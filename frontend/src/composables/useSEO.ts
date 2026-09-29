import { watchEffect, type Ref } from 'vue'

interface SeoOptions {
  title?: string
  description?: string
  keywords?: string
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product'
  twitterCard?: 'summary' | 'summary_large_image'
  noindex?: boolean
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  if (!content) return
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  if (!href) return
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function useSEO(options: Ref<SeoOptions> | SeoOptions) {
  const apply = (opts: SeoOptions) => {
    if (opts.title) document.title = opts.title
    if (opts.description !== undefined) setMeta('description', opts.description)
    if (opts.keywords !== undefined) setMeta('keywords', opts.keywords)

    setMeta('og:title', opts.ogTitle || opts.title || '', 'property')
    setMeta('og:description', opts.ogDescription || opts.description || '', 'property')
    setMeta('og:image', opts.ogImage || '', 'property')
    setMeta('og:type', opts.ogType || 'website', 'property')
    setMeta('twitter:card', opts.twitterCard || 'summary_large_image')
    setMeta('twitter:title', opts.ogTitle || opts.title || '')
    setMeta('twitter:description', opts.ogDescription || opts.description || '')
    setMeta('twitter:image', opts.ogImage || '')

    if (opts.canonical) setLink('canonical', opts.canonical)

    if (opts.noindex) {
      setMeta('robots', 'noindex,nofollow')
    } else {
      const robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]')
      if (robots) robots.setAttribute('content', 'index,follow')
    }
  }

  if (typeof (options as Ref<SeoOptions>).value !== 'undefined' && 'value' in (options as object)) {
    watchEffect(() => apply((options as Ref<SeoOptions>).value))
  } else {
    apply(options as SeoOptions)
  }
}
