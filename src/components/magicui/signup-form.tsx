'use client'

import type { FormEvent } from 'react'
import { cn } from '@/lib/utils'

interface SignupFormProps {
  title?: string
  description?: string
  submitLabel?: string
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
  className?: string
}

export function SignupForm({
  title = 'Create an account',
  description = 'Start with a small, focused form.',
  submitLabel = 'Sign up',
  onSubmit,
  className,
}: SignupFormProps) {
  return (
    <form
      className={cn(
        'w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-left shadow-[0_24px_80px_-48px_rgba(24,24,27,0.65)] dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(event)
      }}
    >
      <div>
        <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">{title}</h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      </div>
      <div className="mt-6 grid gap-3">
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Email
          <input
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[var(--theme-accent-current)] dark:border-zinc-800 dark:bg-zinc-950"
            type="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-200">
          Password
          <input
            className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-sm outline-none transition-colors focus:border-[var(--theme-accent-current)] dark:border-zinc-800 dark:bg-zinc-950"
            type="password"
            placeholder="••••••••"
          />
        </label>
      </div>
      <button
        type="submit"
        className="mt-5 h-11 w-full rounded-xl bg-[var(--theme-accent-current)] px-4 text-sm font-semibold text-[var(--background)] shadow-[0_18px_40px_-24px_var(--theme-accent-current)]"
      >
        {submitLabel}
      </button>
    </form>
  )
}
