import { ShinyButton } from '@/components/shiny-button'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { glassStaticButtonClassName } from '../shared/preview-tokens'

export function ShinyButtonPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Shine Button"
      subtitle="hover for a soft shine"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.28),transparent_55%)]"
    >
      <ShinyButton
        shineColor="rgba(56,189,248,0.68)"
        className={`h-11 ${glassStaticButtonClassName}`}
      >
        continue
      </ShinyButton>
    </PreviewDemoSurface>
  )
}
