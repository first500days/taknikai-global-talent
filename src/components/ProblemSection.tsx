import { Award, Code2, FileCheck2, GitPullRequest, PenLine, type LucideIcon } from 'lucide-react'
import { Reveal } from './ui'

const CARDS: { n: string; title: string; line: string; detail: string; Icon: LucideIcon }[] = [
  {
    n: '01',
    title: 'Technical Work',
    line: 'Independent projects demonstrating genuine technical depth.',
    detail: 'Shipped, documented work you personally architected — not only contributions hidden inside an employer’s codebase.',
    Icon: Code2,
  },
  {
    n: '02',
    title: 'Recognition',
    line: 'Verifiable signals of leadership and expertise.',
    detail: 'Signals from outside your organisation — invitations, selections, peer acknowledgement — each one independently checkable.',
    Icon: Award,
  },
  {
    n: '03',
    title: 'Contribution',
    line: 'Evidence of impact beyond the day job.',
    detail: 'Open source, mentoring, community building and knowledge-sharing that move the wider field forward.',
    Icon: GitPullRequest,
  },
  {
    n: '04',
    title: 'Thought Leadership',
    line: 'A visible point of view in your technical field.',
    detail: 'Writing, talks and commentary that show how you think — and that others in your field engage with.',
    Icon: PenLine,
  },
  {
    n: '05',
    title: 'Evidence',
    line: 'A structured record of achievements that can withstand scrutiny.',
    detail: 'Every claim mapped to documentation, metrics and independent sources an assessor can verify.',
    Icon: FileCheck2,
  },
]

export default function ProblemSection() {
  return (
    <section id="why" aria-labelledby="problem-title" className="relative py-24 sm:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow flex items-center gap-3">
              <span className="text-brand-400">01</span>
              <span className="h-px w-6 bg-white/20" aria-hidden />
              The real challenge
            </p>
            <h2 id="problem-title" className="display mt-5 text-[clamp(2.3rem,5vw,4rem)] text-ink">
              It’s not a paperwork problem.
              <br />
              <span className="text-mist">It’s a </span>
              <span className="text-gradient text-brand-400">profile problem.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="border-l-2 border-brand-500 pl-6">
              <p className="text-[18px] leading-relaxed text-charcoal">
                An endorsing body is assessing whether your work, innovation and contribution justify
                recognition — not whether your forms are tidy.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-slate">
                Most strong engineers have the capability. What they lack is independent, documented
                evidence of it. That is what we help you build.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 flex flex-col gap-3 lg:h-[340px] lg:flex-row">
          {CARDS.map((c, i) => (
            <Reveal
              key={c.n}
              delay={i * 0.06}
              className="group flex lg:min-w-0 lg:flex-1 lg:transition-[flex-grow] lg:duration-700 lg:ease-premium lg:hover:flex-[1.7] lg:focus-within:flex-[1.7]"
            >
              <article
                tabIndex={0}
                className="relative flex w-full flex-col overflow-hidden rounded-2xl bg-card p-6 shadow-card ring-1 ring-white/[0.08] outline-none transition-[background-color,box-shadow,transform] duration-500 ease-premium group-hover:-translate-y-1 group-hover:bg-elevated group-hover:shadow-lift group-hover:ring-brand-600/45 focus-visible:ring-2 focus-visible:ring-brand-500 lg:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] text-mist">{c.n}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-50 text-brand-400 ring-1 ring-brand-100 transition-colors duration-500 group-hover:bg-brand-600 group-hover:text-onaccent">
                    <c.Icon className="h-4 w-4" aria-hidden strokeWidth={1.75} />
                  </span>
                </div>
                <div className="mt-8 lg:mt-auto">
                  <h3 className="text-[20px] font-semibold tracking-[-0.025em] text-ink">{c.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-slate lg:min-h-[4.5em]">{c.line}</p>
                  <div className="grid transition-[grid-template-rows,opacity] duration-700 ease-premium lg:grid-rows-[0fr] lg:opacity-0 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100">
                    <div className="overflow-hidden">
                      <p className="mt-4 border-t border-white/[0.07] pt-4 text-[13.5px] leading-relaxed text-charcoal">
                        {c.detail}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand-500/80 transition-transform duration-700 ease-premium group-hover:scale-x-100"
                />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
