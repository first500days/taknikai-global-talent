import { ArrowRight } from 'lucide-react'
import { Reveal, SectionHeader } from './ui'

const CASES = [
  {
    role: 'AI / ML Engineer',
    track: 'Exceptional Promise',
    problem: 'Strong technical capability but limited public evidence.',
    built: ['Independent ML projects', 'GitHub portfolio', 'Technical writing', 'Community contribution'],
    outcome: 'Stronger evidence-led profile',
  },
  {
    role: 'Data Scientist',
    track: 'Exceptional Talent',
    problem: 'Strong employer-based achievements but limited evidence of individual contribution.',
    built: ['Independent project', 'Contribution narrative', 'Technical portfolio', 'Evidence roadmap'],
    outcome: 'Clearer evidence of individual contribution',
  },
]

// Small structural label with a brand-blue tick — keeps Background / Challenge / Built / Outcome distinct
function Label({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">
      <span aria-hidden className="h-3 w-[2px] rounded-full bg-brand-500" />
      {children}
    </p>
  )
}

export default function CaseStudies() {
  return (
    <section id="case-studies" aria-labelledby="cases-title" className="relative bg-sand py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          index="08"
          label="Profile Journeys"
          titleId="cases-title"
          title={
            <>
              What the work
              <br />
              <span className="text-gradient text-brand-400">looks like in practice.</span>
            </>
          }
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          {CASES.map((c, i) => (
            <Reveal key={c.role} delay={i * 0.08}>
              <article className="group flex h-full flex-col rounded-[28px] bg-card p-8 shadow-card ring-1 ring-white/[0.08] transition-all duration-700 ease-premium hover:-translate-y-1 hover:bg-elevated hover:shadow-lift hover:ring-white/[0.14] sm:p-10">
                <div className="flex">
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-[12px] font-medium text-brand-300 ring-1 ring-brand-600/40">
                    {c.track}
                  </span>
                </div>
                <div className="mt-8">
                  <Label>Background</Label>
                </div>
                <h3 className="mt-3 text-[32px] font-semibold tracking-[-0.035em] text-ink sm:text-[38px]">{c.role}</h3>

                <div className="mt-8 grid gap-8 border-t border-white/[0.07] pt-8 sm:grid-cols-2">
                  <div>
                    <Label>Challenge</Label>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-charcoal">{c.problem}</p>
                  </div>
                  <div>
                    <Label>What we built</Label>
                    <ul className="mt-3 space-y-2">
                      {c.built.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-[15px] text-charcoal">
                          <span aria-hidden className="h-1 w-3 rounded-full bg-brand-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-10">
                  <div className="flex items-center gap-4 rounded-2xl bg-ivory p-5 ring-1 ring-white/[0.07]">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-300 ring-1 ring-brand-600/40 transition-colors duration-500 group-hover:bg-brand-600 group-hover:text-onaccent">
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                    <div>
                      <Label>Outcome</Label>
                      <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em] text-ink">{c.outcome}</p>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
