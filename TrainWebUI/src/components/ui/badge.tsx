import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2 py-1.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-hover-primary hover:shadow-md",
        secondary:
          "border-transparent bg-card text-foreground shadow-sm hover:bg-muted hover:shadow-md",
        destructive:
          "border-transparent bg-error text-primary-foreground shadow-sm hover:bg-destructive/90 hover:shadow-md",
        outline: "text-foreground border-border bg-background shadow-sm hover:bg-card hover:border-border",
        success: "border-transparent bg-success text-primary-foreground shadow-sm hover:bg-emerald-700 hover:shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
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
