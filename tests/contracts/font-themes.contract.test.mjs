import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(dirname(fileURLToPath(import.meta.url))))
const fontThemesPath = join(root, 'src/lib/fontThemes.ts')
const foundationPath = join(root, 'src/app/styles/foundation.css')
const fontThemeSelectPath = join(root, 'src/components/FontThemeSelect.tsx')
const packagePath = join(root, 'package.json')

const localFontAssets = [
  {
    theme: 'chosun-myeongjo',
    family: 'Chosun Myeongjo',
    path: 'public/fonts/chosun-myeongjo/ChosunNm.ttf',
    signature: '\u0000\u0001\u0000\u0000',
  },
  {
    theme: 'chosun-gulim',
    family: 'Chosun Gulim',
    path: 'public/fonts/chosun-gulim/ChosunGu.ttf',
    signature: '\u0000\u0001\u0000\u0000',
  },
  {
    theme: 'paperlogy',
    family: 'Paperlogy',
    path: 'public/fonts/paperlogy/Paperlogy-Regular.woff2',
    signature: 'wOF2',
  },
]

const expectedOptions = [
  {
    value: 'pretendard',
    label: 'Pretendard',
    downloadUrl: 'https://cactus.tistory.com/306',
  },
  {
    value: 'maplestory',
    label: 'Maplestory',
    downloadUrl:
      'https://brand.nexon.com/ko/ci-brand-guidelines/typeface#section-mapleStory',
  },
  {
    value: 'hancom-malangmalang',
    label: '한컴 말랑말랑체',
    downloadUrl: 'https://font.hancom.com/pc/sub/sub2_1.php',
  },
  {
    value: 'chosun-myeongjo',
    label: '조선명조',
    downloadUrl: 'https://event.chosun.com/100/100font.html',
  },
  {
    value: 'moneygraphy',
    label: '토스 머니그래피',
    downloadUrl: 'https://toss.im/moneygraphy-font',
  },
  {
    value: 'chosun-gulim',
    label: '조선굴림',
    downloadUrl: 'https://event.chosun.com/100/100font.html',
  },
  {
    value: 'paperlogy',
    label: '페이퍼로지',
    downloadUrl: 'https://freesentation.blog/paperlogyfont',
  },
]

function parseFontThemeOptions(source) {
  const optionsBlock = source.match(
    /FONT_THEME_OPTIONS[\s\S]*?= \[([\s\S]*?)\n\]/
  )?.[1]

  assert.ok(optionsBlock, 'FONT_THEME_OPTIONS 선언을 찾을 수 없습니다.')

  return Array.from(
    optionsBlock.matchAll(
      /\{\s*value:\s*'([^']+)',\s*label:\s*'([^']+)',\s*fontFamily:\s*"([^"]+)",\s*downloadUrl:\s*'([^']+)',?\s*\}/g
    ),
    ([, value, label, fontFamily, downloadUrl]) => ({
      value,
      label,
      fontFamily,
      downloadUrl,
    })
  )
}

test('폰트 테마 메타데이터는 7개 폰트와 공식 다운로드 URL을 제공한다', () => {
  const source = readFileSync(fontThemesPath, 'utf8')
  const options = parseFontThemeOptions(source)

  assert.equal(options.length, expectedOptions.length)
  assert.deepEqual(
    options.map(({ value, label, downloadUrl }) => ({
      value,
      label,
      downloadUrl,
    })),
    expectedOptions
  )
  assert.ok(options.every(({ fontFamily }) => fontFamily.length > 0))
  assert.ok(
    options.every(({ downloadUrl }) => new URL(downloadUrl).protocol === 'https:')
  )
})

test('폰트 테마 value 목록은 option 순서와 일치한다', () => {
  const source = readFileSync(fontThemesPath, 'utf8')
  const valuesBlock = source.match(
    /FONT_THEME_VALUES = \[([\s\S]*?)\] as const/
  )?.[1]

  assert.ok(valuesBlock, 'FONT_THEME_VALUES 선언을 찾을 수 없습니다.')
  assert.deepEqual(
    Array.from(valuesBlock.matchAll(/'([^']+)'/g), ([, value]) => value),
    expectedOptions.map(({ value }) => value)
  )
})

test('신규 로컬 폰트는 공식 배포 형식과 CSS 테마 선언을 제공한다', () => {
  const foundation = readFileSync(foundationPath, 'utf8')

  for (const { theme, family, path, signature } of localFontAssets) {
    const font = readFileSync(join(root, path))

    assert.equal(font.subarray(0, 4).toString('latin1'), signature, `${path} 형식`)
    assert.match(foundation, new RegExp(`font-family: '${family}'`))
    assert.match(foundation, new RegExp(`html\\[data-font-theme='${theme}'\\]`))
  }

  assert.equal(
    (foundation.match(/font-display: swap;/g) ?? []).length >= 8,
    true,
    '모든 로컬 폰트는 font-display: swap을 사용해야 합니다.'
  )
})

test('재배포가 금지된 머니그라피는 토스 공식 WOFF2를 직접 사용한다', () => {
  const foundation = readFileSync(foundationPath, 'utf8')

  assert.match(
    foundation,
    /https:\/\/static\.toss\.im\/assets\/homepage\/moneygraphy-font\/font\/Moneygraphy-Rounded-1\.1\.woff2/
  )
  assert.equal(
    existsSync(
      join(root, 'public/fonts/moneygraphy/Moneygraphy-Rounded.woff2')
    ),
    false
  )
})

test('페이퍼로지는 원본 SIL OFL 전문을 함께 보관한다', () => {
  const license = readFileSync(join(root, 'public/fonts/paperlogy/OFL.txt'))
  const licenseText = license.toString('utf8')

  assert.match(licenseText, /SIL OPEN FONT LICENSE Version 1\.1/)
  assert.match(licenseText, /Copyright 2024 The PAPERLOGY Authors/)
  assert.equal(
    createHash('sha256').update(license).digest('hex'),
    '603b2e7ef9effb9037b0b67f0530cacdc05e71a4e569032d7e4d98c2e6763135'
  )
})

test('폰트 선택과 다운로드 페이지 링크는 서로 다른 컨트롤로 동작한다', () => {
  const source = readFileSync(fontThemeSelectPath, 'utf8')

  assert.match(source, /SquareArrowOutUpRightIcon/)
  assert.match(source, /href=\{theme\.downloadUrl\}/)
  assert.match(source, /target="_blank"/)
  assert.match(source, /rel="noreferrer"/)
  assert.match(source, /aria-label=\{`\$\{theme\.label\} 다운로드 페이지 열기`\}/)
  assert.match(source, /aria-pressed=\{selectedTheme === theme\.value\}/)
  assert.match(source, /\{theme\.label\}/)
  assert.match(source, /import \{ ScrollArea \} from '@\/components\/ui\/scroll-area'/)
  assert.match(source, /<ScrollArea/)
  assert.doesNotMatch(source, /overflow-y-auto/)
  assert.doesNotMatch(source, /<img/)
  assert.doesNotMatch(source, /previewImage/)
  assert.match(
    source,
    /style=\{\{ fontFamily: getFontThemeStack\(theme\.value\) \}\}/
  )
  assert.match(source, /onPointerDown=\{stopLinkEventPropagation\}/)
  assert.match(source, /onClick=\{stopLinkEventPropagation\}/)
  assert.match(source, /onKeyDown=\{stopLinkKeyDownPropagation\}/)
  assert.match(source, /onOpenAutoFocus=\{handleOpenAutoFocus\}/)
  assert.match(source, /data-lenis-prevent=""/)
  assert.match(source, /<Popover modal open=\{open\}/)
  assert.match(source, /tabIndex=\{activeIndex === index \? 0 : -1\}/)
  assert.match(source, /onKeyDown=\{\(event\) => handleOptionKeyDown\(event, index\)\}/)
  assert.ok(
    (source.match(/stopPropagation\(\)/g) ?? []).length >= 2,
    'pointer/click과 키보드 활성화 이벤트 전파를 차단해야 합니다.'
  )
  assert.doesNotMatch(source, /<SelectItem/)
})

test('생성형 폰트 미리보기 자산과 도구를 포함하지 않는다', () => {
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  const fontThemes = readFileSync(fontThemesPath, 'utf8')

  assert.equal(existsSync(join(root, 'public/fonts/previews')), false)
  assert.equal(
    existsSync(join(root, 'scripts/generate-font-theme-previews.mjs')),
    false
  )
  assert.equal(packageJson.scripts['fonts:previews'], undefined)
  assert.doesNotMatch(fontThemes, /previewImage/)
})
