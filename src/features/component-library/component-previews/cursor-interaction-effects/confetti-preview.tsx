import { ConfettiButton } from '@/components/confetti'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import { glassButtonClassName } from '../shared/preview-tokens'

export function ConfettiPreview() {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="interaction effect"
        title="Confetti Button"
        subtitle="press to celebrate"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.28),transparent_55%)]"
      >
        <ConfettiButton
          type="button"
          className={`relative h-11 ${glassButtonClassName}`}
        >
          Celebrate
        </ConfettiButton>
      </PreviewDemoSurface>
    </OuterEffectSurface>
  )
}
