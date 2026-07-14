---
name: "Ryong Blog Design System"
version: alpha
description: "Code-grounded Phase 05 project design layer for the existing Ryong blog UI; documentation only, with no visual normalization implied."
sources:
  schema: "Phase 05 project schema"
  globalsCss: "src/app/globals.css"
  globalsCssSha256: "223a7733aa1a1d1db85dba5c10bbdc83322ec564f5133e46f27a274bb99523f7"
  componentRoots: ["src/components/ui", "src/components/common", "src/components", "src/features"]
colors:
  semantic:
    background: { cssVariable: "--background", light: "#ffffff", dark: "#171a23" }
    foreground: { cssVariable: "--foreground", light: "#171717", dark: "#f1f4fb" }
    card: { cssVariable: "--card", light: "rgba(255, 255, 255, 0.95)", dark: "rgba(24, 28, 38, 0.95)" }
    card-foreground: { cssVariable: "--card-foreground", light: "#171717", dark: "#f4f4f5" }
    popover: { cssVariable: "--popover", light: "rgba(255, 255, 255, 0.96)", dark: "rgba(24, 28, 38, 0.97)" }
    popover-foreground: { cssVariable: "--popover-foreground", light: "#18181b", dark: "#f4f4f5" }
    primary: { cssVariable: "--primary", light: "#18181b", dark: "#f4f4f5" }
    primary-foreground: { cssVariable: "--primary-foreground", light: "#fafafa", dark: "#18181b" }
    secondary: { cssVariable: "--secondary", light: "#f4f4f5", dark: "rgba(63, 63, 70, 0.75)" }
    secondary-foreground: { cssVariable: "--secondary-foreground", light: "#27272a", dark: "#f4f4f5" }
    muted: { cssVariable: "--muted", light: "#f4f4f5", dark: "rgba(63, 63, 70, 0.75)" }
    muted-foreground: { cssVariable: "--muted-foreground", light: "#71717a", dark: "#a1a1aa" }
    accent: { cssVariable: "--accent", light: "#f4f4f5", dark: "rgba(63, 63, 70, 0.78)" }
    accent-foreground: { cssVariable: "--accent-foreground", light: "#18181b", dark: "#fafafa" }
    destructive: { cssVariable: "--destructive", light: "#e11d48", dark: "#fb7185" }
    destructive-foreground: { cssVariable: "--destructive-foreground", light: "#ffffff", dark: "#18181b" }
    border: { cssVariable: "--border", light: "rgba(228, 228, 231, 0.9)", dark: "rgba(82, 82, 91, 0.78)" }
    input: { cssVariable: "--input", light: "rgba(212, 212, 216, 0.92)", dark: "rgba(82, 82, 91, 0.82)" }
    ring: { cssVariable: "--ring", light: "#a1a1aa", dark: "#71717a" }
    chart-1: { cssVariable: "--chart-1", light: "#2563eb", dark: "#60a5fa" }
    chart-2: { cssVariable: "--chart-2", light: "#10b981", dark: "#34d399" }
    chart-3: { cssVariable: "--chart-3", light: "#f59e0b", dark: "#fbbf24" }
    chart-4: { cssVariable: "--chart-4", light: "#e11d48", dark: "#fb7185" }
    chart-5: { cssVariable: "--chart-5", light: "#8b5cf6", dark: "#a78bfa" }
    sidebar: { cssVariable: "--sidebar", light: "#fafafa", dark: "#181c26" }
    sidebar-foreground: { cssVariable: "--sidebar-foreground", light: "#18181b", dark: "#f4f4f5" }
    sidebar-primary: { cssVariable: "--sidebar-primary", light: "#18181b", dark: "#f4f4f5" }
    sidebar-primary-foreground: { cssVariable: "--sidebar-primary-foreground", light: "#fafafa", dark: "#18181b" }
    sidebar-accent: { cssVariable: "--sidebar-accent", light: "#f4f4f5", dark: "rgba(63, 63, 70, 0.78)" }
    sidebar-accent-foreground: { cssVariable: "--sidebar-accent-foreground", light: "#18181b", dark: "#fafafa" }
    sidebar-border: { cssVariable: "--sidebar-border", light: "rgba(228, 228, 231, 0.9)", dark: "rgba(82, 82, 91, 0.78)" }
    sidebar-ring: { cssVariable: "--sidebar-ring", light: "#a1a1aa", dark: "#71717a" }
  scrollbar:
    scrollbar-thumb: { cssVariable: "--scrollbar-thumb", light: "rgba(39, 39, 42, 0.34)", dark: "rgba(212, 212, 216, 0.36)" }
    scrollbar-thumb-hover: { cssVariable: "--scrollbar-thumb-hover", light: "rgba(39, 39, 42, 0.52)", dark: "rgba(228, 228, 231, 0.58)" }
    scrollbar-thumb-active: { cssVariable: "--scrollbar-thumb-active", light: "rgba(39, 39, 42, 0.66)", dark: "rgba(244, 244, 245, 0.72)" }
    scrollbar-track: { cssVariable: "--scrollbar-track", light: "rgba(244, 244, 245, 0.72)", dark: "rgba(39, 39, 42, 0.44)" }
    scrollbar-track-hover: { cssVariable: "--scrollbar-track-hover", light: "rgba(228, 228, 231, 0.88)", dark: "rgba(63, 63, 70, 0.68)" }
  runtime:
    themeAccentCurrent: { cssVariable: "--theme-accent-current", light: "var(--theme-accent)", dark: "var(--theme-accent-dark)" }
typography:
  userFontVariable: "--font-user"
  defaultTheme: "pretendard"
  fontStacks:
    pretendard: "Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    maplestory: "'Maplestory OTF', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    hancomMalangMalang: "'Hancom MalangMalang', Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Noto Sans KR', 'Segoe UI', sans-serif"
    geistSans: "var(--font-geist-sans)"
    geistMono: "var(--font-geist-mono)"
spacing:
  baseUnit: "4px"
  cssVariables: false
  source: "Tailwind CSS v4 numeric utility scale; literal feature geometry remains local"
  implementedScale:
    "0.5": "2px"
    "1": "4px"
    "1.5": "6px"
    "2": "8px"
    "2.5": "10px"
    "3": "12px"
    "4": "16px"
    "5": "20px"
    "6": "24px"
    "8": "32px"
    "10": "40px"
    "12": "48px"
rounded:
  base: { cssVariable: "--radius", value: "0.625rem" }
  sm: "calc(var(--radius) - 4px)"
  md: "calc(var(--radius) - 2px)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) + 4px)"
  "2xl": "calc(var(--radius) + 10px)"
motion:
  headerAurora: "6.5s ease-in-out infinite"
  componentSheetOpen: "260ms cubic-bezier(0.22, 1, 0.36, 1) both"
  notionToggleSize: "280ms cubic-bezier(0.22, 1, 0.36, 1)"
  postCardEnter: "560ms cubic-bezier(0.22, 1, 0.36, 1) backwards"
  settingsOpen: "210ms cubic-bezier(0.22, 1, 0.36, 1) both"
  lightboxPanel: "320ms cubic-bezier(0.22, 1, 0.36, 1)"
  copyFeedback: "220ms cubic-bezier(0.22, 1, 0.36, 1)"
  reducedSettings: "90ms ease both"
components:
  uiPrimitives: [Badge, Button, Dialog, Popover, ScrollArea, Select, Separator, Skeleton, Tooltip]
  commonComposites: [ActionLink, EmptyState, FilterChip, IconButton, SettingsSection, StatusNotice, Surface]
  button:
    source: "src/components/ui/button.tsx"
    dataSlot: "button"
    variants: [default, secondary, outline, ghost, glass, iconGlass, subtle, danger]
    sizes: [default, sm, lg, icon, iconSm, iconLg]
  badge:
    source: "src/components/ui/badge.tsx"
    dataSlot: "badge"
    variants: [default, secondary, outline, tag, series, count]
  registry:
    source: "src/features/component-library/component-manifest.mjs"
    publicEntries: 46
---

# Ryong Blog Design System

이 문서는 현재 제품 코드에서 역추출한 Phase 05 project schema다. 프로젝트의 실제 구현을 설명하지만, 공식 upstream 형식에 완전히 부합한다고 주장하지 않는다. 문서화 자체는 CSS, DOM, class, copy, focus appearance, motion, route 또는 public contract를 바꾸지 않는다.

## Overview

사이트의 기본 인상은 조용한 기술 블로그와 개인 도구함의 결합이다. 밝고 어두운 중성 surface, 작은 radius 차이, 제한된 glass depth, 기능별 motion이 공존한다. 하나의 완전히 균질한 시각 체계가 아니라 Blog shell을 중심으로 component registry, emoticon workspace, Resume/PDF가 각자의 제약을 가진 visual island로 연결된 구조다.

현재 source of truth는 `src/app/globals.css`, `src/components/ui`, `src/components/common`, site-level `src/components`, feature-local `src/features`다. 이 문서는 해당 코드를 설명하는 design layer이며 아직 literal value를 새 token으로 치환하는 migration contract가 아니다.

## Colors

### Semantic pairs

Front matter의 `colors.semantic`은 `:root`와 `html.dark`에 구현된 32개 light/dark pair를 CSS spelling 그대로 기록한다. Tailwind의 `@theme inline`은 이들을 `--color-background`, `--color-card`, `--color-ring`, chart/sidebar aliases 등으로 연결한다. component는 semantic utilities와 feature-local zinc/blue/emerald/rose literal utility를 함께 사용한다. 후자는 이미 구현된 경계이며 이 단계에서 통합하거나 새 global token으로 승격하지 않는다.

### Blog and scrollbar runtime

Blog accent, selection, reading progress, quote rail, inline code 색은 `src/lib/blogThemes.ts`의 10개 palette가 boot script를 통해 `--theme-*` 속성에 주입한다. 기본 Ink 값은 globals의 fallback과 일치한다. `--theme-accent-current`는 light에서 `var(--theme-accent)`, dark에서 `var(--theme-accent-dark)`를 가리킨다.

Scrollbar는 front matter의 5개 light/dark pair와 `prefers-contrast: more`의 흑백 override를 사용한다. OverlayScrollbars는 `--os-*` runtime custom properties를 소비하고 native scrollbar는 같은 semantic scrollbar pair를 사용한다.

## Typography

`body`는 `--font-user`를 사용한다. 기본 Pretendard stack과 선택 가능한 Maplestory OTF, Hancom MalangMalang stack은 front matter에 source spelling 그대로 기록했다. Maplestory OTF와 Hancom MalangMalang은 각각 400/700 `@font-face`가 있고 모두 `font-display: swap`이다.

`src/app/layout.tsx`는 Geist와 Geist Mono를 각각 `--font-geist-sans`, `--font-geist-mono`로 제공한다. 현재 Tailwind `--font-sans`와 `--font-mono` alias가 이 두 변수를 가리키며, code/registry surface는 `font-mono`를 사용한다. 사용자 본문 font 선택과 code mono font는 소유권이 다르다.

크기와 weight는 shared typography primitive 하나로 통합돼 있지 않다. 기본 shell은 Tailwind scale을 사용하고 component docs, emoticon, Notion post, Resume가 local typography를 가진다. Resume 문서는 global font choice를 상속하지 않는 fixed-output island다.

## Layout

기본 `main`은 `max-w-3xl`, 중앙 정렬, `px-4`, `pt-8`, `pb-16`이다. 홈, portfolio, series, tag, loading surface의 넓은 목록 grid는 반복해서 `1200px`와 viewport inset을 결합한다.

Component docs는 desktop에서 `1380px` 기준 grid를 사용한다. sidebar `17rem`, gap `2rem`, 좌우 reserve를 뺀 content width를 계산하며, mobile에서는 `h-[min(82svh,40rem)]` bottom sheet로 전환한다.

Emoticon workspace의 exact source sentinel은 `w-[min(1180px,calc(100vw-3rem))] sm:w-[min(1180px,calc(100vw-2rem))]`이며, 두 번째 class가 `sm` 이상에서 viewport inset을 override한다.

Resume는 `RESUME_DOCUMENT_WIDTH 595`, `RESUME_DOCUMENT_HEIGHT 2720`의 고정 문서를 생성한다. preview는 `RESUME_PREVIEW_MAX_WIDTH 1000`까지 scale하고 PDF는 별도의 A4 point 상수와 4-page contract를 사용한다. 이 수치는 일반 page grid token이 아니다.

Spacing은 Tailwind CSS v4의 4px numeric scale을 기본으로 한다. `gap-1.5`의 6px, `p-2.5`의 10px처럼 fractional utilities도 실제로 사용한다. 별도 spacing custom property layer는 존재하지 않으며 feature geometry의 11px, 18px, 28px, 42px, 595px 같은 literal은 현재 ownership에 남는다.

## Elevation & Depth

Depth 전략은 mixed다. 기본 Surface와 CardShell은 border, translucent background, layered inset/drop shadow, backdrop filter를 결합한다. Header는 `.glass-surface.header-sticky`의 별도 pseudo-element와 30px/32px blur layer를 사용한다. active route는 header aurora gradient ring과 icon gradient를 가진다.

Overlay 계층은 Radix Dialog/Popover/Select, component mobile sheet, settings popover, Notion lightbox가 각자의 z-index와 shadow를 유지한다. component registry demo와 emoticon action sheet의 depth는 shared Surface로 강제 통합하지 않는다.

## Shapes

Global radius base는 `--radius: 0.625rem`이다. `@theme inline`의 alias는 `sm = base - 4px`, `md = base - 2px`, `lg = base`, `xl = base + 4px`, `2xl = base + 10px`다. 실제 UI는 이 aliases 외에도 pills `999px`, component sheet `28px`, feature-local rounded utilities를 사용한다.

Literal shape를 semantic alias로 바꾸는 것은 cascade와 pixel output을 바꿀 수 있으므로 이 문서는 현재 차이를 보존한다. Resume profile/photo/link geometry와 registry preview shape도 각 visual island가 소유한다.

## Components

### Shared hierarchy

`src/components/ui`의 9개 primitive는 Badge, Button, Dialog, Popover, ScrollArea, Select, Separator, Skeleton, Tooltip이다. Button과 Badge만 CVA variant contract를 가진다. Button은 8 variants(`default`, `secondary`, `outline`, `ghost`, `glass`, `iconGlass`, `subtle`, `danger`)와 6 sizes(`default`, `sm`, `lg`, `icon`, `iconSm`, `iconLg`)다. Badge는 6 variants(`default`, `secondary`, `outline`, `tag`, `series`, `count`)다.

Dialog, Popover, Select는 Radix adapters다. root/trigger/portal/content/item처럼 library semantics를 유지하며 `data-state`, `data-side`, `data-disabled`, `data-highlighted`, `data-placeholder`에 시각 상태가 연결된다. Separator는 `data-orientation`, ScrollArea는 `data-slot="scroll-area"`와 OverlayScrollbars runtime attributes를 유지한다. Button과 Badge는 각각 `data-slot="button"`, `data-slot="badge"`를 public styling hook으로 제공한다.

`src/components/common`의 7개 module이 노출하는 primary composite/adapter는 ActionLink, EmptyState, FilterChip, IconButton, SettingsSection, StatusNotice, Surface다. `ActionControl.tsx`가 ActionLink를 export하고, Surface 파일은 `Surface`와 semantic `<article>`인 `CardShell`을 함께 제공한다. IconButton은 label/optional tooltip을 조합하고, site-level `IconControlButton`과 HeaderControl styling이 이를 확장한다. FilterChip, StatusNotice, EmptyState는 목록 탐색과 feedback를 담당한다.

### Site and feature ownership

Header는 `<header>`, label이 있는 `<nav>`, grouped controls, `aria-current="page"` links를 사용한다. active Header link는 Button으로 바꾸지 않는다. AppLauncherMenu, ThemeModeButton, ThemeSettingsMenu는 각각 Radix/state semantics와 site-level control style을 유지한다.

Component registry는 canonical manifest와 46개 public `/r/*.json`을 public contract로 가진다. 46 preview renderer는 static slug registry와 분리 module을 사용한다. registry demo component를 shared product primitive로 자동 승격하거나 demo-specific visual language를 Blog shell에 적용하지 않는다.

Notion table은 registry/public DataTable과 통합하지 않는다. Emoticon custom action sheet는 generic Dialog와 통합하지 않는다. Resume typography/style은 global system으로 이관하지 않는다. 이 경계는 중복 제거보다 DOM, keyboard, public JSON, PDF pixel fidelity를 우선한다.

## Do's and Don'ts

- 기존 semantic token과 owner component를 먼저 재사용한다.
- 새 반복 pattern이 실제로 생긴 뒤에만 문서와 component boundary를 함께 갱신한다.
- semantic HTML, existing ARIA, keyboard interaction, reduced-motion behavior를 보존한다.
- active/open/selected/loading state의 `data-*`와 `aria-*` public hook을 임의로 이름 변경하지 않는다.
- focus appearance를 global rule로 정규화하지 않는다.
- literal value를 같은 값의 새 token으로 포장했다는 이유만으로 migration하지 않는다.
- Registry demo, Notion renderer, emoticon workspace, Resume/PDF를 모양이 비슷하다는 이유로 통합하지 않는다.
- `@layer`, specificity, source order 또는 authored `!important`를 문서 정리와 함께 변경하지 않는다.

## Motion & Interaction

Motion ownership은 feature별이다. Header active aurora는 6.5s infinite flow이며 reduced motion에서 정지한다. Post cards는 560ms enter, post hero는 420–560ms stagger, TOC rail은 180–240ms transition을 사용한다. Notion toggle은 280ms block-size와 200ms opacity를 사용하며 reduced motion에서 transition을 제거한다.

Component mobile sheet는 180ms exit와 260ms enter, settings popover는 140ms close와 210ms open, settings item은 160ms transition을 사용한다. Lightbox는 overlay 220–240ms, panel 260–320ms, controls 260ms다. Copy feedback는 180–220ms다. Emoticon action/button motion은 workspace가 소유한다.

최종 `prefers-reduced-motion` override는 post/card/hero, TOC, component sheet, lightbox, copy feedback의 animation/transition을 제거한다. Settings popover와 settings/header controls는 state comprehension을 위해 90ms를 유지한다. 이 90ms exception은 의도된 현재 동작이며 0ms로 정규화하지 않는다. `prefers-contrast: more`는 motion이 아니라 scrollbar token override다.

## Accessibility & Semantics

현재 focus 표현은 하나로 통일돼 있지 않다. Button과 HeaderControl은 `focus-visible:ring-2`; ScrollArea는 3px ring과 1px outline; SelectTrigger는 `focus:ring-2`; Dialog close는 `focus:ring-2`; component docs links/tabs/sidebar는 explicit 2px outline; emoticon controls는 local zinc/emerald/rose ring; active Header route는 visible ring을 0으로 만든다. Resume link는 CSS Module pseudo-element와 outline을 사용한다. 문서는 이 차이를 사실대로 기록하며 global focus ring을 추가, 제거, 굵기 변경하지 않는다.

Landmarks와 semantics는 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, headings, `<details>/<summary>`, tables, buttons, links를 각 기능에 맞게 유지한다. State contracts에는 `aria-current`, `aria-selected`, `aria-pressed`, `aria-expanded`, `aria-checked`, `aria-busy`, `aria-modal`, `aria-labelledby`, `role="tab"`, `role="tabpanel"`, `role="dialog"`, `role="spinbutton"`이 포함된다. Icon-only control은 visible text 또는 `aria-label`/`sr-only` name을 유지하고 decorative icon은 `aria-hidden`을 사용한다.

Keyboard behavior는 native elements와 Radix semantics를 우선한다. Dialog/lightbox close, tabs, menu, spinbutton, toggle/switch의 기존 key handling과 focus order를 보존한다. Phase 05의 accessibility overlay는 code-grounded inventory이며 visible UI/UX 변경을 허가하지 않는다.

## Ownership & Visual Islands

- Blog shell: root theme/font boot, Header, `max-w-3xl` main, 1200px post grids, PostCard/CardShell, Notion article.
- Component registry: 1380px desktop shell, mobile DialogRawContent sheet, component docs, preview demo surface, static 46-slug registry/public JSON.
- Emoticon workspace: 1180px container, virtualized/interaction-heavy storage UI, custom tabs/categories/action sheet and feedback timing.
- Resume/PDF: 595 2720 fixed document, preview 1000px cap, `ResumeDocument.module.css`, PDF capture/text/annotation pipeline.

Shared primitive adoption stops where it would change DOM, class order, focus, animation, PDF output, registry payload or feature-specific interaction. Visual similarity alone is not sufficient evidence to merge ownership.

## Runtime Contracts & Exceptions

`src/app/globals.css` remains the only stylesheet imported by root layout. Tailwind의 compiled internals는 `theme`, `base`, `utilities` cascade layers에 들어가고, project-authored app custom CSS는 authored `@layer` wrapper 없이 unlayered 상태라 layered rules와 다른 더 높은 layer precedence를 가진다. Phase 05는 외부 import와 순서를 보존하며 `@layer`, specificity, source order를 바꾸지 않는다.

Runtime/external custom properties are contracts, not missing design tokens: Radix transform origins and trigger dimensions, OverlayScrollbars `--os-*`, Shiki `--shiki-*`, registry component variables such as duration/gap/angle, theme boot `--theme-*`, and inline geometry from client interaction code.

Exceptions intentionally outside global extraction:

- `ResumeDocument.module.css`: fixed PDF/visual output island.
- `CODE_THEME_STYLE_TEXT`: 64 code themes × 2 selectors dynamically injected in `<head>`; globals only owns no-selection fallback.
- `src/components/3d-image-carousel.tsx`: embedded preview CSS with local responsive geometry.
- JSX inline styles: runtime geometry, animation coordinates, PDF scale, image positioning and component demos.
- Library CSS: Pretendard, OverlayScrollbars, Tailwind and `tw-animate-css` import order remains external contract.

## Verification Contract

Documentation claims must stay source-backed. The local Phase 05 design contract parses duplicate-safe YAML, checks section order, derives color key sets and values through PostCSS, derives CVA variants/JSX `data-slot`/exports through the TypeScript compiler AST, verifies exact UI/common file inventories and 46 manifest/public registry entries, and rejects assistant-directed instruction text or invented spacing variables while allowing fenced examples and explicit security prohibitions.

Pixel, DOM, copy, focus, motion and responsive preservation remain governed by source parity, protected snapshot, computed-style/CSSOM/state characterization and existing browser tests. This document does not replace rendered verification and must not be used to accept a visual difference.
