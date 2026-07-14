import 'client-only'

import {
  QueryObserver,
  queryOptions,
  type QueryClient,
} from '@tanstack/react-query'
import type { EmoticonManifest } from './types'

export const EMOTICON_MANIFEST_QUERY_KEY = ['emoticons', 'manifest'] as const

const EMOTICON_MANIFEST_GC_TIME_MS = 2 * 60 * 60 * 1000

type FetchPriority = 'high' | 'low' | 'auto'
type PriorityRequestInit = RequestInit & {
  priority?: FetchPriority
}

interface FetchEmoticonManifestOptions {
  signal?: AbortSignal
  priority?: FetchPriority
}

async function fetchEmoticonManifest({
  signal,
  priority = 'auto',
}: FetchEmoticonManifestOptions = {}): Promise<EmoticonManifest> {
  await Promise.resolve()
  signal?.throwIfAborted()

  const response = await fetch('/emoticons/manifest.json', {
    signal,
    priority,
    credentials: 'same-origin',
    headers: {
      Accept: 'application/json',
    },
  } satisfies PriorityRequestInit)

  if (!response.ok) {
    throw new Error('manifest를 불러오지 못했습니다.')
  }

  return (await response.json()) as EmoticonManifest
}

export function getEmoticonManifestQueryOptions(
  options: FetchEmoticonManifestOptions = {}
) {
  return queryOptions({
    queryKey: EMOTICON_MANIFEST_QUERY_KEY,
    queryFn: ({ signal }) =>
      fetchEmoticonManifest({
        signal,
        priority: options.priority,
      }),
    staleTime: Infinity,
    gcTime: EMOTICON_MANIFEST_GC_TIME_MS,
    retry: false,
    retryOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: (query) => query.state.status === 'error',
  })
}

export function prefetchEmoticonManifest(queryClient: QueryClient) {
  const options = getEmoticonManifestQueryOptions({ priority: 'low' })
  const prefetchPromise = queryClient.prefetchQuery(options)
  const observer = new QueryObserver(queryClient, options)
  const unsubscribe = observer.subscribe(() => undefined)

  return prefetchPromise.finally(unsubscribe)
}
