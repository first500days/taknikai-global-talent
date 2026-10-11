import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Ban, GitMerge, ShieldCheck, Star } from 'lucide-react'
import { EASE, Reveal, SectionHeader } from './ui'

/* Deterministic pseudo-random so the contribution grid is stable across renders */
const cells = Array.from({ length: 7 * 20 }, (_, i) => {
  const v = Math.abs(Math.sin(i * 12.9898 + 4.1) * 43758.5453) % 1
  const ramp = Math.min(1, (i % 20) / 14)
  return v * (0.35 + ramp * 0.65)
})

function Artifact({ label, caption, i, children }: { label: string; caption: string; i: number; children: ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      className="relative"
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: EASE, delay: (i % 3) * 0.1 }}
    >
      {/* Module connectors (desktop 3×2 grid): thin rails, brand blue only at the junctions */}
      {i % 3 !== 2 && (
        <span aria-hidden className="pointer-events-none absolute left-full top-1/2 hidden h-px w-5 bg-white/[0.1] lg:block">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" />
        </span>
      )}
      {i < 3 && (
        <span aria-hidden className="pointer-events-none absolute left-1/2 top-full hidden h-5 w-px bg-white/[0.1] lg:block">
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" />
        </span>
      )}
      <motion.div
        animate={reduce ? undefined : { y: [0, i % 2 ? -4 : -3, 0] }}
        transition={{ duration: 6.5 + i * 0.6, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        className="group relative h-full rounded-2xl bg-card p-5 ring-1 ring-white/[0.08] transition-colors duration-500 hover:bg-elevated hover:ring-brand-600/45"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-white">{label}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]" aria-hidden />
        </div>
        <div className="mt-5 h-[132px] overflow-hidden rounded-xl bg-ivory p-4 ring-1 ring-white/[0.06]" aria-hidden>
          {children}
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-white/55">{caption}</p>
      </motion.div>
    </motion.li>
  )
}

export default function EvidenceSystem() {
  return (
    <section aria-labelledby="build-title" className="relative overflow-hidden bg-ivory py-24 text-white sm:py-32">
      <div aria-hidden className="grid-bg-dark mask-radial pointer-events-none absolute inset-0" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.07),transparent)]" />

      <div className="shell relative">
        <SectionHeader
          dark
          index="07"
          label="What we actually build"
          titleId="build-title"
          title={
            <>
              We don’t manufacture credentials.
              <br />
              <span className="text-gradient text-brand-300">We build genuine evidence.</span>
            </>
          }
        />

        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          <Artifact i={0} label="Project" caption="A real-world technical project you designed, built and can explain line by line.">
            <div className="font-mono text-[11.5px] leading-[1.75] text-white/60">
              <p className="text-brand-300">▾ your-project/</p>
              <p>&nbsp;&nbsp;├─ src/</p>
              <p>&nbsp;&nbsp;├─ tests/</p>
              <p>&nbsp;&nbsp;├─ docs/architecture.md</p>
              <p>&nbsp;&nbsp;└─ README.md <span className="text-brand-300/80">✓</span></p>
            </div>
          </Artifact>

          <Artifact i={1} label="GitHub" caption="A public portfolio with consistent, documented, reviewable work.">
            <div className="grid h-full grid-flow-col grid-rows-7 gap-[3px]">
              {cells.map((v, k) => (
                <span key={k} className="rounded-[2px]" style={{ background: v < 0.15 ? 'rgba(255,255,255,0.06)' : `rgba(62,149,132,${0.25 + v * 0.75})` }} />
              ))}
            </div>
          </Artifact>

          <Artifact i={2} label="Article" caption="Technical writing that shows how you think — published where your field reads.">
            <div>
              <div className="h-2.5 w-4/5 rounded bg-white/70" />
              <div className="mt-2 h-2.5 w-1/2 rounded bg-white/70" />
              <p className="mt-3 font-mono text-[10px] text-brand-300/80">Technical deep-dive · 8 min read</p>
              <div className="mt-3 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-white/15" />
                <div className="h-1.5 w-11/12 rounded bg-white/15" />
                <div className="h-1.5 w-4/5 rounded bg-white/15" />
              </div>
            </div>
          </Artifact>

          <Artifact i={3} label="Contribution" caption="Merged contributions and community work that others depend on.">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-500/25 text-brand-300">
                  <GitMerge className="h-3.5 w-3.5" />
                </span>
                <span className="text-[12.5px] text-white/85">Pull request merged</span>
              </div>
              <div className="space-y-1.5 font-mono text-[10.5px]">
                <p className="text-brand-300/90">+ improves inference latency</p>
                <p className="text-white/40">− removes redundant allocation</p>
              </div>
              <div className="flex gap-1.5">
                {['reviewed', 'docs', 'tests'].map((t) => (
                  <span key={t} className="rounded-full bg-white/[0.07] px-2 py-0.5 font-mono text-[9.5px] text-white/60">{t}</span>
                ))}
              </div>
            </div>
          </Artifact>

          <Artifact i={4} label="Recognition" caption="External, verifiable signals — earned, never purchased.">
            <div className="flex h-full items-center gap-4">
              <div className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full ring-1 ring-brand-400/40">
                <div className="absolute inset-1.5 rounded-full border border-dashed border-white/15" />
                <Star className="h-5 w-5 text-brand-300" />
              </div>
              <div className="space-y-2 text-[12px] text-white/75">
                <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-brand-300" />Invited to speak</p>
                <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-brand-300" />Selected as judge</p>
                <p className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-brand-300" />Work cited by peers</p>
              </div>
            </div>
          </Artifact>

          <Artifact i={5} label="Evidence" caption="Everything organised, mapped to criteria and traceable to source.">
            <div className="space-y-2.5">
              {[
                ['Innovation', 'Mapped'],
                ['Recognition', 'Mapped'],
                ['Contribution', 'Mapped'],
                ['Impact', 'Reviewing'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[12px]">
                  <span className="flex items-center gap-2 text-white/80">
                    <ShieldCheck className={`h-3.5 w-3.5 ${v === 'Mapped' ? 'text-brand-300' : 'text-white/30'}`} />
                    {k}
                  </span>
                  <span className={`font-mono text-[10px] ${v === 'Mapped' ? 'text-brand-300/80' : 'text-white/40'}`}>{v}</span>
                </div>
              ))}
            </div>
          </Artifact>
        </ul>

        <Reveal className="mt-20 grid gap-12 border-t border-white/[0.08] pt-14 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <p className="text-[clamp(1.5rem,2.8vw,2.25rem)] font-medium leading-[1.2] tracking-[-0.03em] text-white">
            Every deliverable is built around genuine technical work, independently verifiable contribution and{' '}
            <span className="text-gradient text-brand-300">evidence you can defend.</span>
          </p>
          <ul className="space-y-4">
            {[
              'We do not fabricate or sell recommendation letters.',
              'We do not manufacture recognition — every signal is earned through real work.',
              'We do not promise endorsement, visa approval or any specific outcome.',
            ].map((t) => (
              <li key={t} className="flex gap-3.5 text-[15px] leading-relaxed text-white/70">
                <Ban className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
