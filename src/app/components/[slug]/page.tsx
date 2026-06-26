import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComponentSection } from '@/features/component-library/component-docs'
import {
  componentSamples,
  getComponentSampleBySlug,
} from '@/features/component-library/component-data'

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
    title: `${sample.title} | ryong.components`,
    description: sample.description,
    alternates: {
      canonical: `/components/${sample.slug}`,
    },
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
