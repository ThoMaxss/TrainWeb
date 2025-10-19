import * as React from "react"

import { cn } from "@/lib/utils/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex min-h-[48px] w-full rounded-lg border-2 border-border bg-background px-2 py-2 text-base text-foreground shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-base file:font-semibold file:text-foreground placeholder:text-muted-foreground hover:border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-card",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
