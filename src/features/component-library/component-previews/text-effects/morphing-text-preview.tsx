import { MorphingText } from '@/components/morphing-text'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'

export function MorphingTextPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <div className="flex w-[min(42rem,82vw)] max-w-full justify-center">
          <MorphingText
            texts={['Design', 'Build', 'Ship']}
            className="mx-auto h-20 w-full text-center text-[42px] text-white md:h-24"
          />
        </div>
      }
      subtitle="morph between words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.26),transparent_55%)]"
      contentClassName="w-full max-w-4xl"
    />
  )
}
