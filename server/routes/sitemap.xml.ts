import { articles } from '../../app/data/articles'
import { products } from '../../app/data/products'
import { projects } from '../../app/data/projects'
import { solutions } from '../../app/data/solutions'

const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/solutions', priority: '0.9', changefreq: 'monthly' },
  { path: '/products', priority: '0.9', changefreq: 'weekly' },
  { path: '/calculator', priority: '0.9', changefreq: 'monthly' },
  { path: '/quote', priority: '0.8', changefreq: 'monthly' },
  { path: '/installation', priority: '0.8', changefreq: 'monthly' },
  { path: '/projects', priority: '0.8', changefreq: 'monthly' },
  { path: '/industries', priority: '0.7', changefreq: 'monthly' },
  { path: '/resources', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.7', changefreq: 'yearly' },
  { path: '/contact', priority: '0.7', changefreq: 'yearly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
]

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const base = String(config.public.siteUrl).replace(/\/$/, '')

  const entries = [
    ...staticRoutes.map((route) => ({
      loc: `${base}${route.path === '/' ? '/' : route.path}`,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: undefined as string | undefined,
    })),
    ...solutions.map((solution) => ({
      loc: `${base}/solutions/${solution.slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: undefined,
    })),
    ...products.map((product) => ({
      loc: `${base}/products/${product.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: undefined,
    })),
    ...projects.map((project) => ({
      loc: `${base}/projects/${project.slug}`,
      changefreq: 'yearly',
      priority: '0.6',
      lastmod: undefined,
    })),
    ...articles.map((article) => ({
      loc: `${base}/resources/${article.slug}`,
      changefreq: 'yearly',
      priority: '0.6',
      lastmod: article.date,
    })),
  ]

  const body = entries
    .map((entry) => {
      const parts = [
        `    <loc>${escapeXml(entry.loc)}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
      ].filter(Boolean)
      return `  <url>\n${parts.join('\n')}\n  </url>`
    })
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`
})
