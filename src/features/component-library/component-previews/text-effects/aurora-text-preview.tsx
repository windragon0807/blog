import { AuroraText } from '@/components/aurora-text'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { auroraOriginalColors } from '../shared/preview-tokens'

export function AuroraTextPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <span className="text-center text-5xl font-semibold tracking-normal">
          <AuroraText colors={[...auroraOriginalColors]}>
            Aurora Text
          </AuroraText>
        </span>
      }
      subtitle="gradient color flows through text"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.28),transparent_55%)]"
    />
  )
}
