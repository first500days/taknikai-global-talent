import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { BOOKING_URL } from '../lib/site'
import { EASE, MagneticButton, Reveal, SectionHeader } from './ui'

type Key = 'accelerator' | 'readiness'

const PLANS: {
  key: Key
  name: string
  duration: string
  who: string
  tag: string
  items: string[]
}[] = [
  {
    key: 'accelerator',
    name: 'Profile Accelerator',
    duration: '10–12 weeks',
    tag: 'Build the evidence',
    who: 'For professionals who need to substantially develop their profile.',
    items: [
      'Profile assessment',
      'Development roadmap',
      'Technical development',
      'Real-world project',
      'GitHub portfolio',
      'Innovation profile',
      'External contribution',
      'Thought leadership',
      'Recognition strategy',
      'Evidence tracker',
      '1:1 mentorship',
    ],
  },
  {
    key: 'readiness',
    name: 'Profile Readiness',
    duration: '6–8 weeks',
    tag: 'Strengthen & organise',
    who: 'For professionals who already have significant technical achievements but need their profile strengthened and organised.',
    items: [
      'Profile assessment',
      'Evidence gap analysis',
      'Evidence organisation',
      'CV / LinkedIn / GitHub review',
      'Criteria mapping',
      'Recommendation readiness',
      'Personal statement support',
      'Application readiness',
    ],
  },
]

const SITUATIONS: { key: Key; label: string }[] = [
  { key: 'accelerator', label: 'I need to build new evidence' },
  { key: 'readiness', label: 'I have evidence — it needs shaping' },
]

export default function Pathways() {
  const [fit, setFit] = useState<Key | null>(null)

  return (
    <section id="programme" aria-labelledby="pathways-title" className="relative bg-sand py-24 sm:py-32">
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="04"
            label="Global Talent Digital Technology Programme"
            titleId="pathways-title"
            title={
              <>
                Two starting points.
                <br />
                <span className="text-gradient text-brand-400">One destination.</span>
              </>
            }
          />
          <Reveal delay={0.1} className="lg:pb-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate">Where are you today?</p>
            <div role="radiogroup" aria-label="Your current situation" className="mt-3 inline-flex flex-col gap-1 rounded-2xl bg-card p-1 ring-1 ring-white/[0.08] sm:flex-row sm:rounded-full">
              {SITUATIONS.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  role="radio"
                  aria-checked={fit === s.key}
                  onClick={() => setFit(fit === s.key ? null : s.key)}
                  className={`relative rounded-full px-4 py-2.5 text-left text-[13.5px] transition-colors duration-300 ${
                    fit === s.key ? 'text-white' : 'text-charcoal hover:text-ink'
                  }`}
                >
                  {fit === s.key && (
                    <motion.span layoutId="fit-pill" className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-brand-600/50" transition={{ duration: 0.45, ease: EASE }} />
                  )}
                  <span className="relative">{s.label}</span>
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 lg:grid-cols-[1.18fr_1fr]">
          {PLANS.map((p, i) => {
            const dark = p.key === 'accelerator'
            const dim = fit !== null && fit !== p.key
            const match = fit === p.key
            return (
              <Reveal key={p.key} delay={i * 0.08} className="h-full">
                <article
                  aria-labelledby={`plan-${p.key}`}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[28px] p-8 transition-all duration-700 ease-premium hover:-translate-y-1 sm:p-10 ${
                    dark
                      ? 'bg-elevated text-white shadow-lift ring-1 ring-brand-600/30'
                      : 'bg-card text-ink shadow-card ring-1 ring-white/[0.08] hover:shadow-lift hover:ring-white/[0.14]'
                  } ${dim ? 'opacity-55 saturate-50' : ''} ${match ? '!ring-brand-500/70' : ''}`}
                >
                  {dark && (
                    <>
                      <div aria-hidden className="grid-bg-dark pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,#000,transparent_60%)]" />
                      <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent)]" />
                      <div aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/70 to-transparent" />
                    </>
                  )}

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <p className={`font-mono text-[10.5px] uppercase tracking-[0.18em] ${dark ? 'text-brand-300' : 'text-brand-400'}`}>
                        Pathway 0{i + 1} · {p.tag}
                      </p>
                      <h3 id={`plan-${p.key}`} className="mt-3 text-[30px] font-semibold tracking-[-0.035em] sm:text-[34px]">
                        {p.name}
                      </h3>
                    </div>
                    {dark && (
                      <span className="hidden shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11.5px] text-brand-300 ring-1 ring-brand-600/40 sm:inline">
                        Most comprehensive
                      </span>
                    )}
                    {match && !dark && (
                      <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 text-[11.5px] text-brand-700 ring-1 ring-brand-200">
                        Likely fit
                      </span>
                    )}
                  </div>

                  <p className={`relative mt-4 max-w-md text-[15.5px] leading-relaxed ${dark ? 'text-white/65' : 'text-slate'}`}>{p.who}</p>

                  <dl className={`relative mt-8 flex items-baseline gap-4 border-y py-5 ${dark ? 'border-white/10' : 'border-white/[0.07]'}`}>
                    <dt className={`font-mono text-[12px] uppercase tracking-[0.14em] ${dark ? 'text-white/55' : 'text-slate'}`}>Typical duration</dt>
                    <dd className={`text-[18px] font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{p.duration}</dd>
                  </dl>

                  <ul className={`relative mt-7 grid gap-x-6 gap-y-3 ${dark ? 'sm:grid-cols-2' : ''}`}>
                    {p.items.map((it) => (
                      <li key={it} className={`flex items-start gap-3 text-[14.5px] ${dark ? 'text-white/85' : 'text-charcoal'}`}>
                        <span className={`mt-0.5 grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full ${dark ? 'bg-brand-500/15 text-brand-300' : 'bg-white/[0.05] text-slate'}`}>
                          <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden />
                        </span>
                        {it}
                      </li>
                    ))}
                  </ul>

                  <div className="relative mt-auto pt-10">
                    <MagneticButton href={BOOKING_URL} arrow variant={dark ? 'primary' : 'secondary'} className="w-full sm:w-auto">
                      Discuss Your Profile
                    </MagneticButton>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="mt-8">
          <p className="text-center text-[13px] text-slate">
            Not sure which fits? The free assessment tells you — including when neither is right yet.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
