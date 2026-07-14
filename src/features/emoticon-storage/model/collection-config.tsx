import Image from 'next/image'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import type { EmoticonCollectionId } from '../types'

export type Subcategory = {
  id: string
  label: string
  icon?: ReactNode
}

export const ALL_SUBCATEGORY: Subcategory = {
  id: 'all',
  label: '전체',
}

export const MATERIAL_SUBCATEGORIES: readonly Subcategory[] = [
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

export const TOSSFACE_SUBCATEGORIES: readonly Subcategory[] = [
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

export const RYONG_SUBCATEGORIES: readonly Subcategory[] = [
  ALL_SUBCATEGORY,
  {
    id: 'favorites',
    label: '아끼는 이미지',
    icon: <RyongCategoryIcon filename="noticon-teg1ooxzhglorh6rk9hs.svg" />,
  },
]

export function CollectionLogoImage({
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

export function MaterialLogo({ isActive }: { isActive: boolean }) {
  return (
    <CollectionLogoImage
      src="/emoticons/logos/material-icon-theme.png"
      isActive={isActive}
    />
  )
}

export function MaterialCategoryIcon({ filename }: { filename: string }) {
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

export function TossfaceCategoryIcon({ name }: { name: string }) {
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

export function TossfaceLogo({ isActive }: { isActive: boolean }) {
  return (
    <CollectionLogoImage
      src="/emoticons/logos/toss-symbol.png"
      isActive={isActive}
    />
  )
}

export function RyongCategoryIcon({ filename }: { filename: string }) {
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

export function RyongLogo({ isActive }: { isActive: boolean }) {
  return <CollectionLogoImage src="/icon.png" isActive={isActive} />
}

export function CollectionLogo({
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

export function getSubcategories(collectionId: EmoticonCollectionId) {
  if (collectionId === 'tossface') {
    return TOSSFACE_SUBCATEGORIES
  }

  if (collectionId === 'ryong') {
    return RYONG_SUBCATEGORIES
  }

  return MATERIAL_SUBCATEGORIES
}

export function getDefaultSubcategory(collectionId: EmoticonCollectionId) {
  return getSubcategories(collectionId)[0]?.id ?? 'all'
}

export function getCollectionLabel(collectionId: EmoticonCollectionId) {
  if (collectionId === 'tossface') {
    return 'Tossface'
  }

  if (collectionId === 'ryong') {
    return 'Ryong'
  }

  return 'Material'
}
