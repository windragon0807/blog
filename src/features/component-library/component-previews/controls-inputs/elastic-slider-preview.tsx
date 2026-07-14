import { ElasticSlider } from '@/components/elastic-slider'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function ElasticSliderPreview() {
  return (
    <PreviewDemoSurface
      label="action control"
      title="Spring Slider"
      subtitle="drag the stepped handle"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.24),transparent_55%)]"
    >
      <ElasticSlider defaultValue={62} isStepped stepSize={4} />
    </PreviewDemoSurface>
  )
}
