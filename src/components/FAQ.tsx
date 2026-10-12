import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus } from 'lucide-react'
import { CONTACT_EMAIL } from '../lib/site'
import { EASE, Reveal, SectionHeader } from './ui'

const FAQS = [
  {
    q: 'Can you guarantee endorsement?',
    a: 'No. Endorsement decisions are made independently by the endorsing body, and visa decisions by the Home Office. No one can honestly guarantee either. We focus on what can be influenced: the strength, authenticity and organisation of your evidence.',
  },
  {
    q: 'Do I need to quit my job?',
    a: 'No. The programme is designed to run alongside full-time work. It does require a consistent weekly commitment — real projects and contribution take real effort.',
  },
  {
    q: 'How long does the programme take?',
    a: 'Profile Accelerator runs for 10–12 weeks; Profile Readiness for 6–8 weeks. Recognition and contribution often continue beyond the core programme, and a typical path to application spans around six months.',
  },
  {
    q: 'What if my profile is already strong?',
    a: 'Then Profile Readiness is likely the better fit. We analyse gaps, organise and map your existing evidence, and prepare your recommendation and personal-statement readiness — without rebuilding what already works.',
  },
  {
    q: 'What happens after the programme?',
    a: 'Once your profile is ready, we provide a structured handoff to regulated immigration professionals. They advise on and prepare the application; we make sure your evidence is organised and consistent when it reaches them.',
  },
  {
    q: 'Do you provide immigration or legal advice?',
    a: 'No. TaknikAI is not a regulated immigration adviser. We develop technology profiles. Legal and visa advice is provided only by regulated immigration professionals.',
  },
  {
    q: 'Is this only for senior professionals?',
    a: 'No. The route recognises both established leaders (Exceptional Talent) and emerging leaders with strong potential (Exceptional Promise). The right preparation looks different for each — the assessment helps identify which applies to you.',
  },
  {
    q: 'What does the free assessment include?',
    a: 'A 30-minute conversation reviewing your current profile, an honest view of where you stand, the key evidence gaps, and which pathway — if any — makes sense. There is no cost and no commitment.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-sand py-24 sm:py-32">
      <div className="shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeader
            index="11"
            label="FAQ"
            titleId="faq-title"
            title={
              <>
                Straight answers.
              </>
            }
            intro={
              <>
                Something else on your mind? Write to{' '}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-brand-500">
                  {CONTACT_EMAIL}
                </a>
                .
              </>
            }
          />
        </div>

        <Reveal delay={0.1}>
          <ul className="border-t border-white/[0.08]">
            {FAQS.map((f, i) => {
              const isOpen = open === i
              return (
                <li key={f.q} className="border-b border-white/[0.08]">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className={`text-[18px] font-medium tracking-[-0.02em] transition-colors sm:text-[20px] ${isOpen ? 'text-ink' : 'text-charcoal group-hover:text-ink'}`}>
                        {f.q}
                      </span>
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition-all duration-500 ease-premium ${
                          isOpen ? 'bg-brand-50 text-brand-300 ring-1 ring-brand-600/50' : 'bg-card text-slate ring-1 ring-white/10 group-hover:text-ink group-hover:ring-white/25'
                        }`}
                      >
                        {isOpen ? <Minus className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-2xl pb-7 pr-12 text-[15.5px] leading-relaxed text-slate">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
