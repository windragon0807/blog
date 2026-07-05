import type { ReactNode } from 'react'

export function SettingsSection({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={label}
      className="settings-item grid gap-2 rounded-lg border border-transparent bg-muted/45 p-2.5 transition-[background-color,border-color] focus-within:border-border/80 focus-within:bg-background/80 dark:bg-white/[0.04] dark:focus-within:bg-white/[0.07] sm:grid-cols-[4.25rem_minmax(0,1fr)] sm:items-center"
    >
      <p className="text-xs font-medium leading-none text-muted-foreground">
        {label}
      </p>
      {children}
    </section>
  )
}
