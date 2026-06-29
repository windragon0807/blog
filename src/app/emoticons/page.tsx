import type { Metadata } from 'next'
import { EmoticonStoragePage } from '@/features/emoticon-storage/emoticon-storage-page'
import { createPageMetadata } from '@/lib/seo'

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'Emoticon Storage',
    description:
      'Material Icon Theme과 Tossface SVG 이모티콘을 탐색하고 SVG, PNG, 클립보드 형식으로 사용할 수 있는 이모티콘 스토리지입니다.',
    path: '/emoticons',
    tags: ['Emoticon', 'SVG', 'PNG', 'Material Icons', 'Tossface'],
  }),
}

export default function EmoticonsPage() {
  return <EmoticonStoragePage />
}
