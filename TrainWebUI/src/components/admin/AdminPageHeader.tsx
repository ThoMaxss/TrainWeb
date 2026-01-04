import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";

interface AdminPageHeaderProps {
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

export function AdminPageHeader({ title, description, icon, actions, stats }: AdminPageHeaderProps) {
  return (
    <div className="border-b bg-background">
      <div className="container mx-auto px-2 py-5 lg:px-2">
        <PageHeader title={title} description={description} icon={icon} actions={actions} stats={stats} />
      </div>
    </div>
  );
}
