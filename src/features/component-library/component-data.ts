export type ComponentCategoryId =
  | 'controls-inputs'
  | 'menus-actions'
  | 'content-display'
  | 'data-status'
  | 'text-effects'
  | 'background-atmosphere'
  | 'cursor-interaction-effects'

export type ComponentPreviewKind =
  | 'ripple-button'
  | 'shiny-button'
  | 'marquee'
  | 'icon-cloud'
  | 'lens'
  | 'pointer'
  | 'file-tree'
  | 'animated-circular-progress-bar'
  | 'curved-loop'
  | 'click-spark'
  | 'magnet'
  | 'stack'
  | 'folder'
  | 'carousel'
  | 'elastic-slider'
  | 'counter'
  | 'meteors'
  | 'confetti'
  | 'particles'
  | 'typing-animation'
  | 'aurora-text'
  | 'video-text'
  | 'number-ticker'
  | 'dia-text-reveal'
  | 'morphing-text'
  | 'highlighter'
  | 'background-boxes'
  | 'keyboard'
  | 'placeholders-and-vanish-input'
  | '3d-marquee'
  | 'avatar-group'
  | 'playful-todolist'
  | 'flower-menu'
  | 'text-flip'
  | 'toggle-theme'
  | '3d-image-carousel'
  | 'sparkle-cursor'
  | 'mouse-invert-cursor'
  | 'mouse-trail-cursor'
  | 'mouse-ripple-cursor'
  | 'mouse-custom-cursor'
  | 'fairy-dust-cursor'
  | 'bubble-cursor'
  | 'character-cursor'
  | 'canvas-cursor'
  | 'data-table'

export interface ComponentCategory {
  id: ComponentCategoryId
  name: string
  description: string
}

export interface ComponentProp {
  name: string
  type: string
  defaultValue: string
  description: string
}

export interface ComponentRegistry {
  name: string
  url: string
  dependencies: readonly string[]
}

export interface ComponentReference {
  label: string
  url: string
}

export interface ComponentSample {
  slug: ComponentPreviewKind
  categoryId: ComponentCategoryId
  title: string
  description: string
  status: 'Draft' | 'Ready'
  installCommand: string
  filePath: string
  preview: {
    kind: ComponentPreviewKind
    label: string
  }
  registry?: ComponentRegistry
  reference: ComponentReference
  code: string
  usage: string
  props: readonly ComponentProp[]
}

interface ComponentSampleInput {
  slug: ComponentPreviewKind
  categoryId: ComponentCategoryId
  title: string
  description: string
  dependencies?: readonly string[]
  reference?: ComponentReference
  usage: string
  props: readonly ComponentProp[]
}

const prop = (
  name: string,
  type: string,
  defaultValue: string,
  description: string
): ComponentProp => ({ name, type, defaultValue, description })

const classNameProp = prop(
  'className',
  'string',
  '-',
  'Additional classes merged onto the component.'
)

const childrenProp = prop(
  'children',
  'React.ReactNode',
  '-',
  'Content rendered inside the component.'
)

const reactBitsReferencePaths: Partial<Record<ComponentPreviewKind, string>> = {
  'curved-loop': '/text-animations/curved-loop',
  'click-spark': '/animations/click-spark',
  magnet: '/animations/magnet',
  stack: '/components/stack',
  folder: '/components/folder',
  carousel: '/components/carousel',
  'elastic-slider': '/components/elastic-slider',
  counter: '/components/counter?value=17.8',
}

const mouseAnimationsReference = {
  label: 'mouse-animations playground',
  url: 'https://tgomilar.github.io/mouse-animations/',
} satisfies ComponentReference

const cursorEffectsReference = {
  label: 'cursor-effects demo',
  url: 'https://tholman.com/cursor-effects/',
} satisfies ComponentReference

const cursifyCanvasReference = {
  label: 'Cursify Canvas Cursor',
  url: 'https://cursify.ui-layouts.com/components/canvas-cursor',
} satisfies ComponentReference

function reactBitsReference(slug: ComponentPreviewKind, title: string) {
  const path = reactBitsReferencePaths[slug]

  if (!path) {
    return undefined
  }

  return {
    label: `ReactBits ${title}`,
    url: `https://reactbits.dev${path}`,
  } satisfies ComponentReference
}

function createSample({
  slug,
  categoryId,
  title,
  description,
  dependencies = [],
  reference,
  usage,
  props,
}: ComponentSampleInput): ComponentSample {
  return {
    slug,
    categoryId,
    title,
    description,
    status: 'Ready',
    installCommand: `pnpm dlx shadcn@latest add https://ryong.dev/r/${slug}.json`,
    filePath: `components/${slug}.tsx`,
    preview: {
      kind: slug,
      label: title,
    },
    registry: {
      name: slug,
      url: `/r/${slug}.json`,
      dependencies,
    },
    reference: reference ?? reactBitsReference(slug, title) ?? {
      label: `Reference ${title}`,
      url: `https://magicui.design/docs/components/${slug}`,
    },
    code: usage,
    usage,
    props,
  }
}

export const componentCategories: readonly ComponentCategory[] = [
  {
    id: 'controls-inputs',
    name: 'Controls & Inputs',
    description: '버튼, 입력, 슬라이더, 토글처럼 사용자가 값을 바꾸는 컨트롤입니다.',
  },
  {
    id: 'menus-actions',
    name: 'Menus & Actions',
    description: '메뉴, 키보드, 투두처럼 액션 선택이나 조작 흐름을 보여주는 컴포넌트입니다.',
  },
  {
    id: 'content-display',
    name: 'Content Display',
    description: '캐러셀, 마키, 아바타, 이미지, 카드처럼 콘텐츠를 보여주는 패턴입니다.',
  },
  {
    id: 'data-status',
    name: 'Data & Status',
    description: '테이블, 트리, 진행률, 카운터처럼 구조화된 정보와 상태를 보여주는 컴포넌트입니다.',
  },
  {
    id: 'text-effects',
    name: 'Text Effects',
    description: '타이핑, 플립, 모핑, 하이라이트처럼 텍스트 자체를 강조하는 효과입니다.',
  },
  {
    id: 'background-atmosphere',
    name: 'Background & Atmosphere',
    description: '섹션 배경과 화면 분위기를 만드는 배경형 효과입니다.',
  },
  {
    id: 'cursor-interaction-effects',
    name: 'Cursor & Interaction Effects',
    description: '마우스 움직임, 클릭, 호버에 반응하는 인터랙션 효과입니다.',
  },
]

export const componentSamples: readonly ComponentSample[] = [
  createSample({
    slug: 'background-boxes',
    categoryId: 'background-atmosphere',
    title: 'Hover Grid Background',
    description: '히어로 영역이나 기능 섹션에 쓰기 좋은, 호버에 반응하는 격자 배경입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Background Boxes',
      url: 'https://ui.aceternity.com/components/background-boxes',
    },
    usage: `import { BackgroundBoxes } from "@/components/background-boxes"

export default function Example() {
  return (
    <div className="relative h-96 overflow-hidden bg-slate-900">
      <BackgroundBoxes />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(15,23,42,0.96)_78%)]" />
    </div>
  )
}`,
    props: [
      classNameProp,
      prop('rows', 'number', '150', 'Number of grid rows.'),
      prop('columns', 'number', '100', 'Number of grid columns.'),
      prop('colors', 'string[]', 'built-in palette', 'Hover color palette.'),
      prop('boxClassName', 'string', '-', 'Classes applied to each box.'),
    ],
  }),
  createSample({
    slug: 'keyboard',
    categoryId: 'menus-actions',
    title: 'Interactive Keyboard',
    description: '클릭과 실제 키 입력 상태를 함께 보여주는 맥 스타일 키보드입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Keyboard',
      url: 'https://ui.aceternity.com/components/keyboard',
    },
    usage: `import { Keyboard } from "@/components/keyboard"

export default function Example() {
  return <Keyboard showPreview />
}`,
    props: [
      classNameProp,
      prop('showPreview', 'boolean', 'false', 'Whether to show the last pressed key above the keyboard.'),
      prop('enableSound', 'boolean', 'false', 'Reserved hook for adding key sounds without bundling audio assets.'),
      prop('keys', 'string[]', '-', 'Optional shortcut mode for compact key combinations.'),
      prop('keyClassName', 'string', '-', 'Classes applied to shortcut keys.'),
    ],
  }),
  createSample({
    slug: 'placeholders-and-vanish-input',
    categoryId: 'controls-inputs',
    title: 'Rotating Search Input',
    description: '플레이스홀더가 순환되고 제출 시 텍스트가 사라지는 검색 입력입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity Placeholders And Vanish Input',
      url: 'https://ui.aceternity.com/components/placeholders-and-vanish-input',
    },
    usage: `import { PlaceholdersAndVanishInput } from "@/components/placeholders-and-vanish-input"

export default function Example() {
  return <PlaceholdersAndVanishInput placeholders={["Search docs", "Ask AI"]} />
}`,
    props: [
      classNameProp,
      prop('placeholders', 'string[]', '-', 'Placeholder values to rotate.'),
      prop('variant', '"light" | "glass"', '"light"', 'Visual surface style.'),
      prop('onSubmit', '(value: string) => void', '-', 'Submit handler.'),
    ],
  }),
  createSample({
    slug: '3d-marquee',
    categoryId: 'content-display',
    title: 'Perspective Image Marquee',
    description: '이미지나 카드 스트립을 원근감 있는 흐름으로 보여주는 3D 마키입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Aceternity 3D Marquee',
      url: 'https://ui.aceternity.com/components/3d-marquee',
    },
    usage: `import { ThreeDMarquee } from "@/components/3d-marquee"

export default function Example() {
  return <ThreeDMarquee images={images} />
}`,
    props: [
      classNameProp,
      prop('images', 'string[]', '-', 'Images rendered in the 3D grid.'),
      prop('items', 'React.ReactNode[]', '-', 'Legacy custom item fallback.'),
    ],
  }),
  createSample({
    slug: 'avatar-group',
    categoryId: 'content-display',
    title: 'Hover Avatar Group',
    description: '겹쳐진 아바타가 호버 시 떠오르고 안내 말풍선을 보여주는 아바타 그룹입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Animate UI Avatar Group',
      url: 'https://animate-ui.com/docs/components/animate/avatar-group',
    },
    usage: `import { AvatarGroup } from "@/components/avatar-group"

export default function Example() {
  return <AvatarGroup items={users} />
}`,
    props: [
      classNameProp,
      prop('items', 'AvatarGroupItem[]', '-', 'Avatar data.'),
      prop('max', 'number', '6', 'Maximum visible avatars.'),
      prop('invertOverlap', 'boolean', 'true', 'Whether the earlier avatars should visually sit above later avatars.'),
      prop('translate', 'string | number', '"-30%"', 'Hover translation applied to the active avatar.'),
      prop('transition', 'Transition', 'spring 300/17', 'Avatar hover transition.'),
      prop('tooltipTransition', 'Transition', 'spring 300/35', 'Tooltip enter and exit transition.'),
    ],
  }),

  createSample({
    slug: 'playful-todolist',
    categoryId: 'menus-actions',
    title: 'Animated Task List',
    description: '체크 동작에 짧은 애니메이션을 더한 작은 투두 리스트입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Animate UI Playful TodoList',
      url: 'https://animate-ui.com/docs/components/community/playful-todolist',
    },
    usage: `import { PlayfulTodoList } from "@/components/playful-todolist"

export default function Example() {
  return <PlayfulTodoList />
}`,
    props: [
      classNameProp,
      prop('items', 'TodoItem[]', 'built-in list', 'Todo labels and initial checked states.'),
    ],
  }),
  createSample({
    slug: 'flower-menu',
    categoryId: 'menus-actions',
    title: 'Radial Action Menu',
    description: '중앙 버튼을 기준으로 액션이 꽃처럼 펼쳐지는 플로팅 메뉴입니다.',
    dependencies: [],
    reference: {
      label: 'Animata Flower Menu',
      url: 'https://animata.design/docs/fabs/flower-menu',
    },
    usage: `import { FlowerMenu } from "@/components/flower-menu"

export default function Example() {
  return <FlowerMenu items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'FlowerMenuItem[]', '-', 'Menu actions.'),
      prop('variant', '"default" | "glass"', '"default"', 'Visual surface style.'),
    ],
  }),

  createSample({
    slug: 'text-flip',
    categoryId: 'text-effects',
    title: 'Rotating Word Flip',
    description: '짧은 단어가 차례로 뒤집히며 교체되는 텍스트 애니메이션입니다.',
    dependencies: ['motion'],
    reference: {
      label: 'Animata Text Flip',
      url: 'https://animata.design/docs/text/text-flip',
    },
    usage: `import { TextFlip } from "@/components/text-flip"

export default function Example() {
  return <TextFlip prefix="Coding is" words={["fantastic", "love", "fire"]} />
}`,
    props: [
      classNameProp,
      prop('prefix', 'string', '"Coding is"', 'Stable text rendered before the animated word.'),
      prop('words', 'string[]', '-', 'Words to rotate.'),
      prop('interval', 'number', '2600', 'Flip interval in milliseconds.'),
    ],
  }),
  createSample({
    slug: 'toggle-theme',
    categoryId: 'controls-inputs',
    title: 'Theme Toggle',
    description: '라이트/다크 테마를 전환하는 간결한 스위치형 토글입니다.',
    dependencies: ['lucide-react', 'next-themes'],
    reference: {
      label: 'Lightswind Toggle Theme',
      url: 'https://lightswind.com/components/toggle-theme',
    },
    usage: `import { ToggleTheme } from "@/components/toggle-theme"

export default function Example() {
  return <ToggleTheme />
}`,
    props: [
      classNameProp,
      prop('duration', 'number', '400', 'View Transition animation duration in milliseconds.'),
      prop('animationType', '"none" | "circle-spread" | "round-morph" | "swipe-left" | "swipe-up" | "diag-down-right" | "fade-in-out" | "shrink-grow" | "flip-x-in" | "split-vertical" | "swipe-right" | "swipe-down" | "wave-ripple"', '"circle-spread"', 'Lightswind View Transition animation style.'),
      prop('variant', '"default" | "glass"', '"default"', 'Visual surface style.'),
      prop('defaultChecked', 'boolean', 'false', 'Initial checked state.'),
      prop('onChange', '(checked: boolean) => void', '-', 'Change handler.'),
    ],
  }),
  createSample({
    slug: '3d-image-carousel',
    categoryId: 'content-display',
    title: 'Depth Image Carousel',
    description: '이미지 카드를 원근감 있게 회전시키는 3D 캐러셀입니다.',
    dependencies: ['lucide-react'],
    reference: {
      label: 'Lightswind 3D Image Carousel',
      url: 'https://lightswind.com/components/3d-image-carousel',
    },
    usage: `import { ThreeDImageCarousel } from "@/components/3d-image-carousel"

export default function Example() {
  return <ThreeDImageCarousel items={items} />
}`,
    props: [
      classNameProp,
      prop('items', 'ThreeDImageCarouselItem[]', '-', 'Images to show.'),
      prop('slides', 'ThreeDImageCarouselItem[]', '-', 'Alias for images to show.'),
      prop('itemCount', '3 | 5', '5', 'Number of visible cascade positions.'),
      prop('interval', 'number', '-', 'Auto-rotation interval alias in milliseconds.'),
      prop('delay', 'number', '3', 'Auto-rotation delay in seconds, matching the source component API.'),
      prop('autoplay', 'boolean', 'false', 'Whether to rotate automatically.'),
      prop('pauseOnHover', 'boolean', 'true', 'Whether autoplay pauses while hovering.'),
    ],
  }),
  createSample({
    slug: 'sparkle-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Sparkle Cursor Trail',
    description: '지정된 영역 안에서 커서 움직임에 따라 반짝임을 뿌리는 효과입니다.',
    dependencies: ['gsap'],
    reference: {
      label: 'Lightswind Sparkle Cursor',
      url: 'https://lightswind.com/components/sparkle-cursor',
    },
    usage: `import { SparkleCursor } from "@/components/sparkle-cursor"

export default function Example() {
  return <SparkleCursor>Move here</SparkleCursor>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('color', 'string', '"var(--theme-accent-current)"', 'Sparkle color.'),
      prop('fullScreen', 'boolean', 'false', 'Whether the canvas covers the viewport.'),
    ],
  }),
  createSample({
    slug: 'mouse-invert-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Invert Cursor',
    description: '영역 안에서 배경을 반전시키는 혼합 모드 커서 효과입니다.',
    reference: mouseAnimationsReference,
    usage: `import { MouseInvertCursor } from "@/components/mouse-invert-cursor"

export default function Example() {
  return (
    <MouseInvertCursor size={50} smoothness={0.08}>
      <div className="min-h-64">Move inside</div>
    </MouseInvertCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('size', 'number', '50', 'Invert cursor diameter in pixels.'),
      prop('color', 'string', '"#ffffff"', 'Blend color used by the cursor circle.'),
      prop('smoothness', 'number', '0.08', 'Lerp factor copied from the playground default.'),
      prop('hideDefault', 'boolean', 'true', 'Whether to hide the native cursor inside the component.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'mouse-trail-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Dot Cursor Trail',
    description: '영역 안에서 커서 뒤를 작은 점들이 따라오는 캔버스 트레일 효과입니다.',
    reference: mouseAnimationsReference,
    usage: `import { MouseTrailCursor } from "@/components/mouse-trail-cursor"

export default function Example() {
  return (
    <MouseTrailCursor color="#c084fc" size={5} length={20} decay={0.05}>
      <div className="min-h-64">Move inside</div>
    </MouseTrailCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('color', 'string', '"#c084fc"', 'Trail dot color from the playground default.'),
      prop('size', 'number', '5', 'Maximum dot radius in pixels.'),
      prop('length', 'number', '20', 'Maximum number of trail points to keep.'),
      prop('decay', 'number', '0.05', 'Alpha decay per frame.'),
      prop('blur', 'number', '0', 'Canvas blur filter in pixels.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'mouse-ripple-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Click Ripple Cursor',
    description: '클릭한 지점에서 원형 리플이 퍼지는 커서 인터랙션입니다.',
    reference: mouseAnimationsReference,
    usage: `import { MouseRippleCursor } from "@/components/mouse-ripple-cursor"

export default function Example() {
  return (
    <MouseRippleCursor color="rgba(96,165,250,0.60)" maxSize={150}>
      <button>Click inside</button>
    </MouseRippleCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('color', 'string', '"rgba(96,165,250,0.60)"', 'Ripple fill color from the playground default.'),
      prop('duration', 'number', '600', 'Ripple animation duration in ms.'),
      prop('maxSize', 'number', '150', 'Maximum ripple diameter in pixels.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'mouse-custom-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Ring Cursor',
    description: '작은 점과 늦게 따라오는 링으로 커서를 대체하는 영역형 효과입니다.',
    reference: mouseAnimationsReference,
    usage: `import { MouseCustomCursor } from "@/components/mouse-custom-cursor"

export default function Example() {
  return (
    <MouseCustomCursor innerColor="#34d399" outerColor="rgba(52,211,153,0.3)">
      <div className="min-h-64">Move inside</div>
    </MouseCustomCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('innerSize', 'number', '6', 'Inner dot size in pixels.'),
      prop('outerSize', 'number', '36', 'Outer ring size in pixels.'),
      prop('innerColor', 'string', '"#34d399"', 'Inner dot color from the playground default.'),
      prop('outerColor', 'string', '"rgba(52,211,153,0.3)"', 'Outer ring color from the playground default.'),
      prop('smoothness', 'number', '0.15', 'Ring lerp factor copied from the playground default.'),
      prop('hideDefault', 'boolean', 'true', 'Whether to hide the native cursor inside the component.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'fairy-dust-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Star Particle Cursor',
    description: '커서 이동을 따라 작은 별가루가 흩어지는 영역형 파티클 효과입니다.',
    reference: cursorEffectsReference,
    usage: `import { FairyDustCursor } from "@/components/fairy-dust-cursor"

export default function Example() {
  return (
    <FairyDustCursor>
      <div className="min-h-64">Move inside</div>
    </FairyDustCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('colors', 'string[]', '["#D61C59", "#E7D84B", "#1B8798"]', 'Particle colors from the cursor-effects default.'),
      prop('fairySymbol', 'string', '"*"', 'Character rendered as each dust particle.'),
      prop('maxParticles', 'number', '160', 'Particle cap used to prevent runaway canvas work.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'bubble-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Bubble Cursor Trail',
    description: '커서 움직임을 따라 거품 파티클이 떠오르는 영역형 효과입니다.',
    reference: cursorEffectsReference,
    usage: `import { BubbleCursor } from "@/components/bubble-cursor"

export default function Example() {
  return (
    <BubbleCursor fillColor="#e6f1f7" strokeColor="#3a92c5">
      <div className="min-h-64">Move inside</div>
    </BubbleCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('fillColor', 'string', '"#e6f1f7"', 'Bubble fill color from the cursor-effects default.'),
      prop('strokeColor', 'string', '"#3a92c5"', 'Bubble stroke color from the cursor-effects default.'),
      prop('maxParticles', 'number', '180', 'Particle cap used to prevent runaway canvas work.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'character-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Character Particle Cursor',
    description: '커서 주변에 문자 파티클이 생성되는 영역형 효과입니다.',
    reference: cursorEffectsReference,
    usage: `import { CharacterCursor } from "@/components/character-cursor"

export default function Example() {
  return (
    <CharacterCursor characters={["h", "e", "l", "l", "o"]}>
      <div className="min-h-64">Move inside</div>
    </CharacterCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('characters', 'string[]', '["h", "e", "l", "l", "o"]', 'Characters rendered as particles.'),
      prop('colors', 'string[]', 'cursor-effects palette', 'Particle colors from the cursor-effects default.'),
      prop('font', 'string', '"15px serif"', 'Canvas font used for particle glyphs.'),
      prop('cursorOffset', '{ x: number; y: number }', '{ x: 0, y: 0 }', 'Offset applied to each spawned character.'),
      prop('maxParticles', 'number', '170', 'Particle cap used to prevent runaway canvas work.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'canvas-cursor',
    categoryId: 'cursor-interaction-effects',
    title: 'Spring Line Cursor',
    description: '스프링처럼 이어진 선이 커서를 따라오는 캔버스 트레일 효과입니다.',
    reference: cursifyCanvasReference,
    usage: `import { CanvasCursor } from "@/components/canvas-cursor"

export default function Example() {
  return (
    <CanvasCursor trails={20} nodeCount={50}>
      <div className="min-h-64">Move inside</div>
    </CanvasCursor>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('trails', 'number', '20', 'Number of spring trails.'),
      prop('nodeCount', 'number', '50', 'Number of nodes in each trail.'),
      prop('friction', 'number', '0.5', 'Trail friction from the Cursify default.'),
      prop('dampening', 'number', '0.25', 'Velocity transfer between trail nodes.'),
      prop('tension', 'number', '0.98', 'Spring tension decay across nodes.'),
      prop('lineWidth', 'number', '1', 'Canvas stroke width in pixels.'),
      prop('hueOffset', 'number', '285', 'Base hue from the Cursify oscillator.'),
      prop('hueAmplitude', 'number', '85', 'Hue oscillator amplitude.'),
      prop('hueFrequency', 'number', '0.0015', 'Hue oscillator frequency.'),
      prop('opacity', 'number', '0.2', 'Trail stroke alpha.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable the cursor effect.'),
    ],
  }),
  createSample({
    slug: 'data-table',
    categoryId: 'data-status',
    title: 'Typed Data Table',
    description: 'HeroUI 테이블 구조를 참고한 타입 기반 데이터 테이블입니다.',
    reference: {
      label: 'HeroUI Table',
      url: 'https://heroui.com/en/docs/react/components/table',
    },
    usage: `import { DataTable } from "@/components/data-table"

export default function Example() {
  return <DataTable columns={columns} rows={rows} />
}`,
    props: [
      classNameProp,
      prop('columns', 'DataTableColumn<T>[]', '-', 'Column definitions.'),
      prop('rows', 'T[]', '-', 'Rows to render.'),
    ],
  }),
  createSample({
    slug: 'ripple-button',
    categoryId: 'controls-inputs',
    title: 'Click Ripple Button',
    description: '클릭한 포인터 위치에서 리플이 퍼지는 버튼입니다.',
    usage: `import { RippleButton } from "@/components/ripple-button"

export default function Example() {
  return <RippleButton>Click me</RippleButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('rippleColor', 'string', '"#ffffff"', 'Color of the ripple wave.'),
      prop('duration', 'string', '"600ms"', 'Ripple animation duration.'),
      prop('...props', 'ButtonHTMLAttributes<HTMLButtonElement>', '-', 'Native button props.'),
    ],
  }),
  createSample({
    slug: 'shiny-button',
    categoryId: 'controls-inputs',
    title: 'Shine Button',
    description: '반복되는 광택 마스크와 탄성 있는 탭 피드백을 가진 버튼입니다.',
    dependencies: ['motion'],
    usage: `import { ShinyButton } from "@/components/shiny-button"

export default function Example() {
  return <ShinyButton>Shiny Button</ShinyButton>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('shineColor', 'string', '"currentColor"', 'Color used by the moving shine mask.'),
      prop('...props', 'HTMLAttributes<HTMLElement> & MotionProps', '-', 'Motion button props.'),
    ],
  }),
  createSample({
    slug: 'marquee',
    categoryId: 'content-display',
    title: 'Continuous Marquee',
    description: '텍스트, 이미지, 비디오를 끊김 없이 흘려보낼 수 있는 마키 컴포넌트입니다.',
    usage: `import { Marquee } from "@/components/marquee"

export default function Example() {
  return (
    <Marquee>
      <span>Next.js</span>
      <span>React</span>
      <span>TypeScript</span>
      <span>Tailwind CSS</span>
    </Marquee>
  )
}`,
    props: [
      classNameProp,
      prop('reverse', 'boolean', 'false', 'Whether to reverse the direction.'),
      prop('pauseOnHover', 'boolean', 'false', 'Whether to pause on hover.'),
      prop('vertical', 'boolean', 'false', 'Whether to animate vertically.'),
      childrenProp,
      prop('repeat', 'number', '4', 'How many times to repeat the content.'),
    ],
  }),
  createSample({
    slug: 'icon-cloud',
    categoryId: 'content-display',
    title: 'Rotating Icon Cloud',
    description: '아이콘이나 이미지를 3D 구름처럼 회전시키는 컴포넌트입니다.',
    usage: `import { IconCloud } from "@/components/icon-cloud"

const images = [
  "https://cdn.simpleicons.org/typescript/typescript",
  "https://cdn.simpleicons.org/react/react",
  "https://cdn.simpleicons.org/nextdotjs/nextdotjs",
]

export default function Example() {
  return <IconCloud images={images} />
}`,
    props: [
      prop('icons', 'React.ReactNode[]', '[]', 'Custom icon nodes to render.'),
      prop('images', 'string[]', '[]', 'Image URLs to render in the cloud.'),
    ],
  }),
  createSample({
    slug: 'lens',
    categoryId: 'content-display',
    title: 'Magnifier Lens',
    description: '이미지, 비디오, 기타 요소를 렌즈처럼 확대해 볼 수 있는 컴포넌트입니다.',
    dependencies: ['motion'],
    usage: `import { Lens } from "@/components/lens"

export default function Example() {
  return (
    <Lens>
      <img src="/images/lens-demo.jpg" alt="Lens demo" />
    </Lens>
  )
}`,
    props: [
      childrenProp,
      prop('zoomFactor', 'number', '1.3', 'The magnification factor.'),
      prop('lensSize', 'number', '170', 'The lens size in pixels.'),
      prop('isStatic', 'boolean', 'false', 'Whether the lens remains fixed.'),
      prop('duration', 'number', '0.1', 'Animation duration in seconds.'),
      prop('lensColor', 'string', '"black"', 'Color used by the mask.'),
    ],
  }),
  createSample({
    slug: 'pointer',
    categoryId: 'cursor-interaction-effects',
    title: 'Hover Pointer',
    description: '요소에 호버했을 때 사용자 지정 포인터를 보여주는 컴포넌트입니다.',
    dependencies: ['motion'],
    usage: `import { Pointer } from "@/components/pointer"

export default function Example() {
  return (
    <div className="relative">
      <Pointer />
    </div>
  )
}`,
    props: [
      classNameProp,
      childrenProp,
      prop('...props', 'HTMLMotionProps<"div">', '-', 'Motion props for wrapper.'),
    ],
  }),
  createSample({
    slug: 'file-tree',
    categoryId: 'data-status',
    title: 'Collapsible File Tree',
    description: '파일과 폴더를 선택하고 접을 수 있는 중첩 파일 트리입니다.',
    dependencies: ['@radix-ui/react-accordion', '@radix-ui/react-scroll-area', 'lucide-react'],
    usage: `import { Tree, type TreeViewElement } from "@/components/file-tree"

const elements: TreeViewElement[] = [
  {
    id: "1",
    name: "app",
    children: [
      { id: "2", name: "page.tsx" },
      { id: "3", name: "layout.tsx" },
    ],
  },
]

export default function Example() {
  return <Tree elements={elements} initialExpandedItems={["1"]} />
}`,
    props: [
      prop('elements', 'TreeViewElement[]', 'undefined', 'Tree data rendered recursively.'),
      prop('initialSelectedId', 'string', 'undefined', 'Initially selected file or folder id.'),
      prop('initialExpandedItems', 'string[]', 'undefined', 'Folder ids opened on first render.'),
      prop('indicator', 'boolean', 'true', 'Whether to show nesting guide lines.'),
      prop('openIcon', 'React.ReactNode', 'FolderOpenIcon', 'Icon for expanded folders.'),
      prop('closeIcon', 'React.ReactNode', 'FolderIcon', 'Icon for collapsed folders.'),
      prop('sort', 'TreeSortMode', '"default"', 'Folder/file sorting behavior.'),
    ],
  }),
  createSample({
    slug: 'animated-circular-progress-bar',
    categoryId: 'data-status',
    title: 'Circular Progress Meter',
    description: '기본 호와 보조 호가 값 변화에 맞춰 움직이는 원형 게이지입니다.',
    usage: `import { AnimatedCircularProgressBar } from "@/components/animated-circular-progress-bar"

export default function Example() {
  return (
    <AnimatedCircularProgressBar
      value={75}
      gaugePrimaryColor="#18181b"
      gaugeSecondaryColor="#e4e4e7"
    />
  )
}`,
    props: [
      prop('value', 'number', '0', 'Current value to display.'),
      prop('min', 'number', '0', 'Minimum gauge value.'),
      prop('max', 'number', '100', 'Maximum gauge value.'),
      prop('gaugePrimaryColor', 'string', '-', 'Primary progress stroke color.'),
      prop('gaugeSecondaryColor', 'string', '-', 'Secondary track stroke color.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'curved-loop',
    categoryId: 'text-effects',
    title: 'Curved Text Marquee',
    description: '곡선 경로를 따라 텍스트가 반복되고 드래그로 흐름을 제어할 수 있는 SVG 마키입니다.',
    usage: `import { CurvedLoop } from "@/components/curved-loop"

export default function Example() {
  return (
    <CurvedLoop
      marqueeText="React Bits ✦ Curved Loop ✦ "
      speed={3}
      curveAmount={120}
      className="text-5xl font-semibold"
    />
  )
}`,
    props: [
      prop('marqueeText', 'string', '""', 'Text repeated along the curve.'),
      prop('speed', 'number', '2', 'Loop speed.'),
      prop('curveAmount', 'number', '400', 'Vertical curve intensity.'),
      prop('direction', '"left" | "right"', '"left"', 'Marquee direction.'),
      prop('interactive', 'boolean', 'true', 'Whether drag controls speed and direction.'),
      prop('colors', 'readonly string[]', '-', 'Optional SVG gradient colors for the text.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'click-spark',
    categoryId: 'cursor-interaction-effects',
    title: 'Click Spark Burst',
    description: '클릭할 때마다 방사형 불꽃이 캔버스 위에 그려지는 효과입니다.',
    usage: `import { ClickSpark } from "@/components/click-spark"

export default function Example() {
  return (
    <ClickSpark sparkColor="#5227ff" sparkRadius={32}>
      <button>Click for sparks</button>
    </ClickSpark>
  )
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('sparkColor', 'string', '"#fff"', 'Spark line color.'),
      prop('sparkColors', 'readonly string[]', '-', 'Optional palette used to randomize each spark color.'),
      prop('sparkSize', 'number', '10', 'Spark line length.'),
      prop('sparkRadius', 'number', '15', 'Spark travel distance.'),
      prop('sparkCount', 'number', '8', 'Number of lines per click.'),
      prop('duration', 'number', '400', 'Spark animation duration in ms.'),
    ],
  }),
  createSample({
    slug: 'magnet',
    categoryId: 'cursor-interaction-effects',
    title: 'Magnetic Hover',
    description: '호버 시 자식 요소가 포인터 쪽으로 끌려오는 자기장 효과입니다.',
    usage: `import { Magnet } from "@/components/magnet"

export default function Example() {
  return (
    <Magnet padding={80} magnetStrength={3}>
      <button>Magnet</button>
    </Magnet>
  )
}`,
    props: [
      childrenProp,
      prop('padding', 'number', '100', 'Pointer activation area around the element.'),
      prop('disabled', 'boolean', 'false', 'Whether to disable magnetic movement.'),
      prop('magnetStrength', 'number', '2', 'How strongly the element follows the pointer.'),
      prop('wrapperClassName', 'string', '""', 'Classes for the outer wrapper.'),
      prop('innerClassName', 'string', '""', 'Classes for the moving child wrapper.'),
    ],
  }),
  createSample({
    slug: 'stack',
    categoryId: 'content-display',
    title: 'Swipe Card Stack',
    description: '드래그한 카드를 뒤로 보내며 순환시키는 카드 스택입니다.',
    dependencies: ['motion'],
    usage: `import { Stack } from "@/components/stack"

export default function Example() {
  return (
    <div className="h-64 w-64">
      <Stack randomRotation />
    </div>
  )
}`,
    props: [
      prop('randomRotation', 'boolean', 'false', 'Whether to rotate cards randomly.'),
      prop('sensitivity', 'number', '200', 'Drag distance required to send card back.'),
      prop('sendToBackOnClick', 'boolean', 'false', 'Whether clicking moves a card back.'),
      prop('cards', 'React.ReactNode[]', 'built-in cards', 'Custom card nodes.'),
      prop('autoplay', 'boolean', 'false', 'Whether the stack cycles automatically.'),
    ],
  }),
  createSample({
    slug: 'folder',
    categoryId: 'content-display',
    title: 'Expandable Folder',
    description: '클릭하면 여러 장의 종이 카드가 펼쳐지는 폴더 일러스트입니다.',
    usage: `import { Folder } from "@/components/folder"

export default function Example() {
  return <Folder color="#5227ff" />
}`,
    props: [
      prop('color', 'string', '"#5227FF"', 'Folder base color.'),
      prop('size', 'number', '1', 'Scale multiplier.'),
      prop('items', 'React.ReactNode[]', '[]', 'Custom paper content.'),
      prop('paperVariant', '"paper" | "glass"', '"paper"', 'Paper surface style.'),
      classNameProp,
    ],
  }),

  createSample({
    slug: 'carousel',
    categoryId: 'content-display',
    title: 'Card Carousel',
    description: '드래그와 자동 재생을 지원하는 3D 카드 캐러셀입니다.',
    dependencies: ['motion', 'react-icons'],
    usage: `import { Carousel } from "@/components/carousel"

export default function Example() {
  return <Carousel autoplay loop pauseOnHover />
}`,
    props: [
      prop('items', 'CarouselItem[]', 'built-in items', 'Carousel cards.'),
      prop('baseWidth', 'number', '300', 'Carousel width.'),
      prop('autoplay', 'boolean', 'false', 'Whether to advance automatically.'),
      prop('autoplayDelay', 'number', '3000', 'Delay between autoplay steps.'),
      prop('pauseOnHover', 'boolean', 'false', 'Whether hovering pauses autoplay.'),
      prop('loop', 'boolean', 'false', 'Whether the carousel wraps.'),
      prop('round', 'boolean', 'false', 'Whether to render the round style.'),
    ],
  }),

  createSample({
    slug: 'elastic-slider',
    categoryId: 'controls-inputs',
    title: 'Spring Slider',
    description: '탄성 있는 초과 움직임과 스프링 움직임을 가진 슬라이더입니다.',
    dependencies: ['motion'],
    usage: `import { ElasticSlider } from "@/components/elastic-slider"

export default function Example() {
  return <ElasticSlider defaultValue={45} />
}`,
    props: [
      prop('defaultValue', 'number', '50', 'Initial slider value.'),
      prop('startingValue', 'number', '0', 'Minimum value.'),
      prop('maxValue', 'number', '100', 'Maximum value.'),
      prop('isStepped', 'boolean', 'false', 'Whether to snap to steps.'),
      prop('stepSize', 'number', '1', 'Value increment when stepped.'),
      prop('leftIcon', 'React.ReactNode', '-', 'Optional left icon.'),
      prop('rightIcon', 'React.ReactNode', '-', 'Optional right icon.'),
    ],
  }),
  createSample({
    slug: 'counter',
    categoryId: 'data-status',
    title: 'Rolling Number Counter',
    description: '소수점 자리까지 지원하며 숫자가 굴러가듯 바뀌는 카운터입니다.',
    dependencies: ['motion'],
    usage: `import { useState } from "react"
import { Counter } from "@/components/counter"

export default function Example() {
  const [value, setValue] = useState(17.8)

  return (
    <div>
      <Counter value={value} />
      <button
        type="button"
        onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}
      >
        Decrease
      </button>
      <button
        type="button"
        onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}
      >
        Increase
      </button>
    </div>
  )
}`,
    props: [
      prop('value', 'number', '-', 'Target number.'),
      prop('fontSize', 'number', '100', 'Digit font size.'),
      prop('places', 'PlaceValue[]', 'auto from value', 'Displayed integer and decimal places.'),
      prop('gap', 'number', '8', 'Gap between digit columns.'),
      prop('textColor', 'string', '"inherit"', 'Digit text color.'),
      prop('fontWeight', 'React.CSSProperties["fontWeight"]', '"inherit"', 'Digit weight.'),
    ],
  }),

  createSample({
    slug: 'meteors',
    categoryId: 'background-atmosphere',
    title: 'Meteor Background',
    description: '화면 위로 유성이 떨어지는 듯한 배경 효과입니다.',
    usage: `import { Meteors } from "@/components/meteors"

export default function Example() {
  return (
    <div className="relative overflow-hidden rounded-xl border p-6">
      <Meteors number={20} />
      Meteors
    </div>
  )
}`,
    props: [
      prop('number', 'number', '20', 'Number of meteors to render.'),
      prop('minDelay', 'number', '0.2', 'Minimum animation delay.'),
      prop('maxDelay', 'number', '1.2', 'Maximum animation delay.'),
      prop('minDuration', 'number', '2', 'Minimum animation duration.'),
      prop('maxDuration', 'number', '10', 'Maximum animation duration.'),
      prop('angle', 'number', '215', 'Meteor travel angle.'),
    ],
  }),
  createSample({
    slug: 'confetti',
    categoryId: 'cursor-interaction-effects',
    title: 'Confetti Button',
    description: '완료, 성공, 축하 같은 순간에 짧은 즐거움을 더하는 색종이 효과입니다.',
    dependencies: ['canvas-confetti', '@types/canvas-confetti'],
    usage: `import { ConfettiButton } from "@/components/confetti"

export default function Example() {
  return <ConfettiButton>Celebrate</ConfettiButton>
}`,
    props: [
      prop('options', 'ConfettiOptions', '-', 'Per-shot confetti options.'),
      prop('globalOptions', 'ConfettiGlobalOptions', '{ resize: true }', 'Canvas instance options.'),
      prop('manualstart', 'boolean', 'false', 'Whether to start manually.'),
      childrenProp,
    ],
  }),
  createSample({
    slug: 'particles',
    categoryId: 'background-atmosphere',
    title: 'Particle Background',
    description: '깊이감과 움직임, 인터랙션으로 배경에 생동감을 더하는 파티클 효과입니다.',
    usage: `import { Particles } from "@/components/particles"

export default function Example() {
  return (
    <div className="relative h-64 overflow-hidden rounded-xl border">
      <Particles quantity={80} color="#38bdf8" />
    </div>
  )
}`,
    props: [
      classNameProp,
      prop('quantity', 'number', '100', 'Number of particles.'),
      prop('staticity', 'number', '50', 'How strongly particles react to pointer movement.'),
      prop('ease', 'number', '50', 'Pointer easing amount.'),
      prop('size', 'number', '0.4', 'Base particle size.'),
      prop('color', 'string', '"#ffffff"', 'Particle color.'),
      prop('colors', 'readonly string[]', '-', 'Optional particle color palette.'),
    ],
  }),
  createSample({
    slug: 'typing-animation',
    categoryId: 'text-effects',
    title: 'Typewriter Text',
    description: '문자가 타이핑되듯 순서대로 나타나는 텍스트 애니메이션입니다.',
    dependencies: ['motion'],
    usage: `import { TypingAnimation } from "@/components/typing-animation"

export default function Example() {
  return <TypingAnimation>Typing Animation</TypingAnimation>
}`,
    props: [
      prop('children', 'string', '-', 'Text content to type.'),
      prop('words', 'string[]', '-', 'Rotating words to type.'),
      classNameProp,
      prop('duration', 'number', '100', 'Character timing.'),
      prop('loop', 'boolean', 'false', 'Whether to loop words.'),
      prop('showCursor', 'boolean', 'true', 'Whether to show cursor.'),
    ],
  }),
  createSample({
    slug: 'aurora-text',
    categoryId: 'text-effects',
    title: 'Gradient Text',
    description: '오로라처럼 흐르는 그라데이션을 텍스트에 입히는 효과입니다.',
    usage: `import { AuroraText } from "@/components/aurora-text"

export default function Example() {
  return <AuroraText>Aurora Text</AuroraText>
}`,
    props: [
      childrenProp,
      classNameProp,
      prop('colors', 'string[]', 'built-in palette', 'Gradient colors.'),
      prop('speed', 'number', '1', 'Animation speed multiplier.'),
    ],
  }),
  createSample({
    slug: 'video-text',
    categoryId: 'text-effects',
    title: 'Video Mask Text',
    description: '텍스트 마스크 안쪽으로 비디오가 재생되는 타이포그래피 컴포넌트입니다.',
    usage: `import { VideoText } from "@/components/video-text"

export default function Example() {
  return <VideoText src="/videos/demo.mp4">VIDEO</VideoText>
}`,
    props: [
      prop('src', 'string', '-', 'Video source URL.'),
      childrenProp,
      classNameProp,
      prop('autoPlay', 'boolean', 'true', 'Whether to autoplay the video.'),
      prop('muted', 'boolean', 'true', 'Whether to mute the video.'),
      prop('loop', 'boolean', 'true', 'Whether to loop the video.'),
    ],
  }),
  createSample({
    slug: 'number-ticker',
    categoryId: 'data-status',
    title: 'Animated Number',
    description: '목표 숫자까지 자연스럽게 증가하거나 감소하는 숫자 애니메이션입니다.',
    dependencies: ['motion'],
    usage: `import { NumberTicker } from "@/components/number-ticker"

export default function Example() {
  return <NumberTicker value={1200} />
}`,
    props: [
      prop('value', 'number', '-', 'Target number.'),
      prop('startValue', 'number', '0', 'Initial number.'),
      prop('direction', '"up" | "down"', '"up"', 'Count direction.'),
      prop('delay', 'number', '0', 'Start delay.'),
      prop('decimalPlaces', 'number', '0', 'Decimal precision.'),
    ],
  }),
  createSample({
    slug: 'dia-text-reveal',
    categoryId: 'text-effects',
    title: 'Color Sweep Text',
    description: '가로 색상 띠가 텍스트를 지나가며 그라데이션 빛을 드러내는 애니메이션입니다.',
    dependencies: ['motion'],
    usage: `import { DiaTextReveal } from "@/components/dia-text-reveal"

export default function Example() {
  return <DiaTextReveal text="Dia Text Reveal" />
}`,
    props: [
      prop('text', 'string | string[]', '-', 'Text or rotating texts to reveal.'),
      prop('colors', 'string[]', 'built-in palette', 'Sweep colors.'),
      prop('textColor', 'string', '"var(--foreground)"', 'Final text color.'),
      prop('duration', 'number', '1.5', 'One sweep duration.'),
      prop('repeat', 'boolean', 'false', 'Whether to repeat text cycling.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'morphing-text',
    categoryId: 'text-effects',
    title: 'Morphing Word',
    description: '단어가 흐림과 투명도 변화로 서로 녹아들듯 전환되는 텍스트 컴포넌트입니다.',
    usage: `import { MorphingText } from "@/components/morphing-text"

export default function Example() {
  return <MorphingText texts={["Design", "Code", "Ship"]} />
}`,
    props: [
      prop('texts', 'string[]', '-', 'Texts to morph between.'),
      classNameProp,
    ],
  }),
  createSample({
    slug: 'highlighter',
    categoryId: 'text-effects',
    title: 'Marker Highlight',
    description: '사람이 직접 그은 마커 획처럼 텍스트를 밑줄 또는 형광펜으로 강조합니다.',
    dependencies: ['motion', 'rough-notation'],
    usage: `import { Highlighter } from "@/components/highlighter"

export default function Example() {
  return (
    <Highlighter color="#fde68a" padding={6}>
      Highlighter
    </Highlighter>
  )
}`,
    props: [
      childrenProp,
      prop('action', 'AnnotationAction', '"highlight"', 'Annotation style.'),
      prop('color', 'string', '"#ffd1dc"', 'Annotation color.'),
      prop('strokeWidth', 'number', '1.5', 'Stroke width.'),
      prop('animationDuration', 'number', '600', 'Draw animation duration.'),
      prop('iterations', 'number', '2', 'Number of rough-notation strokes.'),
      prop('padding', 'number', '2', 'Annotation padding around the text.'),
      prop('multiline', 'boolean', 'true', 'Whether to annotate wrapped lines.'),
      prop('isView', 'boolean', 'false', 'Whether to start when in view.'),
      prop('repeat', 'boolean', 'false', 'Whether to replay the draw animation.'),
      prop('repeatDelay', 'number', '1800', 'Delay between repeated draw animations.'),
    ],
  }),
]

export function getComponentSampleBySlug(slug: string) {
  return componentSamples.find((sample) => sample.slug === slug) ?? null
}
