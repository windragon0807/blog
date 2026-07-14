import { ThreeDMarquee } from '@/components/3d-marquee'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { previewImages } from '../shared/preview-images'

export function ThreeDMarqueePreview() {
  const marqueeImages = Array.from({ length: 8 }, () => previewImages)
    .flat()
    .map((image) => image.src)

  return (
    <PreviewDemoSurface
      label="content motion"
      title="Perspective Image Marquee"
      subtitle="perspective image strips"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22),transparent_58%)]"
      className="min-h-[30rem] sm:min-h-[34rem] md:min-h-[38rem]"
      overlay={
        <>
          <div className="absolute inset-0 opacity-55">
            <ThreeDMarquee
              images={marqueeImages}
              className="h-full max-sm:h-full rounded-[inherit]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(10,10,15,0.34),rgba(10,10,15,0.92)_78%)]" />
        </>
      }
    />
  )
}
