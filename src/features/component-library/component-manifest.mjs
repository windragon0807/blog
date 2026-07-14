// @ts-check

/**
 * @typedef {object} ComponentCategory
 * @property {string} id
 * @property {string} name
 * @property {string} description
 */

/**
 * @typedef {object} ComponentProp
 * @property {string} name
 * @property {string} type
 * @property {string} defaultValue
 * @property {string} description
 */

/**
 * @typedef {object} ComponentReference
 * @property {string} label
 * @property {string} url
 */

/**
 * @typedef {object} ComponentRegistryMetadata
 * @property {string} description
 * @property {readonly string[]} dependencies
 * @property {readonly string[]=} registryDependencies
 * @property {Readonly<Record<string, unknown>>=} cssVars
 * @property {Readonly<Record<string, unknown>>=} css
 */

/**
 * @typedef {object} ComponentManifestEntry
 * @property {string} slug
 * @property {ComponentCategoryId} categoryId
 * @property {string} title
 * @property {string} description
 * @property {true=} hiddenOnMobile
 * @property {ComponentReference} reference
 * @property {string} usage
 * @property {readonly ComponentProp[]} props
 * @property {ComponentRegistryMetadata} registry
 */

export const componentRegistryBaseUrl =
  'https://ryong-blog.vercel.app/r'

/** @satisfies {readonly ComponentCategory[]} */
export const componentCategories = /** @type {const} */ (
  [
    {
      "id": "controls-inputs",
      "name": "Controls & Inputs",
      "description": "버튼, 입력, 슬라이더, 토글처럼 사용자가 값을 바꾸는 컨트롤입니다."
    },
    {
      "id": "menus-actions",
      "name": "Menus & Actions",
      "description": "메뉴, 키보드, 투두처럼 액션 선택이나 조작 흐름을 보여주는 컴포넌트입니다."
    },
    {
      "id": "content-display",
      "name": "Content Display",
      "description": "캐러셀, 마키, 아바타, 이미지, 카드처럼 콘텐츠를 보여주는 패턴입니다."
    },
    {
      "id": "data-status",
      "name": "Data & Status",
      "description": "테이블, 트리, 진행률, 카운터처럼 구조화된 정보와 상태를 보여주는 컴포넌트입니다."
    },
    {
      "id": "text-effects",
      "name": "Text Effects",
      "description": "타이핑, 플립, 모핑, 하이라이트처럼 텍스트 자체를 강조하는 효과입니다."
    },
    {
      "id": "background-atmosphere",
      "name": "Background & Atmosphere",
      "description": "섹션 배경과 화면 분위기를 만드는 배경형 효과입니다."
    },
    {
      "id": "cursor-interaction-effects",
      "name": "Cursor & Interaction Effects",
      "description": "마우스 움직임, 클릭, 호버에 반응하는 인터랙션 효과입니다."
    }
  ]
)

/** @typedef {(typeof componentCategories)[number]['id']} ComponentCategoryId */

/** @satisfies {readonly ComponentManifestEntry[]} */
export const componentManifest = /** @type {const} */ (
  [
    {
      "slug": "background-boxes",
      "categoryId": "background-atmosphere",
      "title": "Hover Grid Background",
      "description": "히어로 영역이나 기능 섹션에 쓰기 좋은, 호버에 반응하는 격자 배경입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "Aceternity Background Boxes",
        "url": "https://ui.aceternity.com/components/background-boxes"
      },
      "usage": "import { BackgroundBoxes } from \"@/components/background-boxes\"\n\nexport default function Example() {\n  return (\n    <div className=\"relative h-96 overflow-hidden bg-slate-900\">\n      <BackgroundBoxes />\n      <div className=\"pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(15,23,42,0.96)_78%)]\" />\n    </div>\n  )\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "rows",
          "type": "number",
          "defaultValue": "150",
          "description": "Number of grid rows."
        },
        {
          "name": "columns",
          "type": "number",
          "defaultValue": "100",
          "description": "Number of grid columns."
        },
        {
          "name": "colors",
          "type": "string[]",
          "defaultValue": "built-in palette",
          "description": "Hover color palette."
        },
        {
          "name": "boxClassName",
          "type": "string",
          "defaultValue": "-",
          "description": "Classes applied to each box."
        }
      ],
      "registry": {
        "description": "A hover-reactive grid background for hero and feature surfaces.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "keyboard",
      "categoryId": "menus-actions",
      "title": "Interactive Keyboard",
      "description": "클릭과 실제 키 입력 상태를 함께 보여주는 맥 스타일 키보드입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "Aceternity Keyboard",
        "url": "https://ui.aceternity.com/components/keyboard"
      },
      "usage": "import { Keyboard } from \"@/components/keyboard\"\n\nexport default function Example() {\n  return <Keyboard showPreview />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "showPreview",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to show the last pressed key above the keyboard."
        },
        {
          "name": "enableSound",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Reserved hook for adding key sounds without bundling audio assets."
        },
        {
          "name": "keys",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Optional shortcut mode for compact key combinations."
        },
        {
          "name": "keyClassName",
          "type": "string",
          "defaultValue": "-",
          "description": "Classes applied to shortcut keys."
        }
      ],
      "registry": {
        "description": "A Mac-style keyboard with clickable and physical key states.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "placeholders-and-vanish-input",
      "categoryId": "controls-inputs",
      "title": "Rotating Search Input",
      "description": "플레이스홀더가 순환되고 제출 시 텍스트가 사라지는 검색 입력입니다.",
      "reference": {
        "label": "Aceternity Placeholders And Vanish Input",
        "url": "https://ui.aceternity.com/components/placeholders-and-vanish-input"
      },
      "usage": "import { PlaceholdersAndVanishInput } from \"@/components/placeholders-and-vanish-input\"\n\nexport default function Example() {\n  return <PlaceholdersAndVanishInput placeholders={[\"Search docs\", \"Ask AI\"]} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "placeholders",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Placeholder values to rotate."
        },
        {
          "name": "variant",
          "type": "\"light\" | \"glass\"",
          "defaultValue": "\"light\"",
          "description": "Visual surface style."
        },
        {
          "name": "onSubmit",
          "type": "(value: string) => void",
          "defaultValue": "-",
          "description": "Submit handler."
        }
      ],
      "registry": {
        "description": "A search input with rotating placeholders and vanish submit motion.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "3d-marquee",
      "categoryId": "content-display",
      "title": "Perspective Image Marquee",
      "description": "이미지나 카드 스트립을 원근감 있는 흐름으로 보여주는 3D 마키입니다.",
      "reference": {
        "label": "Aceternity 3D Marquee",
        "url": "https://ui.aceternity.com/components/3d-marquee"
      },
      "usage": "import { ThreeDMarquee } from \"@/components/3d-marquee\"\n\nexport default function Example() {\n  return <ThreeDMarquee images={images} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "images",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Images rendered in the 3D grid."
        },
        {
          "name": "items",
          "type": "React.ReactNode[]",
          "defaultValue": "-",
          "description": "Legacy custom item fallback."
        }
      ],
      "registry": {
        "description": "A perspective marquee grid for image or card strips.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "playful-todolist",
      "categoryId": "menus-actions",
      "title": "Animated Task List",
      "description": "체크 동작에 짧은 애니메이션을 더한 작은 투두 리스트입니다.",
      "reference": {
        "label": "Animate UI Playful TodoList",
        "url": "https://animate-ui.com/docs/components/community/playful-todolist"
      },
      "usage": "import { PlayfulTodoList } from \"@/components/playful-todolist\"\n\nexport default function Example() {\n  return <PlayfulTodoList />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "items",
          "type": "TodoItem[]",
          "defaultValue": "built-in list",
          "description": "Todo labels and initial checked states."
        }
      ],
      "registry": {
        "description": "A small animated todo list interaction.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "flower-menu",
      "categoryId": "menus-actions",
      "title": "Radial Action Menu",
      "description": "중앙 버튼을 기준으로 액션이 꽃처럼 펼쳐지는 플로팅 메뉴입니다.",
      "reference": {
        "label": "Animata Flower Menu",
        "url": "https://animata.design/docs/fabs/flower-menu"
      },
      "usage": "import { FlowerMenu } from \"@/components/flower-menu\"\n\nexport default function Example() {\n  return <FlowerMenu items={items} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "items",
          "type": "FlowerMenuItem[]",
          "defaultValue": "-",
          "description": "Menu actions."
        },
        {
          "name": "variant",
          "type": "\"default\" | \"glass\"",
          "defaultValue": "\"default\"",
          "description": "Visual surface style."
        }
      ],
      "registry": {
        "description": "A radial floating action menu.",
        "dependencies": []
      }
    },
    {
      "slug": "text-flip",
      "categoryId": "text-effects",
      "title": "Rotating Word Flip",
      "description": "짧은 단어가 차례로 뒤집히며 교체되는 텍스트 애니메이션입니다.",
      "reference": {
        "label": "Animata Text Flip",
        "url": "https://animata.design/docs/text/text-flip"
      },
      "usage": "import { TextFlip } from \"@/components/text-flip\"\n\nexport default function Example() {\n  return <TextFlip prefix=\"Coding is\" words={[\"fantastic\", \"love\", \"fire\"]} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "prefix",
          "type": "string",
          "defaultValue": "\"Coding is\"",
          "description": "Stable text rendered before the animated word."
        },
        {
          "name": "words",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Words to rotate."
        },
        {
          "name": "interval",
          "type": "number",
          "defaultValue": "2600",
          "description": "Flip interval in milliseconds."
        }
      ],
      "registry": {
        "description": "A rotating word flip animation.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "toggle-theme",
      "categoryId": "controls-inputs",
      "title": "Theme Toggle",
      "description": "라이트/다크 테마를 전환하는 간결한 스위치형 토글입니다.",
      "reference": {
        "label": "Lightswind Toggle Theme",
        "url": "https://lightswind.com/components/toggle-theme"
      },
      "usage": "import { ToggleTheme } from \"@/components/toggle-theme\"\n\nexport default function Example() {\n  return <ToggleTheme />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "400",
          "description": "View Transition animation duration in milliseconds."
        },
        {
          "name": "animationType",
          "type": "\"none\" | \"circle-spread\" | \"round-morph\" | \"swipe-left\" | \"swipe-up\" | \"diag-down-right\" | \"fade-in-out\" | \"shrink-grow\" | \"flip-x-in\" | \"split-vertical\" | \"swipe-right\" | \"swipe-down\" | \"wave-ripple\"",
          "defaultValue": "\"circle-spread\"",
          "description": "Lightswind View Transition animation style."
        },
        {
          "name": "variant",
          "type": "\"default\" | \"glass\"",
          "defaultValue": "\"default\"",
          "description": "Visual surface style."
        },
        {
          "name": "defaultChecked",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Initial checked state."
        },
        {
          "name": "onChange",
          "type": "(checked: boolean) => void",
          "defaultValue": "-",
          "description": "Change handler."
        }
      ],
      "registry": {
        "description": "A minimal switch-style theme toggle.",
        "dependencies": [
          "lucide-react",
          "next-themes"
        ]
      }
    },
    {
      "slug": "3d-image-carousel",
      "categoryId": "content-display",
      "title": "Depth Image Carousel",
      "description": "이미지 카드를 원근감 있게 회전시키는 3D 캐러셀입니다.",
      "reference": {
        "label": "Lightswind 3D Image Carousel",
        "url": "https://lightswind.com/components/3d-image-carousel"
      },
      "usage": "import { ThreeDImageCarousel } from \"@/components/3d-image-carousel\"\n\nexport default function Example() {\n  return <ThreeDImageCarousel items={items} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "items",
          "type": "ThreeDImageCarouselItem[]",
          "defaultValue": "-",
          "description": "Images to show."
        },
        {
          "name": "slides",
          "type": "ThreeDImageCarouselItem[]",
          "defaultValue": "-",
          "description": "Alias for images to show."
        },
        {
          "name": "itemCount",
          "type": "3 | 5",
          "defaultValue": "5",
          "description": "Number of visible cascade positions."
        },
        {
          "name": "interval",
          "type": "number",
          "defaultValue": "-",
          "description": "Auto-rotation interval alias in milliseconds."
        },
        {
          "name": "delay",
          "type": "number",
          "defaultValue": "3",
          "description": "Auto-rotation delay in seconds, matching the source component API."
        },
        {
          "name": "autoplay",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to rotate automatically."
        },
        {
          "name": "pauseOnHover",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether autoplay pauses while hovering."
        }
      ],
      "registry": {
        "description": "A rotating perspective image carousel.",
        "dependencies": [
          "lucide-react"
        ]
      }
    },
    {
      "slug": "sparkle-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Sparkle Cursor Trail",
      "description": "지정된 영역 안에서 커서 움직임에 따라 반짝임을 뿌리는 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "Lightswind Sparkle Cursor",
        "url": "https://lightswind.com/components/sparkle-cursor"
      },
      "usage": "import { SparkleCursor } from \"@/components/sparkle-cursor\"\n\nexport default function Example() {\n  return <SparkleCursor>Move here</SparkleCursor>\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"var(--theme-accent-current)\"",
          "description": "Sparkle color."
        },
        {
          "name": "fullScreen",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether the canvas covers the viewport."
        }
      ],
      "registry": {
        "description": "A local cursor sparkle effect for a bounded surface.",
        "dependencies": [
          "gsap"
        ]
      }
    },
    {
      "slug": "mouse-invert-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Invert Cursor",
      "description": "영역 안에서 배경을 반전시키는 혼합 모드 커서 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "mouse-animations playground",
        "url": "https://tgomilar.github.io/mouse-animations/"
      },
      "usage": "import { MouseInvertCursor } from \"@/components/mouse-invert-cursor\"\n\nexport default function Example() {\n  return (\n    <MouseInvertCursor size={50} smoothness={0.08}>\n      <div className=\"min-h-64\">Move inside</div>\n    </MouseInvertCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "size",
          "type": "number",
          "defaultValue": "50",
          "description": "Invert cursor diameter in pixels."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"#ffffff\"",
          "description": "Blend color used by the cursor circle."
        },
        {
          "name": "smoothness",
          "type": "number",
          "defaultValue": "0.08",
          "description": "Lerp factor copied from the playground default."
        },
        {
          "name": "hideDefault",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to hide the native cursor inside the component."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped mix-blend-mode cursor adapted from mouse-animations Invert.",
        "dependencies": []
      }
    },
    {
      "slug": "mouse-trail-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Dot Cursor Trail",
      "description": "영역 안에서 커서 뒤를 작은 점들이 따라오는 캔버스 트레일 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "mouse-animations playground",
        "url": "https://tgomilar.github.io/mouse-animations/"
      },
      "usage": "import { MouseTrailCursor } from \"@/components/mouse-trail-cursor\"\n\nexport default function Example() {\n  return (\n    <MouseTrailCursor color=\"#c084fc\" size={5} length={20} decay={0.05}>\n      <div className=\"min-h-64\">Move inside</div>\n    </MouseTrailCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"#c084fc\"",
          "description": "Trail dot color from the playground default."
        },
        {
          "name": "size",
          "type": "number",
          "defaultValue": "5",
          "description": "Maximum dot radius in pixels."
        },
        {
          "name": "length",
          "type": "number",
          "defaultValue": "20",
          "description": "Maximum number of trail points to keep."
        },
        {
          "name": "decay",
          "type": "number",
          "defaultValue": "0.05",
          "description": "Alpha decay per frame."
        },
        {
          "name": "blur",
          "type": "number",
          "defaultValue": "0",
          "description": "Canvas blur filter in pixels."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A bounded canvas dot trail adapted from mouse-animations Trail.",
        "dependencies": []
      }
    },
    {
      "slug": "mouse-ripple-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Click Ripple Cursor",
      "description": "클릭한 지점에서 원형 리플이 퍼지는 커서 인터랙션입니다.",
      "reference": {
        "label": "mouse-animations playground",
        "url": "https://tgomilar.github.io/mouse-animations/"
      },
      "usage": "import { MouseRippleCursor } from \"@/components/mouse-ripple-cursor\"\n\nexport default function Example() {\n  return (\n    <MouseRippleCursor color=\"rgba(96,165,250,0.60)\" maxSize={150}>\n      <button>Click inside</button>\n    </MouseRippleCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"rgba(96,165,250,0.60)\"",
          "description": "Ripple fill color from the playground default."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "600",
          "description": "Ripple animation duration in ms."
        },
        {
          "name": "maxSize",
          "type": "number",
          "defaultValue": "150",
          "description": "Maximum ripple diameter in pixels."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A click ripple adapted from mouse-animations Ripple.",
        "dependencies": []
      }
    },
    {
      "slug": "mouse-custom-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Ring Cursor",
      "description": "작은 점과 늦게 따라오는 링으로 커서를 대체하는 영역형 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "mouse-animations playground",
        "url": "https://tgomilar.github.io/mouse-animations/"
      },
      "usage": "import { MouseCustomCursor } from \"@/components/mouse-custom-cursor\"\n\nexport default function Example() {\n  return (\n    <MouseCustomCursor innerColor=\"#34d399\" outerColor=\"rgba(52,211,153,0.3)\">\n      <div className=\"min-h-64\">Move inside</div>\n    </MouseCustomCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "innerSize",
          "type": "number",
          "defaultValue": "6",
          "description": "Inner dot size in pixels."
        },
        {
          "name": "outerSize",
          "type": "number",
          "defaultValue": "36",
          "description": "Outer ring size in pixels."
        },
        {
          "name": "innerColor",
          "type": "string",
          "defaultValue": "\"#34d399\"",
          "description": "Inner dot color from the playground default."
        },
        {
          "name": "outerColor",
          "type": "string",
          "defaultValue": "\"rgba(52,211,153,0.3)\"",
          "description": "Outer ring color from the playground default."
        },
        {
          "name": "smoothness",
          "type": "number",
          "defaultValue": "0.15",
          "description": "Ring lerp factor copied from the playground default."
        },
        {
          "name": "hideDefault",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to hide the native cursor inside the component."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped dot and lagging ring adapted from mouse-animations CustomCursor.",
        "dependencies": []
      }
    },
    {
      "slug": "fairy-dust-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Star Particle Cursor",
      "description": "커서 이동을 따라 작은 별가루가 흩어지는 영역형 파티클 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "cursor-effects demo",
        "url": "https://tholman.com/cursor-effects/"
      },
      "usage": "import { FairyDustCursor } from \"@/components/fairy-dust-cursor\"\n\nexport default function Example() {\n  return (\n    <FairyDustCursor>\n      <div className=\"min-h-64\">Move inside</div>\n    </FairyDustCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "colors",
          "type": "string[]",
          "defaultValue": "[\"#D61C59\", \"#E7D84B\", \"#1B8798\"]",
          "description": "Particle colors from the cursor-effects default."
        },
        {
          "name": "fairySymbol",
          "type": "string",
          "defaultValue": "\"*\"",
          "description": "Character rendered as each dust particle."
        },
        {
          "name": "maxParticles",
          "type": "number",
          "defaultValue": "160",
          "description": "Particle cap used to prevent runaway canvas work."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped star-dust trail adapted from tholman cursor-effects Fairy Dust.",
        "dependencies": []
      }
    },
    {
      "slug": "bubble-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Bubble Cursor Trail",
      "description": "커서 움직임을 따라 거품 파티클이 떠오르는 영역형 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "cursor-effects demo",
        "url": "https://tholman.com/cursor-effects/"
      },
      "usage": "import { BubbleCursor } from \"@/components/bubble-cursor\"\n\nexport default function Example() {\n  return (\n    <BubbleCursor fillColor=\"#e6f1f7\" strokeColor=\"#3a92c5\">\n      <div className=\"min-h-64\">Move inside</div>\n    </BubbleCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "fillColor",
          "type": "string",
          "defaultValue": "\"#e6f1f7\"",
          "description": "Bubble fill color from the cursor-effects default."
        },
        {
          "name": "strokeColor",
          "type": "string",
          "defaultValue": "\"#3a92c5\"",
          "description": "Bubble stroke color from the cursor-effects default."
        },
        {
          "name": "maxParticles",
          "type": "number",
          "defaultValue": "180",
          "description": "Particle cap used to prevent runaway canvas work."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped bubble particle cursor adapted from tholman cursor-effects Bubbles.",
        "dependencies": []
      }
    },
    {
      "slug": "character-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Character Particle Cursor",
      "description": "커서 주변에 문자 파티클이 생성되는 영역형 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "cursor-effects demo",
        "url": "https://tholman.com/cursor-effects/"
      },
      "usage": "import { CharacterCursor } from \"@/components/character-cursor\"\n\nexport default function Example() {\n  return (\n    <CharacterCursor characters={[\"h\", \"e\", \"l\", \"l\", \"o\"]}>\n      <div className=\"min-h-64\">Move inside</div>\n    </CharacterCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "characters",
          "type": "string[]",
          "defaultValue": "[\"h\", \"e\", \"l\", \"l\", \"o\"]",
          "description": "Characters rendered as particles."
        },
        {
          "name": "colors",
          "type": "string[]",
          "defaultValue": "cursor-effects palette",
          "description": "Particle colors from the cursor-effects default."
        },
        {
          "name": "font",
          "type": "string",
          "defaultValue": "\"15px serif\"",
          "description": "Canvas font used for particle glyphs."
        },
        {
          "name": "cursorOffset",
          "type": "{ x: number; y: number }",
          "defaultValue": "{ x: 0, y: 0 }",
          "description": "Offset applied to each spawned character."
        },
        {
          "name": "maxParticles",
          "type": "number",
          "defaultValue": "170",
          "description": "Particle cap used to prevent runaway canvas work."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped character particle cursor adapted from tholman cursor-effects Character.",
        "dependencies": []
      }
    },
    {
      "slug": "canvas-cursor",
      "categoryId": "cursor-interaction-effects",
      "title": "Spring Line Cursor",
      "description": "스프링처럼 이어진 선이 커서를 따라오는 캔버스 트레일 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "Cursify Canvas Cursor",
        "url": "https://cursify.ui-layouts.com/components/canvas-cursor"
      },
      "usage": "import { CanvasCursor } from \"@/components/canvas-cursor\"\n\nexport default function Example() {\n  return (\n    <CanvasCursor trails={20} nodeCount={50}>\n      <div className=\"min-h-64\">Move inside</div>\n    </CanvasCursor>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "trails",
          "type": "number",
          "defaultValue": "20",
          "description": "Number of spring trails."
        },
        {
          "name": "nodeCount",
          "type": "number",
          "defaultValue": "50",
          "description": "Number of nodes in each trail."
        },
        {
          "name": "friction",
          "type": "number",
          "defaultValue": "0.5",
          "description": "Trail friction from the Cursify default."
        },
        {
          "name": "dampening",
          "type": "number",
          "defaultValue": "0.25",
          "description": "Velocity transfer between trail nodes."
        },
        {
          "name": "tension",
          "type": "number",
          "defaultValue": "0.98",
          "description": "Spring tension decay across nodes."
        },
        {
          "name": "lineWidth",
          "type": "number",
          "defaultValue": "1",
          "description": "Canvas stroke width in pixels."
        },
        {
          "name": "hueOffset",
          "type": "number",
          "defaultValue": "285",
          "description": "Base hue from the Cursify oscillator."
        },
        {
          "name": "hueAmplitude",
          "type": "number",
          "defaultValue": "85",
          "description": "Hue oscillator amplitude."
        },
        {
          "name": "hueFrequency",
          "type": "number",
          "defaultValue": "0.0015",
          "description": "Hue oscillator frequency."
        },
        {
          "name": "opacity",
          "type": "number",
          "defaultValue": "0.2",
          "description": "Trail stroke alpha."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable the cursor effect."
        }
      ],
      "registry": {
        "description": "A scoped spring-line canvas trail adapted from Cursify Canvas Cursor.",
        "dependencies": []
      }
    },
    {
      "slug": "data-table",
      "categoryId": "data-status",
      "title": "Typed Data Table",
      "description": "HeroUI 테이블 구조를 참고한 타입 기반 데이터 테이블입니다.",
      "reference": {
        "label": "HeroUI Table",
        "url": "https://heroui.com/en/docs/react/components/table"
      },
      "usage": "import { DataTable } from \"@/components/data-table\"\n\nexport default function Example() {\n  return <DataTable columns={columns} rows={rows} />\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "columns",
          "type": "DataTableColumn<T>[]",
          "defaultValue": "-",
          "description": "Column definitions."
        },
        {
          "name": "rows",
          "type": "T[]",
          "defaultValue": "-",
          "description": "Rows to render."
        }
      ],
      "registry": {
        "description": "A simple typed data table inspired by HeroUI table structure.",
        "dependencies": []
      }
    },
    {
      "slug": "physics-number-picker",
      "categoryId": "controls-inputs",
      "title": "Physics Number Picker",
      "description": "관성 스크롤과 스냅 물리를 결합한 숫자 선택 입력 컴포넌트입니다.",
      "reference": {
        "label": "OpenRun ChainPicker",
        "url": "https://github.com/windragon0807/open-run"
      },
      "usage": "\"use client\"\n\nimport { useState } from \"react\"\nimport { PhysicsNumberPicker } from \"@/components/physics-number-picker\"\n\nexport default function Example() {\n  const [value, setValue] = useState(24)\n\n  return (\n    <PhysicsNumberPicker\n      value={value}\n      min={0}\n      max={59}\n      onValueChange={setValue}\n    />\n  )\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "value",
          "type": "number",
          "defaultValue": "-",
          "description": "Controlled selected value."
        },
        {
          "name": "defaultValue",
          "type": "number",
          "defaultValue": "-",
          "description": "Initial value for uncontrolled usage."
        },
        {
          "name": "min",
          "type": "number",
          "defaultValue": "0",
          "description": "Minimum selectable value."
        },
        {
          "name": "max",
          "type": "number",
          "defaultValue": "59",
          "description": "Maximum selectable value."
        },
        {
          "name": "onValueChange",
          "type": "(value: number) => void",
          "defaultValue": "-",
          "description": "Called when the picker snaps to a new value."
        },
        {
          "name": "wrap",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether values loop from max to min."
        },
        {
          "name": "itemHeight",
          "type": "number",
          "defaultValue": "56",
          "description": "Height of each picker row in pixels."
        },
        {
          "name": "visibleItems",
          "type": "5 | 7 | 9",
          "defaultValue": "7",
          "description": "Odd number of visible rows."
        },
        {
          "name": "formatValue",
          "type": "(value: number, isSelected: boolean) => React.ReactNode",
          "defaultValue": "-",
          "description": "Custom renderer for each value."
        },
        {
          "name": "label",
          "type": "string",
          "defaultValue": "\"Number picker\"",
          "description": "Accessible spinbutton label."
        },
        {
          "name": "style",
          "type": "React.CSSProperties",
          "defaultValue": "-",
          "description": "Inline style and picker CSS variables."
        }
      ],
      "registry": {
        "description": "A numeric wheel picker with momentum scrolling and snap physics.",
        "dependencies": []
      }
    },
    {
      "slug": "ripple-button",
      "categoryId": "controls-inputs",
      "title": "Click Ripple Button",
      "description": "클릭한 포인터 위치에서 리플이 퍼지는 버튼입니다.",
      "reference": {
        "label": "Reference Click Ripple Button",
        "url": "https://magicui.design/docs/components/ripple-button"
      },
      "usage": "import { RippleButton } from \"@/components/ripple-button\"\n\nexport default function Example() {\n  return <RippleButton>Click me</RippleButton>\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "rippleColor",
          "type": "string",
          "defaultValue": "\"#ffffff\"",
          "description": "Color of the ripple wave."
        },
        {
          "name": "duration",
          "type": "string",
          "defaultValue": "\"600ms\"",
          "description": "Ripple animation duration."
        },
        {
          "name": "...props",
          "type": "ButtonHTMLAttributes<HTMLButtonElement>",
          "defaultValue": "-",
          "description": "Native button props."
        }
      ],
      "registry": {
        "description": "A button that emits a click ripple from the pointer position.",
        "dependencies": [],
        "cssVars": {
          "theme": {
            "animate-rippling": "rippling var(--duration) ease-out"
          }
        },
        "css": {
          "@keyframes rippling": {
            "0%": {
              "opacity": "1"
            },
            "100%": {
              "transform": "scale(2)",
              "opacity": "0"
            }
          }
        }
      }
    },
    {
      "slug": "shiny-button",
      "categoryId": "controls-inputs",
      "title": "Shine Button",
      "description": "반복되는 광택 마스크와 탄성 있는 탭 피드백을 가진 버튼입니다.",
      "reference": {
        "label": "Reference Shine Button",
        "url": "https://magicui.design/docs/components/shiny-button"
      },
      "usage": "import { ShinyButton } from \"@/components/shiny-button\"\n\nexport default function Example() {\n  return <ShinyButton>Shiny Button</ShinyButton>\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "shineColor",
          "type": "string",
          "defaultValue": "\"currentColor\"",
          "description": "Color used by the moving shine mask."
        },
        {
          "name": "...props",
          "type": "HTMLAttributes<HTMLElement> & MotionProps",
          "defaultValue": "-",
          "description": "Motion button props."
        }
      ],
      "registry": {
        "description": "A button with a looping masked shine and spring tap feedback.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "marquee",
      "categoryId": "content-display",
      "title": "Continuous Marquee",
      "description": "텍스트, 이미지, 비디오를 끊김 없이 흘려보낼 수 있는 마키 컴포넌트입니다.",
      "reference": {
        "label": "Reference Continuous Marquee",
        "url": "https://magicui.design/docs/components/marquee"
      },
      "usage": "import { Marquee } from \"@/components/marquee\"\n\nexport default function Example() {\n  return (\n    <Marquee>\n      <span>Next.js</span>\n      <span>React</span>\n      <span>TypeScript</span>\n      <span>Tailwind CSS</span>\n    </Marquee>\n  )\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "reverse",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to reverse the direction."
        },
        {
          "name": "pauseOnHover",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to pause on hover."
        },
        {
          "name": "vertical",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to animate vertically."
        },
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "repeat",
          "type": "number",
          "defaultValue": "4",
          "description": "How many times to repeat the content."
        }
      ],
      "registry": {
        "description": "An infinite scrolling component that can be used to display text, images, or videos.",
        "dependencies": [],
        "cssVars": {
          "theme": {
            "animate-marquee": "marquee var(--duration) infinite linear",
            "animate-marquee-vertical": "marquee-vertical var(--duration) linear infinite"
          }
        },
        "css": {
          "@keyframes marquee": {
            "from": {
              "transform": "translateX(0)"
            },
            "to": {
              "transform": "translateX(calc(-100% - var(--gap)))"
            }
          },
          "@keyframes marquee-vertical": {
            "from": {
              "transform": "translateY(0)"
            },
            "to": {
              "transform": "translateY(calc(-100% - var(--gap)))"
            }
          }
        }
      }
    },
    {
      "slug": "icon-cloud",
      "categoryId": "content-display",
      "title": "Rotating Icon Cloud",
      "description": "아이콘이나 이미지를 3D 구름처럼 회전시키는 컴포넌트입니다.",
      "reference": {
        "label": "Reference Rotating Icon Cloud",
        "url": "https://magicui.design/docs/components/icon-cloud"
      },
      "usage": "import { IconCloud } from \"@/components/icon-cloud\"\n\nconst images = [\n  \"https://cdn.simpleicons.org/typescript/typescript\",\n  \"https://cdn.simpleicons.org/react/react\",\n  \"https://cdn.simpleicons.org/nextdotjs/nextdotjs\",\n]\n\nexport default function Example() {\n  return <IconCloud images={images} />\n}",
      "props": [
        {
          "name": "icons",
          "type": "React.ReactNode[]",
          "defaultValue": "[]",
          "description": "Custom icon nodes to render."
        },
        {
          "name": "images",
          "type": "string[]",
          "defaultValue": "[]",
          "description": "Image URLs to render in the cloud."
        }
      ],
      "registry": {
        "description": "An interactive 3D tag cloud component.",
        "dependencies": []
      }
    },
    {
      "slug": "lens",
      "categoryId": "content-display",
      "title": "Magnifier Lens",
      "description": "이미지, 비디오, 기타 요소를 렌즈처럼 확대해 볼 수 있는 컴포넌트입니다.",
      "reference": {
        "label": "Reference Magnifier Lens",
        "url": "https://magicui.design/docs/components/lens"
      },
      "usage": "import { Lens } from \"@/components/lens\"\n\nexport default function Example() {\n  return (\n    <Lens>\n      <img src=\"/images/lens-demo.jpg\" alt=\"Lens demo\" />\n    </Lens>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "zoomFactor",
          "type": "number",
          "defaultValue": "1.3",
          "description": "The magnification factor."
        },
        {
          "name": "lensSize",
          "type": "number",
          "defaultValue": "170",
          "description": "The lens size in pixels."
        },
        {
          "name": "isStatic",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether the lens remains fixed."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "0.1",
          "description": "Animation duration in seconds."
        },
        {
          "name": "lensColor",
          "type": "string",
          "defaultValue": "\"black\"",
          "description": "Color used by the mask."
        }
      ],
      "registry": {
        "description": "An interactive component that enables zooming into images, videos, and other elements.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "pointer",
      "categoryId": "cursor-interaction-effects",
      "title": "Hover Pointer",
      "description": "요소에 호버했을 때 사용자 지정 포인터를 보여주는 컴포넌트입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "Reference Hover Pointer",
        "url": "https://magicui.design/docs/components/pointer"
      },
      "usage": "import { Pointer } from \"@/components/pointer\"\n\nexport default function Example() {\n  return (\n    <div className=\"relative\">\n      <Pointer />\n    </div>\n  )\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "...props",
          "type": "HTMLMotionProps<\"div\">",
          "defaultValue": "-",
          "description": "Motion props for wrapper."
        }
      ],
      "registry": {
        "description": "A component that displays a pointer when hovering over an element.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "file-tree",
      "categoryId": "data-status",
      "title": "Collapsible File Tree",
      "description": "파일과 폴더를 선택하고 접을 수 있는 중첩 파일 트리입니다.",
      "reference": {
        "label": "Reference Collapsible File Tree",
        "url": "https://magicui.design/docs/components/file-tree"
      },
      "usage": "import { Tree, type TreeViewElement } from \"@/components/file-tree\"\n\nconst elements: TreeViewElement[] = [\n  {\n    id: \"1\",\n    name: \"app\",\n    children: [\n      { id: \"2\", name: \"page.tsx\" },\n      { id: \"3\", name: \"layout.tsx\" },\n    ],\n  },\n]\n\nexport default function Example() {\n  return <Tree elements={elements} initialExpandedItems={[\"1\"]} />\n}",
      "props": [
        {
          "name": "elements",
          "type": "TreeViewElement[]",
          "defaultValue": "undefined",
          "description": "Tree data rendered recursively."
        },
        {
          "name": "initialSelectedId",
          "type": "string",
          "defaultValue": "undefined",
          "description": "Initially selected file or folder id."
        },
        {
          "name": "initialExpandedItems",
          "type": "string[]",
          "defaultValue": "undefined",
          "description": "Folder ids opened on first render."
        },
        {
          "name": "indicator",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to show nesting guide lines."
        },
        {
          "name": "openIcon",
          "type": "React.ReactNode",
          "defaultValue": "FolderOpenIcon",
          "description": "Icon for expanded folders."
        },
        {
          "name": "closeIcon",
          "type": "React.ReactNode",
          "defaultValue": "FolderIcon",
          "description": "Icon for collapsed folders."
        },
        {
          "name": "sort",
          "type": "TreeSortMode",
          "defaultValue": "\"default\"",
          "description": "Folder/file sorting behavior."
        }
      ],
      "registry": {
        "description": "A nested file tree with selectable files, folders, and collapse controls.",
        "dependencies": [
          "@radix-ui/react-accordion",
          "lucide-react"
        ],
        "cssVars": {
          "theme": {
            "animate-accordion-down": "accordion-down 0.2s ease-out",
            "animate-accordion-up": "accordion-up 0.2s ease-out"
          }
        },
        "css": {
          "@keyframes accordion-down": {
            "from": {
              "height": "0"
            },
            "to": {
              "height": "var(--radix-accordion-content-height)"
            }
          },
          "@keyframes accordion-up": {
            "from": {
              "height": "var(--radix-accordion-content-height)"
            },
            "to": {
              "height": "0"
            }
          }
        }
      }
    },
    {
      "slug": "animated-circular-progress-bar",
      "categoryId": "data-status",
      "title": "Circular Progress Meter",
      "description": "기본 호와 보조 호가 값 변화에 맞춰 움직이는 원형 게이지입니다.",
      "reference": {
        "label": "Reference Circular Progress Meter",
        "url": "https://magicui.design/docs/components/animated-circular-progress-bar"
      },
      "usage": "import { AnimatedCircularProgressBar } from \"@/components/animated-circular-progress-bar\"\n\nexport default function Example() {\n  return (\n    <AnimatedCircularProgressBar\n      value={75}\n      gaugePrimaryColor=\"#18181b\"\n      gaugeSecondaryColor=\"#e4e4e7\"\n    />\n  )\n}",
      "props": [
        {
          "name": "value",
          "type": "number",
          "defaultValue": "0",
          "description": "Current value to display."
        },
        {
          "name": "min",
          "type": "number",
          "defaultValue": "0",
          "description": "Minimum gauge value."
        },
        {
          "name": "max",
          "type": "number",
          "defaultValue": "100",
          "description": "Maximum gauge value."
        },
        {
          "name": "gaugePrimaryColor",
          "type": "string",
          "defaultValue": "-",
          "description": "Primary progress stroke color."
        },
        {
          "name": "gaugeSecondaryColor",
          "type": "string",
          "defaultValue": "-",
          "description": "Secondary track stroke color."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        }
      ],
      "registry": {
        "description": "A circular gauge that animates between values with primary and secondary arcs.",
        "dependencies": []
      }
    },
    {
      "slug": "curved-loop",
      "categoryId": "text-effects",
      "title": "Curved Text Marquee",
      "description": "곡선 경로를 따라 텍스트가 반복되고 드래그로 흐름을 제어할 수 있는 SVG 마키입니다.",
      "reference": {
        "label": "ReactBits Curved Text Marquee",
        "url": "https://reactbits.dev/text-animations/curved-loop"
      },
      "usage": "import { CurvedLoop } from \"@/components/curved-loop\"\n\nexport default function Example() {\n  return (\n    <CurvedLoop\n      marqueeText=\"React Bits ✦ Curved Loop ✦ \"\n      speed={3}\n      curveAmount={120}\n      className=\"text-5xl font-semibold\"\n    />\n  )\n}",
      "props": [
        {
          "name": "marqueeText",
          "type": "string",
          "defaultValue": "\"\"",
          "description": "Text repeated along the curve."
        },
        {
          "name": "speed",
          "type": "number",
          "defaultValue": "2",
          "description": "Loop speed."
        },
        {
          "name": "curveAmount",
          "type": "number",
          "defaultValue": "400",
          "description": "Vertical curve intensity."
        },
        {
          "name": "direction",
          "type": "\"left\" | \"right\"",
          "defaultValue": "\"left\"",
          "description": "Marquee direction."
        },
        {
          "name": "interactive",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether drag controls speed and direction."
        },
        {
          "name": "colors",
          "type": "readonly string[]",
          "defaultValue": "-",
          "description": "Optional SVG gradient colors for the text."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        }
      ],
      "registry": {
        "description": "A draggable SVG text marquee that loops along a curved path.",
        "dependencies": []
      }
    },
    {
      "slug": "click-spark",
      "categoryId": "cursor-interaction-effects",
      "title": "Click Spark Burst",
      "description": "클릭할 때마다 방사형 불꽃이 캔버스 위에 그려지는 효과입니다.",
      "reference": {
        "label": "ReactBits Click Spark Burst",
        "url": "https://reactbits.dev/animations/click-spark"
      },
      "usage": "import { ClickSpark } from \"@/components/click-spark\"\n\nexport default function Example() {\n  return (\n    <ClickSpark sparkColor=\"#5227ff\" sparkRadius={32}>\n      <button>Click for sparks</button>\n    </ClickSpark>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "sparkColor",
          "type": "string",
          "defaultValue": "\"#fff\"",
          "description": "Spark line color."
        },
        {
          "name": "sparkColors",
          "type": "readonly string[]",
          "defaultValue": "-",
          "description": "Optional palette used to randomize each spark color."
        },
        {
          "name": "sparkSize",
          "type": "number",
          "defaultValue": "10",
          "description": "Spark line length."
        },
        {
          "name": "sparkRadius",
          "type": "number",
          "defaultValue": "15",
          "description": "Spark travel distance."
        },
        {
          "name": "sparkCount",
          "type": "number",
          "defaultValue": "8",
          "description": "Number of lines per click."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "400",
          "description": "Spark animation duration in ms."
        }
      ],
      "registry": {
        "description": "A canvas overlay that emits radial sparks from every click.",
        "dependencies": []
      }
    },
    {
      "slug": "magnet",
      "categoryId": "cursor-interaction-effects",
      "title": "Magnetic Hover",
      "description": "호버 시 자식 요소가 포인터 쪽으로 끌려오는 자기장 효과입니다.",
      "hiddenOnMobile": true,
      "reference": {
        "label": "ReactBits Magnetic Hover",
        "url": "https://reactbits.dev/animations/magnet"
      },
      "usage": "import { Magnet } from \"@/components/magnet\"\n\nexport default function Example() {\n  return (\n    <Magnet padding={80} magnetStrength={3}>\n      <button>Magnet</button>\n    </Magnet>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "padding",
          "type": "number",
          "defaultValue": "100",
          "description": "Pointer activation area around the element."
        },
        {
          "name": "disabled",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to disable magnetic movement."
        },
        {
          "name": "magnetStrength",
          "type": "number",
          "defaultValue": "2",
          "description": "How strongly the element follows the pointer."
        },
        {
          "name": "wrapperClassName",
          "type": "string",
          "defaultValue": "\"\"",
          "description": "Classes for the outer wrapper."
        },
        {
          "name": "innerClassName",
          "type": "string",
          "defaultValue": "\"\"",
          "description": "Classes for the moving child wrapper."
        }
      ],
      "registry": {
        "description": "A hover target that pulls its child toward the pointer.",
        "dependencies": []
      }
    },
    {
      "slug": "stack",
      "categoryId": "content-display",
      "title": "Swipe Card Stack",
      "description": "드래그한 카드를 뒤로 보내며 순환시키는 카드 스택입니다.",
      "reference": {
        "label": "ReactBits Swipe Card Stack",
        "url": "https://reactbits.dev/components/stack"
      },
      "usage": "import { Stack } from \"@/components/stack\"\n\nexport default function Example() {\n  return (\n    <div className=\"h-64 w-64\">\n      <Stack randomRotation />\n    </div>\n  )\n}",
      "props": [
        {
          "name": "randomRotation",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to rotate cards randomly."
        },
        {
          "name": "sensitivity",
          "type": "number",
          "defaultValue": "200",
          "description": "Drag distance required to send card back."
        },
        {
          "name": "sendToBackOnClick",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether clicking moves a card back."
        },
        {
          "name": "cards",
          "type": "React.ReactNode[]",
          "defaultValue": "built-in cards",
          "description": "Custom card nodes."
        },
        {
          "name": "autoplay",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether the stack cycles automatically."
        }
      ],
      "registry": {
        "description": "A draggable card stack that sends swiped cards to the back.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "folder",
      "categoryId": "content-display",
      "title": "Expandable Folder",
      "description": "클릭하면 여러 장의 종이 카드가 펼쳐지는 폴더 일러스트입니다.",
      "reference": {
        "label": "ReactBits Expandable Folder",
        "url": "https://reactbits.dev/components/folder"
      },
      "usage": "import { Folder } from \"@/components/folder\"\n\nexport default function Example() {\n  return <Folder color=\"#5227ff\" />\n}",
      "props": [
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"#5227FF\"",
          "description": "Folder base color."
        },
        {
          "name": "size",
          "type": "number",
          "defaultValue": "1",
          "description": "Scale multiplier."
        },
        {
          "name": "items",
          "type": "React.ReactNode[]",
          "defaultValue": "[]",
          "description": "Custom paper content."
        },
        {
          "name": "paperVariant",
          "type": "\"paper\" | \"glass\"",
          "defaultValue": "\"paper\"",
          "description": "Paper surface style."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        }
      ],
      "registry": {
        "description": "A clickable folder illustration that opens layered paper cards.",
        "dependencies": []
      }
    },
    {
      "slug": "carousel",
      "categoryId": "content-display",
      "title": "Card Carousel",
      "description": "드래그와 자동 재생을 지원하는 3D 카드 캐러셀입니다.",
      "reference": {
        "label": "ReactBits Card Carousel",
        "url": "https://reactbits.dev/components/carousel"
      },
      "usage": "import { Carousel } from \"@/components/carousel\"\n\nexport default function Example() {\n  return <Carousel autoplay loop pauseOnHover />\n}",
      "props": [
        {
          "name": "items",
          "type": "CarouselItem[]",
          "defaultValue": "built-in items",
          "description": "Carousel cards."
        },
        {
          "name": "baseWidth",
          "type": "number",
          "defaultValue": "300",
          "description": "Carousel width."
        },
        {
          "name": "autoplay",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to advance automatically."
        },
        {
          "name": "autoplayDelay",
          "type": "number",
          "defaultValue": "3000",
          "description": "Delay between autoplay steps."
        },
        {
          "name": "pauseOnHover",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether hovering pauses autoplay."
        },
        {
          "name": "loop",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether the carousel wraps."
        },
        {
          "name": "round",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to render the round style."
        }
      ],
      "registry": {
        "description": "A draggable, optionally autoplaying 3D card carousel.",
        "dependencies": [
          "motion",
          "react-icons"
        ]
      }
    },
    {
      "slug": "elastic-slider",
      "categoryId": "controls-inputs",
      "title": "Spring Slider",
      "description": "탄성 있는 초과 움직임과 스프링 움직임을 가진 슬라이더입니다.",
      "reference": {
        "label": "ReactBits Spring Slider",
        "url": "https://reactbits.dev/components/elastic-slider"
      },
      "usage": "import { ElasticSlider } from \"@/components/elastic-slider\"\n\nexport default function Example() {\n  return <ElasticSlider defaultValue={45} />\n}",
      "props": [
        {
          "name": "defaultValue",
          "type": "number",
          "defaultValue": "50",
          "description": "Initial slider value."
        },
        {
          "name": "startingValue",
          "type": "number",
          "defaultValue": "0",
          "description": "Minimum value."
        },
        {
          "name": "maxValue",
          "type": "number",
          "defaultValue": "100",
          "description": "Maximum value."
        },
        {
          "name": "isStepped",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to snap to steps."
        },
        {
          "name": "stepSize",
          "type": "number",
          "defaultValue": "1",
          "description": "Value increment when stepped."
        },
        {
          "name": "leftIcon",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Optional left icon."
        },
        {
          "name": "rightIcon",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Optional right icon."
        }
      ],
      "registry": {
        "description": "A slider with elastic overflow and springy thumb movement.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "counter",
      "categoryId": "data-status",
      "title": "Rolling Number Counter",
      "description": "소수점 자리까지 지원하며 숫자가 굴러가듯 바뀌는 카운터입니다.",
      "reference": {
        "label": "ReactBits Rolling Number Counter",
        "url": "https://reactbits.dev/components/counter?value=17.8"
      },
      "usage": "import { useState } from \"react\"\nimport { Counter } from \"@/components/counter\"\n\nexport default function Example() {\n  const [value, setValue] = useState(17.8)\n\n  return (\n    <div>\n      <Counter value={value} />\n      <button\n        type=\"button\"\n        onClick={() => setValue((current) => Number((current - 1).toFixed(1)))}\n      >\n        Decrease\n      </button>\n      <button\n        type=\"button\"\n        onClick={() => setValue((current) => Number((current + 1).toFixed(1)))}\n      >\n        Increase\n      </button>\n    </div>\n  )\n}",
      "props": [
        {
          "name": "value",
          "type": "number",
          "defaultValue": "-",
          "description": "Target number."
        },
        {
          "name": "fontSize",
          "type": "number",
          "defaultValue": "100",
          "description": "Digit font size."
        },
        {
          "name": "places",
          "type": "PlaceValue[]",
          "defaultValue": "auto from value",
          "description": "Displayed integer and decimal places."
        },
        {
          "name": "gap",
          "type": "number",
          "defaultValue": "8",
          "description": "Gap between digit columns."
        },
        {
          "name": "textColor",
          "type": "string",
          "defaultValue": "\"inherit\"",
          "description": "Digit text color."
        },
        {
          "name": "fontWeight",
          "type": "React.CSSProperties[\"fontWeight\"]",
          "defaultValue": "\"inherit\"",
          "description": "Digit weight."
        }
      ],
      "registry": {
        "description": "An animated rolling number counter with decimal place support.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "meteors",
      "categoryId": "background-atmosphere",
      "title": "Meteor Background",
      "description": "화면 위로 유성이 떨어지는 듯한 배경 효과입니다.",
      "reference": {
        "label": "Reference Meteor Background",
        "url": "https://magicui.design/docs/components/meteors"
      },
      "usage": "import { Meteors } from \"@/components/meteors\"\n\nexport default function Example() {\n  return (\n    <div className=\"relative overflow-hidden rounded-xl border p-6\">\n      <Meteors number={20} />\n      Meteors\n    </div>\n  )\n}",
      "props": [
        {
          "name": "number",
          "type": "number",
          "defaultValue": "20",
          "description": "Number of meteors to render."
        },
        {
          "name": "minDelay",
          "type": "number",
          "defaultValue": "0.2",
          "description": "Minimum animation delay."
        },
        {
          "name": "maxDelay",
          "type": "number",
          "defaultValue": "1.2",
          "description": "Maximum animation delay."
        },
        {
          "name": "minDuration",
          "type": "number",
          "defaultValue": "2",
          "description": "Minimum animation duration."
        },
        {
          "name": "maxDuration",
          "type": "number",
          "defaultValue": "10",
          "description": "Maximum animation duration."
        },
        {
          "name": "angle",
          "type": "number",
          "defaultValue": "215",
          "description": "Meteor travel angle."
        }
      ],
      "registry": {
        "description": "A meteor shower effect.",
        "dependencies": [],
        "cssVars": {
          "theme": {
            "animate-meteor": "meteor 5s linear infinite"
          }
        },
        "css": {
          "@keyframes meteor": {
            "0%": {
              "transform": "rotate(var(--angle)) translateX(0)",
              "opacity": "1"
            },
            "70%": {
              "opacity": "1"
            },
            "100%": {
              "transform": "rotate(var(--angle)) translateX(-500px)",
              "opacity": "0"
            }
          }
        }
      }
    },
    {
      "slug": "confetti",
      "categoryId": "cursor-interaction-effects",
      "title": "Confetti Button",
      "description": "완료, 성공, 축하 같은 순간에 짧은 즐거움을 더하는 색종이 효과입니다.",
      "reference": {
        "label": "Reference Confetti Button",
        "url": "https://magicui.design/docs/components/confetti"
      },
      "usage": "import { ConfettiButton } from \"@/components/confetti\"\n\nexport default function Example() {\n  return <ConfettiButton>Celebrate</ConfettiButton>\n}",
      "props": [
        {
          "name": "options",
          "type": "ConfettiOptions",
          "defaultValue": "-",
          "description": "Per-shot confetti options."
        },
        {
          "name": "globalOptions",
          "type": "ConfettiGlobalOptions",
          "defaultValue": "{ resize: true }",
          "description": "Canvas instance options."
        },
        {
          "name": "manualstart",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to start manually."
        },
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        }
      ],
      "registry": {
        "description": "Confetti animations are best used to delight your users when something special happens.",
        "dependencies": [
          "canvas-confetti",
          "@types/canvas-confetti"
        ]
      }
    },
    {
      "slug": "particles",
      "categoryId": "background-atmosphere",
      "title": "Particle Background",
      "description": "깊이감과 움직임, 인터랙션으로 배경에 생동감을 더하는 파티클 효과입니다.",
      "reference": {
        "label": "Reference Particle Background",
        "url": "https://magicui.design/docs/components/particles"
      },
      "usage": "import { Particles } from \"@/components/particles\"\n\nexport default function Example() {\n  return (\n    <div className=\"relative h-64 overflow-hidden rounded-xl border\">\n      <Particles quantity={80} color=\"#38bdf8\" />\n    </div>\n  )\n}",
      "props": [
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "quantity",
          "type": "number",
          "defaultValue": "100",
          "description": "Number of particles."
        },
        {
          "name": "staticity",
          "type": "number",
          "defaultValue": "50",
          "description": "How strongly particles react to pointer movement."
        },
        {
          "name": "ease",
          "type": "number",
          "defaultValue": "50",
          "description": "Pointer easing amount."
        },
        {
          "name": "size",
          "type": "number",
          "defaultValue": "0.4",
          "description": "Base particle size."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"#ffffff\"",
          "description": "Particle color."
        },
        {
          "name": "colors",
          "type": "readonly string[]",
          "defaultValue": "-",
          "description": "Optional particle color palette."
        }
      ],
      "registry": {
        "description": "Particles add visual flair with depth, movement, and interactivity.",
        "dependencies": []
      }
    },
    {
      "slug": "typing-animation",
      "categoryId": "text-effects",
      "title": "Typewriter Text",
      "description": "문자가 타이핑되듯 순서대로 나타나는 텍스트 애니메이션입니다.",
      "reference": {
        "label": "Reference Typewriter Text",
        "url": "https://magicui.design/docs/components/typing-animation"
      },
      "usage": "import { TypingAnimation } from \"@/components/typing-animation\"\n\nexport default function Example() {\n  return <TypingAnimation>Typing Animation</TypingAnimation>\n}",
      "props": [
        {
          "name": "children",
          "type": "string",
          "defaultValue": "-",
          "description": "Text content to type."
        },
        {
          "name": "words",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Rotating words to type."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "100",
          "description": "Character timing."
        },
        {
          "name": "loop",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to loop words."
        },
        {
          "name": "showCursor",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to show cursor."
        }
      ],
      "registry": {
        "description": "Characters appearing in typed animation.",
        "dependencies": [
          "motion"
        ],
        "cssVars": {
          "theme": {
            "animate-blink-cursor": "blink-cursor 1.2s step-end infinite"
          }
        },
        "css": {
          "@keyframes blink-cursor": {
            "0%, 49%": {
              "opacity": "1"
            },
            "50%, 100%": {
              "opacity": "0"
            }
          }
        }
      }
    },
    {
      "slug": "aurora-text",
      "categoryId": "text-effects",
      "title": "Gradient Text",
      "description": "오로라처럼 흐르는 그라데이션을 텍스트에 입히는 효과입니다.",
      "reference": {
        "label": "Reference Gradient Text",
        "url": "https://magicui.design/docs/components/aurora-text"
      },
      "usage": "import { AuroraText } from \"@/components/aurora-text\"\n\nexport default function Example() {\n  return <AuroraText>Aurora Text</AuroraText>\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "colors",
          "type": "string[]",
          "defaultValue": "built-in palette",
          "description": "Gradient colors."
        },
        {
          "name": "speed",
          "type": "number",
          "defaultValue": "1",
          "description": "Animation speed multiplier."
        }
      ],
      "registry": {
        "description": "A beautiful aurora text effect.",
        "dependencies": [],
        "cssVars": {
          "theme": {
            "animate-aurora": "aurora 8s ease-in-out infinite alternate"
          }
        },
        "css": {
          "@keyframes aurora": {
            "0%": {
              "background-position": "0% 50%",
              "transform": "rotate(-5deg) scale(0.9)"
            },
            "25%": {
              "background-position": "50% 100%",
              "transform": "rotate(5deg) scale(1.1)"
            },
            "50%": {
              "background-position": "100% 50%",
              "transform": "rotate(-3deg) scale(0.95)"
            },
            "75%": {
              "background-position": "50% 0%",
              "transform": "rotate(3deg) scale(1.05)"
            },
            "100%": {
              "background-position": "0% 50%",
              "transform": "rotate(-5deg) scale(0.9)"
            }
          }
        }
      }
    },
    {
      "slug": "video-text",
      "categoryId": "text-effects",
      "title": "Video Mask Text",
      "description": "텍스트 마스크 안쪽으로 비디오가 재생되는 타이포그래피 컴포넌트입니다.",
      "reference": {
        "label": "Reference Video Mask Text",
        "url": "https://magicui.design/docs/components/video-text"
      },
      "usage": "import { VideoText } from \"@/components/video-text\"\n\nexport default function Example() {\n  return <VideoText src=\"/videos/demo.mp4\">VIDEO</VideoText>\n}",
      "props": [
        {
          "name": "src",
          "type": "string",
          "defaultValue": "-",
          "description": "Video source URL."
        },
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        },
        {
          "name": "autoPlay",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to autoplay the video."
        },
        {
          "name": "muted",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to mute the video."
        },
        {
          "name": "loop",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to loop the video."
        }
      ],
      "registry": {
        "description": "A component that displays text with a video playing in the background.",
        "dependencies": []
      }
    },
    {
      "slug": "number-ticker",
      "categoryId": "data-status",
      "title": "Animated Number",
      "description": "목표 숫자까지 자연스럽게 증가하거나 감소하는 숫자 애니메이션입니다.",
      "reference": {
        "label": "Reference Animated Number",
        "url": "https://magicui.design/docs/components/number-ticker"
      },
      "usage": "import { NumberTicker } from \"@/components/number-ticker\"\n\nexport default function Example() {\n  return <NumberTicker value={1200} />\n}",
      "props": [
        {
          "name": "value",
          "type": "number",
          "defaultValue": "-",
          "description": "Target number."
        },
        {
          "name": "startValue",
          "type": "number",
          "defaultValue": "0",
          "description": "Initial number."
        },
        {
          "name": "direction",
          "type": "\"up\" | \"down\"",
          "defaultValue": "\"up\"",
          "description": "Count direction."
        },
        {
          "name": "delay",
          "type": "number",
          "defaultValue": "0",
          "description": "Start delay."
        },
        {
          "name": "decimalPlaces",
          "type": "number",
          "defaultValue": "0",
          "description": "Decimal precision."
        }
      ],
      "registry": {
        "description": "Animate numbers to count up or down to a target number.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "dia-text-reveal",
      "categoryId": "text-effects",
      "title": "Color Sweep Text",
      "description": "가로 색상 띠가 텍스트를 지나가며 그라데이션 빛을 드러내는 애니메이션입니다.",
      "reference": {
        "label": "Reference Color Sweep Text",
        "url": "https://magicui.design/docs/components/dia-text-reveal"
      },
      "usage": "import { DiaTextReveal } from \"@/components/dia-text-reveal\"\n\nexport default function Example() {\n  return <DiaTextReveal text=\"Dia Text Reveal\" />\n}",
      "props": [
        {
          "name": "text",
          "type": "string | string[]",
          "defaultValue": "-",
          "description": "Text or rotating texts to reveal."
        },
        {
          "name": "colors",
          "type": "string[]",
          "defaultValue": "built-in palette",
          "description": "Sweep colors."
        },
        {
          "name": "textColor",
          "type": "string",
          "defaultValue": "\"var(--foreground)\"",
          "description": "Final text color."
        },
        {
          "name": "duration",
          "type": "number",
          "defaultValue": "1.5",
          "description": "One sweep duration."
        },
        {
          "name": "repeat",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to repeat text cycling."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        }
      ],
      "registry": {
        "description": "A horizontal color band sweeps across text, revealing a gradient shine before settling on the base color.",
        "dependencies": [
          "motion"
        ]
      }
    },
    {
      "slug": "morphing-text",
      "categoryId": "text-effects",
      "title": "Morphing Word",
      "description": "단어가 흐림과 투명도 변화로 서로 녹아들듯 전환되는 텍스트 컴포넌트입니다.",
      "reference": {
        "label": "Reference Morphing Word",
        "url": "https://magicui.design/docs/components/morphing-text"
      },
      "usage": "import { MorphingText } from \"@/components/morphing-text\"\n\nexport default function Example() {\n  return <MorphingText texts={[\"Design\", \"Code\", \"Ship\"]} />\n}",
      "props": [
        {
          "name": "texts",
          "type": "string[]",
          "defaultValue": "-",
          "description": "Texts to morph between."
        },
        {
          "name": "className",
          "type": "string",
          "defaultValue": "-",
          "description": "Additional classes merged onto the component."
        }
      ],
      "registry": {
        "description": "A dynamic text morphing component.",
        "dependencies": []
      }
    },
    {
      "slug": "highlighter",
      "categoryId": "text-effects",
      "title": "Marker Highlight",
      "description": "사람이 직접 그은 마커 획처럼 텍스트를 밑줄 또는 형광펜으로 강조합니다.",
      "reference": {
        "label": "Reference Marker Highlight",
        "url": "https://magicui.design/docs/components/highlighter"
      },
      "usage": "import { Highlighter } from \"@/components/highlighter\"\n\nexport default function Example() {\n  return (\n    <Highlighter color=\"#fde68a\" padding={6}>\n      Highlighter\n    </Highlighter>\n  )\n}",
      "props": [
        {
          "name": "children",
          "type": "React.ReactNode",
          "defaultValue": "-",
          "description": "Content rendered inside the component."
        },
        {
          "name": "action",
          "type": "AnnotationAction",
          "defaultValue": "\"highlight\"",
          "description": "Annotation style."
        },
        {
          "name": "color",
          "type": "string",
          "defaultValue": "\"#ffd1dc\"",
          "description": "Annotation color."
        },
        {
          "name": "strokeWidth",
          "type": "number",
          "defaultValue": "1.5",
          "description": "Stroke width."
        },
        {
          "name": "animationDuration",
          "type": "number",
          "defaultValue": "600",
          "description": "Draw animation duration."
        },
        {
          "name": "iterations",
          "type": "number",
          "defaultValue": "2",
          "description": "Number of rough-notation strokes."
        },
        {
          "name": "padding",
          "type": "number",
          "defaultValue": "2",
          "description": "Annotation padding around the text."
        },
        {
          "name": "multiline",
          "type": "boolean",
          "defaultValue": "true",
          "description": "Whether to annotate wrapped lines."
        },
        {
          "name": "isView",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to start when in view."
        },
        {
          "name": "repeat",
          "type": "boolean",
          "defaultValue": "false",
          "description": "Whether to replay the draw animation."
        },
        {
          "name": "repeatDelay",
          "type": "number",
          "defaultValue": "1800",
          "description": "Delay between repeated draw animations."
        }
      ],
      "registry": {
        "description": "A text highlighter that mimics the effect of a human-drawn marker stroke.",
        "dependencies": [
          "motion",
          "rough-notation"
        ]
      }
    }
  ]
)
