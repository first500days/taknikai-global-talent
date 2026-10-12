import { ArrowRight } from 'lucide-react'
import { ARTICLES, HOMEPAGE_SLUGS } from '../../content/insights'
import { Reveal, RevealLi, SectionHeader } from '../ui'
import { ArticleCard } from './ArticleCard'

const PREVIEW = HOMEPAGE_SLUGS.map((s) => ARTICLES.find((a) => a.slug === s)!).filter(Boolean)

/** Homepage teaser for the Global Talent articles in the Blogs section. */
export default function InsightsPreview() {
  return (
    <section id="blog" aria-labelledby="insights-preview-title" className="relative border-t border-white/[0.06] py-24 sm:py-32">
      <div className="shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            index="12"
            label="From the Blog"
            titleId="insights-preview-title"
            title={
              <>
                Perspectives on building meaningful{' '}
                <span className="text-gradient text-brand-400">technology careers.</span>
              </>
            }
          />
          <Reveal delay={0.1} className="lg:pb-2">
            <a
              href="/blogs/"
              className="group inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-brand-300"
            >
              View all blogs
              <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-premium group-hover:translate-x-0.5" aria-hidden />
            </a>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PREVIEW.map((a, i) => (
            <RevealLi key={a.slug} delay={i * 0.08} className="h-full">
              <ArticleCard article={a} />
            </RevealLi>
          ))}
        </ul>
      </div>
    </section>
  )
}
