import Link from 'next/link'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ActionVariant = 'default' | 'subtle' | 'glass' | 'outline' | 'secondary'
type ActionLinkProps = ComponentProps<typeof Link> & {
  variant?: ActionVariant
}

export function ActionLink({
  href,
  className,
  variant = 'subtle',
  children,
  ...props
}: ActionLinkProps) {
  return (
    <Button asChild variant={variant} className={cn('gap-2', className)}>
      <Link href={href} {...props}>
        {children}
      </Link>
    </Button>
  )
}
