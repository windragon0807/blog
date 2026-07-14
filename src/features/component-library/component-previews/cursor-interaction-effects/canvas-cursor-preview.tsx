import { CanvasCursor } from '@/components/canvas-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function CanvasCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="canvas-cursor"
      title="Spring Line Cursor"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <CanvasCursor disabled={mode === 'thumbnail'}>
          <PreviewDemoSurface
            label="cursor effect"
            title="Spring Line Cursor"
            subtitle="spring lines follow your cursor"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
          />
        </CanvasCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
