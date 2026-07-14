import { BubbleCursor } from '@/components/bubble-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function BubbleCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="bubble-cursor"
      title="Bubble Cursor Trail"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(58,146,197,0.32),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <BubbleCursor disabled={mode === 'thumbnail'}>
          <PreviewDemoSurface
            label="cursor effect"
            title="Bubbles"
            subtitle="move to float bubbles"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(58,146,197,0.32),transparent_55%)]"
          />
        </BubbleCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
