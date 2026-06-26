'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface TodoItem {
  id: number
  text: string
  done: boolean
}

interface PlayfulTodoListProps {
  initialItems?: string[]
  className?: string
}

export function PlayfulTodoList({
  initialItems = ['Sketch', 'Build', 'Review'],
  className,
}: PlayfulTodoListProps) {
  const [items, setItems] = useState<TodoItem[]>(
    initialItems.map((text, index) => ({ id: index + 1, text, done: index === 0 }))
  )

  return (
    <div
      className={cn(
        'w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">Playful Todo</p>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-accent-current)] text-[var(--background)]"
          onClick={() =>
            setItems((current) => [
              ...current,
              { id: Date.now(), text: `Task ${current.length + 1}`, done: false },
            ])
          }
          aria-label="Add todo"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 24, scale: 0.96 }}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <button
                type="button"
                className={cn(
                  'h-5 w-5 rounded-full border',
                  item.done
                    ? 'border-[var(--theme-accent-current)] bg-[var(--theme-accent-current)]'
                    : 'border-zinc-300 dark:border-zinc-700'
                )}
                onClick={() =>
                  setItems((current) =>
                    current.map((next) =>
                      next.id === item.id ? { ...next, done: !next.done } : next
                    )
                  )
                }
                aria-label={`Toggle ${item.text}`}
              />
              <span
                className={cn(
                  'flex-1 text-sm',
                  item.done && 'text-zinc-400 line-through decoration-2'
                )}
              >
                {item.text}
              </span>
              <button
                type="button"
                onClick={() =>
                  setItems((current) => current.filter((next) => next.id !== item.id))
                }
                aria-label={`Remove ${item.text}`}
              >
                <X className="h-4 w-4 text-zinc-400" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
