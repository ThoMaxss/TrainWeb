import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  actions?: ReactNode;
  stats?: Array<{
    icon: LucideIcon;
    label: string;
    value: string | number;
  }>;
}

export function PageHeader({ title, description, icon: Icon, actions, stats }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between" role="region" aria-label="Page header">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20" aria-hidden="true">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 md:gap-4 md:px-4 md:border-r border-border">
            {stats.map((stat, idx) => {
              const StatIcon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <StatIcon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <span className="font-semibold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
              );
            })}
          </div>
        )}
        {actions && (
          <div className="flex items-center gap-2 md:gap-3">{actions}</div>
        )}
      </div>
    </div>
  );
}
