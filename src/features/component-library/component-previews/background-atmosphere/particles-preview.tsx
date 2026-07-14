import { Particles } from '@/components/particles'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import { cosmicParticleColors } from '../shared/preview-tokens'
import type { PreviewMode } from '../types'

export function ParticlesPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <PreviewDemoSurface
        label="ambient effect"
        title="Particle Background"
        subtitle="canvas depth and motion"
        accentClassName="bg-[radial-gradient(circle_at_center,rgba(129,140,248,0.3),transparent_55%)]"
        overlay={
          <Particles
            className="absolute inset-0"
            quantity={mode === 'thumbnail' ? 40 : 90}
            colors={cosmicParticleColors}
            ease={80}
          />
        }
      />
    </OuterEffectSurface>
  )
}
