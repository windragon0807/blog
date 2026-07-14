import { MouseTrailCursor } from '@/components/mouse-trail-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function MouseTrailCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="mouse-trail-cursor"
      title="Dot Cursor Trail"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.32),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <MouseTrailCursor
          color="#c084fc"
          size={5}
          length={20}
          decay={0.05}
          blur={0}
          disabled={mode === 'thumbnail'}
        >
          <PreviewDemoSurface
            label="cursor effect"
            title="Trail"
            subtitle="fading dots follow your cursor"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(192,132,252,0.32),transparent_55%)]"
          />
        </MouseTrailCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
