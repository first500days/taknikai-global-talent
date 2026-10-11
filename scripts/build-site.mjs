// Builds the static part of the merged TaknikAI website.
//
// Input:  legacy/taknikai_com/  — untouched static export of the original WordPress site (never modified)
//         public/               — static assets owned by the React homepage
//         src/content/insights.ts — the five Global Talent articles (verbatim from "BLOGS FOR TAKNIK AI.docx")
// Output: .generated/public/    — used as Vite's publicDir, so `vite build` copies it into dist/
//
// What it does to the original pages:
//   - rewrites absolute https://taknikai.com/... asset and page links to root-relative paths so the site is
//     self-contained (canonical, Open Graph and JSON-LD URLs stay absolute)
//   - replaces the header menu with the unified navigation (Home · Upskill · About Us · Blogs)
//   - moves the original course homepage from / to /upskill/ (the React Global Talent page becomes /)
//   - generates the Global Talent articles from the original blog-post template and lists them on /blogs/
//   - fixes static-hosting breakage (Cloudflare-obfuscated email, dead WordPress endpoints, staging-domain
//     links, font files hosted on another domain) and writes a sitemap covering every page
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const LEGACY = join(ROOT, 'legacy', 'taknikai_com')
const PUBLIC = join(ROOT, 'public')
const OUT = join(ROOT, '.generated', 'public')

const SUPPLEMENT = join(ROOT, 'legacy', 'supplement')
// Live-site pages the export missed (see legacy/live-snapshots/README.md)
const SNAPSHOTS = join(ROOT, 'legacy', 'live-snapshots')
const STAGING = 'https://slategray-lobster-248773.hostingersite.com'

// Shared with the React homepage so navigation, contact details and disclaimers stay identical everywhere
const { ARTICLES } = await import('../src/content/insights.ts')
const { SITE_URL: SITE, LOGO_SRC, LOGO_WIDTH, LOGO_HEIGHT, ICON_SRC, BOOKING_URL, NAV, FOOTER_LINKS, DISCLAIMER_ADVICE, DISCLAIMER_OUTCOME, GT_COMMUNITY_URL } = await import('../src/lib/site.ts')
const DISCLAIMER = `${DISCLAIMER_ADVICE} ${DISCLAIMER_OUTCOME}`

/* ------------------------------------------------------------------ pages */

// Original pages: source file in the export (or `root`) → output path (URL) and which nav item is active
const PAGES = [
  { src: 'index.html', path: '/upskill/', nav: 'upskill' },
  { src: 'about-us/index.html', path: '/about-us/', nav: 'about' },
  { src: 'success-stories/index.html', path: '/success-stories/', nav: 'upskill' },
  { src: 'blogs/index.html', path: '/blogs/', nav: 'blogs' },
  { src: 'privacy-policy/index.html', path: '/privacy-policy/', nav: '' },
  { src: 'terms-condiiton/index.html', path: '/terms-condiiton/', nav: '' },
  // Form-submission confirmation page: kept out of the sitemap
  { src: 'thank-you/index.html', root: SNAPSHOTS, path: '/thank-you/', nav: '', sitemap: false },
  ...[
    'data-science-data-analytics-generative-ai-which-career-path-should-you-choose-in-2026',
    'how-to-learn-ai-from-scratch',
    'is-data-engineering-a-good-career-in-india',
    'data-engineering-roadmap-for-beginners',
    'is-ai-going-to-replace-freshers-heres-the-reality',
    'how-to-start-a-career-in-ai-without-a-computer-science-degree',
    'best-ai-machine-learning-institute-in-india-learn-generative-ai-with-real-projects',
  ].map((slug) => ({ src: `${slug}/index.html`, path: `/${slug}/`, nav: 'blogs', post: true })),
]

const POST_TEMPLATE = 'how-to-learn-ai-from-scratch/index.html'
const coverPath = (slug) => `/images/blog/${slug}.png`

/* -------------------------------------------------------------- helpers */

const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function mustReplace(html, pattern, replacement, what) {
  const re = typeof pattern === 'string' ? new RegExp(reEsc(pattern)) : pattern
  if (!re.test(html)) throw new Error(`build-site: could not find ${what}`)
  re.lastIndex = 0
  return html.replace(re, replacement)
}

function copyIncremental(from, to) {
  let copied = 0
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const a = join(from, entry.name)
    const b = join(to, entry.name)
    if (entry.isDirectory()) {
      mkdirSync(b, { recursive: true })
      copied += copyIncremental(a, b)
    } else {
      const sa = statSync(a)
      if (existsSync(b)) {
        const sb = statSync(b)
        if (sb.size === sa.size && sb.mtimeMs >= sa.mtimeMs) continue
      }
      mkdirSync(dirname(b), { recursive: true })
      copyFileSync(a, b)
      copied++
    }
  }
  return copied
}

function write(path, html) {
  const file = join(OUT, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

/* ------------------------------------------------------------ navigation */

// The caret Elementor prints after menu items that have a submenu (its widget's submenu_icon setting)
const CARET_SVG =
  '<svg aria-hidden="true" class="e-font-icon-svg e-fas-caret-down" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg"><path d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path></svg>'

// Same markup conventions as the WordPress menu, so Elementor's nav-menu widget and SmartMenus keep working
function menuItems(active, dropdown) {
  const tab = dropdown ? ' tabindex="-1"' : ''
  return NAV.map((item) => {
    const isActive = item.key === active
    const liClass = ['menu-item', item.children ? 'menu-item-has-children' : '', isActive ? 'current-menu-item' : '']
      .filter(Boolean)
      .join(' ')
    const aClass = `elementor-item${isActive ? ' elementor-item-active' : ''}`
    const current = isActive ? ' aria-current="page"' : ''
    const sub = item.children
      ? `<ul class="sub-menu elementor-nav-menu--dropdown">${item.children
          .map(
            (c) =>
              `<li class="menu-item"><a href="${c.href}" class="elementor-sub-item"${tab}${
                c.external ? ' target="_blank" rel="noopener"' : ''
              }>${c.label}</a></li>`,
          )
          .join('')}</ul>`
      : ''
    const caret = item.children ? `<span class="sub-arrow">${CARET_SVG}</span>` : ''
    return `<li class="${liClass}"><a href="${item.href}" class="${aClass}"${current}${tab}>${item.label}${caret}</a>${sub}</li>`
  }).join('\n')
}

function footerItems(path, dropdown) {
  const tab = dropdown ? ' tabindex="-1"' : ''
  return FOOTER_LINKS.map((l) => {
    const active = l.href === path
    return `<li class="menu-item${active ? ' current-menu-item' : ''}"><a href="${l.href}" class="elementor-item${
      active ? ' elementor-item-active' : ''
    }"${active ? ' aria-current="page"' : ''}${tab}>${esc(l.label)}</a></li>`
  }).join('\n')
}

/* ------------------------------------------------------------ transforms */

const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Source+Sans+Pro:wght@300;400;600;700&display=swap'

function decodeCfEmail(hex) {
  const bytes = Buffer.from(hex, 'hex')
  return [...bytes.subarray(1)].map((b) => String.fromCharCode(b ^ bytes[0])).join('')
}

// Walks a JSON-LD value and applies site-wide corrections
function fixSchemaNode(node, page) {
  if (Array.isArray(node)) return node.map((n) => fixSchemaNode(n, page))
  if (!node || typeof node !== 'object') {
    return typeof node === 'string' ? node.replace(STAGING, SITE) : node
  }
  const out = {}
  for (const [k, v] of Object.entries(node)) out[k] = fixSchemaNode(v, page)
  const types = [].concat(out['@type'] || [])
  // Static hosting has no WordPress search endpoint
  if (types.includes('WebSite')) delete out.potentialAction
  // logo.png was never published, and cropped-TaknikAI-Logo.png is the old logo; use the current one
  const logoUrls = ['2024/12/logo.png', '2026/07/cropped-TaknikAI-Logo.png'].map((f) => `${SITE}/wp-content/uploads/${f}`)
  if (logoUrls.includes(out.url) || out.url === `${SITE}${LOGO_SRC}`) {
    out.url = out.contentUrl = `${SITE}${LOGO_SRC}`
    out.width = String(LOGO_WIDTH)
    out.height = String(LOGO_HEIGHT)
  }
  if (types.includes('Organization') && out.url === SITE) out.url = `${SITE}/`
  // The course homepage now lives at /upskill/
  if (page.path === '/upskill/') {
    if (types.includes('WebPage')) {
      out['@id'] = `${SITE}/upskill/#webpage`
      out.url = `${SITE}/upskill/`
    }
    if (types.includes('ListItem') && out.name === 'Home') {
      out['@id'] = `${SITE}/upskill/#listItem`
      out.name = 'Upskill'
    }
    if (types.includes('BreadcrumbList')) out['@id'] = `${SITE}/upskill/#breadcrumblist`
    if (out.breadcrumb?.['@id'] === `${SITE}/#breadcrumblist`) out.breadcrumb = { '@id': `${SITE}/upskill/#breadcrumblist` }
  }
  return out
}

function transform(html, page) {
  // 1. Dead WordPress endpoints and Cloudflare helpers that do not exist on static hosting
  html = html
    .replace(/<link rel="alternate" type="application\/rss\+xml"[^>]*>\s*/g, '')
    .replace(/<link rel="alternate" title="oEmbed[^>]*>\s*/g, '')
    .replace(/<link rel="alternate" title="JSON" type="application\/json"[^>]*>/g, '')
    .replace(/<link rel="https:\/\/api\.w\.org\/"[^>]*>/g, '')
    .replace(/<link rel="EditURI"[^>]*>/g, '')
    .replace(/<link rel='shortlink'[^>]*>\s*/g, '')
    .replace(/<script[^>]*src="\/cdn-cgi\/[^"]*"[^>]*><\/script>/g, '')

  // 2. Cloudflare email obfuscation → plain mailto links (and staging-domain addresses → the real domain)
  html = html
    .replace(/href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"/g, (_, hex) => `href="mailto:${decodeCfEmail(hex)}"`)
    .replace(/<span class="__cf_email__" data-cfemail="([0-9a-f]+)">[^<]*<\/span>/g, (_, hex) => decodeCfEmail(hex))
    .replace(/<a href="\/cdn-cgi\/l\/email-protection" class="__cf_email__" data-cfemail="([0-9a-f]+)">[^<]*<\/a>/g, (_, hex) => {
      const email = decodeCfEmail(hex)
      return `<a href="mailto:${email}">${email}</a>`
    })
    .replace(/@slategray-lobster-248773\.hostingersite\.com/g, '@taknikai.com')

  // 3. Fonts: the exported CSS loads its font files from taknikai.first500days.com; load the same families from Google Fonts
  html = html.replace(/<link rel='stylesheet' id='elementor-gf-local-(poppins|montserrat|sourcesanspro)-css'[^>]*>\n?/g, (m, fam) =>
    fam === 'poppins'
      ? `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel='stylesheet' id='taknikai-fonts-css' href='${FONTS_HREF}' media='all' />\n`
      : '',
  )

  // 4. Staging-domain links in body copy ("explore our programs at www.taknikai.com")
  html = html
    .replace(new RegExp(`href="${reEsc(STAGING)}/reviews/"`, 'g'), 'href="/success-stories/"')
    .replace(new RegExp(`href="${reEsc(STAGING)}/?"`, 'g'), `href="${page.post ? '/upskill/' : '/'}"`)
    // Visible text in the Privacy Policy and Terms ("the website at https://<staging host>/")
    .replace(new RegExp(`${reEsc(STAGING)}(?=[/<\\s])`, 'g'), SITE)

  // 4b. Current brand: the original logo (header, footer, popups, JSON-LD) and favicons → public/images/brand/
  const oldLogo = String.raw`https://taknikai\.com/wp-content/uploads/2024/12/taknikai(?:-1)?(?:-300x82)?\.png`
  // Older purple logo, used by the articles as their Open Graph / JSON-LD logo image
  const oldArticleLogo = String.raw`https://taknikai\.com/wp-content/uploads/2026/07/cropped-TaknikAI-Logo\.png`
  html = html
    .replace(
      new RegExp(String.raw`(<meta property="og:image(?::secure_url)?" content="${oldArticleLogo}" />\s*)+<meta property="og:image:width" content="500" />\s*<meta property="og:image:height" content="143" />`, 'g'),
      (m) => m.replace(/content="500"/, `content="${LOGO_WIDTH}"`).replace(/content="143"/, `content="${LOGO_HEIGHT}"`),
    )
    .replace(new RegExp(oldArticleLogo, 'g'), `${SITE}${LOGO_SRC}`)
    .replace(new RegExp(`width="500" height="136" (src="${oldLogo}")`, 'g'), `width="${LOGO_WIDTH}" height="${LOGO_HEIGHT}" $1`)
    .replace(new RegExp(String.raw`\s(?:srcset="${oldLogo} 500w[^"]*"|sizes="\(max-width: 500px\) 100vw, 500px")`, 'g'), '')
    .replace(new RegExp(oldLogo, 'g'), `${SITE}${LOGO_SRC}`)
    .replace(/https:\/\/taknikai\.com\/wp-content\/uploads\/2025\/01\/cropped-TAKNIK-AI-1-(\d+)x\d+\.png/g, (_, n) => `${SITE}${ICON_SRC(Number(n))}`)

  // 5. JSON-LD: fix staging URLs, the missing logo, the WP search action and (for /upskill/) the page URL
  html = html.replace(/(<script type="application\/ld\+json"[^>]*>)([\s\S]*?)(<\/script>)/g, (m, open, body, close) => {
    try {
      return open + JSON.stringify(fixSchemaNode(JSON.parse(body), page)) + close
    } catch {
      return m
    }
  })

  // 6. Absolute → root-relative links, leaving canonical / Open Graph / Twitter / JSON-LD URLs absolute
  const kept = []
  const keep = (m) => `\u0000${kept.push(m) - 1}\u0000`
  html = html
    .replace(/<script type="application\/ld\+json"[\s\S]*?<\/script>/g, keep)
    .replace(/<link rel="canonical"[^>]*>/g, keep)
    .replace(/<meta (?:property|name)="(?:og|twitter|article):[^"]*" content="[^"]*"\s*\/?>/g, keep)
  // Only URLs in attributes, inline/embedded CSS and script configuration are rewritten — visible text is left alone
  const relativise = (s) =>
    s
      .replace(/(?<![\w.-])https?:\/\/(?:www\.)?taknikai\.com\//g, '/')
      .replace(/(?<![\w.-])https?:\\\/\\\/(?:www\.)?taknikai\.com\\\//g, '\\/')
      .replace(/(?<![\w.-])https?:\/\/(?:www\.)?taknikai\.com(?=["'\s)]|$)/g, '/')
  html = html
    .replace(/(\s[\w:-]+=)("[^"]*"|'[^']*')/g, (m, attr, value) => attr + relativise(value))
    .replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, _tag, body, close) => open + relativise(body) + close)
  html = html.replace(/\u0000(\d+)\u0000/g, (_, i) => kept[Number(i)])

  // 7. Canonical / og:url for the moved course homepage; drop the duplicate canonical tag WordPress printed twice
  if (page.path === '/upskill/') {
    html = html
      .replace(/<link rel="canonical" href="https:\/\/taknikai\.com\/" \/>/g, `<link rel="canonical" href="${SITE}/upskill/" />`)
      .replace(/<meta property="og:url" content="https:\/\/taknikai\.com\/" \/>/g, `<meta property="og:url" content="${SITE}/upskill/" />`)
      .replace(/<meta property="og:image:alt" content="Home" \/>/, '<meta property="og:image:alt" content="Upskill with TaknikAI" />')
      // The original homepage exposed a WordPress admin username as its "author"
      .replace(/<meta name="twitter:label1" content="Written by" \/>\s*<meta name="twitter:data1" content="[^"]*" \/>\s*/, '')
  }
  let seenCanonical = false
  html = html.replace(/<link rel="canonical"[^>]*>\n?/g, (m) => (seenCanonical ? '' : ((seenCanonical = true), m)))

  // 8. Unified header navigation (desktop list and mobile dropdown)
  html = mustReplace(html, /(<ul id="menu-1-a7c83f0" class="elementor-nav-menu">)[\s\S]*?(<\/ul>)/, `$1${menuItems(page.nav, false)}$2`, 'header menu')
  html = mustReplace(html, /(<ul id="menu-2-a7c83f0" class="elementor-nav-menu">)[\s\S]*?(<\/ul>)/, `$1${menuItems(page.nav, true)}$2`, 'header dropdown menu')

  // 9. Footer: quick links and the Global Talent disclaimer
  html = mustReplace(html, /(<ul id="menu-1-2c32757" class="elementor-nav-menu sm-vertical">)[\s\S]*?(<\/ul>)/, `$1${footerItems(page.path, false)}$2`, 'footer menu')
  html = mustReplace(html, /(<ul id="menu-2-2c32757" class="elementor-nav-menu sm-vertical">)[\s\S]*?(<\/ul>)/, `$1${footerItems(page.path, true)}$2`, 'footer dropdown menu')
  html = mustReplace(
    html,
    /(All Rights Reserved By Diksharth Education Pvt Ltd<\/p>)/,
    `$1<p class="tk-footer-disclaimer">${DISCLAIMER}</p>`,
    'footer copyright',
  )

  // 10. Small stylesheet for the merged-site additions (labels, disclaimer, article call-to-action)
  html = mustReplace(html, '</head>', `<link rel='stylesheet' id='taknikai-merge-css' href='/site/merge.css' media='all' />\n</head>`, '</head>')

  // 11. The Tally enquiry form redirects to an absolute https://taknikai.com/... URL after submitting. Off the live
  //     domain (localhost, Vercel previews) keep the visitor on the same site. Registered in <head> so it runs before
  //     Tally's embed.js listener (also a capturing window listener) and can stop it.
  html = mustReplace(html, '</head>', `<script id="taknikai-tally-redirect">${TALLY_REDIRECT_SCRIPT}</script>\n</head>`, '</head>')
  return html
}

const TALLY_REDIRECT_SCRIPT = `(function(){var live=/^(www\\.)?taknikai\\.com$/;if(live.test(location.hostname))return;
addEventListener('message',function(e){if(e.origin!=='https://tally.so'||typeof e.data!=='string')return;
try{var m=JSON.parse(e.data);if(!m||m.event!=='Tally.FormRedirect')return;var u=new URL(m.payload&&m.payload.url);
if(!live.test(u.hostname))return;e.stopImmediatePropagation();location.href=u.pathname+u.search+u.hash}catch(_){}},true)})()`

/* ------------------------------------------------- Global Talent articles */

const words = (s, n) => {
  const w = s.split(/\s+/)
  return w.length <= n ? s : `${w.slice(0, n).join(' ').replace(/[,.;:]$/, '')}...`
}

function articleBody(a) {
  return a.body
    .map((b) =>
      b.type === 'emphasis'
        ? `<p class="wp-block-paragraph"><strong>${esc(b.text)}</strong></p>`
        : `<p class="wp-block-paragraph">${esc(b.text)}</p>`,
    )
    .join('\n\n\n\n')
}

function articleNote() {
  return `
<aside class="tk-gt-note" aria-label="About the Global Talent Digital Technology Programme">
<p class="tk-gt-note__eyebrow">Global Talent Digital Technology Programme</p>
<p class="tk-gt-note__lead">TaknikAI helps digital technology professionals turn technical experience into a credible, evidence-backed profile for the UK Global Talent route.</p>
<p class="tk-gt-note__actions"><a class="tk-btn tk-btn--primary" href="/#programme">Explore the Programme</a> <a class="tk-btn tk-btn--ghost" href="${esc(BOOKING_URL)}">Discuss Your Profile</a></p>
<p class="tk-gt-note__disclaimer">${DISCLAIMER}</p>
</aside>`
}

const CLOCK_SVG =
  '<svg aria-hidden="true" class="e-font-icon-svg e-far-clock" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm61.8-104.4l-84.9-61.7c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v141.7l66.8 48.6c5.4 3.9 6.5 11.4 2.6 16.8L334.6 349c-3.9 5.3-11.4 6.5-16.8 2.6z"></path></svg>'

function articlePage(template, a) {
  const url = `${SITE}/${a.slug}/`
  const image = `${SITE}${coverPath(a.slug)}`
  const title = `${a.title} - TaknikAI`
  let html = template

  // <head>
  const setMeta = (attr, key, value) => {
    const re = new RegExp(`<meta ${attr}="${reEsc(key)}" content="[^"]*"\\s*\\/?>`, 'g')
    html = html.replace(re, `<meta ${attr}="${key}" content="${esc(value)}" />`)
  }
  const dropMeta = (attr, key) => {
    html = html.replace(new RegExp(`\\s*<meta ${attr}="${reEsc(key)}" content="[^"]*"\\s*\\/?>`, 'g'), '')
  }
  html = mustReplace(html, /<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`, 'post title tag')
  setMeta('name', 'description', a.description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', a.description)
  setMeta('property', 'og:url', url)
  setMeta('property', 'og:image', image)
  setMeta('property', 'og:image:secure_url', image)
  setMeta('property', 'og:image:width', '1600')
  setMeta('property', 'og:image:height', '900')
  setMeta('property', 'og:image:alt', a.title)
  setMeta('property', 'article:section', 'Global Talent')
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', a.description)
  setMeta('name', 'twitter:image', image)
  setMeta('name', 'twitter:data1', 'TaknikAI')
  setMeta('name', 'twitter:data2', `${a.readingMinutes} minutes`)
  setMeta('name', 'author', 'TaknikAI')
  // No publication dates exist in the source document, so none are published
  dropMeta('property', 'article:published_time')
  dropMeta('property', 'article:modified_time')
  dropMeta('property', 'og:updated_time')
  html = html.replace(/<link rel="canonical" href="[^"]*" \/>/g, `<link rel="canonical" href="${url}" />`)
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/g, '')
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: a.title,
        description: a.description,
        url,
        mainEntityOfPage: url,
        image,
        articleSection: 'Global Talent',
        inLanguage: 'en-US',
        author: { '@id': `${SITE}/#organization` },
        publisher: { '@id': `${SITE}/#organization` },
      },
      {
        '@type': ['EducationalOrganization', 'Organization'],
        '@id': `${SITE}/#organization`,
        name: 'TaknikAI',
        url: `${SITE}/`,
        logo: { '@type': 'ImageObject', url: `${SITE}${LOGO_SRC}`, width: String(LOGO_WIDTH), height: String(LOGO_HEIGHT) },
      },
    ],
  }
  html = html.replace('</head>', `<script type="application/ld+json" class="taknikai-schema">${JSON.stringify(schema)}</script>\n</head>`)

  // <body>
  html = html.replace(/postid-2826/g, `postid-${a.slug}`).replace(/\bpost-2826\b/g, `post-${a.slug}`)
  html = mustReplace(
    html,
    /(elementor-element-8fbec55[\s\S]*?)<img [^>]*\/>/,
    `$1<img width="1600" height="900" src="${coverPath(a.slug)}" class="attachment-full size-full" alt="" />`,
    'post featured image',
  )
  html = mustReplace(
    html,
    /<h2 class="elementor-heading-title elementor-size-default">How to Learn AI from Scratch<\/h2>/,
    `<h2 class="elementor-heading-title elementor-size-default">${esc(a.title)}</h2>`,
    'post heading',
  )
  html = mustReplace(html, '<span class="elementor-icon-list-text">itsshivampal.official</span>', '<span class="elementor-icon-list-text">TaknikAI · Global Talent</span>', 'post author')
  html = mustReplace(
    html,
    /<svg aria-hidden="true" class="e-font-icon-svg e-fas-calendar-alt"[\s\S]*?<\/svg>(\s*<\/span>\s*<span class="elementor-icon-list-text">)May 29, 2026(<\/span>)/,
    `${CLOCK_SVG}$1${a.readingMinutes} min read$2`,
    'post date',
  )

  // Post content: everything inside the theme-post-content widget
  const marker = 'data-widget_type="theme-post-content.default">'
  const start = html.indexOf(marker)
  const end = html.lastIndexOf('</p>', html.indexOf('<footer')) + 4
  if (start < 0 || end < start) throw new Error('build-site: post content not found')
  if (!/^\s*(<\/div>\s*)+$/.test(html.slice(end, html.indexOf('<footer')))) throw new Error('build-site: unexpected post template layout')
  html = `${html.slice(0, start + marker.length)}\n${articleBody(a)}\n${articleNote()}\n${html.slice(end)}`
  return html
}

/* ------------------------------------------------------------ thank you */

const THANK_YOU_HEADLINE = 'Thank You For Showing Interest in TaknikAI'
const THANK_YOU_CTA = 'Join Our Global Talent Visa Community'
const OLD_THANK_YOU_DESCRIPTION = /Thank you for showing interest in TaknikAl(?:&#039;|')s Courses Our team will contact you shortly with the next steps\. Join WhatsApp Group Get Free Masterclass Access/g

// New headline, and the WhatsApp button turned into a single link to the Global Talent community (no masterclass copy)
function updateThankYou(html) {
  html = mustReplace(
    html,
    /(<h1 class="elementor-heading-title elementor-size-default">)Thank you for showing interest in\s*TaknikAl's Courses(<\/h1>)/,
    `$1${THANK_YOU_HEADLINE}$2`,
    'thank-you headline',
  )
  html = mustReplace(
    html,
    /<div class="elementor-icon-box-wrapper">\s*<div class="elementor-icon-box-icon">\s*<a href="[^"]*" class="(elementor-icon[^"]*)"[^>]*>\s*(<svg[\s\S]*?<\/svg>)\s*<\/a>\s*<\/div>\s*<div class="elementor-icon-box-content">[\s\S]*?Get Free Masterclass Access\s*<\/p>\s*<\/div>\s*<\/div>/,
    (_, iconClass, svg) =>
      `<a class="elementor-icon-box-wrapper tk-community-link" href="${GT_COMMUNITY_URL}" target="_blank" rel="noopener">` +
      `<div class="elementor-icon-box-icon"><span class="${iconClass}" aria-hidden="true">${svg}</span></div>` +
      `<div class="elementor-icon-box-content"><h3 class="elementor-icon-box-title">${THANK_YOU_CTA}</h3></div></a>`,
    'thank-you WhatsApp button',
  )
  // Visitors land here after submitting the enquiry form, so the form popup must not open again on page load
  html = mustReplace(
    html,
    /&quot;triggers&quot;:\{&quot;page_load_delay&quot;:\d+,&quot;page_load&quot;:&quot;yes&quot;\}/,
    '&quot;triggers&quot;:[]',
    'thank-you popup trigger',
  )
  // The page's meta descriptions quoted the old headline and masterclass button
  return html.replace(OLD_THANK_YOU_DESCRIPTION, `${THANK_YOU_HEADLINE}. Our team will contact you shortly with the next steps. ${THANK_YOU_CTA}.`)
}

/* ----------------------------------------------------------- blog listing */

function blogCard(a) {
  const href = `/${a.slug}/`
  return `<article class="eael-grid-post  eael-post-grid-column tk-post--global-talent">
    <div class="eael-grid-post-holder">
        <div class="eael-grid-post-holder-inner"><div class="eael-entry-media"><div class="eael-entry-overlay fade-in"><i class="fas fa-long-arrow-alt-right" aria-hidden="true"></i><a href="${href}" aria-label="${esc(a.title)}"></a></div><div class="eael-entry-thumbnail ">
                            <img loading="lazy" decoding="async" width="1600" height="900" src="${coverPath(a.slug)}" class="attachment-full size-full" alt="" />
                            </div>
                    </div><div class="eael-entry-wrapper"><span class="tk-label tk-label--gt">Global Talent</span><header class="eael-entry-header"><h3 class="eael-entry-title"><a class="eael-grid-post-link" href="${href}" title="${esc(a.title)}">${esc(a.title)}</a></h3></header><div class="eael-entry-content">
                                <div class="eael-grid-post-excerpt"><p>${esc(words(a.excerpt, 26))}</p><a href="${href}" class="eael-post-elements-readmore-btn">Read More</a></div>
                            </div><div class="eael-entry-header-after style-two"><div class="eael-entry-meta"></div></div></div></div>
    </div>
</article>`
}

function addArticlesToBlogs(html) {
  // Label the existing course-related articles so both collections read clearly in one listing
  html = html.replace(/(<div class="eael-entry-wrapper">)(<header class="eael-entry-header">)/g, '$1<span class="tk-label">Upskilling</span>$2')
  return mustReplace(
    html,
    /(<div class="eael-post-grid eael-post-appender eael-post-appender-7871d0b eael-post-grid-style-two" data-layout-mode="grid">)/,
    `$1${ARTICLES.map(blogCard).join('')}`,
    'blogs post grid',
  )
}

/* ---------------------------------------------------------------- sitemap */

function sitemap(entries) {
  const urls = entries
    .map((e) => `  <url>\n    <loc>${SITE}${e.path}</loc>${e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''}\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

const lastmod = (html) =>
  html.match(/<meta property="article:modified_time" content="([^"]+)"/)?.[1] ??
  html.match(/<meta property="og:updated_time" content="([^"]+)"/)?.[1]

/* ------------------------------------------------------------------- run */

const t0 = Date.now()
mkdirSync(OUT, { recursive: true })

// Remove everything from earlier runs except the large WordPress asset folders, which are synced incrementally
for (const entry of readdirSync(OUT)) {
  if (!['wp-content', 'wp-includes'].includes(entry)) rmSync(join(OUT, entry), { recursive: true, force: true })
}

const assetCount =
  copyIncremental(join(LEGACY, 'wp-content'), join(OUT, 'wp-content')) +
  copyIncremental(join(LEGACY, 'wp-includes'), join(OUT, 'wp-includes')) +
  copyIncremental(SUPPLEMENT, OUT) +
  copyIncremental(PUBLIC, OUT)

const sitemapEntries = [{ path: '/' }]

for (const page of PAGES) {
  let html = readFileSync(join(page.root ?? LEGACY, page.src), 'utf8')
  if (page.path === '/blogs/') html = addArticlesToBlogs(html)
  if (page.path === '/thank-you/') html = updateThankYou(html)
  html = transform(html, page)
  write(page.path, html)
  if (page.sitemap !== false) sitemapEntries.push({ path: page.path, lastmod: lastmod(html) })
}

const template = readFileSync(join(LEGACY, POST_TEMPLATE), 'utf8')
for (const a of ARTICLES) {
  if (!existsSync(join(PUBLIC, coverPath(a.slug)))) throw new Error(`build-site: missing cover image public${coverPath(a.slug)} (run: npm run covers)`)
  const page = { path: `/${a.slug}/`, nav: 'blogs', post: true }
  write(page.path, transform(articlePage(template, a), page))
  sitemapEntries.push({ path: page.path })
}

const xml = sitemap(sitemapEntries)
// sitemap_index.xml and wp-sitemap.xml were the WordPress sitemap URLs; keep them valid for existing search-console entries
for (const name of ['sitemap.xml', 'sitemap_index.xml', 'wp-sitemap.xml']) writeFileSync(join(OUT, name), xml)
writeFileSync(
  join(OUT, 'robots.txt'),
  readFileSync(join(LEGACY, 'robots.txt'), 'utf8').replace(/^Sitemap: .*sitemap\.rss\s*$/m, '').trimEnd() + '\n',
)

console.log(
  `build-site: ${PAGES.length} original pages, ${ARTICLES.length} Global Talent articles, ${sitemapEntries.length} sitemap URLs, ` +
    `${assetCount} assets copied → ${relative(ROOT, OUT)} (${Date.now() - t0} ms)`,
)
