// Renders a 1600×900 cover image for each Global Talent article into public/images/blog/<slug>.png (and the
// homepage's social-share image, public/images/og-global-talent.png),
// using a locally installed Chrome or Edge in headless mode. Run with `npm run covers` after adding an article.
// Covers use the original site's hero palette and logo; they contain only the article's title and category.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'images', 'blog')
const LOGO = pathToFileURL(join(ROOT, 'public', 'images', 'brand', 'taknikai-logo.png')).href

const BROWSERS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const browser = BROWSERS.find((p) => existsSync(p))
if (!browser) throw new Error('make-covers: no Chrome/Edge found; set CHROME_PATH')

const { ARTICLES } = await import('../src/content/insights.ts')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const page = (a) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@800&family=Poppins:wght@500;600&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  html,body{width:1600px;height:900px;overflow:hidden}
  body{position:relative;padding:96px 110px;color:#fff;font-family:Poppins,sans-serif;
    background:linear-gradient(135deg,#050713 0%,#07101f 48%,#111827 100%)}
  .grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.035) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,.035) 1px,transparent 1px);background-size:64px 64px;
    -webkit-mask-image:radial-gradient(ellipse 80% 70% at 70% 30%,#000 30%,transparent 80%)}
  .glow{position:absolute;right:-180px;top:-220px;width:900px;height:900px;border-radius:50%;
    background:radial-gradient(closest-side,rgba(37,99,235,.35),rgba(124,58,237,.12) 55%,transparent)}
  .inner{position:relative;height:100%;display:flex;flex-direction:column}
  .logo{height:62px;width:auto;align-self:flex-start}
  .chip{margin-top:70px;align-self:flex-start;padding:10px 20px;border-radius:999px;font-weight:600;font-size:21px;
    letter-spacing:.12em;text-transform:uppercase;background:linear-gradient(135deg,#2563eb,#7c3aed)}
  h1{margin-top:34px;max-width:1260px;font-family:Montserrat,sans-serif;font-weight:800;font-size:${a.title.length > 70 ? 66 : 76}px;
    line-height:1.12;letter-spacing:-.01em}
  .foot{margin-top:auto;display:flex;align-items:center;gap:22px;font-size:24px;font-weight:500;color:#cbd5e1}
  .bar{width:120px;height:6px;border-radius:6px;background:linear-gradient(90deg,#2563eb,#4f46e5,#7c3aed)}
</style></head><body><div class="grid"></div><div class="glow"></div>
<div class="inner"><img class="logo" src="${LOGO}" alt="">
<span class="chip">${esc(a.chip ?? 'Global Talent')}</span><h1>${esc(a.title)}</h1>
<div class="foot"><span class="bar"></span>${esc(a.footer ?? `${a.category} · TaknikAI Blog`)}</div></div></body></html>`

mkdirSync(OUT, { recursive: true })
const tmp = mkdtempSync(join(tmpdir(), 'taknikai-covers-'))
try {
  const HOME = {
    slug: 'og-global-talent',
    out: join(ROOT, 'public', 'images', 'og-global-talent.png'),
    chip: 'Global Talent · Digital Technology',
    title: 'Build the profile that gets noticed.',
    footer: 'Real technical work. Genuine recognition. Evidence that stands up to scrutiny.',
  }
  for (const a of [...ARTICLES, HOME]) {
    const html = join(tmp, `${a.slug}.html`)
    writeFileSync(html, page(a))
    const png = a.out ?? join(OUT, `${a.slug}.png`)
    execFileSync(browser, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--virtual-time-budget=8000',
      '--window-size=1600,900',
      `--screenshot=${png}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' })
    if (!existsSync(png)) throw new Error(`make-covers: failed to render ${a.slug}`)
    console.log(`make-covers: ${png}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
