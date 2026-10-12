import { useEffect, useState } from 'react'
import { HEADER_LOGO_HEIGHT, HEADER_LOGO_SRC, HEADER_LOGO_WIDTH, NAV } from '../lib/site'
import { useLocation } from '../lib/router'

// Mirrors the original taknikai.com Elementor header (navy bar, Poppins 17px/500 links, red active/hover state,
// full-width white dropdown at tablet/mobile widths) so every page shares one header. Sticky, so it stays in view
// without covering content. The static pages render the same menu from the same NAV config (scripts/build-site.mjs).

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { path } = useLocation()
  const activeKey = path === '/' ? 'home' : ''

  useEffect(() => {
    setOpen(false)
  }, [path])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[#F0EAEA3B] bg-header pt-1.5 font-sans">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-[#1A2C47]"
      >
        Skip to content
      </a>
      <div className="mx-auto flex min-h-[64px] max-w-site items-center justify-between px-2.5">
        <a href="/" aria-label="TaknikAI home" className="flex w-[180px] shrink-0 items-center px-2.5 md:w-[15%] md:min-w-[150px]">
          <img src={HEADER_LOGO_SRC} alt="TaknikAI" width={HEADER_LOGO_WIDTH} height={HEADER_LOGO_HEIGHT} className="h-auto w-full max-w-[160px]" />
        </a>

        <div className="flex items-center justify-end gap-2.5 px-2.5">
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center">
              {NAV.map((item) => {
                const active = item.key === activeKey
                return (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center px-5 py-2.5 text-[17px] font-medium leading-5 transition-colors duration-200 hover:text-accent focus-visible:text-accent ${
                        active ? 'text-accent' : 'text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Menu Toggle"
            className="grid h-8 w-8 place-items-center text-white lg:hidden"
          >
            {open ? (
              <svg aria-hidden viewBox="0 0 1000 1000" className="h-[22px] w-[22px] fill-current">
                <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
              </svg>
            ) : (
              <svg aria-hidden viewBox="0 0 1000 1000" className="h-[22px] w-[22px] fill-current">
                <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Primary" className="absolute inset-x-0 top-full bg-white shadow-[0_12px_24px_-12px_rgba(0,0,0,0.35)] lg:hidden">
          <ul>
            {NAV.map((item) => {
              const active = item.key === activeKey
              return (
                <li key={item.key}>
                  <a
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                    className={`flex w-full items-center px-5 py-4 text-left text-[17px] font-medium leading-5 transition-colors ${
                      active ? 'bg-[#3F444B] text-white' : 'text-[#33373D] hover:bg-[#3F444B] hover:text-white'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
