import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-wht-blaze hover:bg-wht-blaze-2 text-white',
        secondary: 'bg-wht-forest hover:bg-wht-ink text-wht-bone',
        outline: 'border border-wht-ink bg-transparent text-wht-ink hover:bg-wht-ink hover:text-wht-bone',
        'outline-bone': 'border border-wht-bone bg-transparent text-wht-bone hover:bg-wht-bone hover:text-wht-ink',
        ghost: 'hover:bg-wht-bone-2 text-wht-ink bg-transparent',
        brass: 'bg-wht-brass hover:brightness-90 text-white',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        link: 'text-wht-blaze underline-offset-4 hover:underline bg-transparent',
        /* Legacy variants for backward compatibility */
        copper: 'bg-wht-blaze hover:bg-wht-blaze-2 text-white',
        'outline-white': 'border border-wht-bone bg-transparent text-wht-bone hover:bg-wht-bone hover:text-wht-ink',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        xl: 'h-12 rounded-md px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
