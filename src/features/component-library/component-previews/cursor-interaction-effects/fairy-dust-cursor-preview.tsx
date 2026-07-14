import { FairyDustCursor } from '@/components/fairy-dust-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function FairyDustCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <DesktopOnlyPreview
      slug="fairy-dust-cursor"
      title="Star Particle Cursor"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(231,216,75,0.28),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <FairyDustCursor disabled={mode === 'thumbnail'}>
          <PreviewDemoSurface
            label="cursor effect"
            title="Fairy Dust"
            subtitle="stardust follows your cursor"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(231,216,75,0.28),transparent_55%)]"
          />
        </FairyDustCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
