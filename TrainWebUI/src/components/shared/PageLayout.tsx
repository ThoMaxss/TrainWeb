// 🎨 Page container with consistent layout and dark mode support
import { cn } from "@/lib/utils/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-background to-muted/30",
      className
    )}>
      {children}
    </div>
  );
}

interface PageHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function PageHeader({ children, className }: PageHeaderProps) {
  return (
    <header className={cn(
      "bg-background/80 backdrop-blur-sm border-b border-border shadow-sm",
      "dark:bg-gray-900/80 dark:border-gray-800",
      className
    )}>
      <div className="container mx-auto px-2 lg:px-2 py-2">
        {children}
      </div>
    </header>
  );
}

interface PageContentProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "full";
}

export function PageContent({ children, className, maxWidth = "4xl" }: PageContentProps) {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "4xl": "max-w-4xl",
    full: "max-w-full"
  };

  return (
    <main className="container mx-auto px-2 lg:px-2 py-5">
      <div className={cn(
        maxWidthClass[maxWidth],
        "mx-auto space-y-3",
        className
      )}>
        {children}
      </div>
    </main>
  );
}