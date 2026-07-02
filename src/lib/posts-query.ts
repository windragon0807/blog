import { queryOptions } from '@tanstack/react-query'
import type { Post } from '@/types/notion'

export const POSTS_QUERY_KEY = ['posts', 'blog'] as const
export const POSTS_STALE_TIME_MS = 60 * 60 * 1000
export const POSTS_GC_TIME_MS = 2 * 60 * 60 * 1000

type FetchPriority = 'high' | 'low' | 'auto'
type PriorityRequestInit = RequestInit & {
  priority?: FetchPriority
}

interface PostsResponse {
  posts: Post[]
}

interface FetchPostsOptions {
  signal?: AbortSignal
  priority?: FetchPriority
}

async function fetchPosts({
  signal,
  priority = 'auto',
}: FetchPostsOptions = {}): Promise<Post[]> {
  const response = await fetch('/api/posts', {
    signal,
    priority,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
  } satisfies PriorityRequestInit)

  if (!response.ok) {
    throw new Error(`게시글 목록을 불러오지 못했습니다. (${response.status})`)
  }

  const payload = (await response.json()) as PostsResponse

  if (!Array.isArray(payload.posts)) {
    throw new Error('게시글 목록 응답 형식이 올바르지 않습니다.')
  }

  return payload.posts
}

export function getPostsQueryOptions(options: FetchPostsOptions = {}) {
  return queryOptions({
    queryKey: POSTS_QUERY_KEY,
    queryFn: ({ signal }) =>
      fetchPosts({
        signal,
        priority: options.priority,
      }),
    staleTime: POSTS_STALE_TIME_MS,
    gcTime: POSTS_GC_TIME_MS,
  })
}
