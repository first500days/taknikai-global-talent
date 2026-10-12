import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { EASE, Reveal, SectionHeader } from './ui'

type Phase = {
  n: string
  title: string
  when: string
  start: number // week column, 1-12; 13 = after readiness
  end: number
  extends?: boolean
  summary: string
  focus: string[]
  output: string
}

const PHASES: Phase[] = [
  {
    n: '01',
    title: 'Assessment',
    when: 'Week 1',
    start: 1,
    end: 1,
    summary: 'Understand where you stand.',
    focus: ['Profile review across all four dimensions', 'Evidence gap analysis against the criteria', 'Focus area and track selection'],
    output: 'A personalised development roadmap',
  },
  {
    n: '02',
    title: 'Technical Development',
    when: 'Weeks 2–4',
    start: 2,
    end: 4,
    summary: 'Strengthen technical depth and capability.',
    focus: ['Targeted skill development with a technical mentor', 'Architecture and design reviews', 'Scoping your independent project'],
    output: 'A project specification and technical plan',
  },
  {
    n: '03',
    title: 'Project & Portfolio',
    when: 'Weeks 3–6',
    start: 3,
    end: 6,
    summary: 'Build genuine technical work and a public portfolio.',
    focus: ['Build a real-world technical project', 'Public GitHub portfolio and documentation', 'Innovation write-up of what is novel'],
    output: 'Shipped, public, documented work',
  },
  {
    n: '04',
    title: 'Recognition & Contribution',
    when: 'Weeks 5–8+',
    start: 5,
    end: 8,
    extends: true,
    summary: 'Build external contribution and professional recognition.',
    focus: ['Open-source and community contribution', 'Technical writing and speaking', 'Recognition strategy and opportunities'],
    output: 'Independent, verifiable external signals',
  },
  {
    n: '05',
    title: 'Evidence Readiness',
    when: 'Weeks 7–9+',
    start: 7,
    end: 9,
    extends: true,
    summary: 'Organise achievements into an evidence-led profile.',
    focus: ['Evidence tracker and criteria mapping', 'Recommendation readiness', 'Profile narrative and personal statement support'],
    output: 'An organised, defensible evidence base',
  },
  {
    n: '06',
    title: 'Immigration Handoff',
    when: 'After readiness',
    start: 13,
    end: 13,
    summary: 'Structured handoff to regulated immigration professionals.',
    focus: ['Final consistency check', 'Structured briefing to a regulated partner', 'Legal and visa advice provided by the partner'],
    output: 'A clean handover — your application continues with a regulated adviser',
  },
]

const COLS = 'grid-cols-[minmax(0,1fr)_repeat(12,minmax(0,0.42fr))_minmax(0,0.95fr)]'
const WEEKS = Array.from({ length: 12 }, (_, i) => i + 1)

export default function Journey() {
  const [sel, setSel] = useState(0)
  const [lit, setLit] = useState(0) // phases illuminated so far by scroll
  const [picked, setPicked] = useState(false) // once the user clicks, scroll stops driving selection
  const reduce = useReducedMotion()
  const ganttRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ganttRef, offset: ['start 80%', 'end 45%'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const next = Math.min(PHASES.length - 1, Math.max(0, Math.floor(v * PHASES.length)))
    setLit((prev) => Math.max(prev, next))
    if (!picked) setSel(next)
  })

  const pick = (i: number) => {
    setPicked(true)
    setSel(i)
    setLit((prev) => Math.max(prev, i))
  }
  const phase = PHASES[sel]

  return (
    <section id="programme" aria-labelledby="journey-title" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          index="04"
          label="The programme journey"
          titleId="journey-title"
          title={
            <>
              Six phases.
              <br />
              <span className="text-gradient text-brand-400">One stronger profile.</span>
            </>
          }
          intro="Phases overlap by design. Technical work, contribution and evidence build in parallel — the way real careers do. Select a phase to see what happens inside it."
        />

        <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-[28px] bg-card shadow-card ring-1 ring-white/[0.08]">
          {/* Gantt */}
          <div className="no-scrollbar overflow-x-auto">
            <div ref={ganttRef} className="relative min-w-[820px] px-6 pb-4 pt-6 sm:px-8">
              {/* week header */}
              <div className={`grid ${COLS} items-end pb-3`} aria-hidden>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-mist">Phase</span>
                {WEEKS.map((w) => (
                  <span key={w} className="text-center font-mono text-[10.5px] text-mist">
                    W{w}
                  </span>
                ))}
                <span className="text-center font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist">After</span>
              </div>

              <div className="relative">
                {/* gridlines */}
                <div aria-hidden className={`pointer-events-none absolute inset-0 grid ${COLS}`}>
                  <span />
                  {WEEKS.map((w) => (
                    <span key={w} className="border-l border-white/[0.04]" />
                  ))}
                  <span className="border-l border-dashed border-white/[0.1] bg-white/[0.015]" />
                </div>

                <div role="tablist" aria-label="Programme phases" className="relative">
                  {PHASES.map((p, i) => {
                    const active = i === sel
                    const reached = i <= lit
                    const handoff = p.start === 13
                    return (
                      <button
                        key={p.n}
                        type="button"
                        role="tab"
                        id={`phase-tab-${i}`}
                        aria-selected={active}
                        aria-controls="phase-panel"
                        onClick={() => pick(i)}
                        className={`group grid w-full ${COLS} items-center border-t border-white/[0.06] py-3 text-left`}
                      >
                        <span className="flex items-center gap-3 pr-4">
                          <span
                            aria-hidden
                            className={`h-2 w-2 shrink-0 rounded-full transition-all duration-700 ${
                              active
                                ? 'bg-brand-400 shadow-[0_0_0_4px_rgba(37,99,235,0.14),0_0_14px_rgba(37,99,235,0.45)]'
                                : reached
                                  ? 'bg-brand-600/70'
                                  : 'bg-white/15'
                            }`}
                          />
                          <span className={`font-mono text-[11px] transition-colors duration-500 ${active ? 'text-brand-400' : reached ? 'text-slate' : 'text-mist'}`}>{p.n}</span>
                          <span className={`text-[14.5px] font-medium tracking-[-0.015em] transition-colors ${active ? 'text-ink' : reached ? 'text-slate group-hover:text-ink' : 'text-mist group-hover:text-slate'}`}>
                            {p.title}
                          </span>
                        </span>
                        <motion.span
                          aria-hidden
                          style={{ gridColumn: `${p.start + 1} / ${(p.extends ? 12 : p.end) + 2}` }}
                          initial={reduce ? false : { scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: EASE, delay: 0.2 + i * 0.12 }}
                          className="relative mx-0.5 flex h-9 origin-left items-center overflow-hidden rounded-lg"
                        >
                          {handoff ? (
                            <span
                              className={`flex h-full w-full items-center justify-center rounded-lg border border-dashed text-[11px] font-medium transition-colors duration-500 ${
                                active ? 'border-brand-500/70 bg-brand-50 text-brand-300 shadow-glow' : reached ? 'border-white/25 text-slate' : 'border-white/15 text-mist'
                              }`}
                            >
                              Handoff
                            </span>
                          ) : (
                            <>
                              <span
                                className={`h-full rounded-lg transition-colors duration-500 ${active ? 'bg-brand-600' : reached ? 'bg-brand-200 group-hover:bg-brand-100' : 'bg-white/[0.05] group-hover:bg-white/[0.08]'}`}
                                style={{ width: `${((p.end - p.start + 1) / ((p.extends ? 12 : p.end) - p.start + 1)) * 100}%` }}
                              />
                              {p.extends && (
                                <span
                                  className={`h-full flex-1 rounded-r-lg transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-60'}`}
                                  style={{
                                    background: reached
                                      ? 'repeating-linear-gradient(135deg, rgba(37,99,235,0.28) 0 4px, transparent 4px 9px)'
                                      : 'repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 4px, transparent 4px 9px)',
                                  }}
                                />
                              )}
                              <span className={`absolute left-3 font-mono text-[10.5px] transition-colors duration-500 ${active ? 'text-onaccent' : reached ? 'text-brand-800' : 'text-mist'}`}>
                                {p.when}
                              </span>
                            </>
                          )}
                        </motion.span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <p className="mt-3 flex items-center gap-2 border-t border-white/[0.06] pt-3 text-[11.5px] text-mist">
                <span aria-hidden className="inline-block h-2.5 w-6 rounded-sm" style={{ background: 'repeating-linear-gradient(135deg, rgba(37,99,235,0.4) 0 3px, transparent 3px 7px)' }} />
                Continues as opportunities arise
              </p>
            </div>
          </div>

          {/* Detail panel */}
          <div id="phase-panel" role="tabpanel" aria-labelledby={`phase-tab-${sel}`} className="border-t border-white/[0.07] bg-paper">
            <AnimatePresence mode="wait">
              <motion.div
                key={sel}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_1fr_0.9fr] lg:gap-12"
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400">
                    Phase {phase.n} · {phase.when}
                  </p>
                  <h3 className="mt-3 text-[32px] font-semibold leading-tight tracking-[-0.035em] text-ink">{phase.title}</h3>
                  <p className="mt-2 text-[17px] text-slate">{phase.summary}</p>
                </div>
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">Focus</p>
                  <ul className="mt-4 space-y-3">
                    {phase.focus.map((f) => (
                      <li key={f} className="flex gap-3 text-[15px] leading-snug text-charcoal">
                        <span aria-hidden className="mt-[8px] h-1 w-3 shrink-0 rounded-full bg-brand-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl bg-card p-6 ring-1 ring-white/[0.08]">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">Output</p>
                  <p className="mt-3 text-[17px] font-medium leading-snug tracking-[-0.015em] text-ink">{phase.output}</p>
                  {sel < PHASES.length - 1 && (
                    <button
                      type="button"
                      onClick={() => pick(sel + 1)}
                      className="mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-brand-300 hover:text-brand-400"
                    >
                      Next: {PHASES[sel + 1].title}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
