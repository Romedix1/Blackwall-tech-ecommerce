import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import { Slot } from '@radix-ui/react-slot'
import { ButtonHTMLAttributes, Ref } from 'react'

const buttonVariants = cva(
  'w-full h-14 uppercase transition-none outline-none font-bold cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-background hover:bg-accent/80 hover:text-text-main focus:bg-accent/80 focus:text-text-main active:bg-accent/60 disabled:cursor-not-allowed disabled:bg-accent/50 disabled:text-background/50 disabled:hover:bg-accent/50 disabled:hover:text-background/50',
        secondary:
          'border border-accent bg-transparent text-accent hover:bg-accent hover:text-background focus:bg-accent focus:text-background active:bg-accent/80 disabled:cursor-not-allowed disabled:border-accent/50 disabled:text-accent/50 disabled:hover:bg-transparent disabled:hover:text-accent/50',
        delete:
          'border border-error-text bg-transparent text-error-text hover:bg-error-text/60 hover:text-text-main focus:bg-error-text/60 focus:text-text-main active:bg-error-bg active:text-text-main disabled:cursor-not-allowed disabled:border-error-text/50 disabled:text-error-text/50 disabled:hover:bg-transparent disabled:hover:text-error-text/50',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: Ref<HTMLButtonElement>
}

const Button = ({
  className,
  variant,
  asChild = false,
  ref,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : 'button'
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Button }
