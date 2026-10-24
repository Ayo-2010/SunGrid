interface PageMetaOptions {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
}

export function usePageMeta({ title, description, image, type = 'website', noindex = false }: PageMetaOptions) {
  const config = useRuntimeConfig()
  const route = useRoute()
  const siteUrl = (config.public.siteUrl as string).replace(/\/$/, '')
  const canonical = `${siteUrl}${route.path === '/' ? '' : route.path}`
  const ogImage = `${siteUrl}${image ?? '/images/solar-house.jpg'}`

  useSeoMeta({
    title,
    description,
    ogTitle: `${title} · SunGrid Energy`,
    ogDescription: description,
    ogType: type === 'product' ? 'website' : type,
    ogImage,
    ogUrl: canonical,
    ogSiteName: 'SunGrid Energy',
    ogLocale: 'en_NG',
    twitterCard: 'summary_large_image',
    twitterTitle: `${title} · SunGrid Energy`,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: noindex ? 'noindex, nofollow' : 'index, follow',
  })

  useHead({
    link: [{ rel: 'canonical', href: canonical }],
  })
}
