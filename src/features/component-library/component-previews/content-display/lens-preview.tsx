import { Lens } from '@/components/lens'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function LensPreview() {
  return (
    <PreviewDemoSurface
      label="content media"
      title="Magnifier Lens"
      subtitle="hover to inspect the image"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(251,146,60,0.22),transparent_55%)]"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] text-left text-white shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur-md">
        <div className="p-4">
          <Lens zoomFactor={2} lensSize={150} isStatic={false}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1736606355698-5efdb410fe93?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="image placeholder"
              width={500}
              height={500}
              className="aspect-square w-full rounded-xl border border-white/10 object-cover"
            />
          </Lens>
        </div>
        <div className="space-y-1 px-4 pb-4">
          <h3 className="text-xl font-semibold text-white">
            Your next camp
          </h3>
          <p className="text-sm leading-6 text-white/58">
            See our latest and best camp destinations across the globe.
          </p>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}
