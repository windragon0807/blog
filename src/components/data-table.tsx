'use client'

import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: keyof T
  header: string
  width?: string
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
    .map(
      (column, index) =>
        column.width ?? getDataTableColumnTrack(columns.length, index)
    )
    .join(' ')

  if (isDark) {
    return (
      <div
        className={cn(
          'w-full overflow-hidden rounded-[34px] text-left text-white',
          className
        )}
      >
        <DataTableMobileCards columns={columns} rows={rows} variant="dark" />
        <div className="custom-scrollbar hidden overflow-x-auto sm:block">
          <table className="block min-w-[680px] rounded-[34px] border border-white/10 bg-white/[0.085] p-2 pt-0 text-base shadow-[0_28px_100px_-56px_rgba(255,255,255,0.35)] backdrop-blur-md">
            <thead className="block">
              <tr
                className="grid px-1 text-white/58"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column, index) => (
                  <th
                    key={String(column.key)}
                    className="relative min-w-0 px-5 py-4 text-left text-sm font-semibold"
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
                      className="min-w-0 px-5 py-5 text-white/82 first:text-lg"
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[28px] text-left',
        'bg-zinc-100 p-2 dark:bg-zinc-900/60',
        className
      )}
    >
      <DataTableMobileCards columns={columns} rows={rows} variant="light" />
      <div className="custom-scrollbar hidden overflow-x-auto sm:block">
        <table className="block min-w-[640px] rounded-[28px] border border-zinc-200/80 bg-white/80 p-2 pt-0 text-base shadow-[0_18px_54px_-42px_rgba(24,24,27,0.42)] dark:border-zinc-700/70 dark:bg-zinc-900/58 dark:shadow-[0_22px_64px_-46px_rgba(2,6,23,0.9)]">
          <thead className="block text-zinc-500 dark:text-zinc-400">
            <tr
              className="grid px-1"
              style={{ gridTemplateColumns }}
            >
              {columns.map((column, index) => (
                <th
                  key={String(column.key)}
                  className="relative min-w-0 px-5 py-4 text-left text-sm font-semibold"
                >
                  {index > 0 ? (
                    <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 bg-zinc-200 dark:bg-zinc-700/70" />
                  ) : null}
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="block overflow-hidden rounded-[22px] border border-zinc-200/80 bg-white/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] dark:border-zinc-700/70 dark:bg-zinc-950/32 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="grid border-t border-zinc-200/75 bg-white/44 transition-colors first:border-t-0 hover:bg-white dark:border-zinc-800/75 dark:bg-white/[0.025] dark:hover:bg-white/[0.065]"
                style={{ gridTemplateColumns }}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="min-w-0 px-5 py-5 text-zinc-700 transition-colors first:text-lg first:text-zinc-950 dark:text-zinc-200/82 dark:first:text-zinc-50"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DataTableMobileCards<T extends Record<string, string | number>>({
  columns,
  rows,
  variant,
}: {
  columns: readonly DataTableColumn<T>[]
  rows: readonly T[]
  variant: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'
  const titleColumn = columns[0]
  const detailColumns = columns.slice(1)

  return (
    <div
      data-data-table-mobile-list=""
      className="space-y-2 sm:hidden"
    >
      {rows.map((row, rowIndex) => (
        <article
          key={rowIndex}
          className={cn(
            'rounded-[22px] border p-4 shadow-[0_16px_44px_-36px_rgba(24,24,27,0.5)]',
            isDark
              ? 'border-white/10 bg-white/[0.07] text-white'
              : 'border-zinc-200/80 bg-white/84 text-zinc-900 dark:border-zinc-700/70 dark:bg-zinc-950/34 dark:text-zinc-50'
          )}
        >
          {titleColumn ? (
            <h3 className="truncate text-base font-semibold tracking-normal">
              {row[titleColumn.key]}
            </h3>
          ) : null}
          {detailColumns.length > 0 ? (
            <dl className="mt-3 grid gap-2">
              {detailColumns.map((column) => (
                <div
                  key={String(column.key)}
                  className="grid grid-cols-[minmax(4.5rem,0.42fr)_minmax(0,1fr)] gap-3 text-sm"
                >
                  <dt
                    className={cn(
                      'truncate font-medium',
                      isDark ? 'text-white/48' : 'text-zinc-500 dark:text-zinc-400'
                    )}
                  >
                    {column.header}
                  </dt>
                  <dd
                    className={cn(
                      'min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
                      isDark ? 'text-white/82' : 'text-zinc-700 dark:text-zinc-200/82'
                    )}
                  >
                    {row[column.key]}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}
        </article>
      ))}
    </div>
  )
}

function getDataTableColumnTrack(columnCount: number, index: number) {
  if (columnCount <= 2) return 'minmax(0, 1fr)'
  if (index === 0 || index === columnCount - 1) return 'minmax(0, 1.35fr)'
  return 'minmax(0, 0.78fr)'
}
