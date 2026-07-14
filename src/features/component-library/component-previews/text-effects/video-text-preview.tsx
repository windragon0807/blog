import { useEffect, useState } from 'react'
import { VideoText } from '@/components/video-text'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

function getUserFontFamily() {
  const rootStyles = window.getComputedStyle(document.documentElement)
  const userFont = rootStyles.getPropertyValue('--font-user').trim()

  return userFont || window.getComputedStyle(document.body).fontFamily || 'sans-serif'
}

function useUserFontFamily() {
  const [userFontFamily, setUserFontFamily] = useState('var(--font-user)')

  useEffect(() => {
    const syncFontFamily = () => {
      const nextFontFamily = getUserFontFamily()
      setUserFontFamily((currentFontFamily) =>
        currentFontFamily === nextFontFamily ? currentFontFamily : nextFontFamily
      )
    }
    const root = document.documentElement
    const observer = new MutationObserver(syncFontFamily)

    syncFontFamily()
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style', 'data-font-theme'],
    })
    window.addEventListener('storage', syncFontFamily)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', syncFontFamily)
    }
  }, [])

  return userFontFamily
}

export function VideoTextPreview() {
  const userFontFamily = useUserFontFamily()

  return (
    <PreviewDemoSurface
      label="text media"
      title="Video Mask Text"
      subtitle="video fills the letter mask"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.24),transparent_55%)]"
      contentClassName="w-full max-w-4xl"
    >
      <VideoText
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        fontSize={17}
        fontFamily={userFontFamily}
        className="h-72 w-full max-w-4xl"
      >
        VIDEO
      </VideoText>
    </PreviewDemoSurface>
  )
}
