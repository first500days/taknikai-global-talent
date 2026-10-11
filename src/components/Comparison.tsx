import { Reveal, SectionHeader } from './ui'

const ROWS: [string, string, string][] = [
  ['Focus', 'Paperwork', 'Profile development'],
  ['Method', 'Templates', 'Real technical work'],
  ['Material', 'Existing evidence', 'New evidence'],
  ['Lens', 'Immigration-led', 'Technology-led'],
  ['Goal', 'Submission-focused', 'Endorsement readiness'],
]

export default function Comparison() {
  return (
    <section id="why-taknikai" aria-labelledby="compare-title" className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          index="11"
          label="Why TaknikAI"
          titleId="compare-title"
          align="center"
          title={
            <>
              A different kind of <span className="text-gradient text-brand-400">partner.</span>
            </>
          }
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-[28px] bg-card shadow-card ring-1 ring-white/[0.08]">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Traditional consultancy compared with TaknikAI</caption>
            <thead>
              <tr>
                <th scope="col" className="hidden w-[22%] p-6 sm:table-cell" />
                <th scope="col" className="p-5 align-bottom sm:p-6">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mist">Traditional</span>
                  <span className="mt-1 block text-[16px] font-semibold tracking-[-0.02em] text-slate sm:text-[18px]">Consultancy</span>
                </th>
                <th scope="col" className="relative bg-elevated p-5 align-bottom sm:p-6">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/80 to-transparent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-300">Profile studio</span>
                  <span className="mt-1 block text-[16px] font-semibold tracking-[-0.02em] text-white sm:text-[18px]">TaknikAI</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b]) => (
                <tr key={k} className="group">
                  <th scope="row" className="hidden border-t border-white/[0.07] p-6 font-mono text-[11px] font-normal uppercase tracking-[0.16em] text-mist sm:table-cell">
                    {k}
                  </th>
                  <td className="border-t border-white/[0.07] p-5 text-[15px] text-mist line-through decoration-white/20 sm:p-6 sm:text-[16px]">{a}</td>
                  <td className="border-t border-white/[0.07] bg-elevated p-5 text-[15px] font-medium text-white transition-colors duration-500 group-hover:bg-[#16243F] sm:p-6 sm:text-[16px]">
                    <span className="flex items-center gap-3">
                      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                      {b}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Reveal>

        <Reveal className="mx-auto mt-24 max-w-5xl text-center">
          <p className="text-[clamp(1.1rem,2vw,1.4rem)] text-slate">
            A visa consultant asks: <span className="text-charcoal">“Is the application complete?”</span>
          </p>
          <p className="display mt-8 text-[clamp(2.8rem,8.2vw,7rem)] leading-[0.96] text-ink">
            We ask: “Is the profile <span className="text-gradient text-brand-400">worth endorsing?</span>”
          </p>
        </Reveal>
      </div>
    </section>
  )
}
