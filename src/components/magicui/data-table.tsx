'use client'

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
        'w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white text-left shadow-sm dark:border-zinc-800 dark:bg-zinc-950',
        className
      )}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-zinc-200 dark:border-zinc-800">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-zinc-700 dark:text-zinc-200">
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
