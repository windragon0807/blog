'use client'

import type { KeyboardEvent, ReactNode } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

export type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

export interface InstallCommandPanel {
  manager: PackageManager
  command: string
  panel: ReactNode
}

export function InstallCommandTabs({
  panels,
}: {
  panels: readonly InstallCommandPanel[]
}) {
  const generatedId = useId()
  const [activeManager, setActiveManager] = useState<PackageManager>(
    panels[0]?.manager ?? 'pnpm'
  )
  const tabRefs = useRef<Record<PackageManager, HTMLButtonElement | null>>({
    pnpm: null,
    npm: null,
    yarn: null,
    bun: null,
  })
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  const syncIndicator = useCallback(() => {
    const activeElement = tabRefs.current[activeManager]
    if (!activeElement) return

    setIndicatorStyle({
      left: activeElement.offsetLeft,
      width: activeElement.offsetWidth,
    })
  }, [activeManager])

  useEffect(() => {
    syncIndicator()
    window.addEventListener('resize', syncIndicator)

    return () => {
      window.removeEventListener('resize', syncIndicator)
    }
  }, [syncIndicator])

  const activePanel = panels.find((panel) => panel.manager === activeManager)

  const activateManager = (manager: PackageManager, shouldFocus = true) => {
    setActiveManager(manager)
    if (shouldFocus) {
      requestAnimationFrame(() => tabRefs.current[manager]?.focus())
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const currentIndex = panels.findIndex(
      (panel) => panel.manager === activeManager
    )
    if (currentIndex < 0) return

    if (event.key === 'ArrowRight') {
      event.preventDefault()
      activateManager(panels[(currentIndex + 1) % panels.length].manager)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      activateManager(
        panels[(currentIndex - 1 + panels.length) % panels.length].manager
      )
    }
    if (event.key === 'Home') {
      event.preventDefault()
      activateManager(panels[0].manager)
    }
    if (event.key === 'End') {
      event.preventDefault()
      activateManager(panels[panels.length - 1].manager)
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <div
          role="tablist"
          aria-label="Install command package manager"
          className="relative inline-flex gap-1 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-900"
        >
          <span
            aria-hidden="true"
            className="absolute inset-y-1 rounded-lg bg-white shadow-sm transition-[left,width] duration-200 ease-out dark:bg-zinc-800"
            style={{
              left: indicatorStyle.left,
              width: indicatorStyle.width,
            }}
          />
          {panels.map((panel) => {
            const isSelected = activeManager === panel.manager

            return (
              <button
                key={panel.manager}
                ref={(node) => {
                  tabRefs.current[panel.manager] = node
                }}
                type="button"
                role="tab"
                id={`${generatedId}-${panel.manager}-tab`}
                aria-selected={isSelected}
                aria-controls={`${generatedId}-${panel.manager}-panel`}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => activateManager(panel.manager, false)}
                onKeyDown={handleKeyDown}
                className={`relative z-10 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50 ${
                  isSelected
                    ? 'text-zinc-950 dark:text-zinc-50'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                }`}
              >
                {panel.manager}
              </button>
            )
          })}
        </div>
      </div>

      {panels.map((panel) => (
        <div
          key={panel.manager}
          role="tabpanel"
          id={`${generatedId}-${panel.manager}-panel`}
          aria-labelledby={`${generatedId}-${panel.manager}-tab`}
          hidden={activePanel?.manager !== panel.manager}
        >
          {panel.panel}
        </div>
      ))}
    </div>
  )
}
