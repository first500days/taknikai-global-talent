import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { EASE, Reveal, SectionHeader } from './ui'

const MONTHS = [
  { m: '1', title: 'Plan & Position', items: ['Map your profile', 'Select a focus area', 'Identify evidence gaps', 'Shortlist opportunities'] },
  { m: '2', title: 'Build Evidence', items: ['Begin technical projects', 'Build your portfolio', 'Identify contribution opportunities'] },
  { m: '3', title: 'Increase Visibility', items: ['Technical writing', 'Events', 'Open source', 'Community contribution'] },
  { m: '4', title: 'Strengthen Impact', items: ['Document metrics', 'Industry contribution', 'Recognition opportunities'] },
  { m: '5', title: 'Finalise the Case', items: ['Evidence review', 'Recommendation readiness', 'Profile narrative'] },
  { m: '6+', title: 'Apply', items: ['Final consistency check', 'Handoff to regulated partner', 'Immigration application'] },
]

// Scroll position at which a card sits flush with the scroller's left padding
const targetFor = (el: HTMLDivElement, card: HTMLElement) => {
  const padding = parseFloat(getComputedStyle(el).paddingLeft) || 0
  return card.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft - padding
}

export default function Roadmap() {
  const scroller = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const progress = useMotionValue(0)
  const smooth = useSpring(progress, { stiffness: 160, damping: 30 })

  const onScroll = useCallback(() => {
    const el = scroller.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    progress.set(max > 0 ? el.scrollLeft / max : 0)
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-month]'))
    let best = 0
    let bestDist = Infinity
    cards.forEach((c, i) => {
      const d = Math.abs(targetFor(el, c) - el.scrollLeft)
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    if (el.scrollLeft >= max - 4) best = cards.length - 1
    setActive(best)
  }, [progress])

  useEffect(() => {
    onScroll()
    window.addEventListener('resize', onScroll)
    return () => window.removeEventListener('resize', onScroll)
  }, [onScroll])

  const go = (i: number) => {
    const el = scroller.current
    if (!el) return
    const idx = Math.max(0, Math.min(MONTHS.length - 1, i))
    const card = el.querySelector<HTMLElement>(`[data-month="${idx}"]`)
    if (!card) return
    el.scrollTo({ left: targetFor(el, card), behavior: 'smooth' })
    setActive(idx)
  }

  return (
    <section aria-labelledby="roadmap-title" className="relative overflow-hidden bg-sand py-24 sm:py-32">
      <div className="shell flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeader
          index="06"
          label="Six-month roadmap"
          titleId="roadmap-title"
          title={
            <>
              A realistic path,
              <br />
              <span className="text-gradient text-brand-400">month by month.</span>
            </>
          }
          intro="Genuine profiles take time to build. Here is how the work typically unfolds from first conversation to application."
        />

        {/* desktop controls */}
        <Reveal delay={0.1} className="hidden flex-col items-end gap-4 lg:flex">
          <div className="flex gap-1 rounded-full bg-card p-1 ring-1 ring-white/[0.08]" role="group" aria-label="Jump to month">
            {MONTHS.map((mo, i) => (
              <button
                key={mo.m}
                type="button"
                onClick={() => go(i)}
                aria-pressed={active === i}
                className={`relative rounded-full px-3.5 py-2 font-mono text-[11.5px] transition-colors duration-300 ${active === i ? 'text-brand-300' : 'text-slate hover:text-ink'}`}
              >
                {active === i && (
                  <motion.span layoutId="month-pill" className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-brand-600/50" transition={{ duration: 0.45, ease: EASE }} />
                )}
                <span className="relative">M{mo.m}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => go(active - 1)} disabled={active === 0} aria-label="Previous month" className="grid h-11 w-11 place-items-center rounded-full bg-card text-ink ring-1 ring-white/10 transition hover:bg-elevated hover:ring-brand-600/50 disabled:opacity-35">
              <ArrowLeft className="h-4 w-4" aria-hidden />
            </button>
            <button type="button" onClick={() => go(active + 1)} disabled={active === MONTHS.length - 1} aria-label="Next month" className="grid h-11 w-11 place-items-center rounded-full bg-card text-ink ring-1 ring-white/10 transition hover:bg-elevated hover:ring-brand-600/50 disabled:opacity-35">
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </Reveal>
      </div>

      <div
        ref={scroller}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Roadmap months"
        className="no-scrollbar relative mt-14 px-5 sm:px-8 lg:snap-x lg:snap-mandatory lg:overflow-x-auto lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:[scroll-padding-inline:max(2rem,calc((100vw-1240px)/2+2rem))] focus-visible:outline-none"
      >
        <div className="relative pl-10 lg:w-max lg:pl-0 lg:pt-10">
          {/* connecting rail */}
          <span aria-hidden className="absolute bottom-8 left-[15px] top-8 w-px bg-white/[0.08] lg:bottom-auto lg:left-0 lg:right-0 lg:top-[15px] lg:h-px lg:w-auto" />
          <ol className="flex flex-col gap-4 lg:flex-row lg:gap-5">
          {MONTHS.map((mo, i) => {
            const final = i === MONTHS.length - 1
            const on = active === i
            return (
              <li key={mo.m} data-month={i} className="relative lg:w-[360px] lg:shrink-0 lg:snap-start">
                <span
                  aria-hidden
                  className={`absolute -left-10 top-6 grid h-[31px] w-[31px] place-items-center rounded-full border transition-colors duration-500 lg:-top-10 lg:left-6 ${
                    final ? 'border-brand-600/70 bg-brand-50' : on ? 'border-brand-500/70 bg-ivory shadow-glow' : 'border-white/15 bg-sand'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${final ? 'bg-brand-400' : on ? 'bg-brand-400' : 'bg-white/25'}`} />
                </span>
                <motion.article
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: Math.min(i, 3) * 0.07 }}
                  onClick={() => go(i)}
                  className={`flex h-full flex-col rounded-3xl p-7 transition-all duration-500 ease-premium lg:min-h-[340px] lg:cursor-pointer lg:hover:-translate-y-1 ${
                    final
                      ? 'bg-[linear-gradient(155deg,rgba(37,99,235,0.16),rgba(37,99,235,0.03)_55%),#0E1A33] text-white shadow-lift ring-1 ring-brand-600/35'
                      : `bg-card shadow-card ring-1 ${on ? 'ring-brand-600/50 lg:bg-elevated lg:shadow-lift' : 'ring-white/[0.08]'}`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className={`font-mono text-[11px] uppercase tracking-[0.2em] ${final ? 'text-brand-300' : 'text-brand-400'}`}>Month {mo.m.padStart(2, '0')}</p>
                    <span className={`font-mono text-[11px] ${final ? 'text-white/50' : 'text-mist'}`}>
                      {String(i + 1).padStart(2, '0')}/{String(MONTHS.length).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className={`mt-6 text-[28px] font-semibold leading-tight tracking-[-0.035em] ${final ? 'text-white' : 'text-ink'}`}>{mo.title}</h3>
                  <ul className="mt-6 space-y-3 lg:mt-auto lg:pt-8">
                    {mo.items.map((it) => (
                      <li key={it} className={`flex items-center gap-3 text-[14.5px] ${final ? 'text-charcoal' : 'text-charcoal'}`}>
                        <Check className={`h-3.5 w-3.5 shrink-0 ${final ? 'text-brand-300' : 'text-brand-500'}`} strokeWidth={2.5} aria-hidden />
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </li>
            )
          })}
          </ol>
        </div>
      </div>

      {/* progress */}
      <div className="shell mt-10 hidden lg:block" aria-hidden>
        <div className="h-[2px] overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div style={{ scaleX: smooth }} className="h-full origin-left bg-brand-500" />
        </div>
      </div>
    </section>
  )
}
