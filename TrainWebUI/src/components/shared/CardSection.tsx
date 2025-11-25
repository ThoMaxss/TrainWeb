// 🎨 Reusable card section with unified spacing and dark mode support
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";
import { LucideIcon } from "lucide-react";

interface CardSectionProps {
  title?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export function CardSection({ 
  title, 
  icon: Icon, 
  children, 
  className, 
  headerClassName,
  contentClassName 
}: CardSectionProps) {
  return (
    <Card className={cn(
      "rounded-xl border border-border bg-background p-6 shadow-sm",
      "dark:border-gray-800 dark:bg-gray-900",
      className
    )}>
      {title && (
        <div className={cn(
          "mb-4 flex items-center gap-2",
          headerClassName
        )}>
          {Icon && (
            <Icon className="h-5 w-5 text-primary " />
          )}
          <h3 className="text-lg font-semibold text-foreground dark:text-gray-100">
            {title}
          </h3>
        </div>
      )}
      <div className={contentClassName}>
        {children}
      </div>
    </Card>
  );
}