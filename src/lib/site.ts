// Central site configuration
export const SITE_URL = 'https://taknikai.com'
export const CONTACT_EMAIL = 'team@taknikai.com'
export const CONTACT_PHONE = '+91 73880 73490'
export const CONTACT_PHONE_HREF = 'tel:+917388073490'
export const BOOKING_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free Profile Assessment — TaknikAI')}`

// "Book a free profile assessment" opens this Tally form in a popup (src/components/TallyPopup.tsx). It is the
// website's existing lead form, also embedded on the original pages; swap the ID if a dedicated form is created.
export const TALLY_FORM_ID = 'KY66Vk'
export const TALLY_EMBED_URL = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1`
// Standalone form page: the link target without JavaScript, and the fallback if the popup cannot load
export const TALLY_FORM_URL = `https://tally.so/r/${TALLY_FORM_ID}`

// Brand assets (public/images/brand/) — used on every page; scripts/build-site.mjs swaps the original site's
// logo and favicons for these
export const LOGO_SRC = '/images/brand/taknikai-logo.png'
export const LOGO_WIDTH = 387
export const LOGO_HEIGHT = 88
// White-text version of the logo for the dark header and footer (LOGO_SRC stays the logo in structured data)
export const HEADER_LOGO_SRC = '/images/brand/taknikai-logo-white.png'
export const HEADER_LOGO_WIDTH = 774
export const HEADER_LOGO_HEIGHT = 168
export const ICON_SRC = (size: 32 | 180 | 192 | 270) => `/images/brand/taknikai-icon-${size}.png`
// WhatsApp community linked from the Thank You page (/thank-you/)
export const GT_COMMUNITY_URL = 'https://chat.whatsapp.com/HDwnSKdPlSMGl75MROtuZN'

// Primary navigation — identical on every page of the site (see scripts/build-site.mjs for the static pages)
export type NavItem = { key: string; label: string; href: string }

export const NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  { key: 'upskill', label: 'Upskill', href: '/upskill/' },
  { key: 'about', label: 'About Us', href: '/about-us/' },
  { key: 'blogs', label: 'Blogs', href: '/blogs/' },
]

export const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Upskill', href: '/upskill/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Blogs', href: '/blogs/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms & Conditions', href: '/terms-condiiton/' },
] as const

// Footer company details, shared by every page
export const COMPANY = {
  about:
    'We help digital technology professionals build genuine, documented, and evidence-backed profiles for a future Global Talent Visa application',
  offices: [
    { city: 'London, UK', address: 'Level 18, 40 Bank Street, Canary Wharf, London, E14 5NR' },
    { city: 'Gurugram, India', address: 'Innov8 Co-Working, 3rd Floor, Orchid Center, Sector 53, Gurugram, India' },
  ],
  name: 'Manalang Ventures LLP',
  legal: 'All Rights Reserved By Manalang Ventures LLP',
  social: [
    { label: 'Instagram', href: 'https://www.instagram.com/taknikai' },
    { label: 'Youtube', href: 'https://youtube.com/@taknikai' },
    { label: 'Linkedin', href: 'https://www.linkedin.com/company/taknikai/' },
    { label: 'Facebook', href: 'https://www.facebook.com/taknikai' },
  ],
  apps: [
    {
      label: 'Get it on Google Play',
      href: 'https://play.google.com/store/apps/details?id=com.taknikai',
      img: '/wp-content/uploads/2024/12/Google_Play_Store_badge_EN.svg-300x89.webp',
    },
    {
      label: 'Download on the App Store',
      href: 'https://apps.apple.com/in/app/taknikai/id6759187085',
      img: '/wp-content/uploads/2024/12/Download_on_the_App_Store_Badge.svg-300x89.png',
    },
  ],
} as const


export const DISCLAIMER_ADVICE =
  'TaknikAI is not a regulated immigration adviser. We develop technology profiles. Regulated immigration professionals provide legal and visa advice.'
export const DISCLAIMER_OUTCOME =
  'TaknikAI does not guarantee endorsement, visa approval or any specific outcome.'
