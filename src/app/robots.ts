import type { MetadataRoute } from 'next'
import { getPublicSiteUrl } from '@/lib/server/env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getPublicSiteUrl() ?? 'http://localhost:3000'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    host: siteUrl,
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
