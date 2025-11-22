// 🎨 Reusable status badge with unified design system and dark mode support
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/utils";
import { LucideIcon } from "lucide-react";

interface BadgeStatusProps {
  status: "success" | "warning" | "error" | "info" | "upcoming" | "completed" | "cancelled";
  label: string;
  icon?: LucideIcon;
  className?: string;
}

const statusConfig = {
  success: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success/30 dark:border-success/80",
  upcoming: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-success/30 dark:border-success/80",
  warning: "bg-warning/10 text-warning border-warning/20 dark:bg-warning/20 dark:text-warning/30 dark:border-warning/80",
  error: "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/10 dark:text-destructive/30 dark:border-destructive/80",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20 dark:bg-destructive/10 dark:text-destructive/30 dark:border-destructive/80",
  info: "bg-primary/10 text-primary border-primary dark:bg-primary/10 dark:text-primary-foreground/80 dark:border-primary",
  completed: "bg-card text-foreground border-border dark:bg-gray-800 dark:text-muted-foreground dark:border-gray-700"
};

export function BadgeStatus({ status, label, icon: Icon, className }: BadgeStatusProps) {
  return (
    <Badge className={cn(
      "inline-flex items-center gap-1.5 px-2 py-1.5 text-sm font-medium border rounded-full",
      statusConfig[status],
      className
    )}>
      {Icon && <Icon className="h-4 w-4" />}
      {label}
    </Badge>
  );
}