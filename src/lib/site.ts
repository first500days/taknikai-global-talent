// Central site configuration. Swap BOOKING_URL for a scheduling link (e.g. Calendly) when available.
export const SITE_URL = 'https://taknikai.com'
export const CONTACT_EMAIL = 'team@taknikai.com'
export const CONTACT_PHONE = '+91 73880 73490'
export const CONTACT_PHONE_HREF = 'tel:+917388073490'
export const BOOKING_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Free Profile Assessment — TaknikAI')}`

// Brand assets (public/images/brand/) — used on every page; scripts/build-site.mjs swaps the original site's
// logo and favicons for these
export const LOGO_SRC = '/images/brand/taknikai-logo.png'
export const LOGO_WIDTH = 387
export const LOGO_HEIGHT = 88
export const FOOTER_LOGO_SRC = LOGO_SRC
export const ICON_SRC = (size: 32 | 180 | 192 | 270) => `/images/brand/taknikai-icon-${size}.png`
// Links shared with the original site
export const LOGIN_URL = 'https://app.taknikai.com/'
export const PAYMENT_URL = 'https://rzp.io/rzp/tR4F0Nq'
// WhatsApp community linked from the Thank You page (/thank-you/)
export const GT_COMMUNITY_URL = 'https://chat.whatsapp.com/HDwnSKdPlSMGl75MROtuZN'

// Primary navigation — identical on every page of the site (see scripts/build-site.mjs for the static pages)
export type NavItem = { key: string; label: string; href: string; children?: { label: string; href: string; external?: boolean }[] }

export const NAV: NavItem[] = [
  { key: 'home', label: 'Home', href: '/' },
  {
    key: 'upskill',
    label: 'Upskill',
    href: '/upskill/',
    children: [
      { label: 'Courses', href: '/upskill/' },
      { label: 'Success Stories', href: '/success-stories/' },
      { label: 'Payment', href: PAYMENT_URL, external: true },
    ],
  },
  { key: 'about', label: 'About Us', href: '/about-us/' },
  { key: 'blogs', label: 'Blogs', href: '/blogs/' },
]

export const FOOTER_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Upskill', href: '/upskill/' },
  { label: 'About Us', href: '/about-us/' },
  { label: 'Success Stories', href: '/success-stories/' },
  { label: 'Blogs', href: '/blogs/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms & Conditions', href: '/terms-condiiton/' },
] as const

// From the original site footer
export const COMPANY = {
  about:
    'TaknikAI is an IIT alumni-led upskilling platform that builds industry-ready AI, ML, and Generative AI engineers to power the growth of New Bharat.',
  addresses: [
    'Innov8 Co-Working, 3rd Floor, Orchid Centre, Sector 53, Gurugram, India',
    '35B, Raman Vihar, Hanspuram, Naubasta, Kanpur, UP, 208021',
  ],
  phones: '+91 9963024162 | +91 7003474657',
  legal: 'All Rights Reserved By Diksharth Education Pvt Ltd',
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

export const STATS = [
  { value: 100, prefix: '', suffix: '+', label: 'Startups mentored' },
  { value: 10, prefix: '$', suffix: 'M+', label: 'Fundraising supported' },
  { value: 8, prefix: '', suffix: '+', label: 'Years building ventures' },
  { value: 4, prefix: '', suffix: '', label: 'Specialist disciplines' },
] as const

export const DISCLAIMER_ADVICE =
  'TaknikAI is not a regulated immigration adviser. We develop technology profiles. Regulated immigration professionals provide legal and visa advice.'
export const DISCLAIMER_OUTCOME =
  'TaknikAI does not guarantee endorsement, visa approval or any specific outcome.'
