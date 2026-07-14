import { MouseInvertCursor } from '@/components/mouse-invert-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function MouseInvertCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="mouse-invert-cursor"
      title="Invert Cursor"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.34),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <MouseInvertCursor
          size={50}
          smoothness={0.08}
          disabled={mode === 'thumbnail'}
        >
          <PreviewDemoSurface
            label="cursor effect"
            title="Invert"
            subtitle="move to invert the surface"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.34),transparent_55%)]"
          />
        </MouseInvertCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
