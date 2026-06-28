import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComponentSection } from '@/features/component-library/component-docs'
import {
  componentSamples,
  getComponentSampleBySlug,
} from '@/features/component-library/component-data'
import { createPageMetadata } from '@/lib/seo'

interface ComponentDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return componentSamples.map((sample) => ({
    slug: sample.slug,
  }))
}

export async function generateMetadata({
  params,
}: ComponentDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const sample = getComponentSampleBySlug(slug)

  if (!sample) {
    return {
      title: 'component not found | ryong.log',
    }
  }

  return {
    ...createPageMetadata({
      title: `${sample.title} | components`,
      description: sample.description,
      path: `/components/${sample.slug}`,
      imageTitle: sample.title,
      tags: ['UI Components', sample.title, sample.categoryId],
    }),
  }
}

export default async function ComponentDetailPage({
  params,
}: ComponentDetailPageProps) {
  const { slug } = await params
  const sample = getComponentSampleBySlug(slug)

  if (!sample) {
    notFound()
  }

  return <ComponentSection sample={sample} />
}
