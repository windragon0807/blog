'use client'

import { ArrowRight } from 'lucide-react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SlideArrowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string
  primaryColor?: string
  children?: ReactNode
}

export function SlideArrowButton({
  text,
  primaryColor = '#6f3cff',
  children,
  className,
  ...props
}: SlideArrowButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'group/slide relative rounded-full border border-white bg-white p-2 text-xl font-semibold shadow-sm',
        className
      )}
      {...props}
    >
      <div
        className="absolute left-0 top-0 flex h-full w-11 items-center justify-end rounded-full transition-all duration-200 ease-in-out group-hover/slide:w-full"
        style={{ backgroundColor: primaryColor }}
      >
        <span className="mr-3 text-white transition-all duration-200 ease-in-out">
          <ArrowRight size={20} />
        </span>
      </div>
      <span className="relative left-4 z-10 whitespace-nowrap px-8 font-semibold text-black transition-all duration-200 ease-in-out group-hover/slide:-left-3 group-hover/slide:text-white">
        {children ?? text ?? 'Get Started'}
      </span>
    </button>
  )
}
