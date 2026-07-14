import { Magnet } from '@/components/magnet'
import { DesktopOnlyPreview } from '../desktop-only-preview'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'

export function MagnetPreview() {
  return (
    <DesktopOnlyPreview
      slug="magnet"
      title="Magnetic Hover"
      subtitle="desktop pointer preview"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.28),transparent_55%)]"
    >
      <OuterEffectSurface className="p-0">
        <PreviewDemoSurface
          label="interaction effect"
          title="Magnetic Hover"
          subtitle="move near the chip"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.28),transparent_55%)]"
        >
          <Magnet padding={90} magnetStrength={3}>
            <div
              className="rounded-full border border-white/10 bg-white/[0.08] px-7 py-4 text-sm font-semibold text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur transition-colors hover:bg-white/[0.12]"
            >
              Magnet
            </div>
          </Magnet>
        </PreviewDemoSurface>
      </OuterEffectSurface>
    </DesktopOnlyPreview>
  )
}
