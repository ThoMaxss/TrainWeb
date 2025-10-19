import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-lg text-base font-semibold ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none active:scale-95 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-hover-primary hover:shadow-lg active:bg-primary/90",
        destructive:
          "bg-error text-primary-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg active:bg-destructive/90",
        outline:
          "border-2 border-border bg-background text-foreground shadow-sm hover:bg-card hover:border-border hover:shadow-md active:bg-card",
        secondary:
          "bg-card text-foreground shadow-sm hover:bg-muted hover:shadow-md active:bg-gray-300",
        ghost: "text-foreground hover:bg-card hover:text-foreground active:bg-muted",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary active:text-primary",
      },
      size: {
        default: "min-h-[48px] px-2 py-2",
        sm: "min-h-[44px] rounded-lg px-2 py-2 text-sm",
        lg: "min-h-[52px] rounded-xl px-5 py-2 text-lg",
        icon: "min-h-[48px] min-w-[48px] p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
