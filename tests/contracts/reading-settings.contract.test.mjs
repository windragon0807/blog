import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const read = (path) => readFileSync(join(root, path), 'utf8')

test('설정은 간결한 헤더를 가진 반응형 Drawer를 사용한다', () => {
  const menu = read('src/components/ThemeSettingsMenu.tsx')
  const drawer = read('src/components/ui/drawer.tsx')
  const scrollbars = read('src/lib/scrollbars.ts')

  assert.match(menu, /<Drawer open=\{open\} onOpenChange=\{setOpen\}>/)
  assert.match(menu, /<DrawerTitle>설정<\/DrawerTitle>/)
  assert.doesNotMatch(menu, /색상과 글꼴, 읽기 환경을 조정합니다\./)
  assert.doesNotMatch(menu, /<DrawerDescription/)
  assert.match(menu, /settings-drawer-scroll/)
  assert.match(menu, /import \{ ScrollArea \} from '@\/components\/ui\/scroll-area'/)
  assert.match(menu, /<ScrollArea/)
  assert.match(menu, /data-lenis-prevent=""/)
  assert.match(menu, /aria-describedby=\{undefined\}/)
  assert.doesNotMatch(menu, /mx-auto mt-2 h-1 w-10/)
  assert.doesNotMatch(menu, /기본 설정으로 되돌리기/)
  assert.doesNotMatch(menu, /handleReset/)
  assert.match(menu, /size-9/)
  assert.match(menu, /after:-inset-1/)
  assert.doesNotMatch(menu, /<Popover/)

  assert.match(drawer, /@radix-ui\/react-dialog/)
  assert.match(drawer, /data-slot="drawer-overlay"/)
  assert.match(drawer, /data-slot="drawer-content"/)
  assert.match(drawer, /settings-drawer-overlay/)
  assert.match(drawer, /settings-drawer-panel/)
  assert.match(scrollbars, /APP_SCROLLBAR_OPTIONS/)
  assert.match(scrollbars, /autoHide: 'scroll'/)
  assert.match(scrollbars, /autoHideDelay: 640/)
})

test('색상 설정은 전체 팔레트와 HEX 입력, 프리셋을 제공하고 최근 색상은 저장하지 않는다', () => {
  const select = read('src/components/BlogThemeSelect.tsx')
  const picker = read('src/components/ui/color-picker.tsx')
  const settings = read('src/app/styles/settings.css')
  const themes = read('src/lib/blogThemes.ts')
  const layout = read('src/app/layout.tsx')

  assert.doesNotMatch(select, /type="color"/)
  assert.match(select, /import \{ ColorPicker \} from '@\/components\/ui\/color-picker'/)
  assert.match(select, /<ColorPicker/)
  assert.match(select, /aria-label="색상 팔레트 열기"/)
  assert.match(select, /직접 색상/)
  assert.match(select, /팔레트 열기/)
  assert.match(select, /aria-label="HEX 색상 값"/)
  assert.doesNotMatch(select, /최근 사용/)
  assert.doesNotMatch(select, /BLOG_THEME_RECENT_COLORS_STORAGE_KEY/)
  assert.doesNotMatch(select, /MAX_RECENT_BLOG_THEME_COLORS/)
  assert.doesNotMatch(select, /saveRecentColors/)
  assert.doesNotMatch(themes, /BLOG_THEME_RECENT_COLORS_STORAGE_KEY/)
  assert.doesNotMatch(themes, /MAX_RECENT_BLOG_THEME_COLORS/)
  assert.match(select, /BLOG_THEME_OPTIONS\.map/)
  assert.match(select, /BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY/)
  assert.match(themes, /createCustomBlogThemePalette/)
  assert.match(themes, /ensureContrast/)
  assert.match(themes, /MINIMUM_TEXT_CONTRAST = 4\.5/)
  assert.match(themes, /isHexColor/)
  assert.match(layout, /BLOG_THEME_CUSTOM_COLOR_STORAGE_KEY/)
  assert.match(layout, /BLOG_THEME_STORAGE_KEY/)
  assert.match(layout, /BLOG_THEME_USER_SET_STORAGE_KEY/)
  assert.match(layout, /CODE_THEME_STORAGE_KEY/)
  assert.match(layout, /FONT_THEME_STORAGE_KEY/)
  assert.match(layout, /createCustomPalette/)
  assert.match(layout, /ensureContrast/)
  assert.match(picker, /aria-label="채도와 명도"/)
  assert.match(picker, /aria-label="색조"/)
  assert.match(picker, /aria-label="컬러 피커 HEX 값"/)
  assert.doesNotMatch(picker, /type="color"/)
  assert.doesNotMatch(picker, /color-picker-saturation[^\n]*\bborder\b/)
  assert.doesNotMatch(picker, /color-picker-saturation[^\n]*shadow-inner/)
  assert.doesNotMatch(picker, /color-picker-saturation[^\n]*focus-visible:ring/)
  assert.match(settings, /\.color-picker-saturation\s*\{[\s\S]*?box-shadow:\s*inset/)
  assert.match(settings, /\.color-picker-saturation:focus-visible\s*\{[\s\S]*?box-shadow:\s*inset/)
})

test('설정 초기화 이벤트와 저장소 일괄 삭제 로직은 남지 않는다', () => {
  const files = [
    'src/components/ThemeSettingsMenu.tsx',
    'src/components/BlogThemeSelect.tsx',
    'src/components/CodeThemeSelect.tsx',
    'src/components/FontThemeSelect.tsx',
    'src/components/ReadingPreferencesControls.tsx',
    'src/lib/readingPreferences.ts',
  ]
  const source = files.map(read).join('\n')

  assert.doesNotMatch(source, /SETTINGS_RESET_EVENT/)
  assert.doesNotMatch(source, /dispatchSettingsReset/)
  assert.doesNotMatch(source, /clearAllSettingsStorage/)
  assert.equal(existsSync(join(root, 'src/lib/settingsEvents.ts')), false)
})

test('Drawer는 상세 읽기 설정을 모두 제공한다', () => {
  const menu = read('src/components/ThemeSettingsMenu.tsx')
  const controls = read('src/components/ReadingPreferencesControls.tsx')
  const segmented = read('src/components/ui/segmented-control.tsx')
  const settings = read('src/app/styles/settings.css')

  for (const label of ['색상', '글꼴', '글꼴 굵기', '글자 크기', '줄 간격', '코드 블럭', '접근성']) {
    assert.match(`${menu}\n${controls}`, new RegExp(label))
  }

  assert.match(controls, /<SegmentedControl/)
  assert.match(controls, /label="글자 크기"/)
  assert.match(controls, /label="줄 간격"/)
  assert.match(segmented, /role="group"/)
  assert.match(segmented, /data-segmented-indicator/)
  assert.match(`${segmented}\n${settings}`, /translate3d/)
  assert.match(controls, /role="switch"/)
  assert.match(controls, /aria-label="모션 줄이기"/)
  assert.match(controls, /aria-checked=\{preferences\.reducedMotion\}/)
  assert.match(controls, /import \{ FontThemeSelect \} from '\.\/FontThemeSelect'/)
  assert.match(controls, /import \{ CodeThemeSelect \} from '\.\/CodeThemeSelect'/)
  assert.match(controls, /<FontThemeSelect/)
  assert.match(controls, /<CodeThemeSelect/)
  assert.doesNotMatch(controls, /renderFontSelect/)
  assert.doesNotMatch(controls, /codeThemeSelect/)
  assert.doesNotMatch(menu, /selectedFontTheme/)
  assert.doesNotMatch(menu, /renderFontSelect/)
  assert.doesNotMatch(menu, /FontThemeSelect/)
  assert.doesNotMatch(menu, /CodeThemeSelect/)
  assert.equal((`${menu}\n${controls}`.match(/label="글꼴"/g) ?? []).length, 1)
  assert.doesNotMatch(controls, /선택한 글꼴이 실제로 제공하는 굵기입니다\./)
  assert.match(controls, /supportedWeights\.length > 1/)
  assert.match(controls, /handleFontThemeChange\(nextTheme: FontThemeName\)/)
  assert.match(controls, /normalizedWeight === current\.preferences\.fontWeight/)

  const codeSectionIndex = controls.indexOf('label="코드 블럭"')
  const accessibilitySectionIndex = controls.indexOf('label="접근성"')
  assert.ok(codeSectionIndex >= 0)
  assert.ok(accessibilitySectionIndex > codeSectionIndex)
})

test('글꼴 굵기 옵션은 선택 배경과 옵션 간격을 가진다', () => {
  const controls = read('src/components/ReadingPreferencesControls.tsx')

  assert.match(controls, /data-\[state=checked\]:bg-accent/)
  assert.match(controls, /viewportClassName="grid gap-0\.5"/)
  assert.match(controls, /import \{ Badge \} from '@\/components\/ui\/badge'/)
  assert.match(controls, /data-font-weight-badge=""/)
  assert.match(controls, /<FontWeightLabel weight=\{effectivePreferences\.fontWeight\}/)
  assert.match(controls, /<FontWeightLabel weight=\{weight\}/)
})

test('활성 헤더 아이콘은 기본 아이콘보다 굵은 stroke를 사용한다', () => {
  const siteChrome = read('src/app/styles/site-chrome.css')

  assert.match(
    siteChrome,
    /\.header-active-aurora > svg:not\(\.header-aurora-icon-defs\)\s*\{[\s\S]*?stroke-width:\s*2\.35/
  )
})

test('코드 테마 선택 위에 다중 토큰 색상 미리보기를 제공한다', () => {
  const select = read('src/components/CodeThemeSelect.tsx')
  const themes = read('src/lib/codeThemes.ts')
  const previewData = read('src/lib/codeThemePreviewPalettes.ts')

  assert.match(select, /aria-label="코드 테마 미리보기"/)
  assert.match(select, /CODE_THEME_PREVIEW_LINES\.map/)
  assert.match(select, /data-code-preview-token=\{segment\.index\}/)
  assert.match(select, /data-code-preview-segment=\{segment\.id\}/)
  assert.match(select, /previewPalette\.tokenColorIndexes\[segment\.index\]/)
  assert.match(select, /focus-visible:outline-white/)
  assert.match(select, /focus-visible:ring-black/)
  assert.match(select, /CODE_THEME_PREVIEW_PALETTES/)
  assert.match(themes, /CODE_THEME_PREVIEW_PALETTES/)
  assert.match(themes, /CODE_THEME_PREVIEW_LINES/)
  assert.match(previewData, /"id": "3:8"/)
  assert.match(previewData, /"id": "7:9"/)
  assert.match(previewData, /tokenColorIndexes/)
})

test('읽기 설정은 검증된 기본값과 저장 키, DOM 적용 함수를 분리한다', () => {
  const preferences = read('src/lib/readingPreferences.ts')

  assert.match(preferences, /DEFAULT_READING_PREFERENCES/)
  assert.match(preferences, /fontWeight: 400/)
  assert.match(preferences, /fontSize: 'default'/)
  assert.match(preferences, /lineHeight: 'comfortable'/)
  assert.match(preferences, /reducedMotion: false/)
  assert.match(preferences, /reading-font-weight/)
  assert.match(preferences, /reading-font-size/)
  assert.match(preferences, /reading-line-height/)
  assert.match(preferences, /reading-reduced-motion/)
  assert.match(preferences, /--reading-font-weight/)
  assert.match(preferences, /--reading-font-size/)
  assert.match(preferences, /--reading-line-height/)
  assert.match(preferences, /data-reduced-motion/)
})

test('폰트 테마별로 실제 지원하는 굵기만 노출한다', () => {
  const themes = read('src/lib/fontThemes.ts')

  assert.match(themes, /FONT_THEME_WEIGHT_MAP/)
  assert.match(themes, /pretendard:\s*ALL_FONT_WEIGHTS/)
  assert.match(themes, /maplestory:\s*\[400, 700\]/)
  assert.match(themes, /'hancom-malangmalang':\s*\[400, 700\]/)
  assert.match(themes, /'chosun-myeongjo':\s*\[400\]/)
  assert.match(themes, /moneygraphy:\s*\[400\]/)
  assert.match(themes, /'chosun-gulim':\s*\[400\]/)
  assert.match(themes, /paperlogy:\s*ALL_FONT_WEIGHTS/)
  assert.match(themes, /getSupportedFontWeights/)
  assert.match(themes, /normalizeFontWeight/)
})

test('Paperlogy는 100부터 900까지 WOFF2 굵기를 제공한다', () => {
  const foundation = read('src/app/styles/foundation.css')
  const files = [
    'Paperlogy-Thin.woff2',
    'Paperlogy-ExtraLight.woff2',
    'Paperlogy-Light.woff2',
    'Paperlogy-Regular.woff2',
    'Paperlogy-Medium.woff2',
    'Paperlogy-SemiBold.woff2',
    'Paperlogy-Bold.woff2',
    'Paperlogy-ExtraBold.woff2',
    'Paperlogy-Black.woff2',
  ]

  for (const [index, file] of files.entries()) {
    const path = join(root, 'public/fonts/paperlogy', file)
    assert.equal(existsSync(path), true, `${file} 파일`)
    const bytes = readFileSync(path)
    assert.equal(bytes.subarray(0, 4).toString('latin1'), 'wOF2', `${file} 형식`)
    assert.match(foundation, new RegExp(file.replace('.', '\\.')))
    assert.match(foundation, new RegExp(`font-weight: ${(index + 1) * 100};`))
  }
})

test('저장된 읽기 설정은 hydration 전에 적용된다', () => {
  const layout = read('src/app/layout.tsx')
  const notionStyles = read('src/app/styles/notion-post.css')
  const postCard = read('src/components/PostCard.tsx')

  assert.match(layout, /readingPreferencesBootScript/)
  assert.match(layout, /id="reading-preferences-init"/)
  assert.match(layout, /READING_PREFERENCE_STORAGE_KEYS/)
  assert.match(notionStyles, /var\(--reading-font-size/)
  assert.match(notionStyles, /var\(--reading-line-height/)
  assert.match(notionStyles, /var\(--reading-font-weight/)
  assert.match(postCard, /data-reading-surface="post-card-title"/)
  assert.match(postCard, /data-reading-card-size=/)
  assert.match(notionStyles, /\[data-reading-surface='post-card-title'\]/)
  assert.match(
    notionStyles,
    /\[data-reading-surface='post-card-title'\]\s*\{[\s\S]*?font-weight:\s*var\(--reading-font-weight, 400\)/
  )
  assert.doesNotMatch(notionStyles, /data-reading-font-weight='700'/)
  assert.match(notionStyles, /\[data-reading-card-size='grid'\]/)
})

test('Drawer는 모바일 Bottom Sheet와 데스크톱 오른쪽 패널 모션을 분리한다', () => {
  const settings = read('src/app/styles/settings.css')
  const reducedMotion = read('src/app/styles/reduced-motion.css')

  assert.match(settings, /@keyframes settings-sheet-in/)
  assert.match(settings, /translateY\(100%\)/)
  assert.match(settings, /@media \(min-width: 640px\)/)
  assert.match(settings, /@keyframes settings-drawer-in/)
  assert.match(settings, /translateX\(calc\(100% \+ 1rem\)\)/)
  assert.match(settings, /backdrop-filter: blur\(/)
  assert.match(settings, /border-top-left-radius: 20px/)
  assert.match(settings, /border-top-right-radius: 20px/)
  assert.match(settings, /border-bottom-right-radius: 20px/)
  assert.match(settings, /border-bottom-left-radius: 20px/)
  assert.match(drawerSource(), /sm:top-4/)
  assert.match(drawerSource(), /sm:right-4/)
  assert.match(drawerSource(), /sm:bottom-4/)
  assert.match(settings, /\.settings-drawer-scroll \[data-overlayscrollbars-viewport\]/)
  assert.doesNotMatch(settings, /scrollbar-gutter:\s*stable/)
  assert.match(reducedMotion, /html\[data-reduced-motion='true'\]/)
  assert.match(reducedMotion, /\.settings-drawer-panel/)
})

function drawerSource() {
  return read('src/components/ui/drawer.tsx')
}

test('공유하던 프로젝트 Popover 모션과 모바일 배치를 보존한다', () => {
  const launcher = read('src/components/AppLauncherMenu.tsx')
  const settings = read('src/app/styles/settings.css')

  assert.match(launcher, /className="settings-popover/)
  assert.match(launcher, /data-mobile-center-popover=""/)
  assert.match(settings, /@keyframes settings-popover-in/)
  assert.match(settings, /\.settings-popover\[data-state='open'\]/)
  assert.match(settings, /data-mobile-center-popover/)
})
