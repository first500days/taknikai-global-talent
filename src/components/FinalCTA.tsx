import { AssessmentButton } from './TallyPopup'
import { Reveal, RevealLi } from './ui'

const STEPS = ['Book assessment', 'Receive gap analysis', 'Choose your pathway', 'Start building']

export default function FinalCTA() {
  return (
    <section id="contact" aria-labelledby="cta-title" className="relative overflow-hidden border-t border-white/[0.06] bg-[#050713] py-28 text-white sm:py-36">
      <div aria-hidden className="grid-bg-dark mask-radial pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[30%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent)]" />

      <div className="shell relative text-center">
        <Reveal>
          <p className="eyebrow text-white/50">
            <span className="text-brand-400">14</span> — Next step
          </p>
          <h2 id="cta-title" className="display mx-auto mt-6 max-w-4xl text-[clamp(2.6rem,7vw,5.75rem)] leading-[0.98] text-white">
            Find out where your profile <span className="text-gradient text-brand-400">stands.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-white/60">
            30 minutes. No cost. No commitment. A straight answer on where you stand and what it would take to
            become endorsement-ready.
          </p>
          <div className="mt-10 flex justify-center">
            <AssessmentButton variant="light" size="lg" arrow>
              Book My Free Assessment
            </AssessmentButton>
          </div>
        </Reveal>

        <ol className="mx-auto mt-20 grid max-w-5xl gap-px overflow-hidden rounded-2xl bg-white/[0.07] text-left ring-1 ring-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <RevealLi key={s} delay={i * 0.08} className="group relative bg-[#08111F] p-6 transition-colors duration-500 hover:bg-card">
              <span className="font-mono text-[12px] text-brand-400">0{i + 1}</span>
              <p className="mt-6 text-[17px] font-medium tracking-[-0.02em] text-white">{s}</p>
              <span aria-hidden className="absolute inset-x-6 bottom-0 h-px origin-left scale-x-0 bg-brand-400 transition-transform duration-700 ease-premium group-hover:scale-x-100" />
            </RevealLi>
          ))}
        </ol>
      </div>
    </section>
  )
}
