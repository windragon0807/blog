# Blog Design System

## 1. Atmosphere & Identity

Quiet technical workspace with a personal portfolio edge. The signature is restrained density: compact controls, neutral surfaces, soft dark-mode depth, and small interaction details that make utility screens feel cared for without turning them into marketing pages.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | `--background` | `#ffffff` | `#171a23` | Page background |
| Text/primary | `--foreground` | `#171717` | `#f1f4fb` | Main body and headings |
| Surface/card | `--card` | `rgba(255,255,255,0.95)` | `rgba(24,28,38,0.95)` | Cards and panels |
| Text/muted | `--muted-foreground` | `#71717a` | `#a1a1aa` | Secondary text |
| Border/default | `--border` | `rgba(228,228,231,0.9)` | `rgba(82,82,91,0.78)` | Separators and outlines |
| Focus/ring | `--ring` | `#a1a1aa` | `#71717a` | Focus rings |

### Rules

- Prefer existing Tailwind zinc and theme tokens already mapped in `src/app/globals.css`.
- Use collection artwork colors as content, not as global UI accents.
- Add new semantic tokens before adding a new repeated color role.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Section/title | `1.875rem` | 800-900 | 1 | 0 | Compact page and tool headers |
| H3/compact title | `1.375rem` | 700-900 | 1.1-1.4 | 0 | Dense panel titles |
| Body | `1rem` | 400-600 | 1.5-1.6 | 0 | Default readable text |
| Body/sm | `0.875rem` | 400-700 | 1.5 | 0 | Controls and metadata |
| Caption | `0.75rem` | 500-700 | 1.4 | 0 | Labels and helper text |

### Font Stack

- Primary: `var(--font-user)`, defaulting to Pretendard and system Korean sans-serif.
- Mono: `var(--font-geist-mono)` where code surfaces need it.

### Rules

- Do not scale type directly with viewport width.
- Keep letter spacing at `0` unless an existing component already has a deliberate tighter setting.

## 4. Spacing & Layout

### Base Unit

All spacing derives from a 4px base.

| Token | Value | Usage |
| --- | --- | --- |
| `--space-1` | 4px | Tight icon and label separation |
| `--space-2` | 8px | Compact groups |
| `--space-3` | 12px | Control padding |
| `--space-4` | 16px | Standard content spacing |
| `--space-6` | 24px | Section spacing on mobile |
| `--space-8` | 32px | Major compact section separation |

### Grid

- Max content width: 1180px on the emoticon page.
- Breakpoints follow Tailwind defaults: `sm`, `md`, `lg`, `xl`, `2xl`.

### Rules

- Use stable dimensions for tabs, icon buttons, grids, and virtualized rows.
- Keep fixed-format controls from resizing during hover, active, loading, and selected states.

## 5. Components

### Emoticon Collection Tab

- **Structure**: `<button role="tab">` containing a logo mark and text label.
- **Variants**: active, inactive, inactive hover, focus-visible.
- **Spacing**: compact inline gap of 6-8px; mobile type stays within 32px tab height.
- **States**: active uses full text and full-color logo; inactive uses muted text and a grayscale logo; hover previews slightly stronger text and logo color.
- **Accessibility**: `aria-selected` reflects state; focus-visible keeps the zinc ring.
- **Motion**: click state changes are immediate; hover keeps the muted-to-preview visual response without transition animation.

## 6. Motion & Interaction

### Timing

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | 100-180ms | `ease-out` | Press and feedback |
| Standard | 200-300ms | `cubic-bezier(0.22,1,0.36,1)` | Panels and button feedback |
| Emphasis | None | n/a | Emoticon collection tab click changes |

### Rules

- Animate compositor-friendly properties first when motion is used elsewhere: `opacity` and `transform`.
- Do not animate frequently clicked tab logos.
- Respect `prefers-reduced-motion` with shorter durations rather than abrupt removal when state comprehension depends on the transition.

## 7. Depth & Surface

### Strategy

Mixed: dense application surfaces use tonal shifts and light borders; overlays and action panels may use restrained shadows.

| Level | Value | Usage |
| --- | --- | --- |
| Subtle | `border-zinc-200/800` or tonal background | Inline controls and separators |
| Default | Soft panel shadow already present in local components | Popovers, sheets, action panels |

### Rules

- Avoid adding decorative cards around full-page tool sections.
- Preserve the existing quiet, utilitarian page structure for `/emoticons`.
