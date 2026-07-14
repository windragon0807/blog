import { MouseRippleCursor } from '@/components/mouse-ripple-cursor'
import { OuterEffectSurface, PreviewDemoSurface } from '../shared/preview-demo-surface'
import type { PreviewMode } from '../types'

export function MouseRippleCursorPreview({ mode }: { mode: PreviewMode }) {
  return (
    <OuterEffectSurface className="p-0">
      <MouseRippleCursor
        color="rgba(96,165,250,0.60)"
        duration={600}
        maxSize={150}
        disabled={mode === 'thumbnail'}
      >
        <PreviewDemoSurface
          label="cursor effect"
          title="Ripple"
          subtitle="click to expand"
          accentClassName="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.34),transparent_55%)]"
        />
      </MouseRippleCursor>
    </OuterEffectSurface>
  )
}
