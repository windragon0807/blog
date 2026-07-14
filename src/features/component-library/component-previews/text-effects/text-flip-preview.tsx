import { TextFlip } from '@/components/text-flip'
import { PreviewDemoSurface } from '../shared/preview-demo-surface'
import { textFlipColors } from '../shared/preview-tokens'

export function TextFlipPreview() {
  return (
    <PreviewDemoSurface
      label="text motion"
      title={
        <TextFlip
          prefix="Coding is"
          words={['fantastic', 'love', 'fire', 'awesome']}
          wordColors={textFlipColors}
          className="mx-auto justify-center text-center [&>span:first-child]:!text-white"
          wordClassName="w-[8.5ch] justify-items-start text-left sm:w-[9ch]"
        />
      }
      subtitle="flip through short words"
      accentClassName="bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.24),transparent_55%)]"
    />
  )
}
