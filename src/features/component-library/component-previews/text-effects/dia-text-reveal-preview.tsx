import { DiaTextReveal } from '@/components/dia-text-reveal'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { originalGradientColors } from '../shared/preview-tokens'

export function DiaTextRevealPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <DiaTextReveal
          text={['Dia Text Reveal', 'Color Sweep', 'Gradient Text']}
          repeat
          colors={[...originalGradientColors]}
          textColor="#ffffff"
          finalTextColor="#ffffff"
          className="text-center text-4xl font-semibold text-white"
        />
      }
      subtitle="reveal letters with a color trail"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_55%)]"
    />
  )
}
