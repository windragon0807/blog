import { MouseCustomCursor } from '@/components/mouse-custom-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function MouseCustomCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="mouse-custom-cursor"
      title="Ring Cursor"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.3),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <MouseCustomCursor
          innerSize={6}
          outerSize={36}
          innerColor="#34d399"
          outerColor="rgba(52,211,153,0.3)"
          smoothness={0.15}
          disabled={mode === 'thumbnail'}
        >
          <PreviewDemoSurface
            label="cursor effect"
            title="Custom Cursor"
            subtitle="dot + ring following your cursor"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.3),transparent_55%)]"
          />
        </MouseCustomCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
