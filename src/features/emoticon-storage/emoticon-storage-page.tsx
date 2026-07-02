'use client'

import Image from 'next/image'
import { useVirtualizer } from '@tanstack/react-virtual'
import { XIcon } from 'lucide-react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  memo,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { CircleCheckIcon, CopyIcon, DownloadIcon } from '@/components/icons'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn, subscribeToTouchInputDeviceChange } from '@/lib/utils'
import type {
  EmoticonCollection,
  EmoticonCollectionId,
  EmoticonItem,
  EmoticonManifest,
} from './types'

const PNG_EXPORT_SIZE = 512
const GRID_GAP = 10
const GRID_EDGE_BLEED = 8
const GRID_ROW_HEIGHT = 62
const MOBILE_GRID_SECTION_HEADING_HEIGHT = 42
const DESKTOP_GRID_SECTION_HEADING_HEIGHT = 74
const MOBILE_CARD_MIN_WIDTH = 54
const DESKTOP_CARD_MIN_WIDTH = 56
const SHEET_EXIT_DURATION_MS = 180
const ACTION_FEEDBACK_DURATION_MS = 1200
const ACTION_SHEET_MAX_WIDTH = 540
const GRID_OVERSCAN = 4
const PREFETCH_ROW_LOOKAHEAD = 12
const PREFETCH_ROW_LOOKBEHIND = 6
const PREFETCH_CHUNK_SIZE = 8
const BACKGROUND_PREFETCH_CHUNK_SIZE = 8
const EAGER_ROW_BUFFER = 1
const EMOTICON_PAGE_SHELL_CLASS_NAME =
  'fixed inset-0 flex h-[100dvh] min-h-[100svh] flex-col overflow-hidden pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-[calc(6.5rem+env(safe-area-inset-top))] sm:pb-4 sm:pt-20 [min-height:-webkit-fill-available]'
const EMOTICON_CONTENT_CLASS_NAME =
  'mx-auto w-[min(1180px,calc(100vw-3rem))] sm:w-[min(1180px,calc(100vw-2rem))]'
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

type ActionKey = 'download-svg' | 'download-png' | 'copy-svg' | 'copy-png'

type ActionFeedback = {
  key: ActionKey
  status: 'success' | 'error'
} | null

type BrowserIdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (
      callback: () => void,
      options?: { timeout?: number }
    ) => number
    cancelIdleCallback?: (handle: number) => void
    scheduler?: {
      postTask?: (
        callback: () => void,
        options?: {
          priority?: 'user-blocking' | 'user-visible' | 'background'
          signal?: AbortSignal
        }
      ) => Promise<unknown>
    }
  }

type Subcategory = {
  id: string
  label: string
  icon?: ReactNode
}

type EmoticonGridSection = {
  id: string
  label: string
  items: EmoticonItem[]
}

type PreparedEmoticonCollection = {
  collection: EmoticonCollection
  sectionsBySubcategory: Map<string, EmoticonGridSection>
}

type EmoticonGridRow =
  | {
      type: 'heading'
      key: string
      label: string
    }
  | {
      type: 'icons'
      key: string
      items: EmoticonItem[]
    }

type FloatingTooltipState = {
  itemId: string
  label: string
  x: number
  y: number
} | null

const prefetchedEmoticonImages = new Set<string>()
const pendingEmoticonImagePrefetches = new Map<
  string,
  {
    image: HTMLImageElement
    promise: Promise<void>
  }
>()

function markEmoticonImageSettled(src: string) {
  prefetchedEmoticonImages.add(src)
}

function hasSettledEmoticonImage(src: string) {
  return prefetchedEmoticonImages.has(src)
}

const ALL_SUBCATEGORY: Subcategory = {
  id: 'all',
  label: '전체',
}

const MATERIAL_SUBCATEGORIES: readonly Subcategory[] = [
  ALL_SUBCATEGORY,
  {
    id: 'files',
    label: '파일 아이콘',
    icon: <MaterialCategoryIcon filename="typescript.svg" />,
  },
  {
    id: 'folders',
    label: '폴더 아이콘',
    icon: <MaterialCategoryIcon filename="folder-src.svg" />,
  },
]

const TOSSFACE_SUBCATEGORIES: readonly Subcategory[] = [
  ALL_SUBCATEGORY,
  {
    id: 'smileys-people',
    label: '얼굴 및 사람',
    icon: <TossfaceCategoryIcon name="미소 짓는 눈으로 살짝 웃는 얼굴" />,
  },
  {
    id: 'animals-nature',
    label: '동물 및 자연',
    icon: <TossfaceCategoryIcon name="강아지 얼굴" />,
  },
  {
    id: 'food-drink',
    label: '음식',
    icon: <TossfaceCategoryIcon name="초록 사과" />,
  },
  {
    id: 'activity',
    label: '활동',
    icon: <TossfaceCategoryIcon name="축구공" />,
  },
  {
    id: 'travel-places',
    label: '여행',
    icon: <TossfaceCategoryIcon name="자동차" />,
  },
  {
    id: 'objects',
    label: '물건',
    icon: <TossfaceCategoryIcon name="노트북" />,
  },
  {
    id: 'symbols',
    label: '기호',
    icon: <TossfaceCategoryIcon name="빨간색 하트" />,
  },
  {
    id: 'flags',
    label: '깃발',
    icon: <TossfaceCategoryIcon name="펄럭이는 흰색 깃발" />,
  },
]

const RYONG_SUBCATEGORIES: readonly Subcategory[] = [
  ALL_SUBCATEGORY,
  {
    id: 'favorites',
    label: '아끼는 이미지',
    icon: <RyongCategoryIcon filename="noticon-teg1ooxzhglorh6rk9hs.svg" />,
  },
]

const TOSSFACE_FOOD_ORDER = [
  '초록 사과',
  '빨간 사과',
  '배',
  '귤',
  '레몬',
  '바나나',
  '수박',
  '포도',
  '딸기',
  '블루베리',
  '멜론',
  '체리',
  '복숭아',
  '망고',
  '파인애플',
  '코코넛',
  '키위',
  '토마토',
  '가지',
  '아보카도',
  '브로콜리',
  '오이',
  '홍고추',
  '피망',
  '옥수수',
  '당근',
  '올리브',
  '마늘',
  '양파',
  '감자',
  '고구마',
  '크루아상',
  '베이글',
  '빵',
  '바게트',
  '프레첼',
  '치즈 조각',
  '달걀',
  '요리',
  '버터',
  '팬케이크',
  '와플',
  '베이컨',
  '고기',
  '닭다리',
  '뼈다귀',
  '핫도그',
  '햄버거',
  '감자튀김',
  '피자',
  '플랫브레드',
  '샌드위치',
  '타코',
  '부리토',
  '타말레',
  '팔라펠',
  '야채샐러드',
  '팝콘',
  '주먹밥',
  '삼각 김밥',
  '밥',
  '카레라이스',
  '초밥',
  '도시락',
  '만두',
  '오뎅',
  '새우',
  '새우튀김',
  '샤베트 아이스크림',
  '아이스크림',
  '소프트 아이스크림',
  '파이',
  '컵케이크',
  '생일 케이크',
  '롤리팝',
  '사탕',
  '초콜릿 바',
  '팝콘',
  '도넛',
  '쿠키',
  '밤',
  '땅콩',
  '콩',
  '꿀',
  '물컵',
  '젖병',
  '찻주전자',
  '뜨거운 음료',
  '차',
  '우유 한잔',
  '음료 팩',
  '빨대와 컵',
  '버블티',
  '맥주',
  '맥주잔',
  '건배하는 샴페인 잔',
  '와인잔',
  '양주잔',
  '칵테일',
  '마테차',
  '사케',
  '얼음',
  '숟가락',
  '포크와 나이프',
  '포크와 나이프가 있는 접시',
  '그릇과 숟가락',
  '젓가락',
  '소금',
] as const

const TOSSFACE_ACTIVITY_ORDER = [
  '축구공',
  '야구공',
  '소프트볼',
  '농구',
  '배구공',
  '미식축구공',
  '럭비공',
  '테니스',
  '플라잉 디스크',
  '볼링',
  '크리켓',
  '하키',
  '탁구',
  '배드민턴',
  '권투 글러브',
  '도복',
  '골대',
  '골프',
  '스케이트',
  '낚싯대',
  '다이빙 마스크',
  '스키',
  '썰매',
  '컬링 스톤',
  '다트',
  '요요',
  '연',
  '당구',
  '수정 구슬',
  '마술 지팡이',
  '비디오 게임',
  '조이스틱',
  '슬롯 머신',
  '주사위',
  '퍼즐',
  '곰인형',
  '피냐타',
  '미러볼',
  '러시아 인형',
  '스페이드',
  '다이아몬드',
  '클럽',
  '체스 폰',
  '조커',
  '마작',
  '화투',
  '공연 예술',
  '액자',
  '팔레트',
] as const

const TOSSFACE_TRAVEL_PREFIXES = [
  '지구',
  '세계 지도',
  '나침반',
  '산',
  '화산',
  '후지산',
  '캠핑',
  '해변',
  '사막',
  '사막 섬',
  '국립공원',
  '경기장',
  '건물',
  '집',
  '주택',
  '빌딩',
  '우체국',
  '병원',
  '은행',
  '호텔',
  '편의점',
  '학교',
  '백화점',
  '공장',
  '성',
  '결혼식',
  '타워',
  '자유의 여신상',
  '교회',
  '모스크',
  '사원',
  '신사',
  '분수',
  '텐트',
  '일출',
  '일몰',
  '온천',
  '관람차',
  '롤러코스터',
  '이발소',
  '기관차',
  '기차',
  '전철',
  '트램',
  '버스',
  '택시',
  '자동차',
  '트럭',
  '트랙터',
  '경주용 자동차',
  '오토바이',
  '스쿠터',
  '자전거',
  '킥보드',
  '스케이트보드',
  '철도',
  '경찰차',
  '소방차',
  '구급차',
  '비행기',
  '로켓',
  '헬리콥터',
  '위성',
  '돛단배',
  '페리',
  '요트',
  '닻',
] as const

const TOSSFACE_ANIMAL_NATURE_PREFIXES = [
  '강아지',
  '개',
  '고양이',
  '사자',
  '호랑이',
  '말',
  '유니콘',
  '얼룩말',
  '사슴',
  '소',
  '황소',
  '물소',
  '돼지',
  '멧돼지',
  '양',
  '염소',
  '낙타',
  '라마',
  '기린',
  '코끼리',
  '코뿔소',
  '하마',
  '쥐',
  '햄스터',
  '토끼',
  '다람쥐',
  '비버',
  '고슴도치',
  '박쥐',
  '곰',
  '북극곰',
  '코알라',
  '판다',
  '나무늘보',
  '수달',
  '스컹크',
  '캥거루',
  '오소리',
  '칠면조',
  '닭',
  '병아리',
  '새',
  '펭귄',
  '비둘기',
  '독수리',
  '오리',
  '백조',
  '공작',
  '앵무새',
  '개구리',
  '악어',
  '거북이',
  '도마뱀',
  '뱀',
  '용',
  '공룡',
  '티라노사우루스',
  '고래',
  '돌고래',
  '물개',
  '물고기',
  '열대어',
  '복어',
  '상어',
  '문어',
  '달팽이',
  '나비',
  '벌레',
  '개미',
  '꿀벌',
  '딱정벌레',
  '무당벌레',
  '귀뚜라미',
  '바퀴벌레',
  '거미',
  '전갈',
  '모기',
  '파리',
  '지렁이',
  '미생물',
  '꽃',
  '장미',
  '튤립',
  '새싹',
  '소나무',
  '선인장',
  '벼',
  '클로버',
  '단풍잎',
  '낙엽',
  '잎',
] as const

const TOSSFACE_SYMBOL_PREFIXES = [
  '빨간색 하트',
  '주황색 하트',
  '노란색 하트',
  '초록색 하트',
  '파란색 하트',
  '보라색 하트',
  '갈색 하트',
  '검은색 하트',
  '흰색 하트',
  '회색 하트',
  '분홍색 하트',
  '밝은 파란색 하트',
  '깨진 하트',
  '평화 기호',
  '십자가',
  '별',
  '초승달',
  '옴',
  '다윗의 별',
  '음양',
  '자리',
  '재생',
  '정지',
  '녹화',
  '밝기',
  '여성 기호',
  '남성 기호',
  '트랜스젠더 기호',
  '곱하기',
  '더하기',
  '빼기',
  '나누기',
  '무한',
  '느낌표',
  '물음표',
  '숫자',
  '샵 기호',
  '별표',
  '체크',
  '엑스',
  '화살표',
  '금지',
  '원글자',
  '알파벳',
  '버튼',
] as const

const TOSSFACE_OBJECT_PREFIXES = [
  '안경',
  '선글라스',
  '고글',
  '넥타이',
  '티셔츠',
  '스카프',
  '장갑',
  '코트',
  '양말',
  '원피스',
  '기모노',
  '지갑',
  '핸드백',
  '쇼핑백',
  '가방',
  '신발',
  '모자',
  '헬멧',
  '립스틱',
  '반지',
  '스피커',
  '확성기',
  '벨',
  '음표',
  '마이크',
  '헤드폰',
  '라디오',
  '색소폰',
  '기타',
  '피아노',
  '트럼펫',
  '바이올린',
  '드럼',
  '휴대전화',
  '컴퓨터',
  '노트북',
  '키보드',
  '마우스',
  '프린터',
  '카메라',
  '텔레비전',
  '전화',
  '팩스',
  '배터리',
  '전구',
  '손전등',
  '양초',
  '소화기',
  '돈',
  '신용카드',
  '영수증',
  '이메일',
  '봉투',
  '소포',
  '연필',
  '펜',
  '붓',
  '크레용',
  '메모',
  '서류',
  '파일',
  '폴더',
  '달력',
  '카드',
  '상자',
  '쓰레기통',
  '자물쇠',
  '열쇠',
  '망치',
  '도끼',
  '렌치',
  '드라이버',
  '톱니바퀴',
  '저울',
  '지팡이',
  '링크',
  '갈고리',
  '자석',
  '사다리',
  '시험관',
  '현미경',
  '망원경',
  '주사기',
  '알약',
  '문',
  '엘리베이터',
  '거울',
  '창문',
  '침대',
  '소파',
  '의자',
  '변기',
  '샤워',
  '욕조',
  '비누',
  '스펀지',
] as const

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = filename
  document.body.append(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

async function fetchSvgText(item: EmoticonItem) {
  const response = await fetch(item.src)

  if (!response.ok) {
    throw new Error('SVG 파일을 불러오지 못했습니다.')
  }

  return response.text()
}

async function fetchSvgBlob(item: EmoticonItem) {
  const response = await fetch(item.src)

  if (!response.ok) {
    throw new Error('SVG 파일을 불러오지 못했습니다.')
  }

  return response.blob()
}

async function fetchPngBlob(item: EmoticonItem) {
  if (!item.pngSrc) {
    return svgToPngBlob(item)
  }

  const response = await fetch(item.pngSrc)

  if (!response.ok) {
    throw new Error('PNG 파일을 불러오지 못했습니다.')
  }

  return response.blob()
}

async function svgToPngBlob(item: EmoticonItem, size = PNG_EXPORT_SIZE) {
  const svg = await fetchSvgText(item)

  const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
  const objectUrl = URL.createObjectURL(svgBlob)

  try {
    const image = new window.Image()
    image.decoding = 'async'
    image.src = objectUrl
    await image.decode()

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('PNG 변환을 지원하지 않는 브라우저입니다.')
    }

    canvas.width = size
    canvas.height = size
    context.clearRect(0, 0, size, size)
    context.drawImage(image, 0, 0, size, size)

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png')
    })

    if (!blob) {
      throw new Error('PNG 파일을 만들지 못했습니다.')
    }

    return blob
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

async function copyPngToClipboard(blob: Blob) {
  const clipboard = navigator.clipboard
  const ClipboardItemConstructor = window.ClipboardItem

  if (!clipboard || !ClipboardItemConstructor) {
    throw new Error('이미지 복사를 지원하지 않는 브라우저입니다.')
  }

  await clipboard.write([
    new ClipboardItemConstructor({
      [blob.type]: blob,
    }),
  ])
}

function getFocusableElements(container: HTMLElement) {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter((element) => {
    return !element.hasAttribute('disabled') && !element.getAttribute('hidden')
  })
}

function CollectionLogoImage({
  src,
  isActive,
}: {
  src: string
  isActive: boolean
}) {
  return (
    <Image
      src={src}
      alt=""
      width={28}
      height={28}
      data-emoticon-collection-logo=""
      data-active={isActive ? 'true' : 'false'}
      className={cn(
        'h-[0.9em] w-[0.9em] shrink-0 rounded-[0.22em] object-contain',
        isActive
          ? 'opacity-100'
          : 'opacity-35 grayscale saturate-0 contrast-75 group-hover:opacity-65 group-hover:grayscale-[0.45] group-hover:saturate-[0.65]'
      )}
    />
  )
}

function MaterialLogo({ isActive }: { isActive: boolean }) {
  return (
    <CollectionLogoImage
      src="/emoticons/logos/material-icon-theme.png"
      isActive={isActive}
    />
  )
}

function MaterialCategoryIcon({ filename }: { filename: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/emoticons/material/${filename}`}
      alt=""
      loading="eager"
      decoding="async"
      fetchPriority="low"
      className="h-5 w-5 object-contain"
    />
  )
}

function TossfaceCategoryIcon({ name }: { name: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/emoticons/tossface/${encodeURIComponent(name)}.svg`}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-4 w-4 object-contain"
    />
  )
}

function TossfaceLogo({ isActive }: { isActive: boolean }) {
  return (
    <CollectionLogoImage
      src="/emoticons/logos/toss-symbol.png"
      isActive={isActive}
    />
  )
}

function RyongCategoryIcon({ filename }: { filename: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/emoticons/ryong/${filename}`}
      alt=""
      loading="lazy"
      decoding="async"
      className="h-4 w-4 object-contain"
    />
  )
}

function RyongLogo({ isActive }: { isActive: boolean }) {
  return <CollectionLogoImage src="/icon.png" isActive={isActive} />
}

function CollectionLogo({
  id,
  isActive,
}: {
  id: EmoticonCollectionId
  isActive: boolean
}) {
  if (id === 'tossface') {
    return <TossfaceLogo isActive={isActive} />
  }

  if (id === 'ryong') {
    return <RyongLogo isActive={isActive} />
  }

  return <MaterialLogo isActive={isActive} />
}

function getSubcategories(collectionId: EmoticonCollectionId) {
  if (collectionId === 'tossface') {
    return TOSSFACE_SUBCATEGORIES
  }

  if (collectionId === 'ryong') {
    return RYONG_SUBCATEGORIES
  }

  return MATERIAL_SUBCATEGORIES
}

function getDefaultSubcategory(collectionId: EmoticonCollectionId) {
  return getSubcategories(collectionId)[0]?.id ?? 'all'
}

function getCollectionLabel(collectionId: EmoticonCollectionId) {
  if (collectionId === 'tossface') {
    return 'Tossface'
  }

  if (collectionId === 'ryong') {
    return 'Ryong'
  }

  return 'Material'
}

function matchesAnyKeyword(name: string, keywords: readonly string[]) {
  return keywords.some((keyword) => name.includes(keyword))
}

function startsWithAny(name: string, prefixes: readonly string[]) {
  return prefixes.some((prefix) => name.startsWith(prefix))
}

function getExactOrderIndex(name: string, order: readonly string[]) {
  return order.findIndex((orderedName) => orderedName === name)
}

function getItemSubcategory(
  collectionId: EmoticonCollectionId,
  item: EmoticonItem
) {
  if (collectionId === 'material') {
    return item.filename.startsWith('folder-') ? 'folders' : 'files'
  }

  if (collectionId === 'ryong') {
    return item.category ?? 'favorites'
  }

  if (item.category) {
    return item.category
  }

  const name = item.name

  if (name.includes('깃발')) {
    return 'flags'
  }

  if (TOSSFACE_FOOD_ORDER.includes(name as (typeof TOSSFACE_FOOD_ORDER)[number])) {
    return 'food-drink'
  }

  if (
    TOSSFACE_ACTIVITY_ORDER.includes(
      name as (typeof TOSSFACE_ACTIVITY_ORDER)[number]
    ) ||
    matchesAnyKeyword(name, [
      '골프치는',
      '수영하는',
      '서핑하는',
      '스키 타는',
      '스노보드',
      '자전거 타는',
      '역도 선수',
      '핸드볼',
      '공 가진',
      '공을 갖고',
      '저글링',
      '클라이밍',
      '노젓는',
      '옆돌기',
      '달리는',
      '뛰는',
      '메달',
      '트로피',
    ])
  ) {
    return 'activity'
  }

  if (startsWithAny(name, TOSSFACE_TRAVEL_PREFIXES)) {
    return 'travel-places'
  }

  if (startsWithAny(name, TOSSFACE_ANIMAL_NATURE_PREFIXES)) {
    return 'animals-nature'
  }

  if (startsWithAny(name, TOSSFACE_SYMBOL_PREFIXES)) {
    return 'symbols'
  }

  if (startsWithAny(name, TOSSFACE_OBJECT_PREFIXES)) {
    return 'objects'
  }

  return 'smileys-people'
}

function getTossfaceDisplayRank(
  subcategoryId: string,
  item: EmoticonItem
) {
  if (subcategoryId !== 'smileys-people') {
    return 0
  }

  if (item.name.includes('얼굴')) {
    return 0
  }

  if (
    matchesAnyKeyword(item.name, [
      '손',
      '엄지',
      '손가락',
      '손바닥',
      '박수',
      '주먹',
    ])
  ) {
    return 1
  }

  if (matchesAnyKeyword(item.name, ['눈', '입', '혀', '귀', '코', '치아'])) {
    return 2
  }

  return 3
}

function sortDisplayItems({
  collectionId,
  subcategoryId,
  items,
}: {
  collectionId: EmoticonCollectionId
  subcategoryId: string
  items: EmoticonItem[]
}) {
  if (collectionId !== 'tossface') {
    return items
  }

  const orderedItems = items.every((item) => typeof item.order === 'number')

  if (orderedItems) {
    return [...items].sort((a, b) => {
      return (a.order ?? Number.MAX_SAFE_INTEGER) -
        (b.order ?? Number.MAX_SAFE_INTEGER)
    })
  }

  const order =
    subcategoryId === 'food-drink'
      ? TOSSFACE_FOOD_ORDER
      : subcategoryId === 'activity'
        ? TOSSFACE_ACTIVITY_ORDER
        : null

  return [...items].sort((a, b) => {
    if (order) {
      const aIndex = getExactOrderIndex(a.name, order)
      const bIndex = getExactOrderIndex(b.name, order)

      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
          (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex)
      }
    }

    const rankDiff =
      getTossfaceDisplayRank(subcategoryId, a) -
      getTossfaceDisplayRank(subcategoryId, b)

    if (rankDiff !== 0) {
      return rankDiff
    }

    return a.name.localeCompare(b.name, 'ko')
  })
}

function prepareEmoticonCollection(
  collection: EmoticonCollection
): PreparedEmoticonCollection {
  const sectionsBySubcategory = new Map<string, EmoticonGridSection>()
  const subcategories = getSubcategories(collection.id).filter(
    (subcategory) => subcategory.id !== 'all'
  )

  for (const subcategory of subcategories) {
    sectionsBySubcategory.set(subcategory.id, {
      id: subcategory.id,
      label: subcategory.label,
      items: [],
    })
  }

  for (const item of collection.items) {
    const subcategoryId = getItemSubcategory(collection.id, item)
    const section = sectionsBySubcategory.get(subcategoryId)

    if (section) {
      section.items.push(item)
    }
  }

  for (const section of sectionsBySubcategory.values()) {
    section.items = sortDisplayItems({
      collectionId: collection.id,
      subcategoryId: section.id,
      items: section.items,
    })
  }

  return {
    collection,
    sectionsBySubcategory,
  }
}

function getClampedSheetCenterX(element: HTMLElement) {
  const rect = element.getBoundingClientRect()
  const sheetWidth = Math.min(ACTION_SHEET_MAX_WIDTH, window.innerWidth - 24)
  const minCenterX = 12 + sheetWidth / 2
  const maxCenterX = window.innerWidth - 12 - sheetWidth / 2
  const elementCenterX = rect.left + rect.width / 2

  return Math.min(Math.max(elementCenterX, minCenterX), maxCenterX)
}

function getActionButtonState({
  actionKey,
  feedback,
  visibleLabel,
  defaultAriaLabel,
  successAriaLabel,
  errorAriaLabel,
  defaultIcon,
}: {
  actionKey: ActionKey
  feedback: ActionFeedback
  visibleLabel: string
  defaultAriaLabel: string
  successAriaLabel: string
  errorAriaLabel: string
  defaultIcon: ReactNode
}) {
  if (feedback?.key !== actionKey) {
    return {
      ariaLabel: defaultAriaLabel,
      icon: defaultIcon,
      label: visibleLabel,
      tone: 'default' as const,
    }
  }

  if (feedback.status === 'success') {
    return {
      ariaLabel: successAriaLabel,
      icon: <CircleCheckIcon className="h-4 w-4" />,
      label: visibleLabel,
      tone: 'success' as const,
    }
  }

  return {
    ariaLabel: errorAriaLabel,
    icon: <XIcon className="h-4 w-4" />,
    label: visibleLabel,
    tone: 'error' as const,
  }
}

function EmoticonStorageSkeleton() {
  const tabWidths = ['w-32', 'w-36', 'w-28']
  const categoryWidths = ['w-24', 'w-32', 'w-32', 'w-24', 'w-24', 'w-24']

  return (
    <section
      data-emoticon-skeleton=""
      data-emoticon-viewport-contract="dynamic-safe-area"
      className={EMOTICON_PAGE_SHELL_CLASS_NAME}
    >
      <div className={cn('shrink-0', EMOTICON_CONTENT_CLASS_NAME)}>
        <div className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-1.5 sm:mb-4 sm:gap-x-6 sm:gap-y-2 md:mb-6 md:gap-x-7">
          {tabWidths.map((width, index) => (
            <div
              key={width}
              className="flex animate-pulse items-center gap-1.5 md:gap-2"
            >
              <div className="h-5 w-5 rounded-md bg-zinc-100 dark:bg-zinc-900 sm:h-6 sm:w-6 md:h-7 md:w-7" />
              <div
                className={cn(
                  'h-7 rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-8 md:h-9',
                  width,
                  index === 1 ? 'opacity-60' : ''
                )}
              />
            </div>
          ))}
        </div>

        <div className="-mx-1 mb-3 px-1 py-1 sm:-mx-2 sm:mb-4 sm:px-2 sm:py-2">
          <div className="flex w-max max-w-full gap-1.5 overflow-hidden sm:gap-2">
            {categoryWidths.map((width, index) => (
              <div
                key={`${width}-${index}`}
                className={cn(
                  'h-10 shrink-0 animate-pulse rounded-2xl bg-zinc-100 dark:bg-zinc-900 sm:h-12',
                  width,
                  index > 2 ? 'hidden sm:block' : ''
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div data-emoticon-grid-shell="" className="min-h-0 flex-1 overflow-hidden">
        <div data-emoticon-grid-scroll="" className="h-full w-full overflow-hidden">
          <div
            data-emoticon-grid-content=""
            className={cn('relative', EMOTICON_CONTENT_CLASS_NAME)}
          >
            <div
              data-emoticon-skeleton-section-heading=""
              className="flex h-[42px] items-end pb-2 sm:h-[74px] sm:pb-4"
            >
              <div className="h-5 w-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900 sm:h-8 sm:w-32" />
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(54px,1fr))] content-start gap-2 px-2">
              {Array.from({ length: 144 }, (_, index) => (
                <div
                  key={index}
                  className="grid h-14 animate-pulse place-items-center rounded-xl"
                >
                  <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ActionButton({
  ariaLabel,
  icon,
  label,
  tone,
  onClick,
}: {
  ariaLabel: string
  icon: ReactNode
  label: string
  tone: 'default' | 'success' | 'error'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      data-emoticon-action-button=""
      data-tone={tone}
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        'emoticon-action-button inline-flex h-11 min-w-0 translate-y-0 items-center justify-center gap-1.5 rounded-xl px-2 text-xs font-bold transition-[background-color,border-color,box-shadow,transform,color,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 sm:gap-2 sm:px-3 sm:text-sm',
        tone === 'default' &&
          'border border-white/65 bg-white/58 text-zinc-700 shadow-[0_18px_36px_-20px_rgba(15,23,42,0.32),0_4px_14px_-10px_rgba(15,23,42,0.20),inset_0_1px_0_rgba(255,255,255,0.94)] backdrop-blur-xl focus-visible:ring-zinc-400/35 dark:border-white/10 dark:bg-white/10 dark:text-zinc-200 dark:shadow-[0_18px_38px_-20px_rgba(2,6,23,0.78),0_4px_16px_-10px_rgba(2,6,23,0.60),inset_0_1px_0_rgba(255,255,255,0.12)]',
        tone === 'success' &&
          'bg-emerald-500 text-white shadow-[0_12px_30px_-16px_rgba(16,185,129,0.9)] focus-visible:ring-emerald-400/45 dark:bg-emerald-500 dark:text-white',
        tone === 'error' &&
          'bg-rose-500 text-white shadow-[0_12px_30px_-16px_rgba(244,63,94,0.85)] focus-visible:ring-rose-400/45 dark:bg-rose-500 dark:text-white'
      )}
    >
      <span className="grid h-4 w-4 shrink-0 place-items-center">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  )
}

function getColumnCount(width: number) {
  const innerWidth = Math.max(0, width - GRID_EDGE_BLEED * 2)
  const minCardWidth =
    innerWidth >= 640 ? DESKTOP_CARD_MIN_WIDTH : MOBILE_CARD_MIN_WIDTH

  return Math.max(
    1,
    Math.floor((innerWidth + GRID_GAP) / (minCardWidth + GRID_GAP))
  )
}

function prefetchEmoticonImage(src: string) {
  if (
    prefetchedEmoticonImages.has(src) ||
    pendingEmoticonImagePrefetches.has(src)
  ) {
    return
  }

  const image = new window.Image()
  image.decoding = 'async'

  if ('fetchPriority' in image) {
    image.fetchPriority = 'low'
  }

  const loadPromise = new Promise<void>((resolve) => {
    image.onload = () => resolve()
    image.onerror = () => resolve()
  })

  image.src = src

  const decodePromise =
    typeof image.decode === 'function'
      ? image.decode().catch(() => undefined)
      : loadPromise

  const promise = Promise.all([loadPromise, decodePromise])
    .catch(() => undefined)
    .then(() => {
      markEmoticonImageSettled(src)
      pendingEmoticonImagePrefetches.delete(src)
    })

  pendingEmoticonImagePrefetches.set(src, {
    image,
    promise,
  })
}

function scheduleEmoticonImagePrefetch(srcs: string[]) {
  if (typeof window === 'undefined' || srcs.length === 0) {
    return () => undefined
  }

  const idleWindow = window as BrowserIdleWindow
  const uniqueSrcs = Array.from(new Set(srcs)).filter((src) => {
    return (
      !prefetchedEmoticonImages.has(src) &&
      !pendingEmoticonImagePrefetches.has(src)
    )
  })
  let cursor = 0
  let idleHandle: number | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  let isCancelled = false

  const cancelScheduledRun = () => {
    if (idleHandle !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleHandle)
      idleHandle = null
    }

    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }
  }

  const runChunk = () => {
    idleHandle = null
    timeoutHandle = null

    if (isCancelled) {
      return
    }

    const end = Math.min(cursor + PREFETCH_CHUNK_SIZE, uniqueSrcs.length)

    for (let index = cursor; index < end; index += 1) {
      prefetchEmoticonImage(uniqueSrcs[index])
    }

    cursor = end

    if (cursor < uniqueSrcs.length) {
      scheduleChunk()
    }
  }

  const scheduleChunk = () => {
    if (isCancelled || cursor >= uniqueSrcs.length) {
      return
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(runChunk, { timeout: 700 })
      return
    }

    timeoutHandle = setTimeout(runChunk, 80)
  }

  runChunk()

  return () => {
    isCancelled = true
    cancelScheduledRun()
  }
}

function scheduleBackgroundEmoticonImageWarmup(srcs: string[]) {
  if (typeof window === 'undefined' || srcs.length === 0) {
    return () => undefined
  }

  const idleWindow = window as BrowserIdleWindow
  const uniqueSrcs = Array.from(new Set(srcs)).filter((src) => {
    return (
      !prefetchedEmoticonImages.has(src) &&
      !pendingEmoticonImagePrefetches.has(src)
    )
  })
  let cursor = 0
  let idleHandle: number | null = null
  let timeoutHandle: ReturnType<typeof setTimeout> | null = null
  let animationFrameHandle: number | null = null
  let taskAbortController: AbortController | null = null
  let isCancelled = false

  const cancelScheduledRun = () => {
    if (idleHandle !== null && idleWindow.cancelIdleCallback) {
      idleWindow.cancelIdleCallback(idleHandle)
      idleHandle = null
    }

    if (timeoutHandle !== null) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }

    if (animationFrameHandle !== null) {
      cancelAnimationFrame(animationFrameHandle)
      animationFrameHandle = null
    }

    taskAbortController?.abort()
    taskAbortController = null
  }

  const scheduleChunk = () => {
    if (isCancelled || cursor >= uniqueSrcs.length) {
      return
    }

    if (idleWindow.scheduler?.postTask) {
      taskAbortController = new AbortController()
      idleWindow.scheduler
        .postTask(runChunk, {
          priority: 'background',
          signal: taskAbortController.signal,
        })
        .catch(() => undefined)
      return
    }

    if (idleWindow.requestIdleCallback) {
      idleHandle = idleWindow.requestIdleCallback(runChunk, { timeout: 1200 })
      return
    }

    timeoutHandle = setTimeout(runChunk, 120)
  }

  const runChunk = () => {
    idleHandle = null
    timeoutHandle = null
    taskAbortController = null

    if (isCancelled) {
      return
    }

    const end = Math.min(
      cursor + BACKGROUND_PREFETCH_CHUNK_SIZE,
      uniqueSrcs.length
    )

    for (let index = cursor; index < end; index += 1) {
      prefetchEmoticonImage(uniqueSrcs[index])
    }

    cursor = end

    if (cursor < uniqueSrcs.length) {
      scheduleChunk()
    }
  }

  animationFrameHandle = requestAnimationFrame(() => {
    animationFrameHandle = requestAnimationFrame(scheduleChunk)
  })

  return () => {
    isCancelled = true
    cancelScheduledRun()
  }
}

const EmoticonCard = memo(function EmoticonCard({
  item,
  isSelected,
  collectionId,
  imageLoading,
  isTouchInput,
  onSelect,
  onTooltipHide,
  onTooltipShow,
}: {
  item: EmoticonItem
  isSelected: boolean
  collectionId: EmoticonCollectionId
  imageLoading: 'eager' | 'lazy'
  isTouchInput: boolean
  onSelect: (item: EmoticonItem, trigger: HTMLButtonElement) => void
  onTooltipHide: (itemId: string) => void
  onTooltipShow: (item: EmoticonItem, trigger: HTMLButtonElement) => void
}) {
  const [isImageLoaded, setIsImageLoaded] = useState(() =>
    hasSettledEmoticonImage(item.src)
  )
  const handleImageSettled = () => {
    markEmoticonImageSettled(item.src)
    setIsImageLoaded(true)
  }

  return (
    <button
      type="button"
      data-emoticon-card=""
      data-collection={collectionId}
      data-touch-input={isTouchInput ? 'true' : undefined}
      aria-label={`${item.name} 선택`}
      onBlur={() => {
        if (!isTouchInput) onTooltipHide(item.id)
      }}
      onClick={(event) => onSelect(item, event.currentTarget)}
      onFocus={(event) => {
        if (!isTouchInput) onTooltipShow(item, event.currentTarget)
      }}
      onMouseEnter={(event) => {
        if (!isTouchInput) onTooltipShow(item, event.currentTarget)
      }}
      onMouseLeave={() => {
        if (!isTouchInput) onTooltipHide(item.id)
      }}
      className={cn(
        'group grid h-14 place-items-center rounded-xl transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35',
        isSelected
          ? 'bg-zinc-100 shadow-sm ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10'
          : 'bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/70'
      )}
    >
      <span className="relative grid h-12 w-12 place-items-center">
        {!isImageLoaded ? (
          <span
            data-emoticon-card-skeleton=""
            className="absolute inset-1.5 animate-pulse rounded-xl bg-zinc-100/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] dark:bg-zinc-800/80"
          />
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.src}
          alt=""
          decoding="async"
          height={36}
          loading={imageLoading}
          onError={handleImageSettled}
          onLoad={handleImageSettled}
          width={36}
          className={cn(
            'relative h-9 w-9 object-contain transition duration-200 group-hover:scale-110',
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </span>
    </button>
  )
})

EmoticonCard.displayName = 'EmoticonCard'

function VirtualizedEmoticonGrid({
  collectionId,
  sections,
  showSectionHeadings,
  selectedItemId,
  onSelect,
}: {
  collectionId: EmoticonCollectionId
  sections: EmoticonGridSection[]
  showSectionHeadings: boolean
  selectedItemId: string | null
  onSelect: (item: EmoticonItem, trigger: HTMLButtonElement) => void
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [columnCount, setColumnCount] = useState(1)
  const [isCompactGrid, setIsCompactGrid] = useState(false)
  const [isTouchInput, setIsTouchInput] = useState(false)
  const [tooltip, setTooltip] = useState<FloatingTooltipState>(null)
  const rows = useMemo<EmoticonGridRow[]>(() => {
    const nextRows: EmoticonGridRow[] = []

    for (const section of sections) {
      if (showSectionHeadings) {
        nextRows.push({
          type: 'heading',
          key: `${section.id}-heading`,
          label: section.label,
        })
      }

      for (let index = 0; index < section.items.length; index += columnCount) {
        nextRows.push({
          type: 'icons',
          key: `${section.id}-${index}`,
          items: section.items.slice(index, index + columnCount),
        })
      }
    }

    return nextRows
  }, [columnCount, sections, showSectionHeadings])

  useLayoutEffect(() => {
    const contentElement = contentRef.current

    if (!contentElement) {
      return
    }

    const syncLayout = () => {
      const rect = contentElement.getBoundingClientRect()

      setColumnCount(getColumnCount(rect.width))
      setIsCompactGrid(rect.width < 640)
    }

    syncLayout()
    const observer = new ResizeObserver(syncLayout)
    observer.observe(contentElement)
    window.addEventListener('resize', syncLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', syncLayout)
    }
  }, [])

  useEffect(() => {
    return subscribeToTouchInputDeviceChange((nextIsTouchInput) => {
      setIsTouchInput(nextIsTouchInput)

      if (nextIsTouchInput) {
        setTooltip(null)
      }
    })
  }, [])

  const sectionHeadingHeight = isCompactGrid
    ? MOBILE_GRID_SECTION_HEADING_HEIGHT
    : DESKTOP_GRID_SECTION_HEADING_HEIGHT

  // TanStack Virtual keeps mutable methods on the virtualizer instance.
  // eslint-disable-next-line react-hooks/incompatible-library
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: (index) =>
      rows[index]?.type === 'heading'
        ? sectionHeadingHeight
        : GRID_ROW_HEIGHT,
    overscan: GRID_OVERSCAN,
  })
  const virtualRows = rowVirtualizer.getVirtualItems()
  const firstVirtualRowIndex = virtualRows[0]?.index ?? 0
  const lastVirtualRowIndex =
    virtualRows[virtualRows.length - 1]?.index ?? firstVirtualRowIndex
  const scrollOffset = rowVirtualizer.scrollOffset ?? 0
  const viewportHeight = scrollRef.current?.clientHeight ?? 0

  useEffect(() => {
    rowVirtualizer.measure()
  }, [
    collectionId,
    columnCount,
    rowVirtualizer,
    rows.length,
    sectionHeadingHeight,
  ])

  const handleTooltipShow = useCallback(
    (item: EmoticonItem, trigger: HTMLButtonElement) => {
      if (isTouchInput) {
        setTooltip(null)
        return
      }

      const rect = trigger.getBoundingClientRect()

      setTooltip({
        itemId: item.id,
        label: item.name,
        x: rect.left + rect.width / 2,
        y: Math.max(12, rect.top - 10),
      })
    },
    [isTouchInput]
  )

  const handleTooltipHide = useCallback((itemId: string) => {
    setTooltip((currentTooltip) => {
      if (currentTooltip?.itemId !== itemId) {
        return currentTooltip
      }

      return null
    })
  }, [])

  useEffect(() => {
    if (rows.length === 0 || lastVirtualRowIndex < 0) {
      return
    }

    const startRow = Math.max(0, firstVirtualRowIndex - PREFETCH_ROW_LOOKBEHIND)
    const endRow = Math.min(
      rows.length,
      lastVirtualRowIndex + PREFETCH_ROW_LOOKAHEAD
    )
    const prefetchSrcs = rows
      .slice(startRow, endRow + 1)
      .flatMap((row) => (row.type === 'icons' ? row.items : []))
      .map((item) => item.src)

    return scheduleEmoticonImagePrefetch(prefetchSrcs)
  }, [collectionId, firstVirtualRowIndex, lastVirtualRowIndex, rows])

  useEffect(() => {
    if (rows.length === 0 || lastVirtualRowIndex < 0) {
      return
    }

    const warmupSrcs = rows
      .slice(lastVirtualRowIndex + 1)
      .flatMap((row) => (row.type === 'icons' ? row.items : []))
      .map((item) => item.src)

    return scheduleBackgroundEmoticonImageWarmup(warmupSrcs)
  }, [collectionId, lastVirtualRowIndex, rows])

  return (
    <div
      ref={scrollRef}
      data-emoticon-grid-scroll=""
      data-emoticon-grid-overscan={GRID_OVERSCAN}
      data-lenis-prevent=""
      data-emoticon-prefetch-lookahead={PREFETCH_ROW_LOOKAHEAD}
      data-emoticon-prefetch-lookbehind={PREFETCH_ROW_LOOKBEHIND}
      data-emoticon-background-prefetch="continuous"
      data-emoticon-background-prefetch-chunk={BACKGROUND_PREFETCH_CHUNK_SIZE}
      data-emoticon-prefetch-mode="while-scrolling"
      className="h-full w-full overflow-y-auto overscroll-contain"
      style={{
        contain: 'layout paint style',
        scrollbarGutter: 'stable',
      }}
    >
      <div
        ref={contentRef}
        data-emoticon-grid-content=""
        className={cn('relative', EMOTICON_CONTENT_CLASS_NAME)}
        style={{
          contain: 'layout paint style',
          height: `${rowVirtualizer.getTotalSize()}px`,
        }}
      >
        {virtualRows.map((virtualRow) => {
          const row = rows[virtualRow.index]

          if (!row) {
            return null
          }

          const transform = `translateY(${virtualRow.start}px)`

          if (row.type === 'heading') {
            return (
              <div
                key={virtualRow.key}
                className="absolute top-0 flex items-end pb-2 sm:pb-4"
                style={{
                  height: `${sectionHeadingHeight}px`,
                  left: `${GRID_EDGE_BLEED}px`,
                  right: `${GRID_EDGE_BLEED}px`,
                  transform,
                }}
              >
                {row.label ? (
                  <h2 className="text-lg font-black leading-none tracking-tight text-[#6B7684] sm:text-2xl">
                    {row.label}
                  </h2>
                ) : null}
              </div>
            )
          }

          return (
            <div
              key={virtualRow.key}
              className="absolute top-0 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
                height: `${GRID_ROW_HEIGHT - GRID_GAP}px`,
                left: `${GRID_EDGE_BLEED}px`,
                right: `${GRID_EDGE_BLEED}px`,
                transform,
              }}
            >
              {row.items.map((item) => {
                const rowEnd = virtualRow.start + virtualRow.size
                const isNearViewport =
                  rowEnd >= scrollOffset - GRID_ROW_HEIGHT * EAGER_ROW_BUFFER &&
                  virtualRow.start <=
                    scrollOffset +
                      viewportHeight +
                      GRID_ROW_HEIGHT * EAGER_ROW_BUFFER

                return (
                  <EmoticonCard
                    key={item.id}
                    item={item}
                    collectionId={collectionId}
                    imageLoading={isNearViewport ? 'eager' : 'lazy'}
                    isTouchInput={isTouchInput}
                    isSelected={selectedItemId === item.id}
                    onSelect={onSelect}
                    onTooltipHide={handleTooltipHide}
                    onTooltipShow={handleTooltipShow}
                  />
                )
              })}
            </div>
          )
        })}
      </div>
      {tooltip && typeof document !== 'undefined'
        ? createPortal(<FloatingEmoticonTooltip tooltip={tooltip} />, document.body)
        : null}
    </div>
  )
}

function FloatingEmoticonTooltip({
  tooltip,
}: {
  tooltip: NonNullable<FloatingTooltipState>
}) {
  return (
    <div
      role="tooltip"
      data-emoticon-floating-tooltip=""
      className="pointer-events-none fixed z-[90] -translate-x-1/2 -translate-y-full rounded-xl border border-zinc-950/5 bg-zinc-950 px-3 py-1.5 text-xs font-bold text-white shadow-[0_14px_34px_-18px_rgba(15,23,42,0.64)] dark:border-white/10 dark:bg-zinc-100 dark:text-zinc-950"
      style={{
        left: `${tooltip.x}px`,
        top: `${tooltip.y}px`,
      }}
    >
      {tooltip.label}
    </div>
  )
}

function BottomActionSheet({
  item,
  feedback,
  isClosing,
  centerX,
  onClose,
  onDownloadSvg,
  onDownloadPng,
  onCopySvg,
  onCopyImage,
}: {
  item: EmoticonItem
  feedback: ActionFeedback
  isClosing: boolean
  centerX: number | null
  onClose: () => void
  onDownloadSvg: () => void
  onDownloadPng: () => void
  onCopySvg: () => void
  onCopyImage: () => void
}) {
  const titleId = useId()
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const svgDownloadState = getActionButtonState({
    actionKey: 'download-svg',
    feedback,
    visibleLabel: 'SVG',
    defaultAriaLabel: 'Download SVG',
    successAriaLabel: 'Downloaded SVG',
    errorAriaLabel: 'Download SVG failed',
    defaultIcon: <DownloadIcon className="h-4 w-4" />,
  })
  const pngDownloadState = getActionButtonState({
    actionKey: 'download-png',
    feedback,
    visibleLabel: 'PNG',
    defaultAriaLabel: 'Download PNG',
    successAriaLabel: 'Downloaded PNG',
    errorAriaLabel: 'Download PNG failed',
    defaultIcon: <DownloadIcon className="h-4 w-4" />,
  })
  const svgCopyState = getActionButtonState({
    actionKey: 'copy-svg',
    feedback,
    visibleLabel: 'SVG',
    defaultAriaLabel: 'Copy SVG',
    successAriaLabel: 'Copied SVG',
    errorAriaLabel: 'Copy SVG failed',
    defaultIcon: <CopyIcon className="h-4 w-4" />,
  })
  const pngCopyState = getActionButtonState({
    actionKey: 'copy-png',
    feedback,
    visibleLabel: 'PNG',
    defaultAriaLabel: 'Copy PNG',
    successAriaLabel: 'Copied PNG',
    errorAriaLabel: 'Copy PNG failed',
    defaultIcon: <CopyIcon className="h-4 w-4" />,
  })

  useEffect(() => {
    if (isClosing) {
      return
    }

    const sheet = sheetRef.current

    if (!sheet) {
      return
    }

    const firstFocusable = getFocusableElements(sheet)[0]

    requestAnimationFrame(() => {
      ;(firstFocusable ?? sheet).focus({ preventScroll: true })
    })
  }, [isClosing, item.id])

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') {
      return
    }

    const sheet = sheetRef.current

    if (!sheet) {
      return
    }

    const focusableElements = getFocusableElements(sheet)

    if (focusableElements.length === 0) {
      event.preventDefault()
      sheet.focus({ preventScroll: true })
      return
    }

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus({ preventScroll: true })
      return
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus({ preventScroll: true })
    }
  }

  return (
    <div
      className="pointer-events-none fixed bottom-[max(16px,env(safe-area-inset-bottom))] z-[70] w-[min(540px,calc(100vw-1.5rem))] -translate-x-1/2"
      style={{ left: centerX === null ? '50%' : `${centerX}px` }}
    >
      <div
        ref={sheetRef}
        data-emoticon-bottom-sheet=""
        data-state={isClosing ? 'closing' : 'open'}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'pointer-events-auto relative isolate w-full overflow-hidden rounded-[28px] border border-white/65 bg-white/70 p-3 shadow-[0_28px_90px_-34px_rgba(15,23,42,0.46),inset_0_1px_0_rgba(255,255,255,0.9)] ring-1 ring-zinc-950/5 backdrop-blur-2xl before:pointer-events-none before:absolute before:inset-x-5 before:top-0 before:h-px before:bg-white/90 after:pointer-events-none after:absolute after:-left-20 after:-top-24 after:h-48 after:w-48 after:rounded-full after:bg-sky-200/35 after:blur-3xl dark:border-white/10 dark:bg-zinc-950/72 dark:shadow-[0_30px_92px_-34px_rgba(2,6,23,0.88),inset_0_1px_0_rgba(255,255,255,0.08)] dark:ring-white/10 dark:after:bg-blue-400/12',
          isClosing
            ? 'motion-safe:animate-[emoticon-bottom-sheet-exit_180ms_cubic-bezier(0.4,0,1,1)_both]'
            : 'motion-safe:animate-[emoticon-bottom-sheet-enter_220ms_cubic-bezier(0.22,1,0.36,1)_both]'
        )}
      >
        <button
          type="button"
          aria-label="액션 시트 닫기"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-zinc-400 transition hover:bg-white/70 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 dark:hover:bg-white/10 dark:hover:text-zinc-100"
        >
          <XIcon className="h-4 w-4" />
        </button>

        <div className="grid min-w-0 grid-cols-[92px_minmax(0,1fr)] gap-2.5 sm:grid-cols-[128px_minmax(0,1fr)] sm:gap-4">
          <figure
            data-emoticon-selected-identity=""
            className="flex min-w-0 flex-col items-center justify-center px-1 py-1 sm:px-2 sm:py-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-emoticon-selected-preview=""
              src={item.src}
              alt=""
              className="h-16 w-16 shrink-0 object-contain drop-shadow-[0_16px_24px_rgba(15,23,42,0.12)] dark:drop-shadow-[0_18px_26px_rgba(2,6,23,0.48)] sm:h-20 sm:w-20"
            />
            <figcaption
              id={titleId}
              className="mt-2 w-full truncate text-center text-xs font-semibold leading-5 text-zinc-700 dark:text-zinc-300 sm:text-sm"
            >
              {item.name}
            </figcaption>
          </figure>

          <div className="flex min-w-0 flex-col justify-end pt-11">
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                ariaLabel={svgDownloadState.ariaLabel}
                icon={svgDownloadState.icon}
                label={svgDownloadState.label}
                tone={svgDownloadState.tone}
                onClick={onDownloadSvg}
              />
              <ActionButton
                ariaLabel={pngDownloadState.ariaLabel}
                icon={pngDownloadState.icon}
                label={pngDownloadState.label}
                tone={pngDownloadState.tone}
                onClick={onDownloadPng}
              />
              <ActionButton
                ariaLabel={svgCopyState.ariaLabel}
                icon={svgCopyState.icon}
                label={svgCopyState.label}
                tone={svgCopyState.tone}
                onClick={onCopySvg}
              />
              <ActionButton
                ariaLabel={pngCopyState.ariaLabel}
                icon={pngCopyState.icon}
                label={pngCopyState.label}
                tone={pngCopyState.tone}
                onClick={onCopyImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function EmoticonStoragePage() {
  const pageShellRef = useRef<HTMLElement | null>(null)
  const selectedTriggerRef = useRef<HTMLButtonElement | null>(null)
  const sheetCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const actionFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  )
  const [manifest, setManifest] = useState<EmoticonManifest | null>(null)
  const [activeCollectionId, setActiveCollectionId] =
    useState<EmoticonCollectionId>('material')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isSheetClosing, setIsSheetClosing] = useState(false)
  const [sheetCenterX, setSheetCenterX] = useState<number | null>(null)
  const [activeSubcategoryId, setActiveSubcategoryId] = useState('all')
  const [actionFeedback, setActionFeedback] = useState<ActionFeedback>(null)
  const [loadError, setLoadError] = useState('')
  const portalContainer =
    typeof document === 'undefined' ? null : document.body

  useEffect(() => {
    let isMounted = true

    fetch('/emoticons/manifest.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('manifest를 불러오지 못했습니다.')
        }

        return response.json() as Promise<EmoticonManifest>
      })
      .then((data) => {
        if (!isMounted) {
          return
        }

        setManifest(data)
      })
      .catch((error) => {
        if (!isMounted) {
          return
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : '이모티콘 목록을 불러오지 못했습니다.'
        )
      })

    return () => {
      isMounted = false
    }
  }, [])

  const preparedCollections = useMemo(() => {
    if (!manifest) {
      return new Map<EmoticonCollectionId, PreparedEmoticonCollection>()
    }

    return new Map(
      manifest.collections.map((collection) => {
        return [collection.id, prepareEmoticonCollection(collection)] as const
      })
    )
  }, [manifest])

  const activePreparedCollection = useMemo<PreparedEmoticonCollection | null>(() => {
    return preparedCollections.get(activeCollectionId) ?? null
  }, [activeCollectionId, preparedCollections])

  const activeCollection = activePreparedCollection?.collection ?? null

  const subcategories = getSubcategories(activeCollectionId)

  const visibleSections = useMemo<EmoticonGridSection[]>(() => {
    if (!activePreparedCollection) {
      return []
    }

    if (activeSubcategoryId === 'all') {
      return subcategories
        .filter((subcategory) => subcategory.id !== 'all')
        .map((subcategory) => {
          return activePreparedCollection.sectionsBySubcategory.get(subcategory.id)
        })
        .filter((section): section is EmoticonGridSection => {
          return Boolean(section && section.items.length > 0)
        })
    }

    const activeSection =
      activePreparedCollection.sectionsBySubcategory.get(activeSubcategoryId)

    return activeSection ? [activeSection] : []
  }, [activePreparedCollection, activeSubcategoryId, subcategories])
  const visibleItemCount = visibleSections.reduce((count, section) => {
    return count + section.items.length
  }, 0)
  const showSectionHeadings = activeSubcategoryId === 'all'

  const selectedItem = useMemo(() => {
    if (!selectedItemId) {
      return null
    }

    return activeCollection?.items.find((item) => item.id === selectedItemId) ?? null
  }, [activeCollection, selectedItemId])

  const clearSheetCloseTimer = useCallback(() => {
    if (!sheetCloseTimeoutRef.current) {
      return
    }

    clearTimeout(sheetCloseTimeoutRef.current)
    sheetCloseTimeoutRef.current = null
  }, [])

  const clearActionFeedbackTimer = useCallback(() => {
    if (!actionFeedbackTimeoutRef.current) {
      return
    }

    clearTimeout(actionFeedbackTimeoutRef.current)
    actionFeedbackTimeoutRef.current = null
  }, [])

  const resetActionFeedback = useCallback(() => {
    clearActionFeedbackTimer()
    setActionFeedback(null)
  }, [clearActionFeedbackTimer])

  const clearSelectedItemImmediately = useCallback(() => {
    clearSheetCloseTimer()
    resetActionFeedback()
    setSelectedItemId(null)
    setIsSheetClosing(false)
    setSheetCenterX(null)
    selectedTriggerRef.current = null
  }, [clearSheetCloseTimer, resetActionFeedback])

  const closeSelectedItem = useCallback(() => {
    if (!selectedItemId || isSheetClosing) {
      return
    }

    const trigger = selectedTriggerRef.current

    clearSheetCloseTimer()
    setIsSheetClosing(true)
    resetActionFeedback()

    sheetCloseTimeoutRef.current = setTimeout(() => {
      sheetCloseTimeoutRef.current = null
      setSelectedItemId(null)
      setIsSheetClosing(false)
      setSheetCenterX(null)

      requestAnimationFrame(() => {
        if (trigger?.isConnected) {
          trigger.focus({ preventScroll: true })
        }
      })
    }, SHEET_EXIT_DURATION_MS)
  }, [clearSheetCloseTimer, isSheetClosing, resetActionFeedback, selectedItemId])

  const handleSelectItem = useCallback(
    (item: EmoticonItem, trigger: HTMLButtonElement) => {
      selectedTriggerRef.current = trigger

      if (selectedItemId === item.id && !isSheetClosing) {
        closeSelectedItem()
        return
      }

      clearSheetCloseTimer()
      resetActionFeedback()
      setIsSheetClosing(false)
      setSelectedItemId(item.id)
    },
    [
      clearSheetCloseTimer,
      closeSelectedItem,
      isSheetClosing,
      resetActionFeedback,
      selectedItemId,
    ]
  )

  useEffect(() => {
    const closePanelOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSelectedItem()
      }
    }

    window.addEventListener('keydown', closePanelOnEscape)

    return () => {
      window.removeEventListener('keydown', closePanelOnEscape)
    }
  }, [closeSelectedItem])

  useEffect(() => {
    return () => {
      clearSheetCloseTimer()
      clearActionFeedbackTimer()
    }
  }, [clearActionFeedbackTimer, clearSheetCloseTimer])

  useLayoutEffect(() => {
    if (!selectedItem) {
      return
    }

    const pageShell = pageShellRef.current

    if (!pageShell) {
      return
    }

    const updateSheetCenter = () => {
      setSheetCenterX(getClampedSheetCenterX(pageShell))
    }

    updateSheetCenter()
    const observer = new ResizeObserver(updateSheetCenter)
    observer.observe(pageShell)
    window.addEventListener('resize', updateSheetCenter)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSheetCenter)
    }
  }, [selectedItem])

  const setTimedActionFeedback = useCallback(
    (key: ActionKey, status: 'success' | 'error') => {
      clearActionFeedbackTimer()
      setActionFeedback({ key, status })
      actionFeedbackTimeoutRef.current = setTimeout(() => {
        actionFeedbackTimeoutRef.current = null
        setActionFeedback(null)
      }, ACTION_FEEDBACK_DURATION_MS)
    },
    [clearActionFeedbackTimer]
  )

  const setSuccess = (key: ActionKey) => {
    setTimedActionFeedback(key, 'success')
  }

  const setError = (key: ActionKey) => {
    setTimedActionFeedback(key, 'error')
  }

  const handleDownloadSvg = async () => {
    if (!selectedItem) {
      return
    }

    try {
      const blob = await fetchSvgBlob(selectedItem)
      downloadBlob(blob, selectedItem.filename)
      setSuccess('download-svg')
    } catch {
      setError('download-svg')
    }
  }

  const handleCopySvg = async () => {
    if (!selectedItem) {
      return
    }

    try {
      const svg = await fetchSvgText(selectedItem)
      await navigator.clipboard.writeText(svg)
      setSuccess('copy-svg')
    } catch {
      setError('copy-svg')
    }
  }

  const handleDownloadPng = async () => {
    if (!selectedItem) {
      return
    }

    try {
      const blob = await fetchPngBlob(selectedItem)
      downloadBlob(blob, selectedItem.filename.replace(/\.svg$/i, '.png'))
      setSuccess('download-png')
    } catch {
      setError('download-png')
    }
  }

  const handleCopyImage = async () => {
    if (!selectedItem) {
      return
    }

    try {
      const blob = await fetchPngBlob(selectedItem)
      await copyPngToClipboard(blob)
      setSuccess('copy-png')
    } catch {
      setError('copy-png')
    }
  }

  if (!manifest && !loadError) {
    return <EmoticonStorageSkeleton />
  }

  return (
    <>
      <section
        ref={pageShellRef}
        data-emoticon-page-shell=""
        data-emoticon-viewport-contract="dynamic-safe-area"
        className={EMOTICON_PAGE_SHELL_CLASS_NAME}
      >
        <div
          data-emoticon-sticky-header=""
          className="z-20 shrink-0 bg-background pb-1 dark:bg-background"
        >
          <div className={EMOTICON_CONTENT_CLASS_NAME}>
            <div
              role="tablist"
              aria-label="이모티콘 종류"
              className="mb-3 flex flex-wrap items-end gap-x-5 gap-y-1.5 sm:mb-4 sm:gap-x-6 sm:gap-y-2 md:mb-6 md:gap-x-7"
            >
              {manifest?.collections.map((collection) => {
                const isActive = collection.id === activeCollectionId

                return (
                  <button
                    key={collection.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveCollectionId(collection.id)
                      setActiveSubcategoryId(getDefaultSubcategory(collection.id))
                      clearSelectedItemImmediately()
                    }}
                    className={cn(
                      'group inline-flex min-h-8 items-center gap-1.5 whitespace-nowrap rounded-xl text-[1.375rem] font-black leading-none tracking-tight focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 sm:text-2xl md:gap-2 md:text-3xl',
                      isActive
                        ? 'text-zinc-950 dark:text-zinc-50'
                        : 'text-zinc-300 hover:text-zinc-500 dark:text-zinc-700 dark:hover:text-zinc-500'
                    )}
                  >
                    <CollectionLogo id={collection.id} isActive={isActive} />
                    <span className="emoticon-collection-label">
                      {getCollectionLabel(collection.id)}
                    </span>
                  </button>
                )
              })}
            </div>

            <nav
              aria-label="이모티콘 세부 카테고리"
              className="-mx-1 mb-3 bg-background px-1 py-1 dark:bg-background sm:-mx-2 sm:mb-4 sm:px-2 sm:py-2"
            >
              <ScrollArea
                orientation="horizontal"
                data-emoticon-subcategory-scroll=""
                className="w-full"
              >
                <div
                  data-emoticon-subcategory-list=""
                  className="flex w-max gap-1.5 pr-1 sm:gap-2 sm:pr-2"
                >
                  {subcategories.map((subcategory) => {
                    const isActive = subcategory.id === activeSubcategoryId

                    return (
                      <button
                        key={subcategory.id}
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => {
                          setActiveSubcategoryId(subcategory.id)
                          clearSelectedItemImmediately()
                        }}
                        className={cn(
                          'inline-flex h-10 shrink-0 items-center gap-1.5 rounded-2xl px-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/35 sm:h-12 sm:gap-2 sm:px-5 sm:text-base',
                          isActive
                            ? 'bg-zinc-100 text-zinc-950 dark:bg-zinc-900 dark:text-zinc-50'
                            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/70 dark:hover:text-zinc-100'
                        )}
                      >
                        {subcategory.icon ? (
                          <span className="grid place-items-center">
                            {subcategory.icon}
                          </span>
                        ) : null}
                        <span>{subcategory.label}</span>
                      </button>
                    )
                  })}
                </div>
              </ScrollArea>
            </nav>
          </div>
        </div>

        <div
          data-emoticon-grid-shell=""
          className="relative min-h-0 flex-1 overflow-hidden"
        >
          {visibleItemCount > 0 && activeCollection ? (
            <VirtualizedEmoticonGrid
              key={`${activeCollection.id}-${activeSubcategoryId}`}
              collectionId={activeCollection.id}
              sections={visibleSections}
              showSectionHeadings={showSectionHeadings}
              selectedItemId={selectedItemId}
              onSelect={handleSelectItem}
            />
          ) : (
            <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-zinc-200 bg-white/55 text-sm font-semibold text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/45">
              {loadError || '검색 결과가 없습니다.'}
            </div>
          )}
        </div>

      {portalContainer && selectedItem
        ? createPortal(
            <BottomActionSheet
              item={selectedItem}
              feedback={actionFeedback}
              isClosing={isSheetClosing}
              centerX={sheetCenterX}
              onClose={() => {
                closeSelectedItem()
              }}
              onDownloadSvg={handleDownloadSvg}
              onDownloadPng={handleDownloadPng}
              onCopySvg={handleCopySvg}
              onCopyImage={handleCopyImage}
            />,
            portalContainer
          )
        : null}
      </section>
    </>
  )
}
