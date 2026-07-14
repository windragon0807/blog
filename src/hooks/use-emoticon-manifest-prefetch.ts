'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  EMOTICON_MANIFEST_QUERY_KEY,
  prefetchEmoticonManifest,
} from '@/features/emoticon-storage/emoticon-manifest-query'

export function useEmoticonManifestPrefetch() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return useCallback(() => {
    router.prefetch('/emoticons')

    const queryState = queryClient.getQueryState(EMOTICON_MANIFEST_QUERY_KEY)

    if (
      queryState?.data !== undefined ||
      queryState?.status === 'pending' ||
      queryState?.fetchStatus === 'fetching' ||
      queryState?.status === 'error'
    ) {
      return
    }

    void prefetchEmoticonManifest(queryClient).catch(() => undefined)
  }, [queryClient, router])
}
