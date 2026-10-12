import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, X } from 'lucide-react'
import { CONTACT_EMAIL, TALLY_EMBED_URL, TALLY_FORM_URL } from '../lib/site'
import { EASE, MagneticButton } from './ui'

// "Book a free profile assessment" opens the Tally form in a dialog, so visitors stay on the page.
// The form is a plain iframe of Tally's embed URL (no extra script); the dialog handles focus, scrolling and the
// form's "redirect on completion" message, which Tally's embed.js would otherwise handle.

const TITLE = 'Book a free profile assessment'
const LOAD_TIMEOUT_MS = 15000
const LIVE_HOST = /^(www\.)?taknikai\.com$/

type Ctx = { open: () => void }
const TallyPopupContext = createContext<Ctx>({ open: () => {} })

export const useTallyPopup = () => useContext(TallyPopupContext)

export function TallyPopupProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const open = useCallback(() => setOpen(true), [])
  return (
    <TallyPopupContext.Provider value={{ open }}>
      {children}
      {createPortal(<AnimatePresence>{isOpen && <TallyDialog onClose={() => setOpen(false)} />}</AnimatePresence>, document.body)}
    </TallyPopupContext.Provider>
  )
}

// Same look as MagneticButton. Without JavaScript, or with a modifier key, the link opens the form page in a new tab.
export function AssessmentButton(props: Omit<Parameters<typeof MagneticButton>[0], 'href' | 'onClick'>) {
  const { open } = useTallyPopup()
  return (
    <MagneticButton
      {...props}
      href={TALLY_FORM_URL}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
        e.preventDefault()
        open()
      }}
    />
  )
}

type Status = 'loading' | 'ready' | 'error'

function TallyDialog({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [status, setStatus] = useState<Status>(() => (navigator.onLine === false ? 'error' : 'loading'))

  // Focus the dialog on open and return focus to the button that opened it; lock the page behind it
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.documentElement
    const { overflow, paddingRight } = root.style
    const scrollbar = window.innerWidth - root.clientWidth
    root.style.overflow = 'hidden'
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`
    closeRef.current?.focus()
    return () => {
      root.style.overflow = overflow
      root.style.paddingRight = paddingRight
      opener?.focus?.()
    }
  }, [])

  // Escape closes; Tab stays inside the dialog
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !dialogRef.current) return
      const items = dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], iframe')
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // The iframe gives no error event for network failures, so treat a form that never loads as failed
  useEffect(() => {
    if (status !== 'loading') return
    const t = window.setTimeout(() => setStatus('error'), LOAD_TIMEOUT_MS)
    return () => window.clearTimeout(t)
  }, [status])

  // After submitting, the form asks its host page to go to /thank-you/. Off the live domain (localhost, previews)
  // stay on the same site, as the static pages do (scripts/build-site.mjs).
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://tally.so' || typeof e.data !== 'string') return
      try {
        const msg = JSON.parse(e.data)
        if (msg?.event !== 'Tally.FormRedirect' || !msg.payload?.url) return
        const url = new URL(msg.payload.url)
        window.location.href =
          LIVE_HOST.test(url.hostname) && !LIVE_HOST.test(window.location.hostname) ? url.pathname + url.search + url.hash : url.href
      } catch {
        // not a Tally message
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-end justify-center bg-[rgba(3,7,18,0.78)] backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tally-dialog-title"
        className="flex h-[92dvh] w-full flex-col overflow-hidden rounded-t-[24px] bg-card shadow-lift ring-1 ring-white/[0.1] sm:h-[min(760px,calc(100dvh-3rem))] sm:max-w-[640px] sm:rounded-[24px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.35, ease: EASE }}
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4 sm:px-7">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-400">30 minutes · No cost</p>
            <h2 id="tally-dialog-title" className="mt-1 text-[18px] font-semibold tracking-[-0.02em] text-ink sm:text-[20px]">
              {TITLE}
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate ring-1 ring-white/15 transition-colors hover:bg-white/[0.06] hover:text-ink"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="relative flex-1 bg-white">
          {status !== 'error' && (
            <iframe
              src={TALLY_EMBED_URL}
              title={TITLE}
              onLoad={() => setStatus('ready')}
              className={`absolute inset-x-3 bottom-0 top-3 h-[calc(100%-0.75rem)] w-[calc(100%-1.5rem)] border-0 transition-opacity duration-300 sm:inset-x-5 sm:top-5 sm:h-[calc(100%-1.25rem)] sm:w-[calc(100%-2.5rem)] ${
                status === 'ready' ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {status === 'loading' && (
            <div className="absolute inset-0 grid place-items-center text-[#475569]" role="status">
              <span className="flex items-center gap-3 text-[14px]">
                <Loader2 className="h-5 w-5 animate-spin text-[#2563EB]" aria-hidden />
                Loading the form…
              </span>
            </div>
          )}
          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center text-[#334155]" role="alert">
              <p className="max-w-sm text-[15px] leading-relaxed">The form could not be loaded here. You can open it in a new tab, or email us instead.</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <a
                  href={TALLY_FORM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,#2563EB,#7C3AED)] px-5 text-[14.5px] font-semibold text-white"
                >
                  Open the form
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-[14.5px] font-semibold text-[#1A2C47] ring-1 ring-[#CBD5E1]"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
