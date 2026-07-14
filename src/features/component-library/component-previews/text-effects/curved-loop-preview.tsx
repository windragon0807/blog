import { CurvedLoop } from '@/components/curved-loop'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { auroraSparkColors } from '../shared/preview-tokens'

export function CurvedLoopPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title="Curved Text Marquee"
      subtitle="curved marquee text"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,113,133,0.24),transparent_55%)]"
      contentClassName="w-full max-w-none"
    >
      <div className="-mx-8 h-52 w-[calc(100%+4rem)] overflow-visible">
        <CurvedLoop
          marqueeText="React Bits ✦ Curved Loop ✦ "
          speed={2.5}
          curveAmount={150}
          colors={auroraSparkColors}
          className="text-[76px] font-semibold tracking-normal [text-shadow:0_18px_60px_rgba(255,255,255,0.22)]"
        />
      </div>
    </PreviewDemoSurface>
  )
}
