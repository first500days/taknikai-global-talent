import { Reveal, SectionHeader } from './ui'

const PILLARS = [
  {
    n: 'I',
    title: 'Innovation',
    line: 'Original technical work and differentiated ideas.',
    signals: ['Approaches that depart from standard practice', 'Tools or products you originated', 'Technical decisions you can explain and defend'],
  },
  {
    n: 'II',
    title: 'Recognition',
    line: 'Recognition within the digital technology field.',
    signals: ['Acknowledgement from outside your employer', 'Selection, invitation or citation by peers', 'Senior voices who know your work first-hand'],
  },
  {
    n: 'III',
    title: 'Contribution',
    line: 'Impact beyond normal employment.',
    signals: ['Open-source and community work', 'Mentoring and knowledge-sharing', 'Effort that advances the wider sector'],
  },
  {
    n: 'IV',
    title: 'Measurable Impact',
    line: 'Technical, commercial or entrepreneurial outcomes.',
    signals: ['Quantified results — users, performance, revenue', 'Clear before-and-after outcomes', 'Attribution to your individual role'],
  },
]

export default function Pillars() {
  return (
    <section aria-labelledby="pillars-title" className="relative py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <SectionHeader
            index="03"
            label="The framework"
            titleId="pillars-title"
            title={
              <>
                What makes a profile <span className="text-gradient text-brand-400">exceptional?</span>
              </>
            }
          />
          <Reveal delay={0.1}>
            <p className="text-[16px] leading-relaxed text-slate lg:pb-2">
              Four dimensions sit at the centre of the digital technology route. A strong profile does not
              need to excel at all four equally — but it needs credible, independent evidence across them.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mt-16">
          <div className="relative grid overflow-hidden rounded-3xl bg-card shadow-card ring-1 ring-white/[0.08] md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <article
                key={p.title}
                className={`group relative p-8 transition-colors duration-700 ease-premium hover:bg-[linear-gradient(160deg,rgba(37,99,235,0.07),transparent_60%)] sm:p-10 lg:p-14 ${
                  i === 1 || i === 2 ? 'bg-[#0C1629]' : 'bg-card'
                } ${
                  i % 2 === 0 ? 'md:border-r' : ''
                } ${i < 2 ? 'border-b' : i === 2 ? 'border-b md:border-b-0' : ''} border-white/[0.07]`}
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="font-display font-extrabold text-[64px] leading-none text-white/[0.14] transition-colors duration-700 group-hover:text-brand-400/70 sm:text-[84px]">
                    {p.n}
                  </span>
                  <span className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">
                    Dimension 0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 text-[30px] font-semibold tracking-[-0.035em] text-ink sm:text-[36px]">{p.title}</h3>
                <p className="mt-3 max-w-sm text-[16.5px] leading-relaxed text-charcoal">{p.line}</p>
                <div className="mt-8 border-t border-dashed border-white/[0.1] pt-6">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-slate">What assessors look for</p>
                  <ul className="mt-4 space-y-2.5">
                    {p.signals.map((s) => (
                      <li key={s} className="flex gap-3 text-[14.5px] leading-snug text-slate">
                        <span aria-hidden className="mt-[7px] h-1 w-3 shrink-0 rounded-full bg-brand-400" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}

            {/* intersection marker */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
            >
              <div className="grid h-[132px] w-[132px] place-items-center rounded-full bg-ivory ring-1 ring-white/[0.08]">
                <div className="grid h-[104px] w-[104px] place-items-center rounded-full bg-elevated text-center ring-1 ring-brand-600/40">
                  <span className="text-[11px] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
                    Exceptional
                    <br />
                    <span className="text-brand-300">Profile</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
