'use client'

import type React from 'react'
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { cn } from '@/lib/utils'

export interface FlowerMenuItem {
  label: string
  icon: ReactNode | React.ComponentType<React.SVGProps<SVGSVGElement>>
  href?: string
  onClick?: () => void
  key?: string
}

interface FlowerMenuProps extends React.HTMLAttributes<HTMLElement> {
  items?: FlowerMenuItem[]
  menuItems?: FlowerMenuItem[]
  iconColor?: string
  backgroundColor?: string
  variant?: 'default' | 'glass'
  animationDuration?: number
  togglerSize?: number
  petalGap?: number
  triggerLabel?: string
  menuLabel?: string
}

function renderIcon(icon: FlowerMenuItem['icon'], size: number) {
  if (typeof icon === 'function') {
    const Icon = icon
    return <Icon aria-hidden="true" style={{ width: size, height: size }} />
  }

  return icon
}

function MenuToggler({
  isOpen,
  onToggle,
  backgroundColor,
  iconColor,
  variant,
  animationDuration,
  togglerSize,
  iconSize,
  controlsId,
  triggerLabel,
  buttonRef,
}: {
  isOpen: boolean
  onToggle: () => void
  backgroundColor: string
  iconColor: string
  variant: 'default' | 'glass'
  animationDuration: number
  togglerSize: number
  iconSize: number
  controlsId: string
  triggerLabel: string
  buttonRef: React.RefObject<HTMLButtonElement | null>
}) {
  const lineHeight = Math.max(2, iconSize * 0.1)
  const lineWidth = iconSize * 0.8
  const lineSpacing = iconSize * 0.25

  return (
    <button
      ref={buttonRef}
      type="button"
      className={cn(
        'absolute inset-0 z-20 m-auto flex touch-manipulation cursor-pointer items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2',
        variant === 'glass' &&
          'border border-white/10 bg-white/[0.08] shadow-[0_24px_90px_-52px_rgba(255,255,255,0.34)] backdrop-blur-md hover:bg-white/[0.14]'
      )}
      style={{
        backgroundColor: variant === 'glass' ? undefined : backgroundColor,
        color: iconColor,
        width: togglerSize,
        height: togglerSize,
      }}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      aria-controls={controlsId}
      aria-label={isOpen ? 'Close menu' : triggerLabel}
      onClick={onToggle}
    >
      <span
        aria-hidden="true"
        className="relative flex flex-col items-center justify-center"
        style={{ width: iconSize, height: iconSize }}
      >
        {[0, 1, 2].map((lineIndex) => (
          <span
            key={lineIndex}
            className={cn(
              'absolute bg-current transition-[transform,opacity] ease-out',
              isOpen && lineIndex === 0 && 'opacity-0',
              isOpen && lineIndex === 1 && 'rotate-45',
              isOpen && lineIndex === 2 && '-rotate-45'
            )}
            style={{
              transitionDuration: `${Math.min(animationDuration, 180)}ms`,
              width: lineWidth,
              height: lineHeight,
              top: isOpen
                ? `calc(50% - ${lineHeight / 2}px)`
                : `calc(50% + ${(lineIndex - 1) * lineSpacing}px - ${
                    lineHeight / 2
                  }px)`,
            }}
          />
        ))}
      </span>
    </button>
  )
}

export function FlowerMenu({
  items,
  menuItems,
  iconColor = 'white',
  backgroundColor = 'var(--theme-accent-current)',
  variant = 'default',
  animationDuration = 220,
  togglerSize = 44,
  petalGap = 28,
  triggerLabel = 'Open links menu',
  menuLabel = 'Menu',
  className,
  ...props
}: FlowerMenuProps) {
  const menuId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([])
  const [isOpen, setIsOpen] = useState(false)
  const menu = useMemo(() => menuItems ?? items ?? [], [items, menuItems])
  const itemCount = menu.length
  const safeTogglerSize = Math.max(44, togglerSize)
  const itemSize = safeTogglerSize
  const iconSize = Math.max(20, Math.floor(safeTogglerSize * 0.45))
  const orbitRadius = itemSize + petalGap
  const containerSize = (orbitRadius + itemSize / 2) * 2 + 8

  const close = useCallback(() => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((value) => !value)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    itemRefs.current[0]?.focus()
  }, [isOpen])

  const focusItem = (index: number) => {
    if (itemCount === 0) return
    itemRefs.current[(index + itemCount) % itemCount]?.focus()
  }

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLUListElement>) => {
    const activeIndex = itemRefs.current.findIndex(
      (node) => node === document.activeElement
    )

    switch (event.key) {
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        setIsOpen(false)
        break
      case 'Home':
        event.preventDefault()
        focusItem(0)
        break
      case 'End':
        event.preventDefault()
        focusItem(itemCount - 1)
        break
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault()
        focusItem(activeIndex < 0 ? 0 : activeIndex + 1)
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault()
        focusItem(activeIndex <= 0 ? itemCount - 1 : activeIndex - 1)
        break
    }
  }

  return (
    <nav
      ref={rootRef}
      aria-label={menuLabel}
      className={cn('relative mx-auto', className)}
      style={{ width: containerSize, height: containerSize, minHeight: containerSize }}
      {...props}
    >
      <MenuToggler
        isOpen={isOpen}
        onToggle={toggle}
        backgroundColor={backgroundColor}
        iconColor={iconColor}
        variant={variant}
        animationDuration={animationDuration}
        togglerSize={safeTogglerSize}
        iconSize={iconSize}
        controlsId={menuId}
        triggerLabel={triggerLabel}
        buttonRef={triggerRef}
      />

      <ul
        id={menuId}
        role="menu"
        aria-orientation="vertical"
        inert={!isOpen ? true : undefined}
        onKeyDown={onMenuKeyDown}
        className="absolute inset-0 m-0 list-none p-0"
      >
        {menu.map((item, index) => {
          const angle = (360 / Math.max(itemCount, 1)) * index
          const openDelay = 10 + index * 20
          const closeDelay = (itemCount - 1 - index) * 14
          const buttonClassName = cn(
            'flower-petal-control flex size-full touch-manipulation items-center justify-center rounded-full transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 active:scale-95',
            variant === 'glass'
              ? 'border border-white/10 bg-white/[0.07] text-white/82 shadow-[0_18px_58px_-38px_rgba(255,255,255,0.32)] backdrop-blur-md'
              : 'border border-zinc-200 bg-white text-zinc-600 shadow-sm',
            isOpen ? 'opacity-100' : 'opacity-0',
            'hover:scale-110 focus-visible:scale-110'
          )
          const buttonStyle = {
            transform: `rotate(-${angle}deg)`,
          }
          const content = (
            <>
              <span className="sr-only">{item.label}</span>
              {renderIcon(item.icon, iconSize)}
            </>
          )

          return (
            <li
              key={item.key ?? item.href ?? item.label}
              role="none"
              className={cn(
                'flower-petal pointer-events-none absolute inset-0 m-auto opacity-0 transition-[transform,opacity] ease-out',
                isOpen && 'pointer-events-auto opacity-100'
              )}
              style={{
                width: itemSize,
                height: itemSize,
                transitionDuration: `${animationDuration}ms`,
                transitionDelay: isOpen ? `${openDelay}ms` : `${closeDelay}ms`,
                transform: isOpen
                  ? `rotate(${angle}deg) translateX(-${orbitRadius}px) scale(1)`
                  : 'rotate(0deg) translateX(0) scale(0.72)',
              }}
            >
              {item.href ? (
                <a
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  role="menuitem"
                  aria-label={item.label}
                  tabIndex={isOpen ? 0 : -1}
                  className={buttonClassName}
                  style={buttonStyle}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                >
                  {content}
                </a>
              ) : (
                <button
                  ref={(node) => {
                    itemRefs.current[index] = node
                  }}
                  type="button"
                  role="menuitem"
                  aria-label={item.label}
                  tabIndex={isOpen ? 0 : -1}
                  className={buttonClassName}
                  style={buttonStyle}
                  onClick={() => {
                    item.onClick?.()
                    setIsOpen(false)
                  }}
                >
                  {content}
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
