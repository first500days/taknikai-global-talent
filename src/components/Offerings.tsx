import { ArrowRight, GraduationCap, Layers } from 'lucide-react'
import { Reveal, RevealLi, SectionHeader } from './ui'

// Connects the Global Talent programme with TaknikAI's existing education offering (the Upskill section).
// Upskill copy is taken from the original course homepage.
const OFFERINGS = [
  {
    icon: Layers,
    eyebrow: 'On this page',
    title: 'Global Talent Digital Technology Programme',
    body: 'For technology professionals developing real technical work, a credible professional profile and well-organised evidence — and, where appropriate, exploring readiness for the UK Global Talent route.',
    cta: 'Explore the Programme',
    href: '#programme',
  },
  {
    icon: GraduationCap,
    eyebrow: 'Upskill',
    title: 'Generative AI, Data Science & Analytics courses',
    body: 'A structured, IIT-Alumni-led program designed to build real-world skills. Learn through live classes, hands-on projects, and 1:1 mentorship.',
    cta: 'Explore Upskill',
    href: '/upskill/',
  },
]

export default function Offerings() {
  return (
    <section id="offerings" aria-labelledby="offerings-title" className="relative border-t border-white/[0.06] bg-sand py-24 sm:py-28">
      <div className="shell">
        <SectionHeader
          index="14"
          label="Also from TaknikAI"
          titleId="offerings-title"
          title={
            <>
              Learn the skills. <span className="text-gradient text-brand-400">Build the profile.</span>
            </>
          }
          intro="TaknikAI supports technology learning and professional growth through two related, but separate, offerings."
        />

        <ul className="mt-12 grid gap-5 md:grid-cols-2">
          {OFFERINGS.map((o, i) => (
            <RevealLi key={o.title} delay={i * 0.08} className="h-full">
              <a
                href={o.href}
                className="group flex h-full flex-col rounded-[20px] bg-card p-7 shadow-card ring-1 ring-white/[0.08] transition-all duration-500 ease-premium hover:-translate-y-1 hover:bg-elevated hover:ring-white/[0.14] sm:p-8"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white">
                  <o.icon className="h-5 w-5" aria-hidden />
                </span>
                <p className="eyebrow mt-6 text-brand-400">{o.eyebrow}</p>
                <h3 className="mt-2 text-[22px] font-semibold leading-snug tracking-[-0.01em] text-ink">{o.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-slate">{o.body}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[15px] font-semibold text-ink transition-colors group-hover:text-brand-300">
                  {o.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </span>
              </a>
            </RevealLi>
          ))}
        </ul>

        <Reveal className="mt-6">
          <p className="text-[13px] leading-relaxed text-mist">
            Completing a course does not by itself make anyone eligible for the UK Global Talent route, and neither
            offering guarantees recognition, endorsement or a visa.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
