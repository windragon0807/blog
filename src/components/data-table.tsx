'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: keyof T
  header: string
}

interface DataTableProps<T extends Record<string, string | number>> {
  columns: readonly DataTableColumn<T>[]
  rows: readonly T[]
  variant?: 'light' | 'dark'
  className?: string
}

export function DataTable<T extends Record<string, string | number>>({
  columns,
  rows,
  variant = 'light',
  className,
}: DataTableProps<T>) {
  const isDark = variant === 'dark'
  const gridTemplateColumns = columns
    .map((_, index) => {
      if (columns.length <= 2) return 'minmax(0, 1fr)'
      if (index === 0 || index === columns.length - 1) return 'minmax(0, 1.35fr)'
      return 'minmax(0, 0.78fr)'
    })
    .join(' ')

  if (isDark) {
    return (
      <div
        className={cn(
          'w-full overflow-hidden rounded-[34px] text-left text-white',
          className
        )}
      >
        <ScrollArea orientation="horizontal" className="custom-scrollbar">
          <table className="block min-w-[680px] rounded-[34px] border border-white/10 bg-white/[0.085] p-2 pt-0 text-base shadow-[0_28px_100px_-56px_rgba(255,255,255,0.35)] backdrop-blur-md">
            <thead className="block">
              <tr
                className="grid px-1 text-white/58"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column, index) => (
                  <th
                    key={String(column.key)}
                    className="relative px-5 py-4 text-left text-sm font-semibold"
                  >
                    {index > 0 ? (
                      <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-white/10" />
                    ) : null}
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.055] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="grid border-t border-white/10 bg-white/[0.025] transition-colors first:border-t-0 hover:bg-white/[0.075]"
                  style={{ gridTemplateColumns }}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-5 py-5 text-white/82 first:text-lg"
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[28px] text-left',
        'bg-zinc-100 p-2 dark:bg-zinc-900',
        className
      )}
    >
      <ScrollArea orientation="horizontal" className="custom-scrollbar">
        <table className="w-full min-w-[640px] border-collapse overflow-hidden rounded-[28px] text-base">
          <thead className="text-zinc-500 dark:text-zinc-400">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className="relative px-6 py-4 text-left text-sm font-semibold"
                >
                  {index > 0 ? (
                    <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-zinc-200 dark:bg-zinc-800" />
                  ) : null}
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-zinc-950">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="group transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={String(column.key)}
                    className={cn(
                      'border-t border-zinc-200 px-6 py-5 text-zinc-900 transition-colors first:text-lg dark:border-zinc-800 dark:text-zinc-100',
                      rowIndex === 0 && columnIndex === 0 && 'rounded-tl-3xl',
                      rowIndex === 0 &&
                        columnIndex === columns.length - 1 &&
                        'rounded-tr-3xl',
                      rowIndex === rows.length - 1 &&
                        columnIndex === 0 &&
                        'rounded-bl-3xl',
                      rowIndex === rows.length - 1 &&
                        columnIndex === columns.length - 1 &&
                        'rounded-br-3xl'
                    )}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  )
}
