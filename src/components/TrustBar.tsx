import { CountUp, Reveal } from './ui'

const ITEMS = [
  { value: 100, prefix: '', suffix: '+', label: 'Startups mentored' },
  { value: 10, prefix: '$', suffix: 'M+', label: 'Fundraising supported' },
  { value: 8, prefix: '', suffix: '+', label: 'Years building ventures' },
]

export default function TrustBar() {
  return (
    <div className="relative border-y border-white/[0.06] bg-paper/70">
      <Reveal className="shell flex flex-col gap-6 py-7 md:flex-row md:items-center md:justify-between">
        <dl className="grid grid-cols-3 gap-4 md:flex md:gap-0 md:divide-x md:divide-white/[0.08]">
          {ITEMS.map((s) => (
            <div key={s.label} className="group flex flex-col md:flex-row md:items-baseline md:gap-3 md:px-8 md:first:pl-0">
              <dt className="order-2 text-[12.5px] leading-tight text-slate md:order-2">{s.label}</dt>
              <dd className="order-1 text-[26px] font-semibold tracking-[-0.03em] text-ink transition-colors duration-300 group-hover:text-brand-400 md:text-[28px]">
                <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="flex items-center gap-3 text-[13px] text-slate">
          <span className="h-px w-8 bg-white/15" aria-hidden />
          Built in partnership with <span className="font-semibold tracking-[-0.01em] text-ink">First500days</span>
        </p>
      </Reveal>
    </div>
  )
}
