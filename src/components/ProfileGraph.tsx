import { motion, useReducedMotion } from 'framer-motion'
import { EASE } from './ui'

const SIZE = 600
const C = SIZE / 2
const R = 200

const NODES = [
  'Technical Work',
  'Innovation',
  'Recognition',
  'Contribution',
  'Evidence',
  'Leadership',
].map((label, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180
  const x = C + R * Math.cos(a)
  const y = C + R * Math.sin(a)
  // Gentle curve: control point offset perpendicular to the spoke
  const mx = (C + x) / 2
  const my = (C + y) / 2
  const px = -Math.sin(a) * 26
  const py = Math.cos(a) * 26
  return {
    label,
    i,
    x,
    y,
    d: `M ${C} ${C} Q ${mx + px} ${my + py} ${x} ${y}`,
    left: `${(x / SIZE) * 100}%`,
    top: `${(y / SIZE) * 100}%`,
  }
})

const TICKS = Array.from({ length: 72 }, (_, i) => i)

export default function ProfileGraph() {
  const reduce = useReducedMotion()

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]" role="img" aria-label="Diagram: your profile at the centre, connected to technical work, innovation, recognition, contribution, evidence and leadership.">
      {/* soft ground glow */}
      <div aria-hidden className="absolute inset-[14%] rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.12),transparent)]" />

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="pg-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="pg-spoke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.12" />
          </linearGradient>
        </defs>

        {/* measurement ring */}
        <g className={reduce ? '' : 'animate-slow-spin'}>
          {TICKS.map((t) => {
            const a = (t * 5 * Math.PI) / 180
            const long = t % 6 === 0
            const r1 = 268
            const r2 = long ? 280 : 274
            return (
              <line
                key={t}
                x1={C + r1 * Math.cos(a)}
                y1={C + r1 * Math.sin(a)}
                x2={C + r2 * Math.cos(a)}
                y2={C + r2 * Math.sin(a)}
                stroke="#FFFFFF"
                strokeOpacity={long ? 0.14 : 0.05}
                strokeWidth="1"
              />
            )
          })}
        </g>

        <circle cx={C} cy={C} r={R} fill="none" stroke="#FFFFFF" strokeOpacity="0.07" />
        <circle cx={C} cy={C} r={128} fill="none" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="2 5" />
        <circle cx={C} cy={C} r={150} fill="url(#pg-core)" />

        {/* hexagonal peer links */}
        <motion.path
          d={NODES.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ') + ' Z'}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.07"
          strokeDasharray="3 6"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: EASE, delay: 0.9 }}
        />

        {/* spokes */}
        {NODES.map((n) => (
          <g key={n.label}>
            <motion.path
              d={n.d}
              fill="none"
              stroke="url(#pg-spoke)"
              strokeWidth="1.25"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.3, ease: EASE, delay: 0.35 + n.i * 0.09 }}
            />
            <path
              d={n.d}
              fill="none"
              stroke="#3B82F6"
              strokeOpacity="0.55"
              strokeWidth="1.25"
              strokeDasharray="4 44"
              className={reduce ? '' : 'animate-dash'}
              style={{ animationDelay: `${n.i * -0.6}s` }}
            />
            {!reduce && (
              <circle r="2.4" fill="#3B82F6" opacity="0">
                <animateMotion dur={`${5 + (n.i % 3)}s`} begin={`${1.6 + n.i * 0.7}s`} repeatCount="indefinite" path={n.d} />
                <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.8;1" dur={`${5 + (n.i % 3)}s`} begin={`${1.6 + n.i * 0.7}s`} repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={n.x} cy={n.y} r="3.5" fill="#07101F" stroke="#3B82F6" strokeWidth="1.25" />
          </g>
        ))}

        {/* core */}
        <circle cx={C} cy={C} r="74" fill="none" stroke="#3B82F6" strokeOpacity="0.3" className={reduce ? '' : 'animate-soft-pulse'} />
        <circle cx={C} cy={C} r="62" fill="#0F1B30" />
        <circle cx={C} cy={C} r="62" fill="none" stroke="#3B82F6" strokeOpacity="0.45" />
      </svg>

      {/* core label */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.2 }}
        className="flex flex-col items-center text-center"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-brand-400 sm:text-[10px]">Core</span>
        <span className="mt-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-white sm:text-[14px]">
          Your
          <br />
          Profile
        </span>
      </motion.div>
      </div>

      {/* node labels */}
      {NODES.map((n) => (
        <motion.div
          key={n.label}
          className="absolute"
          style={{ left: n.left, top: n.top }}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.8 + n.i * 0.08 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 6 + n.i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-card/95 px-2.5 py-1.5 shadow-card ring-1 ring-white/[0.08] backdrop-blur sm:px-3 sm:py-2">
              <span className="font-mono text-[9px] text-brand-400 sm:text-[10px]">0{n.i + 1}</span>
              <span className="text-[11px] font-medium tracking-[-0.01em] text-ink sm:text-[13px]">{n.label}</span>
            </div>
          </motion.div>
        </motion.div>
      ))}

      {/* criteria mapping micro-panel */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 1.6 }}
        className="absolute -bottom-2 -right-2 hidden w-[210px] rounded-2xl bg-card/95 p-4 shadow-lift ring-1 ring-white/[0.08] backdrop-blur xl:block"
        aria-hidden
      >
        <p className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-mist">Criteria mapping</p>
        {[
          ['Innovation', 0.82],
          ['Recognition', 0.58],
          ['Contribution', 0.7],
        ].map(([label, v], i) => (
          <div key={label as string} className="mt-3">
            <div className="flex justify-between text-[11.5px]">
              <span className="text-charcoal">{label}</span>
              <span className="font-mono text-[10px] text-slate">In progress</span>
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-brand-500"
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${(v as number) * 100}%` }}
                transition={{ duration: 1.6, ease: EASE, delay: 2 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
