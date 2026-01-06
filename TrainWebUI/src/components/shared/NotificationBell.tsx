"use client";

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/lib/services/notificationService';
import { cn } from '@/lib/utils/utils';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96overflow-y-auto bg-background border border-border shadow-lg rounded-md z-50">
        <div className="flex items-center justify-between px-3 py-2 border-b">
          <h3 className="font-semibold">Thông báo</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-auto p-1 text-xs"
            >
              Xóa tất cả
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-muted-foreground">
            Không có thông báo mới
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "flex flex-col items-start gap-1 px-3 py-3 cursor-pointer",
                !notification.read && "bg-primary/5"
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start justify-between w-full">
                <span className="font-medium text-sm">{notification.title}</span>
                {!notification.read && (
                  <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">{notification.message}</p>
              <span className="text-xs text-muted-foreground">
                {new Date(notification.timestamp).toLocaleString('vi-VN')}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
