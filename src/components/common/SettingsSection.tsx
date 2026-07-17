import { useId, type ReactNode } from 'react'

export function SettingsSection({
  label,
  description,
  children,
}: {
  label: string
  description?: string
  children: ReactNode
}) {
  const titleId = useId()
  const descriptionId = useId()

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="settings-item rounded-2xl border border-border/70 bg-card/70 p-4 shadow-[0_12px_32px_-30px_rgba(15,23,42,0.4)] focus-within:border-ring/45 dark:bg-white/[0.035]"
    >
      <div className="mb-3">
        <h3 id={titleId} className="text-sm font-semibold text-foreground">
          {label}
        </h3>
        {description ? (
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-zinc-300"
          >
            {description}
          </p>
        ) : null}
      </div>
      <div>{children}</div>
    </section>
  )
}
