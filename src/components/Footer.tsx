import {
  COMPANY,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  DISCLAIMER_ADVICE,
  DISCLAIMER_OUTCOME,
  FOOTER_LINKS,
  HEADER_LOGO_HEIGHT,
  HEADER_LOGO_SRC,
  HEADER_LOGO_WIDTH,
} from '../lib/site'
import { useLocation } from '../lib/router'
import { BrandIcon, type IconName } from './BrandIcon'

// Mirrors the original taknikai.com Elementor footer (black, Poppins, grey copy, blue icons) — the static pages
// keep that exact footer, with the same quick links and disclaimer added by scripts/build-site.mjs.

const SOCIAL_ICON: Record<string, IconName> = {
  Instagram: 'instagram',
  Youtube: 'youtube',
  Linkedin: 'linkedin',
  Facebook: 'facebook',
}

export default function Footer() {
  const { path } = useLocation()
  const here = path === '/' ? '/' : `${path}/`

  return (
    <footer className="bg-abyss font-sans text-[#9CA3AF]">
      <div className="mx-auto max-w-site px-2.5 pb-[15px] pt-[25px]">
        <div className="grid gap-10 px-5 py-5 md:grid-cols-[288px_1fr] lg:grid-cols-[288px_277px_1fr] lg:gap-[60px]">
          <div>
            <img src={HEADER_LOGO_SRC} alt="TaknikAI" width={HEADER_LOGO_WIDTH} height={HEADER_LOGO_HEIGHT} loading="lazy" className="h-auto w-[200px]" />
            <p className="mt-5 text-[16px] leading-6">{COMPANY.about}</p>
            <ul className="mt-5 flex gap-[15px]" aria-label="TaknikAI on social media">
              {COMPANY.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener" className="block text-white transition-colors hover:text-[#016DD9]">
                    <span className="sr-only">{s.label}</span>
                    <BrandIcon name={SOCIAL_ICON[s.label]} className="h-[25px] w-[25px]" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-5">
              {COMPANY.apps.map((a) => (
                <a key={a.href} href={a.href} target="_blank" rel="noopener">
                  <img src={a.img} alt={a.label} width={300} height={89} loading="lazy" className="h-auto w-[130px]" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-labelledby="footer-quick-links">
            <h2 id="footer-quick-links" className="text-[18px] font-semibold leading-[18px] text-white">
              Quick Links
            </h2>
            <ul className="mt-5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={l.href === here ? 'page' : undefined}
                    className={`block py-[5px] text-[16px] font-semibold leading-5 transition-colors hover:text-[#016DD9] ${
                      l.href === here ? 'text-[#016DD9]' : ''
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-2 lg:col-span-1">
            <h2 className="text-[18px] font-semibold leading-[18px] text-white">Contact Us</h2>
            <address className="mt-5 grid gap-5 text-[16px] not-italic leading-6 sm:grid-cols-2 lg:grid-cols-1">
              {COMPANY.offices.map((o) => (
                <div key={o.city} className="flex gap-2.5">
                  <BrandIcon name="mapMarker" className="mt-[5px] h-[14px] w-[14px] shrink-0 text-[#016DD9]" />
                  <p>
                    <span className="block font-semibold text-white">{o.city}</span>
                    {o.address}
                  </p>
                </div>
              ))}
              <div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
                <p>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex gap-2.5 transition-colors hover:text-white">
                    <BrandIcon name="envelope" className="mt-[5px] h-[14px] w-[14px] shrink-0 text-[#016DD9]" />
                    {CONTACT_EMAIL}
                  </a>
                </p>
                <p>
                  <a href={CONTACT_PHONE_HREF} className="inline-flex gap-2.5 transition-colors hover:text-white">
                    <BrandIcon name="phone" className="mt-[5px] h-[14px] w-[14px] shrink-0 text-[#016DD9]" />
                    {CONTACT_PHONE}
                  </a>
                </p>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-[#FFFFFF59] px-5 pt-6 text-center">
          <p className="text-[20px] font-light leading-8 text-[#6B7280]">
            TaknikAI © {new Date().getFullYear()} | {COMPANY.legal}
          </p>
          <p className="mx-auto mt-2.5 max-w-[920px] pb-2 text-[12px] leading-[1.6]">
            {DISCLAIMER_ADVICE} {DISCLAIMER_OUTCOME}
          </p>
        </div>
      </div>
    </footer>
  )
}
