import { ToggleTheme } from '@/components/toggle-theme'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

const toggleThemePreviewAnimations = [
  'circle-spread',
  'round-morph',
  'swipe-left',
  'swipe-up',
  'diag-down-right',
  'fade-in-out',
  'shrink-grow',
  'flip-x-in',
  'split-vertical',
  'swipe-right',
  'swipe-down',
  'wave-ripple',
] as const

export function ToggleThemePreview() {
  return (
    <PreviewDemoSurface
      label="theme control"
      title="Theme Toggle"
      subtitle="switch with different transitions"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.22),transparent_55%)]"
      contentClassName="max-w-3xl"
    >
      <div className="flex flex-wrap items-center justify-center gap-3">
        {toggleThemePreviewAnimations.map((animationType) => (
          <ToggleTheme
            key={animationType}
            animationType={animationType}
            duration={360}
            label={animationType}
            variant="glass"
          />
        ))}
      </div>
    </PreviewDemoSurface>
  )
}
