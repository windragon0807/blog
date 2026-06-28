import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ryong.dev'
export const SITE_NAME = 'ryong.log'
export const SITE_AUTHOR = '정승룡'
export const SITE_DESCRIPTION =
  '프론트엔드 개발, UI 컴포넌트, 제품 개발 경험을 정리하는 정승룡의 개발 블로그입니다.'

type PageMetadataInput = {
  title: string
  description: string
  path: string
  imageTitle?: string
  tags?: readonly string[]
}

export function absoluteUrl(path: string) {
  return new URL(path, SITE_URL).toString()
}

export function ogImageUrl(title: string, tags: readonly string[] = []) {
  const params = new URLSearchParams({ title })

  if (tags.length > 0) {
    params.set('tags', tags.join(','))
  }

  return absoluteUrl(`/api/og?${params.toString()}`)
}

export function createPageMetadata({
  title,
  description,
  path,
  imageTitle = title,
  tags = [],
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path)
  const image = ogImageUrl(imageTitle, tags)

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    keywords: tags.length > 0 ? [...tags] : undefined,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'ko_KR',
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
