import { ClickSpark } from '@/components/click-spark'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import { auroraSparkColors } from '../shared/preview-tokens'

export function ClickSparkPreview() {
  return (
    <OuterEffectSurface className="min-h-[30rem] p-0">
      <ClickSpark
        sparkColors={auroraSparkColors}
        sparkRadius={38}
        sparkSize={14}
        sparkCount={10}
        className="min-h-[30rem] w-full [&>canvas]:z-20"
      >
        <PreviewDemoSurface
          label="interaction effect"
          title="Click Spark Burst"
          subtitle="click anywhere in the stage"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.28),transparent_55%)]"
          className="min-h-[30rem] cursor-crosshair"
        />
      </ClickSpark>
    </OuterEffectSurface>
  )
}
