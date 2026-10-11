import { STATS } from '../lib/site'
import { CountUp, Reveal } from './ui'

export default function Credibility() {
  return (
    <section aria-label="Credibility" className="relative py-24 sm:py-28">
      <div className="shell">
        <dl className="grid grid-cols-2 border-y border-white/[0.08] lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.06}
              className={`group flex flex-col px-2 py-10 sm:px-6 lg:py-14 ${i % 2 === 1 ? 'border-l border-white/[0.08]' : ''} ${
                i > 1 ? 'border-t border-white/[0.08] lg:border-t-0' : ''
              } ${i === 2 ? 'lg:border-l' : ''}`}
            >
              <dt className="order-2 mt-3 text-[14px] text-slate">{s.label}</dt>
              <dd className="order-1 text-[clamp(2.6rem,5.4vw,4.6rem)] font-semibold leading-none tracking-[-0.055em] text-ink transition-colors duration-500 group-hover:text-brand-400">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </dd>
            </Reveal>
          ))}
        </dl>
        <Reveal className="mt-10 flex flex-col items-center justify-center gap-2 text-center sm:flex-row sm:gap-4">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-mist">Built in partnership with</span>
          <span className="text-[22px] font-semibold tracking-[-0.035em] text-ink">
            First<span className="text-brand-400">500</span>days
          </span>
        </Reveal>
      </div>
    </section>
  )
}
