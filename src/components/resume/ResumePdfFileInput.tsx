'use client'

import { FileText, Upload } from 'lucide-react'
import { useId, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ResumePdfFileInputProps = {
  disabled?: boolean
}

export function ResumePdfFileInput({ disabled = false }: ResumePdfFileInputProps) {
  const inputId = useId()
  const [fileName, setFileName] = useState('')

  return (
    <div
      className={cn(
        'flex min-h-16 flex-col gap-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50/70 p-3 sm:flex-row sm:items-center dark:border-zinc-700 dark:bg-zinc-950/35',
        disabled && 'opacity-60'
      )}
    >
      <input
        id={inputId}
        type="file"
        name="resumePdf"
        accept="application/pdf,.pdf"
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          setFileName(event.currentTarget.files?.[0]?.name ?? '')
        }}
      />
      <label
        htmlFor={inputId}
        aria-disabled={disabled}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'w-full cursor-pointer sm:w-auto',
          disabled && 'pointer-events-none'
        )}
      >
        <Upload className="size-4" aria-hidden />
        PDF 파일 선택
      </label>
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <FileText className="mt-0.5 size-4 shrink-0 text-zinc-400 dark:text-zinc-500" aria-hidden />
        <div className="min-w-0 space-y-0.5">
          <p
            className={cn(
              'truncate text-sm',
              fileName
                ? 'font-medium text-zinc-900 dark:text-zinc-100'
                : 'text-zinc-500 dark:text-zinc-400'
            )}
          >
            {fileName || '선택된 파일 없음'}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">PDF, 최대 25MB</p>
        </div>
      </div>
    </div>
  )
}
