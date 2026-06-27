'use client'

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface GooeyInputClassNames {
  root?: string
  filterWrap?: string
  buttonRow?: string
  trigger?: string
  input?: string
  bubble?: string
  bubbleSurface?: string
}

interface GooeyInputProps {
  placeholder?: string
  collapsedLabel?: string
  className?: string
  classNames?: GooeyInputClassNames
  collapsedWidth?: number
  expandedWidth?: number
  expandedOffset?: number
  gooeyBlur?: number
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

const transition = {
  duration: 0.4,
  type: 'spring' as const,
  bounce: 0.25,
}

function GooeyFilter({ filterId, blur }: { filterId: string; blur: number }) {
  return (
    <svg className="absolute hidden h-0 w-0" aria-hidden="true">
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  )
}

function SearchIcon() {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      className="size-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </motion.svg>
  )
}

export function GooeyInput({
  placeholder = 'search',
  collapsedLabel,
  className,
  classNames,
  collapsedWidth = 115,
  expandedWidth = 200,
  expandedOffset = 50,
  gooeyBlur = 5,
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onOpenChange,
  disabled = false,
}: GooeyInputProps) {
  const reactId = useId()
  const safeId = reactId.replace(/:/g, '')
  const filterId = `gooey-filter-${safeId}`
  const inputRef = useRef<HTMLInputElement>(null)
  const previousExpandedRef = useRef(false)
  const [expanded, setExpanded] = useState(false)
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)

  const controlled = valueProp !== undefined
  const searchText = controlled ? valueProp : uncontrolledValue

  const setSearchText = useCallback(
    (next: string) => {
      if (!controlled) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [controlled, onValueChange]
  )

  const setOpen = useCallback(
    (next: boolean) => {
      setExpanded(next)
      onOpenChange?.(next)
    },
    [onOpenChange]
  )

  useEffect(() => {
    if (expanded) {
      inputRef.current?.focus()
    } else if (previousExpandedRef.current) {
      setSearchText('')
    }
    previousExpandedRef.current = expanded
  }, [expanded, setSearchText])

  const buttonVariants = useMemo(
    () => ({
      collapsed: { width: collapsedWidth, marginLeft: 0 },
      expanded: { width: expandedWidth, marginLeft: expandedOffset },
    }),
    [collapsedWidth, expandedOffset, expandedWidth]
  )

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
  }

  return (
    <div className={cn('relative flex items-center justify-center', className, classNames?.root)}>
      <GooeyFilter filterId={filterId} blur={gooeyBlur} />
      <div
        data-gooey-filter-wrap
        className={cn('relative flex h-10 items-center justify-center', classNames?.filterWrap)}
        style={{ filter: `url(#${filterId})` }}
      >
        <motion.div
          className={cn('flex h-10 items-center justify-center', classNames?.buttonRow)}
          variants={buttonVariants}
          initial="collapsed"
          animate={expanded ? 'expanded' : 'collapsed'}
          transition={transition}
        >
          <button
            data-gooey-trigger
            type="button"
            disabled={disabled}
            onClick={() => {
              if (!disabled) setOpen(true)
            }}
            className={cn(
              'flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-foreground px-4 text-sm font-medium text-background shadow-sm ring-1 ring-border/60 outline-none transition-[color,box-shadow] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
              classNames?.trigger
            )}
          >
            {!expanded ? <SearchIcon /> : null}
            {expanded ? (
              <motion.input
                ref={inputRef}
                type="search"
                enterKeyHint="search"
                autoComplete="off"
                value={searchText}
                onChange={handleChange}
                onBlur={() => {
                  if (!searchText) setOpen(false)
                }}
                disabled={disabled}
                placeholder={placeholder}
                initial={false}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn(
                  'h-full min-w-0 flex-1 bg-transparent text-sm text-background outline-none placeholder:text-background/50',
                  classNames?.input
                )}
              />
            ) : (
              <motion.span
                initial={false}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className={cn(
                  'min-w-0 truncate text-sm text-background/85',
                  classNames?.input
                )}
              >
                {collapsedLabel ?? placeholder}
              </motion.span>
            )}
          </button>
        </motion.div>
        <motion.div
          data-gooey-bubble
          className={cn(
            'absolute left-0 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center',
            classNames?.bubble
          )}
          variants={{
            collapsed: { scale: 0, opacity: 0 },
            expanded: { scale: 1, opacity: 1 },
          }}
          initial="collapsed"
          animate={expanded ? 'expanded' : 'collapsed'}
          transition={transition}
        >
          <div
            className={cn(
              'flex size-10 items-center justify-center rounded-full bg-foreground text-background shadow-sm ring-1 ring-border/60',
              classNames?.bubbleSurface
            )}
          >
            <SearchIcon />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
