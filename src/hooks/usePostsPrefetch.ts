'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { getPostsQueryOptions, POSTS_QUERY_KEY } from '@/lib/posts-query';

export function usePostsPrefetch() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useCallback(() => {
    router.prefetch('/');

    if (queryClient.getQueryData(POSTS_QUERY_KEY)) return;

    void queryClient
      .prefetchQuery(getPostsQueryOptions({ priority: 'low' }))
      .catch(() => undefined);
  }, [queryClient, router]);
}
