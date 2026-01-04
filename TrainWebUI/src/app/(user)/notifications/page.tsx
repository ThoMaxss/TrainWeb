"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Check,
  Trash2,
  AlertCircle,
  Train,
  CreditCard,
  Gift,
  X,
  CheckCheck,
  Filter,
  Home,
  Search,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { getCurrentUserId } from "@/lib/utils/auth";

type NotificationCategory = "all" | "trip" | "payment" | "promotion" | "system";

interface Notification {
  id: string;
  category: "trip" | "payment" | "promotion" | "system";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  isCritical: boolean;
  actionType?: "ticket" | "transaction" | "promotion" | "system";
  actionId?: string;
}

const CACHE_KEY = "notifications_cache";

export default function NotificationsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load notifications with caching
  const loadNotifications = useCallback(() => {
    try {
      setLoading(true);
      const userId = getCurrentUserId() || "guest";
      const cached = localStorage.getItem(`${CACHE_KEY}_${userId}`);

      if (cached) {
        const parsed = JSON.parse(cached);
        const notifications = parsed.map((n: unknown) => {
          const record = n as Record<string, unknown>;
          const ts = record.timestamp;
          return {
            id: String(record.id ?? ""),
            category: (record.category as Notification['category']) ?? 'system',
            title: String(record.title ?? ""),
            message: String(record.message ?? ""),
            timestamp: new Date(String(ts ?? Date.now())),
            isRead: Boolean(record.isRead ?? false),
            isCritical: Boolean(record.isCritical ?? false),
            actionType: (record.actionType as Notification['actionType']) ?? undefined,
            actionId: record.actionId ? String(record.actionId) : undefined,
          } as Notification;
        });
        setNotifications(notifications);
      } else {
        // Mock data - replace with API call
        const mockNotifications: Notification[] = [
          {
            id: "notif-1",
            category: "trip",
            title: "Chuyến tàu SE3 bị hoãn 30 phút",
            message:
              "Chuyến tàu SE3 từ Hà Nội đi Đà Nẵng ngày 30/09/2025 sẽ xuất phát muộn 30 phút.",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            isRead: false,
            isCritical: true,
            actionType: "ticket",
            actionId: "VNAB12CD34",
          },
          {
            id: "notif-2",
            category: "payment",
            title: "Thanh toán thành công",
            message:
              "Giao dịch 1.900.000đ cho vé SE3 đã được xử lý thành công.",
            timestamp: new Date(Date.now() - 1000 * 60 * 120),
            isRead: false,
            isCritical: false,
            actionType: "transaction",
            actionId: "TXN2025093001234",
          },
          {
            id: "notif-3",
            category: "promotion",
            title: "🎉 Khuyến mãi mùa thu - Giảm 20%",
            message:
              "Đặt vé tàu đi Đà Nẵng, Nha Trang giảm ngay 20%. Áp dụng từ 01-15/10/2025.",
            timestamp: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
            isRead: false,
            isCritical: false,
            actionType: "promotion",
            actionId: "PROMO-FALL2025",
          },
          {
            id: "notif-4",
            category: "trip",
            title: "Nhắc nhở: Chuyến tàu sắp khởi hành",
            message:
              "Chuyến tàu SE3 của bạn sẽ khởi hành trong 24 giờ. Vui lòng chuẩn bị hành lý.",
            timestamp: new Date(Date.now() - 1000 * 60 * 300), // 5 hours ago
            isRead: true,
            isCritical: false,
            actionType: "ticket",
            actionId: "VNAB12CD34",
          },
          // Yesterday
          {
            id: "notif-5",
            category: "system",
            title: "Cập nhật điều khoản dịch vụ",
            message:
              "Chúng tôi đã cập nhật điều khoản sử dụng. Vui lòng xem lại để tiếp tục sử dụng dịch vụ.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26), // 26 hours ago
            isRead: false,
            isCritical: false,
            actionType: "system",
          },
          {
            id: "notif-6",
            category: "payment",
            title: "Hoàn tiền thành công",
            message:
              "Số tiền 950.000đ đã được hoàn về thẻ VISA của bạn. Vui lòng kiểm tra sau 3-5 ngày làm việc.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
            isRead: true,
            isCritical: false,
            actionType: "transaction",
            actionId: "TXN2025092501789",
          },
          // This week
          {
            id: "notif-7",
            category: "trip",
            title: "Xác nhận đặt vé thành công",
            message:
              "Vé tàu SE2 từ TP. Hồ Chí Minh đi Nha Trang đã được xác nhận. Mã vé: VN56EF78GH",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            isRead: true,
            isCritical: false,
            actionType: "ticket",
            actionId: "VN56EF78GH",
          },
          {
            id: "notif-8",
            category: "promotion",
            title: "Điểm thưởng của bạn sắp hết hạn",
            message:
              "Bạn có 1.500 điểm sẽ hết hạn vào 15/10/2025. Sử dụng ngay để được giảm giá.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
            isRead: true,
            isCritical: false,
            actionType: "promotion",
          },
          {
            id: "notif-9",
            category: "system",
            title: "Bảo trì hệ thống",
            message:
              "Hệ thống sẽ tạm ngưng hoạt động từ 01:00-03:00 ngày 05/10 để bảo trì.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
            isRead: true,
            isCritical: false,
            actionType: "system",
          },
          {
            id: "notif-10",
            category: "trip",
            title: "Thay đổi ga xuất phát",
            message:
              "Chuyến tàu SE5 sẽ xuất phát từ ga B thay vì ga A. Vui lòng kiểm tra lại thông tin.",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
            isRead: false,
            isCritical: true,
            actionType: "ticket",
            actionId: "VN78IJ90KL",
          },
        ];

        setNotifications(mockNotifications);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulate real-time notification
  useEffect(() => {
    const timer = setTimeout(() => {
      // Add a new notification after 10 seconds (for demo)
      const newNotif: Notification = {
        id: `notif-${Date.now()}`,
        category: "trip",
        title: "Cổng check-in đã mở",
        message: "Cổng số 3 đã mở để check-in chuyến tàu SE3. Vui lòng đến trước 15 phút.",
        timestamp: new Date(),
        isRead: false,
        isCritical: false,
        actionType: "ticket",
        actionId: "VNAB12CD34",
      };

      setNotifications((prev) => [newNotif, ...prev]);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    // Category filter
    if (activeTab !== "all" && notif.category !== activeTab) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!notif.title.toLowerCase().includes(query) && 
          !notif.message.toLowerCase().includes(query)) return false;
    }
    
    // Unread filter
    if (showOnlyUnread && notif.isRead) return false;
    
    return true;
  });

  // Group by date
  const groupedNotifications = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const groups: {
      title: string;
      notifications: Notification[];
    }[] = [];

    // Critical first
    const critical = filteredNotifications.filter((n) => n.isCritical);
    if (critical.length > 0) {
      groups.push({ title: "⚠️ Quan trọng", notifications: critical });
    }

    // Today
    const todayNotifs = filteredNotifications.filter(
      (n) => !n.isCritical && n.timestamp >= today
    );
    if (todayNotifs.length > 0) {
      groups.push({ title: "📅 Hôm nay", notifications: todayNotifs });
    }

    // Yesterday
    const yesterdayNotifs = filteredNotifications.filter(
      (n) =>
        !n.isCritical && n.timestamp >= yesterday && n.timestamp < today
    );
    if (yesterdayNotifs.length > 0) {
      groups.push({ title: "📆 Hôm qua", notifications: yesterdayNotifs });
    }

    // This week
    const weekNotifs = filteredNotifications.filter(
      (n) =>
        !n.isCritical && n.timestamp >= thisWeek && n.timestamp < yesterday
    );
    if (weekNotifs.length > 0) {
      groups.push({ title: "📋 Tuần này", notifications: weekNotifs });
    }

    return groups;
  };

  // Get time ago string
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return "Vừa xong";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "Hôm qua";
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Get category config
  const getCategoryConfig = (category: Notification["category"]) => {
    switch (category) {
      case "trip":
        return {
          label: "Chuyến đi",
          icon: Train,
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary",
        };
      case "payment":
        return {
          label: "Thanh toán",
          icon: CreditCard,
          color: "text-success",
          bgColor: "bg-success/10",
          borderColor: "border-success/20",
        };
      case "promotion":
        return {
          label: "Khuyến mãi",
          icon: Gift,
          color: "text-warning",
          bgColor: "bg-warning/10",
          borderColor: "border-warning/20",
        };
      case "system":
        return {
          label: "Hệ thống",
          icon: AlertCircle,
          color: "text-muted-foreground",
          bgColor: "bg-card",
          borderColor: "border-border",
        };
    }
  };

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Delete selected
  const deleteSelected = () => {
    setNotifications((prev) => prev.filter((n) => !selectedIds.has(n.id)));
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  // Mark selected as read
  const markSelectedAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (selectedIds.has(n.id) ? { ...n, isRead: true } : n))
    );
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    if (selectionMode) {
      toggleSelection(notification.id);
      return;
    }

    markAsRead(notification.id);

    // Navigate based on action type
    if (notification.actionType === "ticket") {
      router.push("/my-tickets");
    } else if (notification.actionType === "transaction") {
      router.push("/transactions");
    }
    // For promotion and system, just mark as read
  };

  // Navigation handlers
  const handleGoHome = () => {
    router.push("/");
  };

  // Unread count
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter((n) => n.isCritical && !n.isRead).length;

  const groups = groupedNotifications();

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted via-primary/10 to-primary/20">
      {/* Notification Header Section - Converted from sticky header */}
      <div className="border-b bg-background/80 backdrop-blur-sm shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                <Bell className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-primary">Thông báo</h1>
                  {unreadCount > 0 && (
                    <Badge className="bg-destructive hover:bg-destructive animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                  {criticalCount > 0 && (
                    <Badge variant="outline" className="border-destructive text-destructive">
                      {criticalCount} quan trọng
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Cập nhật về chuyến đi và giao dịch của bạn
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {selectionMode ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectionMode(false);
                      setSelectedIds(new Set());
                    }}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Hủy</span>
                  </Button>
                  {selectedIds.size > 0 && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={markSelectedAsRead}
                        className="gap-2 border-primary hover:bg-primary/10"
                      >
                        <CheckCheck className="h-4 w-4" />
                        <span className="hidden sm:inline">Đánh dấu đã đọc ({selectedIds.size})</span>
                        <span className="sm:hidden">{selectedIds.size}</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deleteSelected}
                        className="gap-2 border-destructive/20 hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Xóa ({selectedIds.size})</span>
                        <span className="sm:hidden">{selectedIds.size}</span>
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectionMode(true)}
                    className="gap-2"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Chọn</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="gap-2 border-primary hover:bg-primary/10"
                  >
                    <Check className="h-4 w-4" />
                    <span className="hidden md:inline">Đọc tất cả</span>
                    <span className="md:hidden">Tất cả</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOnlyUnread(!showOnlyUnread)}
                    className={cn(
                      "gap-2",
                      showOnlyUnread && "bg-primary/10 border-primary"
                    )}
                  >
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {showOnlyUnread ? "Hiện tất cả" : "Chưa đọc"}
                    </span>
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="gap-2 border-primary hover:bg-primary/10"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Trang chủ</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-3 lg:mt-0 lg:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm thông báo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-4xl">
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as NotificationCategory)
            }
            className="w-full"
          >
            <div className="sticky top-4 z-[25] bg-gradient-to-br from-muted via-primary/10 to-primary/20 pb-3">
              <TabsList className="grid w-full grid-cols-5 bg-background/90 backdrop-blur-sm shadow-sm">
                <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-primary/10">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Tất cả</span>
                  <span className="sm:hidden">Tất cả</span>
                  {activeTab === "all" && unreadCount > 0 && (
                    <Badge className="ml-1 h-5 w-5 p-0 text-xs bg-destructive">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="trip" className="gap-2 data-[state=active]:bg-primary/10">
                  <Train className="h-4 w-4" />
                  <span className="hidden sm:inline">Chuyến đi</span>
                  <span className="sm:hidden">Đi</span>
                </TabsTrigger>
                <TabsTrigger value="payment" className="gap-2 data-[state=active]:bg-success/10">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Thanh toán</span>
                  <span className="sm:hidden">TT</span>
                </TabsTrigger>
                <TabsTrigger value="promotion" className="gap-2 data-[state=active]:bg-warning/10">
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Khuyến mãi</span>
                  <span className="sm:hidden">KM</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="gap-2 data-[state=active]:bg-card">
                  <AlertCircle className="h-4 w-4" />
                  <span className="hidden sm:inline">Hệ thống</span>
                  <span className="sm:hidden">HT</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="mt-3">
              {groups.length === 0 ? (
                <EmptyState onGoHome={handleGoHome} category={activeTab} />
              ) : (
                <ScrollArea className="h-[calc(100vh-350px)]">
                  <div className="space-y-3">
                    {groups.map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-3">
                        {/* Date Header */}
                        <div className="flex items-center gap-2 px-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-muted-foreground">
                            {group.title}
                          </p>
                          <div className="flex-1 border-b border-dashed" />
                          <span className="text-xs text-muted-foreground">
                            {group.notifications.length} thông báo
                          </span>
                        </div>

                        {/* Notifications */}
                        <div className="space-y-2">
                          {group.notifications.map((notification, index) => (
                            <NotificationCard
                              key={notification.id}
                              notification={notification}
                              onClick={() => handleNotificationClick(notification)}
                              onDelete={() => deleteNotification(notification.id)}
                              onMarkAsRead={() => markAsRead(notification.id)}
                              isSelected={selectedIds.has(notification.id)}
                              selectionMode={selectionMode}
                              categoryConfig={getCategoryConfig(
                                notification.category
                              )}
                              timeAgo={getTimeAgo(notification.timestamp)}
                              animationDelay={index * 50}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Notification Card Component
interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
  onDelete: () => void;
  onMarkAsRead: () => void;
  isSelected: boolean;
  selectionMode: boolean;
  categoryConfig: {
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  timeAgo: string;
  animationDelay: number;
}

function NotificationCard({
  notification,
  onClick,
  onDelete,
  onMarkAsRead,
  isSelected,
  selectionMode,
  categoryConfig,
  timeAgo,
  animationDelay,
}: NotificationCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [touchStart, setTouchStart] = useState(0);

  const CategoryIcon = categoryConfig.icon;

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diff = e.touches[0].clientX - touchStart;
    if (Math.abs(diff) > 10) {
      setSwipeX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (swipeX > 100) {
      // Swipe right - mark as read
      onMarkAsRead();
    } else if (swipeX < -100) {
      // Swipe left - delete
      onDelete();
    }
    setSwipeX(0);
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-sm transition-all duration-300 hover:shadow-md",
        notification.isCritical && "border-2 border-destructive shadow-md bg-destructive/10",
        !notification.isRead && !notification.isCritical && "bg-primary/10 border-l-4 border-l-blue-500",
        isHovered && "shadow-lg transform scale-[1.02]",
        isSelected && "ring-2 ring-blue-500 shadow-lg"
      )}
      style={{
        transform: `translateX(${swipeX}px)`,
        animation: `slideIn 0.3s ease-out ${animationDelay}ms both`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex cursor-pointer items-start gap-3 p-2"
        onClick={onClick}
      >
        {/* Selection Checkbox */}
        {selectionMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onClick()}
            className="mt-1"
          />
        )}

        {/* Icon */}
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm",
            categoryConfig.bgColor,
            notification.isCritical && "bg-destructive/10 animate-pulse"
          )}
        >
          <CategoryIcon className={cn("h-6 w-6", categoryConfig.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                "text-foreground leading-tight",
                !notification.isRead && "font-semibold"
              )}
            >
              {notification.title}
            </h4>
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <div className="h-2 w-2 shrink-0 rounded-full bg-primary animate-pulse" />
              )}
              {notification.isCritical && (
                <Badge className="bg-destructive text-xs hover:bg-destructive animate-pulse">
                  Quan trọng
                </Badge>
              )}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {notification.message}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <Badge
              variant="outline"
              className={cn("text-xs", categoryConfig.borderColor)}
            >
              {categoryConfig.label}
            </Badge>
            <span className="text-xs text-muted-foreground font-medium">{timeAgo}</span>
            {notification.actionId && (
              <span className="text-xs text-muted-foreground bg-card px-2 py-1 rounded">
                {notification.actionId}
              </span>
            )}
          </div>
        </div>

        {/* Action Arrow */}
        {!selectionMode && (
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-1" />
        )}
      </div>

      {/* Swipe Indicators */}
      {swipeX !== 0 && (
        <>
          {swipeX > 0 && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-success">
              <Check className="h-6 w-6" />
            </div>
          )}
          {swipeX < 0 && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-destructive">
              <Trash2 className="h-6 w-6" />
            </div>
          )}
        </>
      )}

      {/* Hover Actions */}
      {isHovered && !selectionMode && (
        <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!notification.isRead && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
              }}
              className="h-8 w-8 p-0 hover:bg-success/10"
            >
              <Check className="h-4 w-4 text-success" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="h-8 w-8 p-0 hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      )}
    </Card>
  );
}

// Empty State Component
function EmptyState({
  onGoHome,
  category,
}: {
  onGoHome: () => void;
  category: NotificationCategory;
}) {
  const getMessage = () => {
    switch (category) {
      case "trip":
        return "Bạn chưa có thông báo về chuyến đi nào.";
      case "payment":
        return "Bạn chưa có thông báo về thanh toán nào.";
      case "promotion":
        return "Bạn chưa có khuyến mãi nào.";
      case "system":
        return "Bạn chưa có thông báo hệ thống nào.";
      default:
        return "Bạn chưa có thông báo nào.";
    }
  };

  const getIcon = () => {
    switch (category) {
      case "trip":
        return Train;
      case "payment":
        return CreditCard;
      case "promotion":
        return Gift;
      case "system":
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  return (
    <Card className="border-0 bg-background/90 backdrop-blur-sm shadow-md">
      <div className="flex flex-col items-center justify-center py-16 px-2 text-center">
        <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
          <Icon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-foreground">{getMessage()}</h3>
        <p className="mb-3 max-w-md text-muted-foreground">
          Các thông báo quan trọng về chuyến đi, thanh toán và khuyến mãi sẽ
          xuất hiện tại đây.
        </p>
        {category === "all" || category === "promotion" ? (
          <Button
            size="lg"
            onClick={onGoHome}
            className="gap-2 bg-gradient-to-r from-warning/5 to-warning/10 hover:from-warning hover:to-warning/90 shadow-lg"
          >
            <Sparkles className="h-5 w-5" />
            Khám phá khuyến mãi ngay
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={onGoHome}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary/90 shadow-lg"
          >
            <Train className="h-5 w-5" />
            Tìm chuyến tàu
          </Button>
        )}
      </div>
    </Card>
  );
}
