import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const EASE = [0.22, 1, 0.36, 1] as const

/* ------------------------------------------------------------------ Reveal */

type RevealProps = HTMLMotionProps<'div'> & { delay?: number; y?: number }

export function Reveal({ delay = 0, y = 18, children, ...rest }: RevealProps) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

type RevealLiProps = HTMLMotionProps<'li'> & { delay?: number; y?: number }

export function RevealLi({ delay = 0, y = 18, children, ...rest }: RevealLiProps) {
  const reduce = useReducedMotion()
  return (
    <motion.li
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </motion.li>
  )
}

/* ---------------------------------------------------------- Section header */

export function SectionHeader({
  index,
  label,
  title,
  titleId,
  intro,
  dark = false,
  align = 'left',
  className = '',
}: {
  index: string
  label: string
  title: ReactNode
  titleId?: string
  intro?: ReactNode
  dark?: boolean
  align?: 'left' | 'center'
  className?: string
}) {
  const centered = align === 'center'
  return (
    <Reveal className={`${centered ? 'mx-auto text-center' : ''} max-w-3xl ${className}`}>
      <p
        className={`eyebrow flex items-center gap-3 ${centered ? 'justify-center' : ''} ${
          dark ? 'text-white/50' : ''
        }`}
      >
        <span className={dark ? 'text-brand-300' : 'text-brand-400'}>{index}</span>
        <span className={`h-px w-6 ${dark ? 'bg-white/20' : 'bg-ink/20'}`} aria-hidden />
        {label}
      </p>
      <h2
        id={titleId}
        className={`display mt-5 text-[clamp(2.1rem,4.6vw,3.6rem)] ${dark ? 'text-white' : 'text-ink'}`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-[17px] leading-relaxed ${
            dark ? 'text-white/60' : 'text-slate'
          } ${centered ? 'mx-auto' : ''} max-w-2xl`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  )
}

/* -------------------------------------------------------- Magnetic button */

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'ghost-dark'

// Matches the original site's hero buttons: blue → violet gradient primary, quiet outline secondary
const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white hover:brightness-110 shadow-[0_10px_30px_-12px_rgba(79,70,229,0.75)]',
  secondary: 'bg-white/[0.03] text-ink ring-1 ring-white/15 hover:bg-white/[0.07] hover:ring-white/25',
  light:
    'bg-[linear-gradient(135deg,#2563EB,#7C3AED)] text-white hover:brightness-110 shadow-[0_10px_30px_-12px_rgba(79,70,229,0.75)]',
  'ghost-dark': 'text-white ring-1 ring-white/15 hover:bg-white/[0.06]',
}

export function MagneticButton({
  href,
  children,
  variant = 'primary',
  arrow = false,
  className = '',
  size = 'md',
  onClick,
}: {
  href: string
  children: ReactNode
  variant?: ButtonVariant
  arrow?: boolean
  className?: string
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}) {
  const ref = useRef<HTMLAnchorElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: React.MouseEvent) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * 0.18)
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  const sizes = {
    sm: 'h-10 px-4 text-[13.5px]',
    md: 'h-12 px-6 text-[15px]',
    lg: 'h-14 px-7 text-[16px]',
  }
  const external = href.startsWith('http')

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`group relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[10px] font-semibold tracking-[-0.01em] transition-colors duration-300 ${sizes[size]} ${VARIANTS[variant]} ${className}`}
    >
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5"
        />
      )}
    </motion.a>
  )
}

/* ----------------------------------------------------------------- CountUp */

export function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1.6,
}: {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  const [display, setDisplay] = useState(reduce ? value : 0)

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value)
      return
    }
    const controls = animate(0, value, {
      duration,
      ease: EASE,
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, value, duration, reduce])

  return (
    <span ref={ref} className="relative inline-block tabular-nums">
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
      {/* Invisible final value reserves width so counting causes no layout shift */}
      <span aria-hidden className="invisible">
        {prefix}
        {value}
        {suffix}
      </span>
      <span aria-hidden className="absolute inset-0 text-left">
        {prefix}
        {display}
        {suffix}
      </span>
    </span>
  )
}
