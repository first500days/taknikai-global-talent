import { CountUp, Reveal, RevealLi, SectionHeader } from './ui'

const SECTORS = ['AI', 'SaaS', 'EdTech', 'HealthTech', 'Consumer Internet']

const FOUNDER_STATS = [
  { value: 100, prefix: '', suffix: '+', label: 'Founders & startups mentored' },
  { value: 10, prefix: '$', suffix: 'M+', label: 'Fundraising supported' },
  { value: 5, prefix: '$', suffix: 'M+', label: 'Revenue generated' },
]

const ROLES = [
  {
    role: 'Profile Strategy Lead',
    remit: 'Owns your assessment, development roadmap and the overall narrative of your profile.',
    phases: ['01', '05'],
  },
  {
    role: 'Technical Development Mentor',
    remit: 'Guides technical depth, project architecture and the quality of your public portfolio.',
    phases: ['02', '03'],
  },
  {
    role: 'Industry & Recognition Strategist',
    remit: 'Identifies contribution, visibility and recognition opportunities within your field.',
    phases: ['04'],
  },
  {
    role: 'Evidence & Profile Specialist',
    remit: 'Organises, maps and stress-tests your evidence ahead of the handoff.',
    phases: ['05', '06'],
  },
]

export default function Founder() {
  return (
    <section id="proof" aria-labelledby="founder-title" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="shell">
        <SectionHeader
          index="08"
          label="Leadership"
          titleId="founder-title"
          title={
            <>
              Built by operators who
              <br />
              <span className="text-gradient text-brand-400">understand technology.</span>
            </>
          }
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-8">
          {/* Portrait panel */}
          <Reveal className="relative flex flex-col overflow-hidden rounded-[28px] bg-[#0B1527] text-white ring-1 ring-white/[0.08]">
            <div className="relative">
              <img
                src="/images/shivam-pal.jpg"
                alt="Shivam Pal, Founder and Managing Director of TaknikAI"
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full object-cover object-top grayscale-[20%]"
              />
              {/* Blend the photo's lower edge into the panel */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1527] to-transparent" />
              <p className="absolute left-8 top-8 rounded-full bg-[rgba(7,16,31,0.6)] px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.2em] text-brand-300 ring-1 ring-white/10 backdrop-blur sm:left-10 sm:top-10">
                Founder
              </p>
            </div>
            <div className="relative mt-auto px-8 pb-8 sm:px-10 sm:pb-10">
              <div className="border-t border-white/[0.08] pt-6">
                <h3 className="text-[28px] font-semibold tracking-[-0.03em]">Shivam Pal</h3>
                <p className="mt-1 text-[15px] text-white/60">Founder & Managing Director</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex flex-col rounded-[28px] bg-card p-8 shadow-card ring-1 ring-white/[0.08] sm:p-10">
            <p className="text-[clamp(1.35rem,2.2vw,1.75rem)] font-medium leading-[1.3] tracking-[-0.025em] text-ink">
              8+ years building and scaling digital businesses — and helping founders turn capability into
              something the world can see and evaluate.
            </p>
            <p className="mt-5 text-[15.5px] leading-relaxed text-slate">
              Shivam brings an operator’s view of technology careers: what genuine innovation looks like, how
              recognition is earned, and how evidence is judged by people who assess ambitious work for a living.
            </p>

            <div className="mt-7">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mist">Sectors</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SECTORS.map((s) => (
                  <li key={s} className="rounded-full bg-ivory px-3.5 py-1.5 text-[13px] text-charcoal ring-1 ring-white/[0.08]">
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-8 max-sm:mt-10">
              {FOUNDER_STATS.map((s) => (
                <div key={s.label} className="flex flex-col">
                  <dt className="order-2 mt-1 text-[12.5px] leading-snug text-slate">{s.label}</dt>
                  <dd className="order-1 text-[clamp(2rem,3.9vw,3.1rem)] font-semibold leading-none tracking-[-0.05em] text-ink">
                    <CountUp value={s.value} prefix={s.prefix} suffix={s.suffix} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Studio model */}
        <div className="mt-20">
          <Reveal className="flex flex-col justify-between gap-4 border-b border-white/[0.1] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-brand-400">The studio model</p>
              <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.25rem)] font-semibold tracking-[-0.035em] text-ink">
                Four specialist disciplines. One profile.
              </h3>
            </div>
            <p className="max-w-sm text-[14.5px] leading-relaxed text-slate">
              Each part of your profile is owned by a specialist — not a generalist consultant.
            </p>
          </Reveal>

          <ol>
            {ROLES.map((r, i) => (
              <RevealLi
                key={r.role}
                delay={i * 0.05}
                className="group grid gap-3 border-b border-white/[0.07] py-7 transition-colors duration-500 hover:bg-white/[0.02] sm:grid-cols-[48px_minmax(0,1fr)_minmax(0,1.3fr)_150px] sm:items-center sm:gap-8 sm:px-4"
              >
                <span className="font-mono text-[12px] text-mist transition-colors group-hover:text-brand-400">0{i + 1}</span>
                <h4 className="text-[20px] font-semibold tracking-[-0.025em] text-ink sm:text-[22px]">{r.role}</h4>
                <p className="text-[15px] leading-relaxed text-slate">{r.remit}</p>
                <div className="flex items-center gap-1.5 sm:justify-end">
                  <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist">Phases</span>
                  {r.phases.map((p) => (
                    <span key={p} className="grid h-7 w-7 place-items-center rounded-full bg-brand-50 font-mono text-[10.5px] text-brand-700 ring-1 ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-onaccent">
                      {p}
                    </span>
                  ))}
                </div>
              </RevealLi>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
