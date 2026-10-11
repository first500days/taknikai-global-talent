import { motion, useReducedMotion } from 'framer-motion'
import { BOOKING_URL } from '../lib/site'
import ProfileGraph from './ProfileGraph'
import TrustBar from './TrustBar'
import { EASE, MagneticButton } from './ui'

export default function Hero() {
  const reduce = useReducedMotion()
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.95, ease: EASE, delay },
  })

  return (
    <section id="top" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* atmosphere */}
      <div aria-hidden className="grid-bg mask-radial pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10%] top-[-6%] h-[820px] w-[820px] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.07),transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-20 h-[620px] w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.035),transparent)]"
      />

      <div className="shell relative grid items-center gap-14 pb-16 pt-14 sm:pt-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:pb-24 lg:pt-24">
        <div>
          <motion.p {...rise(0.05)} className="eyebrow flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand-400 opacity-40" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-brand-500" />
            </span>
            Global Talent · Digital Technology
          </motion.p>

          <motion.h1
            id="hero-title"
            {...rise(0.15)}
            className="display mt-7 text-[clamp(2.9rem,6.4vw,5.5rem)] leading-[0.98] text-ink"
          >
            Build the profile that gets{' '}
            <span className="text-gradient text-brand-400">noticed.</span>
          </motion.h1>

          <motion.p
            {...rise(0.28)}
            className="mt-7 max-w-xl text-[19px] font-medium leading-snug tracking-[-0.015em] text-charcoal sm:text-[21px]"
          >
            Real technical work. Genuine recognition. Evidence that stands up to scrutiny.
          </motion.p>

          <motion.p {...rise(0.36)} className="mt-4 max-w-lg text-[16.5px] leading-relaxed text-slate">
            TaknikAI helps digital technology professionals turn technical experience into a credible,
            evidence-backed profile for the UK Global Talent route.
          </motion.p>

          <motion.div {...rise(0.46)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <MagneticButton href={BOOKING_URL} size="lg" arrow>
              Book a Free Profile Assessment
            </MagneticButton>
            <MagneticButton href="#programme" size="lg" variant="secondary">
              Explore the Programme
            </MagneticButton>
          </motion.div>

          <motion.p {...rise(0.56)} className="mt-6 text-[12.5px] text-mist">
            Profile development, not immigration advice. Legal and visa advice is provided by regulated partners.
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
          className="relative px-4 sm:px-10 lg:px-0"
        >
          <ProfileGraph />
        </motion.div>
      </div>

      <TrustBar />
    </section>
  )
}
