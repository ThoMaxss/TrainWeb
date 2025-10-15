import { cn } from "@/lib/utils/utils";
import { HTMLAttributes, forwardRef, ElementType, ReactNode } from "react";

// ===============================
// 📝 TYPOGRAPHY COMPONENTS
// ===============================
// Mục đích: component nhỏ cho UI screens, nhất quán typography scale

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  children?: ReactNode;
}

// Display heading - cho hero sections
export const Display = forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-display font-bold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
Display.displayName = "Display";

// H1 component
export const H1 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h1", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-h1 font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
H1.displayName = "H1";

// H2 component
export const H2 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h2", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-h2 font-semibold tracking-tight text-foreground",
        className
      )}
      {...props}
    />
  )
);
H2.displayName = "H2";

// H3 component
export const H3 = forwardRef<HTMLHeadingElement, TypographyProps>(
  ({ className, as: Component = "h3", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-h3 font-medium text-foreground",
        className
      )}
      {...props}
    />
  )
);
H3.displayName = "H3";

// Body text - chính
export const Body = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-body text-foreground",
        className
      )}
      {...props}
    />
  )
);
Body.displayName = "Body";

// Lead text - cho intro, descriptions
export const Lead = forwardRef<HTMLParagraphElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-body text-muted-foreground font-medium",
        className
      )}
      {...props}
    />
  )
);
Lead.displayName = "Lead";

// Small text
export const Small = forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "span", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Small.displayName = "Small";

// Micro text - cho labels, captions
export const Micro = forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "span", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-micro text-muted-foreground font-medium",
        className
      )}
      {...props}
    />
  )
);
Micro.displayName = "Micro";

// Code text
export const Code = forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "code", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
);
Code.displayName = "Code";

// Blockquote
export const Blockquote = forwardRef<HTMLQuoteElement, TypographyProps>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "mt-6 border-l-2 pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Blockquote.displayName = "Blockquote";

// List
export const List = forwardRef<HTMLUListElement, TypographyProps>(
  ({ className, as: Component = "ul", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "my-6 ml-6 list-disc text-body",
        className
      )}
      {...props}
    />
  )
);
List.displayName = "List";

// Muted text - helper
export const Muted = forwardRef<HTMLElement, TypographyProps>(
  ({ className, as: Component = "p", ...props }, ref) => (
    <Component
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Muted.displayName = "Muted";