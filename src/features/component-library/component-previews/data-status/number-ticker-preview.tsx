import { NumberTicker } from '@/components/number-ticker'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function NumberTickerPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <span className="text-6xl font-semibold tabular-nums text-white">
          <NumberTicker value={12840} />
        </span>
      }
      subtitle="count up to the latest value"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.26),transparent_55%)]"
    />
  )
}
