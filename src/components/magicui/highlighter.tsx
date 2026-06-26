"use client"

import { useLayoutEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
}

type ScrollTarget = Element | Window

function getScrollTargets(element: HTMLElement): ScrollTarget[] {
  const targets: ScrollTarget[] = [window]
  let parent = element.parentElement

  while (parent && parent !== document.body) {
    const style = window.getComputedStyle(parent)
    const overflow = `${style.overflow}${style.overflowX}${style.overflowY}`

    if (/(auto|scroll|overlay)/.test(overflow)) {
      targets.push(parent)
    }

    parent = parent.parentElement
  }

  return targets
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If isView is false, always show. If isView is true, wait for inView
  const shouldShow = !isView || isInView

  useLayoutEffect(() => {
    const element = elementRef.current
    let annotation: RoughAnnotation | null = null
    let resizeObserver: ResizeObserver | null = null
    let animationFrame: number | null = null
    let scrollTargets: ScrollTarget[] = []
    let refreshAnnotation: (() => void) | null = null

    if (shouldShow && element) {
      const annotationConfig = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      }

      const currentAnnotation = annotate(element, annotationConfig)
      annotation = currentAnnotation
      currentAnnotation.show()

      refreshAnnotation = () => {
        if (animationFrame !== null) return

        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = null
          currentAnnotation.show()
        })
      }

      resizeObserver = new ResizeObserver(() => {
        refreshAnnotation?.()
      })

      resizeObserver.observe(element)
      resizeObserver.observe(document.body)
      scrollTargets = getScrollTargets(element)
      scrollTargets.forEach((target) => {
        target.addEventListener("scroll", refreshAnnotation as EventListener, {
          passive: true,
        })
      })
    }

    return () => {
      annotation?.remove()
      if (refreshAnnotation) {
        scrollTargets.forEach((target) => {
          target.removeEventListener(
            "scroll",
            refreshAnnotation as EventListener
          )
        })
      }
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}
