import { BackgroundBoxes } from '@/components/background-boxes'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function BackgroundBoxesPreview() {
  return (
    <DesktopOnlyPreview
      slug="background-boxes"
      title="Hover Grid Background"
      subtitle="desktop hover preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.24),transparent_58%)]"
    >
      <PreviewDemoSurface
        label="ambient background"
        title="Hover Grid Background"
        subtitle="move across the grid"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.24),transparent_58%)]"
        overlay={
          <>
            <BackgroundBoxes />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(10,10,15,0.92)_76%)]" />
          </>
        }
      />
    </DesktopOnlyPreview>
  )
}
