import { Highlighter } from '@/components/highlighter'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function HighlighterPreview() {
  return (
    <PreviewDemoSurface
      label="text emphasis"
      title="Marker Highlight"
      subtitle="underline or mark important words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.24),transparent_55%)]"
    >
      <p className="max-w-full whitespace-nowrap text-center text-lg leading-relaxed text-white md:text-xl">
        The{' '}
        <Highlighter
          action="underline"
          color="#FF9800"
          strokeWidth={2}
          animationDuration={900}
          repeat
          repeatDelay={1400}
        >
          Marker Highlighter
        </Highlighter>{' '}
        makes important{' '}
        <Highlighter
          action="highlight"
          color="#87CEFA"
          strokeWidth={2}
          animationDuration={900}
          repeat
          repeatDelay={1400}
        >
          text stand out
        </Highlighter>
        {' '}effortlessly.
      </p>
    </PreviewDemoSurface>
  )
}
