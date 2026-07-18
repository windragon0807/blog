import { getPostReadingStats } from '@/lib/postContent'

interface Props {
  postId: string
}

export async function PostReadingTime({ postId }: Props) {
  const stats = await getPostReadingStats(postId)

  return (
    <span className="text-sm text-[var(--post-muted)] dark:text-zinc-400">
      읽는 데 약 {stats.minutes}분
    </span>
  )
}
