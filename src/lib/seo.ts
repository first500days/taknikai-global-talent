import { useEffect } from 'react'
import { SITE_URL } from './site'

export type Seo = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
}

// Mirrors the static tags in index.html
export const HOME_SEO: Seo = {
  title: 'TaknikAI — Global Talent Digital Technology Programme',
  description:
    'TaknikAI helps digital technology professionals build real technical work, a credible professional profile and well-organised evidence for the UK Global Talent route. Profile development — not immigration advice.',
  path: '/',
}

export const canonical = (path: string) => SITE_URL + (path === '/' ? '/' : path)

function setMeta(attr: 'name' | 'property', key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = value
}

export function useSeo(seo: Seo & { noindex?: boolean }) {
  useEffect(() => {
    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (seo.noindex) {
      // Not-found pages must not claim the homepage's canonical URL
      link?.remove()
      setMeta('name', 'robots', 'noindex')
      return
    }
    setMeta('property', 'og:url', canonical(seo.path))
    if (link) link.href = canonical(seo.path)
  }, [seo.title, seo.description, seo.path, seo.noindex])
}
