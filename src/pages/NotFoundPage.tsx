import { MagneticButton } from '../components/ui'
import { useSeo } from '../lib/seo'

export default function NotFoundPage() {
  useSeo({ title: 'Page not found | TaknikAI', description: 'The page you were looking for could not be found.', path: '/404', noindex: true })
  return (
    <section aria-labelledby="nf-title" className="relative">
      <div className="shell flex min-h-[70vh] flex-col items-start justify-center py-24">
        <p className="eyebrow">404</p>
        <h1 id="nf-title" className="display mt-6 text-[clamp(2.4rem,5vw,4rem)] text-ink">
          This page could not be <span className="text-gradient text-brand-400">found.</span>
        </h1>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <MagneticButton href="/" arrow>
            Back to home
          </MagneticButton>
          <MagneticButton href="/blogs/" variant="secondary">
            Browse Blogs
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}
