import { TypingAnimation } from '@/components/typing-animation'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function TypingAnimationPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <TypingAnimation
          words={['Typing Animation', 'Typed Motion', 'Text Loop']}
          loop
          className="text-5xl font-semibold text-white"
        />
      }
      subtitle="loop through short phrases"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.28),transparent_55%)]"
    />
  )
}
