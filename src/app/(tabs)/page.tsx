import type { Metadata } from 'next'
import { getPosts } from '@/lib/notion'
import { PostExplorer } from '@/components/PostExplorer'
import { createPageMetadata } from '@/lib/seo'

export const revalidate = 3600 // ISR: 1시간마다 재생성

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'ryong.log',
    description:
      '프론트엔드 개발, UI 구현, 제품 개발 과정에서 배운 내용을 기록합니다.',
    path: '/',
    tags: ['Frontend', 'React', 'Next.js', 'UI'],
  }),
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="relative left-1/2 w-[min(1200px,calc(100vw-2rem))] -translate-x-1/2 pt-5 md:pt-6">
      <PostExplorer
        posts={posts}
        emptyTitle="아직 게시글이 없어요"
        emptyMessage="아직 게시된 글이 없습니다."
      />
    </div>
  )
}
