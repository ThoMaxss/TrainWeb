"use client";

import { Card } from "@/components/ui/card";
import { Ticket, User, ClipboardList, ChevronRight } from "lucide-react";

interface QuickLinksCardProps {
  onNavigate: (path: string) => void;
}

const quickLinks = [
  {
    icon: Ticket,
    label: "Vé của tôi",
    description: "Xem và quản lý vé cá nhân",
    path: "/my-tickets",
    color: "text-success",
    bgColor: "bg-success/10",
    hoverColor: "hover:bg-success/20",
  },
  {
    icon: User,
    label: "Thông tin cá nhân",
    description: "Cập nhật thông tin tài khoản",
    path: "/profile",
    color: "text-primary",
    bgColor: "bg-primary/10",
    hoverColor: "hover:bg-primary/20",
  },
];

export function QuickLinksCard({ onNavigate }: QuickLinksCardProps) {
  return (
    <Card className="border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-success" />
          <h3 className="text-lg font-semibold">Truy cập nhanh</h3>
        </div>

        <div className="space-y-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.path}
                onClick={() => onNavigate(link.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${link.hoverColor} group`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${link.bgColor}`}>
                  <Icon className={`h-5 w-5 ${link.color}`} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{link.label}</p>
                  <p className="text-xs text-muted-foreground">{link.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-success transition-colors" />
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
