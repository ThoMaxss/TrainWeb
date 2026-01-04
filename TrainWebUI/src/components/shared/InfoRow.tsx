// 🎨 Reusable info row component with consistent spacing and dark mode
import { cn } from "@/lib/utils/utils";

interface InfoRowProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

export function InfoRow({ 
  label, 
  value, 
  className, 
  labelClassName, 
  valueClassName 
}: InfoRowProps) {
  return (
    <div className={cn(
      "flex items-center justify-between py-2",
      className
    )}>
      <span className={cn(
        "text-sm text-muted-foreground",
        labelClassName
      )}>
        {label}:
      </span>
      <span className={cn(
        "text-sm font-medium text-foreground",
        valueClassName
      )}>
        {value}
      </span>
    </div>
  );
}