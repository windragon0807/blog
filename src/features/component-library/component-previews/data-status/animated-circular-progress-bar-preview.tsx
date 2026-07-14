import { useState } from 'react'
import { AnimatedCircularProgressBar } from '@/components/animated-circular-progress-bar'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function AnimatedCircularProgressBarPreview() {
  const [value, setValue] = useState(68)

  return (
    <PreviewDemoSurface
      label="data structure"
      title="Circular Progress"
      subtitle="adjust progress manually"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.24),transparent_55%)]"
    >
      <div className="flex flex-col items-center gap-6">
        <AnimatedCircularProgressBar
          value={value}
          gaugePrimaryColor="#34d399"
          gaugeSecondaryColor="rgba(255,255,255,0.18)"
          className="text-emerald-300"
        />
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-1">
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-lg font-medium text-white/75 transition-colors hover:bg-white/10"
            aria-label="Decrease progress value"
            onClick={() => setValue((current) => Math.max(0, current - 5))}
          >
            -
          </button>
          <button
            type="button"
            className="flex size-9 items-center justify-center rounded-full text-lg font-medium text-white/75 transition-colors hover:bg-white/10"
            aria-label="Increase progress value"
            onClick={() => setValue((current) => Math.min(100, current + 5))}
          >
            +
          </button>
        </div>
      </div>
    </PreviewDemoSurface>
  )
}
