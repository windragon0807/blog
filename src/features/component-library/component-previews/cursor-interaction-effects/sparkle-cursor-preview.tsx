import { SparkleCursor } from '@/components/sparkle-cursor'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'

export function SparkleCursorPreview() {
  return (
    <DesktopOnlyPreview
      slug="sparkle-cursor"
      title="Sparkle Cursor Trail"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.28),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <SparkleCursor className="block w-full">
          <PreviewDemoSurface
            label="cursor effect"
            title="Sparkle Cursor Trail"
            subtitle="move to scatter sparkles"
            accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.28),transparent_55%)]"
          />
        </SparkleCursor>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
