import { Keyboard } from '@/components/keyboard'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function KeyboardPreview() {
  return (
    <DesktopOnlyPreview
      slug="keyboard"
      title="Interactive Keyboard"
      subtitle="desktop keyboard preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_55%)]"
    >
      <PreviewDemoSurface
        label="action control"
        title="Interactive Keyboard"
        subtitle="press keys or click keycaps"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_55%)]"
        className="min-h-[44rem]"
        headingClassName="-translate-y-10 md:-translate-y-12"
        contentGapClassName="mt-3"
        contentClassName="max-w-5xl"
      >
        <Keyboard showPreview className="scale-[1.35] md:scale-[1.55]" />
      </PreviewDemoSurface>
    </DesktopOnlyPreview>
  )
}
