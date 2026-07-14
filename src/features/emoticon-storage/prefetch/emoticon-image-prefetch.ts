export const PREFETCH_ROW_LOOKAHEAD = 12
export const PREFETCH_ROW_LOOKBEHIND = 6
const PREFETCH_CHUNK_SIZE = 8
export const BACKGROUND_PREFETCH_CHUNK_SIZE = 8

type BrowserIdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout?: number }
    ) => number
    cancelIdleCallback?: (handle: number) => void
    scheduler?: {
      postTask?: (
        callback: () => void,
        options?: {
          priority?: 'user-blocking' | 'user-visible' | 'background'
          signal?: AbortSignal
        }
      ) => Promise<unknown>
    }
  }

const prefetchedEmoticonImages = new Set<string>()
const pendingEmoticonImagePrefetches = new Map<
  string,
  {
    image: HTMLImageElement
    promise: Promise<void>
  }
>()

export function markEmoticonImageSettled(src: string) {
  prefetchedEmoticonImages.add(src)
}

export function hasSettledEmoticonImage(src: string) {
  return prefetchedEmoticonImages.has(src)
}

function prefetchEmoticonImage(src: string) {
  if (
    prefetchedEmoticonImages.has(src) ||
    pendingEmoticonImagePrefetches.has(src)
  ) {
    return
  }

  const image = new window.Image()
  image.decoding = 'async'

  if ('fetchPriority' in image) {
    image.fetchPriority = 'low'
  }

  const loadPromise = new Promise<void>((resolve) => {
    image.onload = () => resolve()
    image.onerror = () => resolve()
  })

  image.src = src

  const decodePromise =
    typeof image.decode === 'function'
      ? image.decode().catch(() => undefined)
      : loadPromise

  const promise = Promise.all([loadPromise, decodePromise])
    .catch(() => undefined)
    .then(() => {
      markEmoticonImageSettled(src)
      pendingEmoticonImagePrefetches.delete(src)
    })

  pendingEmoticonImagePrefetches.set(src, {
    image,
    promise,
  })
}

export function scheduleEmoticonImagePrefetch(srcs: string[]) {
  if (typeof window === 'undefined' || srcs.length === 0) {
    return () => undefined
  }

  const idleWindow = window as BrowserIdleWindow
  const uniqueSrcs = Array.from(new Set(srcs)).filter((src) => {
    return (
      !prefetchedEmoticonImages.has(src) &&
      !pendingEmoticonImagePrefetches.has(src)
    )
  })
  let cursor = 0
  let idleHandle: number | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  let isCancelled = false

  const cancelScheduledRun = () => {
    if (idleHandle !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleHandle)
      idleHandle = null
    }

    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }
  }

  const runChunk = () => {
    idleHandle = null
    timeoutHandle = null

    if (isCancelled) {
      return
    }

    const end = Math.min(cursor + PREFETCH_CHUNK_SIZE, uniqueSrcs.length)

    for (let index = cursor; index < end; index += 1) {
      prefetchEmoticonImage(uniqueSrcs[index])
    }

    cursor = end

    if (cursor < uniqueSrcs.length) {
      scheduleChunk()
    }
  }

  const scheduleChunk = () => {
    if (isCancelled || cursor >= uniqueSrcs.length) {
      return
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(runChunk, { timeout: 700 })
      return
    }

    timeoutHandle = setTimeout(runChunk, 80)
  }

  runChunk()

  return () => {
    isCancelled = true
    cancelScheduledRun()
  }
}

export function scheduleBackgroundEmoticonImageWarmup(srcs: string[]) {
  if (typeof window === 'undefined' || srcs.length === 0) {
    return () => undefined
  }

  const idleWindow = window as BrowserIdleWindow
  const uniqueSrcs = Array.from(new Set(srcs)).filter((src) => {
    return (
      !prefetchedEmoticonImages.has(src) &&
      !pendingEmoticonImagePrefetches.has(src)
    )
  })
  let cursor = 0
  let idleHandle: number | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  let animationFrameHandle: number | null = null
  let taskAbortController: AbortController | null = null
  let isCancelled = false

  const cancelScheduledRun = () => {
    if (idleHandle !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleHandle)
      idleHandle = null
    }

    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }

    if (animationFrameHandle !== null) {
      cancelAnimationFrame(animationFrameHandle)
      animationFrameHandle = null
    }

    taskAbortController?.abort()
    taskAbortController = null
  }

  const scheduleChunk = () => {
    if (isCancelled || cursor >= uniqueSrcs.length) {
      return
    }

    if (idleWindow.scheduler?.postTask) {
      taskAbortController = new AbortController()
      idleWindow.scheduler
        .postTask(runChunk, {
          priority: 'background',
          signal: taskAbortController.signal,
        })
        .catch(() => undefined)
      return
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(runChunk, { timeout: 1200 })
      return
    }

    timeoutHandle = setTimeout(runChunk, 120)
  }

  const runChunk = () => {
    idleHandle = null
    timeoutHandle = null
    taskAbortController = null

    if (isCancelled) {
      return
    }

    const end = Math.min(
      cursor + BACKGROUND_PREFETCH_CHUNK_SIZE,
      uniqueSrcs.length
    )

    for (let index = cursor; index < end; index += 1) {
      prefetchEmoticonImage(uniqueSrcs[index])
    }

    cursor = end

    if (cursor < uniqueSrcs.length) {
      scheduleChunk()
    }
  }

  animationFrameHandle = requestAnimationFrame(() => {
    animationFrameHandle = requestAnimationFrame(scheduleChunk)
  })

  return () => {
    isCancelled = true
    cancelScheduledRun()
  }
}
