import { ThreeDImageCarousel } from '@/components/3d-image-carousel'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { previewImages } from '../shared/preview-images'

export function ThreeDImageCarouselPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Depth Image Carousel"
      subtitle="rotate through image cards"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.22),transparent_58%)]"
      className="min-h-[32rem]"
      contentClassName="max-w-6xl"
    >
      <div className="w-full max-w-5xl min-w-0 overflow-visible [&_[data-3d-image-carousel]]:!overflow-visible">
        <ThreeDImageCarousel
          items={previewImages}
          itemCount={3}
          className="w-full min-w-0"
        />
      </div>
    </PreviewDemoSurface>
  )
}
