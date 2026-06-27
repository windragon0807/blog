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
  className?: string
}

export function DataTable<T extends Record<string, string | number>>({
  columns,
  rows,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[28px] bg-zinc-100 p-2 text-left dark:bg-zinc-900',
        className
      )}
    >
      <ScrollArea orientation="horizontal" className="custom-scrollbar">
        <table className="w-full min-w-[640px] border-separate border-spacing-0 text-base">
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
