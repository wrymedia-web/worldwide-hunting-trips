import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-wht-ink text-wht-bone font-mono tracking-wide',
        species: 'bg-wht-ink text-wht-bone font-mono text-xs tracking-wide',
        state: 'bg-wht-bone-2 text-wht-stone font-mono text-xs',
        secondary: 'bg-wht-bone-2 text-wht-stone font-mono text-xs',
        outline: 'border border-wht-ink text-wht-ink bg-transparent',
        brass: 'bg-wht-brass text-white',
        blaze: 'bg-wht-blaze text-white',
        ghost: 'bg-white/20 text-white border border-white/30',
        /* Legacy variants */
        copper: 'bg-wht-blaze text-white',
        sage: 'bg-wht-forest text-wht-bone',
        warm: 'bg-wht-bone-2 text-wht-stone',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
