import { RippleButton } from '@/components/ripple-button'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { glassButtonClassName } from '../shared/preview-tokens'

export function RippleButtonPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Click Ripple Button"
      subtitle="click to send a ripple"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.3),transparent_55%)]"
    >
      <RippleButton
        rippleColor="rgba(56,189,248,0.36)"
        className={`h-11 ${glassButtonClassName}`}
      >
        Click me
      </RippleButton>
    </PreviewDemoSurface>
  )
}
