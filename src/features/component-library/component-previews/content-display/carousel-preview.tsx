import { Carousel } from '@/components/carousel'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function CarouselPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Card Carousel"
      subtitle="autoplay through cards"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.24),transparent_55%)]"
    >
      <Carousel autoplay loop pauseOnHover variant="dark" />
    </PreviewDemoSurface>
  )
}
