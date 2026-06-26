'use client'

import { useId, useState } from 'react'
import { FileUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  label?: string
  description?: string
  className?: string
}

export function FileUpload({
  label = 'Upload files',
  description = 'Drop files here or browse from your computer.',
  className,
}: FileUploadProps) {
  const id = useId()
  const [names, setNames] = useState<string[]>([])

  return (
    <label
      htmlFor={id}
      className={cn(
        'flex w-full max-w-md cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white p-8 text-center transition-colors hover:border-[var(--theme-accent-current)] dark:border-zinc-700 dark:bg-zinc-950',
        className
      )}
    >
      <input
        id={id}
        type="file"
        multiple
        className="sr-only"
        onChange={(event) => {
          setNames(Array.from(event.target.files ?? []).map((file) => file.name))
        }}
      />
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--theme-accent-current)]/10 text-[var(--theme-accent-current)]">
        <FileUp className="h-5 w-5" />
      </span>
      <span className="mt-4 text-sm font-semibold text-zinc-950 dark:text-zinc-50">{label}</span>
      <span className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {names.length ? names.join(', ') : description}
      </span>
    </label>
  )
}
