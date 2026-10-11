import { ArrowUpRight } from 'lucide-react'
import type { Article } from '../../content/insights'

// Global Talent articles are published in the site's Blogs section as /<slug>/ (see scripts/build-site.mjs)
export const articleHref = (a: Article) => `/${a.slug}/`
export const articleCover = (a: Article) => `/images/blog/${a.slug}.png`

export function ArticleMeta({ article, className = '' }: { article: Article; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${className}`}>
      <span className="text-brand-400">{article.category}</span>
      <span aria-hidden className="h-px w-4 bg-white/20" />
      <span className="text-mist">{article.readingMinutes} min read</span>
    </p>
  )
}

/** Card used on the homepage blog preview. */
export function ArticleCard({ article, headingLevel = 'h3' }: { article: Article; headingLevel?: 'h2' | 'h3' }) {
  const Heading = headingLevel
  return (
    <a
      href={articleHref(article)}
      className="group flex h-full flex-col overflow-hidden rounded-[20px] bg-card shadow-card ring-1 ring-white/[0.08] transition-all duration-500 ease-premium hover:-translate-y-1 hover:bg-elevated hover:shadow-lift hover:ring-white/[0.14]"
    >
      <img
        src={articleCover(article)}
        alt=""
        width={1600}
        height={900}
        loading="lazy"
        decoding="async"
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-7">
        <ArticleMeta article={article} />
        <Heading className="mt-4 text-[20px] font-semibold leading-[1.3] tracking-[-0.01em] text-ink">{article.title}</Heading>
        <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-7 text-[14px] font-medium text-ink">
          Read article
          <span className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-white/15 transition-all duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-brand-600 group-hover:text-onaccent group-hover:ring-brand-600">
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </span>
      </div>
    </a>
  )
}
