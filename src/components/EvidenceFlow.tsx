import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { EASE, Reveal, RevealLi } from './ui'

const STAGES = [
  { title: 'Experience', body: 'Years of real, capable work — most of it invisible outside your employer.', tag: 'Starting point' },
  { title: 'Technical Work', body: 'Independent projects that show what you can design and ship on your own.', tag: 'Build' },
  { title: 'Recognition', body: 'External signals that people in your field value your expertise.', tag: 'Signal' },
  { title: 'Contribution', body: 'Impact beyond the day job — open source, community and shared knowledge.', tag: 'Impact' },
  { title: 'Evidence', body: 'Every achievement documented, verifiable and mapped to the assessment criteria.', tag: 'Proof' },
  { title: 'Endorsement Readiness', body: 'A coherent, defensible profile — ready for regulated partners to take forward.', tag: 'Destination' },
]

const LAST = STAGES.length - 1

export default function EvidenceFlow() {
  return (
    <section aria-labelledby="flow-title" className="relative bg-sand">
      <DesktopFlow />
      <MobileFlow />
    </section>
  )
}

function Header({ id }: { id?: string }) {
  return (
    <div>
      <p className="eyebrow flex items-center gap-3">
        <span className="text-brand-400">02</span>
        <span className="h-px w-6 bg-white/20" aria-hidden />
        The transformation
      </p>
      <h2 id={id} className="display mt-5 text-[clamp(2.2rem,4.6vw,3.6rem)] text-ink">
        From experience <span className="text-gradient text-brand-400">to evidence.</span>
      </h2>
      <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-mist">
        Not every profile needs every stage, and no stage guarantees an outcome. The right route depends on your
        background, experience, achievements and goals.
      </p>
    </div>
  )
}

/* ---------------------------------------------------------------- Desktop */

function DesktopFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const fill = useTransform(scrollYProgress, [0.04, 0.88], [0, 1], { clamp: true })
  const smooth = useSpring(fill, { stiffness: 120, damping: 28, mass: 0.4 })
  const [active, setActive] = useState(0)

  useMotionValueEvent(fill, 'change', (v) => {
    setActive(Math.min(LAST, Math.floor(v * LAST + 0.02)))
  })

  const stage = STAGES[active]

  return (
    <div ref={ref} className="relative hidden h-[360vh] lg:block">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_30%,#000_70%,transparent)]" />
        <div className="shell relative">
          <div className="flex items-end justify-between gap-10">
            <Header id="flow-title" />
            <p className="max-w-sm text-[15px] leading-relaxed text-slate">
              Capability becomes recognisable only when it is visible, independent and documented.
              Scroll to follow the path.
            </p>
          </div>

          {/* track */}
          <div className="relative mt-20">
            <div className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[22px] h-px bg-white/[0.08]" />
            <motion.div
              style={{ scaleX: smooth }}
              className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[21.5px] h-[2px] origin-left rounded-full bg-gradient-to-r from-brand-600 to-brand-500"
            />
            <ol className="relative grid grid-cols-6">
              {STAGES.map((s, i) => {
                const reached = i <= active
                const current = i === active
                return (
                  <li key={s.title} className="flex flex-col items-center text-center" aria-current={current ? 'step' : undefined}>
                    <span
                      className={`relative grid h-11 w-11 place-items-center rounded-full font-mono text-[11px] transition-all duration-700 ease-premium ${
                        current
                          ? 'bg-brand-600 text-onaccent shadow-glow'
                          : reached
                            ? 'bg-elevated text-ink ring-1 ring-brand-600/50'
                            : 'bg-card text-mist ring-1 ring-white/10'
                      } ${current ? 'scale-110' : ''}`}
                    >
                      {current && (
                        <motion.span
                          layoutId="flow-halo"
                          className="absolute -inset-2 rounded-full ring-1 ring-brand-500/30"
                          transition={{ duration: 0.6, ease: EASE }}
                        />
                      )}
                      0{i + 1}
                    </span>
                    <span
                      className={`mt-5 text-[15px] font-medium tracking-[-0.015em] transition-colors duration-500 ${
                        reached ? 'text-ink' : 'text-mist'
                      }`}
                    >
                      {s.title}
                    </span>
                  </li>
                )
              })}
            </ol>
          </div>

          {/* stage panel */}
          <div className="mt-16 grid grid-cols-[1fr_auto] items-end gap-10 rounded-3xl bg-card p-10 shadow-card ring-1 ring-white/[0.08]">
            <div className="min-h-[148px]" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400">{stage.tag}</p>
                  <h3 className="mt-3 text-[44px] font-semibold leading-none tracking-[-0.04em] text-ink">{stage.title}</h3>
                  <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-slate">{stage.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist">Profile signal</p>
              <div className="mt-3 flex items-end justify-end gap-1.5" aria-hidden>
                {STAGES.map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 rounded-sm transition-all duration-700 ease-premium ${
                      i <= active ? 'bg-brand-500' : 'bg-white/[0.08]'
                    }`}
                    style={{ height: 14 + i * 9 }}
                  />
                ))}
              </div>
              <p className="mt-3 text-[56px] font-semibold leading-none tracking-[-0.05em] text-ink tabular-nums">
                0{active + 1}
                <span className="text-[22px] text-mist"> / 06</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------- Mobile */

function MobileFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <div className="shell py-24 lg:hidden">
      <Reveal>
        <Header />
        <p className="mt-5 text-[16px] leading-relaxed text-slate">
          Capability becomes recognisable only when it is visible, independent and documented.
        </p>
      </Reveal>
      <div ref={ref} className="relative mt-12 pl-12">
        <span aria-hidden className="absolute bottom-6 left-[19px] top-6 w-px bg-white/[0.08]" />
        <motion.span
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute bottom-6 left-[18px] top-6 w-[3px] origin-top rounded-full bg-brand-500"
        />
        <ol className="space-y-4">
        {STAGES.map((s, i) => (
          <RevealLi
            key={s.title}
            delay={0.04 * i}
            className="relative rounded-2xl bg-card p-5 shadow-card ring-1 ring-white/[0.08]"
          >
              <span
                className={`absolute -left-12 top-5 grid h-10 w-10 place-items-center rounded-full font-mono text-[11px] ${
                  i === LAST ? 'bg-brand-600 text-onaccent' : 'bg-ivory text-brand-300 ring-1 ring-white/10'
                }`}
              >
                0{i + 1}
              </span>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-brand-400">{s.tag}</p>
              <h3 className="mt-1.5 text-[20px] font-semibold tracking-[-0.025em] text-ink">{s.title}</h3>
              <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate">{s.body}</p>
          </RevealLi>
        ))}
        </ol>
      </div>
    </div>
  )
}
