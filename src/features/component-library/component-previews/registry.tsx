import type { ReactNode } from 'react'
import type { ComponentPreviewKind } from '../component-data'
import { BackgroundBoxesPreview } from './background-atmosphere/background-boxes-preview'
import { MeteorsPreview } from './background-atmosphere/meteors-preview'
import { ParticlesPreview } from './background-atmosphere/particles-preview'
import { ThreeDImageCarouselPreview } from './content-display/3d-image-carousel-preview'
import { ThreeDMarqueePreview } from './content-display/3d-marquee-preview'
import { CarouselPreview } from './content-display/carousel-preview'
import { FolderPreview } from './content-display/folder-preview'
import { IconCloudPreview } from './content-display/icon-cloud-preview'
import { LensPreview } from './content-display/lens-preview'
import { MarqueePreview } from './content-display/marquee-preview'
import { StackPreview } from './content-display/stack-preview'
import { ElasticSliderPreview } from './controls-inputs/elastic-slider-preview'
import { PhysicsNumberPickerPreview } from './controls-inputs/physics-number-picker-preview'
import { PlaceholdersAndVanishInputPreview } from './controls-inputs/placeholders-and-vanish-input-preview'
import { RippleButtonPreview } from './controls-inputs/ripple-button-preview'
import { ShinyButtonPreview } from './controls-inputs/shiny-button-preview'
import { ToggleThemePreview } from './controls-inputs/toggle-theme-preview'
import { BubbleCursorPreview } from './cursor-interaction-effects/bubble-cursor-preview'
import { CanvasCursorPreview } from './cursor-interaction-effects/canvas-cursor-preview'
import { CharacterCursorPreview } from './cursor-interaction-effects/character-cursor-preview'
import { ClickSparkPreview } from './cursor-interaction-effects/click-spark-preview'
import { ConfettiPreview } from './cursor-interaction-effects/confetti-preview'
import { FairyDustCursorPreview } from './cursor-interaction-effects/fairy-dust-cursor-preview'
import { MagnetPreview } from './cursor-interaction-effects/magnet-preview'
import { MouseCustomCursorPreview } from './cursor-interaction-effects/mouse-custom-cursor-preview'
import { MouseInvertCursorPreview } from './cursor-interaction-effects/mouse-invert-cursor-preview'
import { MouseRippleCursorPreview } from './cursor-interaction-effects/mouse-ripple-cursor-preview'
import { MouseTrailCursorPreview } from './cursor-interaction-effects/mouse-trail-cursor-preview'
import { PointerPreview } from './cursor-interaction-effects/pointer-preview'
import { SparkleCursorPreview } from './cursor-interaction-effects/sparkle-cursor-preview'
import { AnimatedCircularProgressBarPreview } from './data-status/animated-circular-progress-bar-preview'
import { CounterPreview } from './data-status/counter-preview'
import { DataTablePreview } from './data-status/data-table-preview'
import { FileTreePreview } from './data-status/file-tree-preview'
import { NumberTickerPreview } from './data-status/number-ticker-preview'
import { FlowerMenuPreview } from './menus-actions/flower-menu-preview'
import { KeyboardPreview } from './menus-actions/keyboard-preview'
import { PlayfulTodoListPreview } from './menus-actions/playful-todolist-preview'
import { AuroraTextPreview } from './text-effects/aurora-text-preview'
import { CurvedLoopPreview } from './text-effects/curved-loop-preview'
import { DiaTextRevealPreview } from './text-effects/dia-text-reveal-preview'
import { HighlighterPreview } from './text-effects/highlighter-preview'
import { MorphingTextPreview } from './text-effects/morphing-text-preview'
import { TextFlipPreview } from './text-effects/text-flip-preview'
import { TypingAnimationPreview } from './text-effects/typing-animation-preview'
import { VideoTextPreview } from './text-effects/video-text-preview'
import type { PreviewMode } from './types'

type ComponentPreviewRenderer = (mode: PreviewMode) => ReactNode

const componentPreviewRenderers = {
  'background-boxes': () => <BackgroundBoxesPreview />,
  keyboard: () => <KeyboardPreview />,
  'placeholders-and-vanish-input': () => <PlaceholdersAndVanishInputPreview />,
  '3d-marquee': () => <ThreeDMarqueePreview />,
  'playful-todolist': () => <PlayfulTodoListPreview />,
  'flower-menu': () => <FlowerMenuPreview />,
  'text-flip': () => <TextFlipPreview />,
  'toggle-theme': () => <ToggleThemePreview />,
  '3d-image-carousel': () => <ThreeDImageCarouselPreview />,
  'sparkle-cursor': () => <SparkleCursorPreview />,
  'mouse-invert-cursor': (mode) => <MouseInvertCursorPreview mode={mode} />,
  'mouse-trail-cursor': (mode) => <MouseTrailCursorPreview mode={mode} />,
  'mouse-ripple-cursor': (mode) => <MouseRippleCursorPreview mode={mode} />,
  'mouse-custom-cursor': (mode) => <MouseCustomCursorPreview mode={mode} />,
  'fairy-dust-cursor': (mode) => <FairyDustCursorPreview mode={mode} />,
  'bubble-cursor': (mode) => <BubbleCursorPreview mode={mode} />,
  'character-cursor': (mode) => <CharacterCursorPreview mode={mode} />,
  'canvas-cursor': (mode) => <CanvasCursorPreview mode={mode} />,
  'data-table': () => <DataTablePreview />,
  'physics-number-picker': () => <PhysicsNumberPickerPreview />,
  'ripple-button': () => <RippleButtonPreview />,
  'shiny-button': () => <ShinyButtonPreview />,
  marquee: () => <MarqueePreview />,
  'icon-cloud': () => <IconCloudPreview />,
  lens: () => <LensPreview />,
  pointer: () => <PointerPreview />,
  'file-tree': () => <FileTreePreview />,
  'animated-circular-progress-bar': () => (
    <AnimatedCircularProgressBarPreview />
  ),
  'curved-loop': () => <CurvedLoopPreview />,
  'click-spark': () => <ClickSparkPreview />,
  magnet: () => <MagnetPreview />,
  stack: () => <StackPreview />,
  folder: () => <FolderPreview />,
  carousel: () => <CarouselPreview />,
  'elastic-slider': () => <ElasticSliderPreview />,
  counter: () => <CounterPreview />,
  meteors: (mode) => <MeteorsPreview mode={mode} />,
  confetti: () => <ConfettiPreview />,
  particles: (mode) => <ParticlesPreview mode={mode} />,
  'typing-animation': () => <TypingAnimationPreview />,
  'aurora-text': () => <AuroraTextPreview />,
  'video-text': () => <VideoTextPreview />,
  'number-ticker': () => <NumberTickerPreview />,
  'dia-text-reveal': () => <DiaTextRevealPreview />,
  'morphing-text': () => <MorphingTextPreview />,
  highlighter: () => <HighlighterPreview />,
} satisfies Record<ComponentPreviewKind, ComponentPreviewRenderer>

export function renderComponentPreview(
  kind: ComponentPreviewKind,
  mode: PreviewMode
) {
  if (!Object.prototype.hasOwnProperty.call(componentPreviewRenderers, kind)) {
    return undefined
  }

  return componentPreviewRenderers[kind](mode)
}
