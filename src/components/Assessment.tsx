import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, RotateCcw } from 'lucide-react'
import { BOOKING_URL } from '../lib/site'
import { EASE, MagneticButton, Reveal, SectionHeader } from './ui'

type Question = {
  id: string
  q: string
  dimension?: string // shown as a gap when the answer is weak
  scored: boolean
  options: string[]
}

const QUESTIONS: Question[] = [
  { id: 'years', q: 'How many years of experience do you have in digital technology?', scored: true, dimension: 'Experience', options: ['Less than 2 years', '2–5 years', '5–8 years', '8+ years'] },
  { id: 'field', q: 'Which technical field best describes your work?', scored: false, options: ['AI / Machine Learning', 'Software Engineering', 'Data Science & Analytics', 'Product, Cyber or Technical Leadership'] },
  { id: 'achievements', q: 'How would you describe your major technical achievements?', scored: true, dimension: 'Innovation', options: ['Mostly contributions within a team', 'A few notable individual achievements', 'Significant achievements with measurable impact', 'Innovations adopted widely or recognised externally'] },
  { id: 'projects', q: 'Do you have independent technical projects outside your day job?', scored: true, dimension: 'Independent technical work', options: ['None yet', 'Personal or experimental projects', 'Public projects with some users', 'Projects used or adopted by others at scale'] },
  { id: 'recognition', q: 'What recognition have you received for your work?', scored: true, dimension: 'Recognition', options: ['None outside my employer', 'Internal awards or promotions', 'External mentions, awards or selections', 'Significant recognition within the industry'] },
  { id: 'community', q: 'How involved are you in open-source or community contribution?', scored: true, dimension: 'Contribution', options: ['Not involved yet', 'Occasional contributions', 'Regular contributor or organiser', 'Maintainer or community leader'] },
  { id: 'voice', q: 'Have you published technical writing or spoken publicly?', scored: true, dimension: 'Thought leadership', options: ['Not yet', 'Blog posts or internal talks', 'Published articles or conference talks', 'Invited talks or widely-read publications'] },
  { id: 'recommenders', q: 'Who could credibly speak to your work?', scored: true, dimension: 'Recommendation readiness', options: ['I’m not sure yet', 'Colleagues and direct managers', 'Senior leaders who know my work well', 'Recognised figures in my field who know my work'] },
]

const BANDS = [
  { name: 'Early Stage', note: 'Your capability may be real, but very little of it is yet visible or documented outside your role.' },
  { name: 'Developing', note: 'You have a foundation to build on. Independent work and external signals are the main gaps.' },
  { name: 'Strong', note: 'You have meaningful achievements. The work is likely in strengthening, organising and mapping your evidence.' },
  { name: 'Endorsement Ready', note: 'Your answers suggest a well-developed profile. A rigorous evidence review is the sensible next step.' },
]

export default function Assessment() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null))
  const [dir, setDir] = useState(1)
  const timer = useRef<number>()
  const done = step >= QUESTIONS.length

  const result = useMemo(() => {
    const scored = QUESTIONS.map((q, i) => ({ q, a: answers[i] })).filter((x) => x.q.scored)
    const total = scored.reduce((sum, x) => sum + (x.a ?? 0), 0)
    const score = total / (scored.length * 3)
    const band = score < 0.3 ? 0 : score < 0.55 ? 1 : score < 0.78 ? 2 : 3
    const gaps = scored
      .filter((x) => (x.a ?? 0) <= 1 && x.q.dimension)
      .sort((a, b) => (a.a ?? 0) - (b.a ?? 0))
      .slice(0, 3)
      .map((x) => x.q.dimension as string)
    return { score, band, gaps }
  }, [answers])

  const choose = (opt: number) => {
    const next = [...answers]
    next[step] = opt
    setAnswers(next)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => {
      setDir(1)
      setStep((s) => s + 1)
    }, 280)
  }

  const back = () => {
    window.clearTimeout(timer.current)
    setDir(-1)
    setStep((s) => Math.max(0, s - 1))
  }

  const restart = () => {
    setAnswers(QUESTIONS.map(() => null))
    setDir(-1)
    setStep(0)
  }

  const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)]
  const answered = answers.filter((a) => a !== null).length
  const pathway = result.band <= 1 ? 'Profile Accelerator' : 'Profile Readiness'
  const field = answers[1] !== null ? QUESTIONS[1].options[answers[1] as number] : null

  return (
    <section id="assessment" aria-labelledby="assess-title" className="relative bg-sand py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            index="10"
            label="Self-assessment"
            titleId="assess-title"
            title={
              <>
                Is your profile Global Talent{' '}
                <span className="text-gradient text-brand-400">ready?</span>
              </>
            }
            intro="Eight questions. Two minutes. An honest first read on where your profile stands today."
          />
          <Reveal delay={0.1} className="mt-8 hidden lg:block">
            <ol className="space-y-2">
              {QUESTIONS.map((qq, i) => (
                <li key={qq.id} className="flex items-center gap-3 text-[13.5px]">
                  <span
                    className={`grid h-6 w-6 place-items-center rounded-full font-mono text-[10px] transition-colors duration-500 ${
                      answers[i] !== null ? 'bg-brand-600 text-onaccent' : i === step ? 'bg-white/[0.06] text-ink ring-1 ring-brand-500/70' : 'bg-card text-mist ring-1 ring-white/10'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className={i === step && !done ? 'text-ink' : 'text-slate'}>
                    {['Experience', 'Technical field', 'Achievements', 'Independent projects', 'Recognition', 'Community contribution', 'Publications & speaking', 'Potential recommenders'][i]}
                  </span>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-[28px] bg-card shadow-lift ring-1 ring-white/[0.08]">
            {/* progress */}
            <div className="h-1 bg-white/[0.06]" aria-hidden>
              <motion.div
                className="h-full bg-brand-500"
                animate={{ width: `${(answered / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>

            <div className="min-h-[520px] p-7 sm:p-10" aria-live="polite">
              <AnimatePresence mode="wait" custom={dir}>
                {!done ? (
                  <motion.div
                    key={step}
                    custom={dir}
                    initial={{ opacity: 0, x: dir * 28 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: dir * -28 }}
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400">
                        Question {step + 1} of {QUESTIONS.length}
                      </p>
                      {step > 0 && (
                        <button type="button" onClick={back} className="inline-flex items-center gap-1.5 text-[13px] text-slate hover:text-ink">
                          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Back
                        </button>
                      )}
                    </div>
                    <h3 id={`q-${q.id}`} className="mt-5 text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-ink">
                      {q.q}
                    </h3>
                    <div role="radiogroup" aria-labelledby={`q-${q.id}`} className="mt-8 grid gap-3">
                      {q.options.map((o, i) => {
                        const sel = answers[step] === i
                        return (
                          <button
                            key={o}
                            type="button"
                            role="radio"
                            aria-checked={sel}
                            onClick={() => choose(i)}
                            className={`group flex items-center gap-4 rounded-2xl p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 transition-all duration-300 ease-premium sm:p-5 ${
                              sel ? 'bg-elevated text-ink ring-1 ring-brand-600' : 'bg-paper text-charcoal ring-1 ring-white/[0.08] hover:-translate-y-0.5 hover:bg-elevated hover:shadow-card hover:ring-white/[0.16]'
                            }`}
                          >
                            <span
                              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[11px] transition-colors ${
                                sel ? 'bg-brand-600 text-onaccent' : 'bg-card text-slate ring-1 ring-white/10 group-hover:text-ink'
                              }`}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-[15.5px] leading-snug">{o}</span>
                          </button>
                        )
                      })}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-400">Your profile signal</p>
                      <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-[13px] text-slate hover:text-ink">
                        <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Retake
                      </button>
                    </div>
                    <h3 className="mt-4 text-[clamp(2.2rem,4.4vw,3.2rem)] font-semibold leading-none tracking-[-0.045em] text-ink">
                      {BANDS[result.band].name}
                    </h3>
                    <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-slate">{BANDS[result.band].note}</p>

                    {/* spectrum */}
                    <div className="mt-10">
                      <div className="relative h-1.5 rounded-full bg-gradient-to-r from-sand-deep via-brand-600/80 to-brand-400">
                        <motion.span
                          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-card bg-brand-400 shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_0_16px_rgba(37,99,235,0.35)]"
                          initial={{ left: '0%' }}
                          animate={{ left: `${Math.max(3, Math.min(97, result.score * 100))}%` }}
                          transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
                          aria-hidden
                        />
                      </div>
                      <ol className="mt-4 grid grid-cols-4 text-[11.5px] sm:text-[12.5px]">
                        {BANDS.map((b, i) => (
                          <li
                            key={b.name}
                            className={`${i === 0 ? 'text-left' : i === 3 ? 'text-right' : 'text-center'} ${
                              i === result.band ? 'font-semibold text-ink' : 'text-mist'
                            }`}
                          >
                            {b.name}
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="mt-10 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-paper p-5 ring-1 ring-white/[0.08]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Areas worth exploring</p>
                        {result.gaps.length ? (
                          <ul className="mt-3 space-y-1.5">
                            {result.gaps.map((g) => (
                              <li key={g} className="flex items-center gap-2.5 text-[14.5px] text-charcoal">
                                <span aria-hidden className="h-1 w-3 rounded-full bg-brand-400" />
                                {g}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="mt-3 text-[14.5px] text-charcoal">No obvious gaps — evidence quality is what to test next.</p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-paper p-5 ring-1 ring-white/[0.08]">
                        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Likely starting point</p>
                        <p className="mt-3 text-[17px] font-semibold tracking-[-0.02em] text-ink">{pathway}</p>
                        {field && <p className="mt-1 text-[13px] text-slate">Field: {field}</p>}
                      </div>
                    </div>

                    <p className="mt-8 rounded-xl border-l-2 border-brand-500 bg-brand-50 px-4 py-3 text-[13.5px] font-medium leading-relaxed text-brand-800">
                      This is an initial profile assessment, not an eligibility or endorsement decision.
                    </p>

                    <div className="mt-8">
                      <MagneticButton href={BOOKING_URL} arrow size="lg" className="w-full sm:w-auto">
                        Book Your Free Assessment
                      </MagneticButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
