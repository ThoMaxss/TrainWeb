// 🎨 Enhanced admin dashboard with unified design system and dark mode
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Ticket,
  RefreshCw,
  XCircle,
  Users,
  Bell,
  Settings,
  LogOut,
  Download,
  Calendar,
  ChevronDown,
  Filter,
  ChevronRight,
  Sparkles,
  Clock,
  Activity,
  FileSpreadsheet,
  FileText,
  User,
  Shield,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CardSection } from "@/components/shared/CardSection";
import { BadgeStatus } from "@/components/shared/BadgeStatus";
import { PageContainer, PageHeader, PageContent } from "@/components/shared/PageLayout";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils/utils";

interface RevenueData {
  date: string;
  revenue: number;
  tickets: number;
}

interface RouteTicketData {
  route: string;
  tickets: number;
  revenue: number;
}

interface PaymentMethodData {
  method: string;
  value: number;
  percentage: number;
  [key: string]: string | number; // For Recharts compatibility
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  shift: string;
  status: "online" | "offline";
  ticketsProcessed: number;
  feedbackHandled: number;
}

interface DetailedRevenueRow {
  date: string;
  route: string;
  ticketsSold: number;
  revenue: number;
  refunds: number;
  netRevenue: number;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [timeFilter, setTimeFilter] = useState<"today" | "7days" | "30days" | "custom">("30days");
  const [routeFilter, setRouteFilter] = useState<string>("all");
  const [trainTypeFilter, setTrainTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  
  // Animated counter state
  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayTickets, setDisplayTickets] = useState(0);

  // Mock KPI data
  const kpiData = {
    totalRevenue: 1245800000, // Monthly revenue
    revenueChange: 18.5,
    ticketsSold: 8247,
    ticketsChange: 12.3,
    refundRate: 8.5,
    refundRateChange: 2.1,
    failedTransactionRate: 2.3,
    failedTransactionChange: -0.8,
    staffOnline: 24,
  };

  // Animate counters on mount
  useEffect(() => {
    const revenueInterval = setInterval(() => {
      setDisplayRevenue((prev) => {
        const increment = kpiData.totalRevenue / 50;
        if (prev < kpiData.totalRevenue) {
          return Math.min(prev + increment, kpiData.totalRevenue);
        }
        clearInterval(revenueInterval);
        return kpiData.totalRevenue;
      });
    }, 20);

    const ticketsInterval = setInterval(() => {
      setDisplayTickets((prev) => {
        const increment = kpiData.ticketsSold / 50;
        if (prev < kpiData.ticketsSold) {
          return Math.min(prev + increment, kpiData.ticketsSold);
        }
        clearInterval(ticketsInterval);
        return kpiData.ticketsSold;
      });
    }, 20);

    return () => {
      clearInterval(revenueInterval);
      clearInterval(ticketsInterval);
    };
  }, []);

  // Mock 30-day revenue trend data
  const revenueTrendData: RevenueData[] = [
    { date: "01/09", revenue: 38500, tickets: 245 },
    { date: "03/09", revenue: 42100, tickets: 268 },
    { date: "05/09", revenue: 39800, tickets: 252 },
    { date: "07/09", revenue: 45200, tickets: 287 },
    { date: "09/09", revenue: 41900, tickets: 266 },
    { date: "11/09", revenue: 48300, tickets: 306 },
    { date: "13/09", revenue: 44700, tickets: 283 },
    { date: "15/09", revenue: 51200, tickets: 324 },
    { date: "17/09", revenue: 47800, tickets: 303 },
    { date: "19/09", revenue: 53600, tickets: 339 },
    { date: "21/09", revenue: 49200, tickets: 312 },
    { date: "23/09", revenue: 55800, tickets: 353 },
    { date: "25/09", revenue: 52100, tickets: 330 },
    { date: "27/09", revenue: 58400, tickets: 370 },
    { date: "29/09", revenue: 54700, tickets: 346 },
    { date: "01/10", revenue: 61200, tickets: 387 },
  ];

  // Mock route ticket data
  const routeTicketData: RouteTicketData[] = [
    { route: "Hà Nội - TP.HCM", tickets: 2886, revenue: 435000000 },
    { route: "Hà Nội - Đà Nẵng", tickets: 1814, revenue: 217000000 },
    { route: "TP.HCM - Nha Trang", tickets: 1484, revenue: 148000000 },
    { route: "Hà Nội - Hải Phòng", tickets: 1072, revenue: 96000000 },
    { route: "TP.HCM - Phan Thiết", tickets: 991, revenue: 79000000 },
  ];

  // Mock payment method data
  const paymentMethodData: PaymentMethodData[] = [
    { method: "VISA/MasterCard", value: 498320, percentage: 40 },
    { method: "MoMo", value: 311450, percentage: 25 },
    { method: "VNPay", value: 249160, percentage: 20 },
    { method: "ZaloPay", value: 124580, percentage: 10 },
    { method: "Khác", value: 62290, percentage: 5 },
  ];

  // Mock staff data
  const staffMembers: StaffMember[] = [
    {
      id: "1",
      name: "Nguyễn Văn An",
      role: "Quản lý ca",
      shift: "Ca sáng",
      status: "online",
      ticketsProcessed: 145,
      feedbackHandled: 23,
    },
    {
      id: "2",
      name: "Trần Thị Bình",
      role: "Nhân viên bán vé",
      shift: "Ca sáng",
      status: "online",
      ticketsProcessed: 89,
      feedbackHandled: 12,
    },
    {
      id: "3",
      name: "Lê Hoàng Cường",
      role: "Nhân viên kiểm tra",
      shift: "Ca chiều",
      status: "online",
      ticketsProcessed: 67,
      feedbackHandled: 8,
    },
    {
      id: "4",
      name: "Phạm Thị Dung",
      role: "Hỗ trợ khách hàng",
      shift: "Ca sáng",
      status: "online",
      ticketsProcessed: 52,
      feedbackHandled: 31,
    },
  ];

  // Mock detailed table data
  const detailedData: DetailedRevenueRow[] = [
    {
      date: "01/10/2025",
      route: "Hà Nội - TP.HCM",
      ticketsSold: 98,
      revenue: 147000000,
      refunds: 8400000,
      netRevenue: 138600000,
    },
    {
      date: "01/10/2025",
      route: "Hà Nội - Đà Nẵng",
      ticketsSold: 67,
      revenue: 80400000,
      refunds: 3600000,
      netRevenue: 76800000,
    },
    {
      date: "01/10/2025",
      route: "TP.HCM - Nha Trang",
      ticketsSold: 82,
      revenue: 82000000,
      refunds: 4100000,
      netRevenue: 77900000,
    },
    {
      date: "30/09/2025",
      route: "Hà Nội - TP.HCM",
      ticketsSold: 92,
      revenue: 138000000,
      refunds: 9660000,
      netRevenue: 128340000,
    },
    {
      date: "30/09/2025",
      route: "Hà Nội - Hải Phòng",
      ticketsSold: 45,
      revenue: 40500000,
      refunds: 2025000,
      netRevenue: 38475000,
    },
  ];

  // Chart colors
  const COLORS = {
    primary: "var(--color-primary)",
    secondary: "var(--color-secondary)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-destructive)",
    info: "var(--color-info)",
    indigo: "var(--color-secondary)",
  };

  const PIE_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.success,
    COLORS.warning,
    COLORS.danger,
  ];

  const PIE_COLORS_MAP = {
    "VISA/MasterCard": COLORS.primary,
    "MoMo": COLORS.secondary,
    "VNPay": COLORS.success,
    "ZaloPay": COLORS.warning,
    "Khác": COLORS.danger,
  };

  // Handle export
  const handleExport = (format: "excel" | "pdf") => {
    console.log(`Exporting ${format} report...`);
    // Simulate export process
    setTimeout(() => {
      console.log(`${format.toUpperCase()} report exported successfully!`);
    }, 1500);
  };

  // Handle logout
  const handleLogout = () => {
    console.log("Logging out...");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Main Content */}
      <ScrollArea className="flex-1">
        <div className="mx-auto max-w-7xl p-4 lg:p-8 space-y-8">
          <AdminPageHeader
            title="Admin Dashboard"
            description="Overview and key metrics"
            icon={LayoutDashboard}
            stats={[
              { icon: DollarSign, label: "Revenue (month)", value: `${Math.round(kpiData.totalRevenue).toLocaleString("vi-VN")}₫` },
              { icon: Ticket, label: "Tickets", value: kpiData.ticketsSold },
              { icon: Users, label: "Online Staff", value: kpiData.staffOnline },
            ]}
            actions={
              <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport("excel")}>
                <FileSpreadsheet className="h-4 w-4" />
                Export
              </Button>
            }
          />
          {/* KPI Cards - Large & Bold */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {/* Total Revenue */}
            <Card className="border bg-success/10 lg:col-span-2">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success">
                    <DollarSign className="h-8 w-8 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1"
                  >
                    {kpiData.revenueChange >= 0 ? (
                      <ArrowUpRight className="h-3 w-3" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3" />
                    )}
                    {Math.abs(kpiData.revenueChange)}%
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  {Math.round(displayRevenue).toLocaleString("vi-VN")}₫
                </h2>
                <p className="text-muted-foreground">Tổng doanh thu tháng</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Tăng so với tháng trước</span>
                </div>
              </div>
            </Card>

            {/* Tickets Sold */}
            <Card className="border bg-primary/10">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
                    <Ticket className="h-7 w-7 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {kpiData.ticketsChange}%
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {Math.round(displayTickets).toLocaleString("vi-VN")}
                </h2>
                <p className="text-muted-foreground">Tổng vé bán ra</p>
              </div>
            </Card>

            {/* Refund Rate */}
            <Card className="border bg-warning/10">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-warning">
                    <RefreshCw className="h-7 w-7 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1"
                  >
                    <ArrowUpRight className="h-3 w-3" />
                    {kpiData.refundRateChange}%
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{kpiData.refundRate}%</h2>
                <p className="text-muted-foreground">Tỷ lệ hoàn vé</p>
              </div>
            </Card>

            {/* Failed Transaction Rate */}
            <Card className="border bg-destructive/10">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive">
                    <XCircle className="h-7 w-7 text-white" />
                  </div>
                  <Badge
                    variant="outline"
                    className="gap-1"
                  >
                    <ArrowDownRight className="h-3 w-3" />
                    {Math.abs(kpiData.failedTransactionChange)}%
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{kpiData.failedTransactionRate}%</h2>
                <p className="text-muted-foreground">Giao dịch thất bại</p>
              </div>
            </Card>
          </div>

          {/* Second Row: Staff Online + AI Insights */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Staff Online */}
            <Card className="border bg-secondary/10">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                    <Users className="h-7 w-7 text-white" />
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <Activity className="h-3 w-3" />
                    Đang hoạt động
                  </Badge>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{kpiData.staffOnline}</h2>
                <p className="text-muted-foreground">Nhân viên đang online</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Tất cả các ca</span>
                </div>
              </div>
            </Card>

            {/* AI Insights Box */}
            <Card className="border lg:col-span-2">
              <div className="p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shrink-0">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-4">
                      <h3 className="text-lg font-semibold text-foreground">Phân tích AI</h3>
                      <Badge className="bg-primary">
                        <Zap className="mr-1 h-3 w-3" />
                        Tự động
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="rounded-lg bg-background border p-4">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-success mt-2 shrink-0"></div>
                          <p className="text-sm text-foreground">
                            <span className="font-medium text-primary">Tuyến Hà Nội – Sài Gòn</span> chiếm{" "}
                            <span className="font-medium">35%</span> doanh thu tháng này.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-background border p-4">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-warning mt-2 shrink-0"></div>
                          <p className="text-sm text-foreground">
                            Tỷ lệ hoàn vé <span className="font-medium text-warning">tăng 2%</span> so với tháng trước.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-background border p-4">
                        <div className="flex items-start gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0"></div>
                          <p className="text-sm text-foreground">
                            <span className="font-medium text-primary">Ca tối</span> có lượng vé bán cao nhất ({" "}
                            <span className="font-medium">40%</span>).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* 30-Day Revenue Trend - Line Chart */}
            <Card className="border lg:col-span-2">
              <div className="p-8">
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Doanh thu 30 ngày gần nhất</h3>
                    <p className="text-sm text-muted-foreground">Xu hướng tăng trưởng liên tục</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="gap-1">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                      Doanh thu
                    </Badge>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={revenueTrendData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} />
                    <YAxis
                      stroke="var(--color-muted-foreground)"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value: number) => `${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: `1px solid var(--color-border)`,
                        borderRadius: "12px",
                        padding: "12px",
                      }}
                      formatter={(value: any) => [`${value.toLocaleString("vi-VN")}₫`, "Doanh thu"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={COLORS.primary}
                      strokeWidth={3}
                      dot={{ fill: COLORS.primary, r: 5 }}
                      activeDot={{ r: 7 }}
                      fill="url(#colorRevenue)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Payment Methods - Pie Chart */}
            <Card className="border">
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-foreground">Phương thức thanh toán</h3>
                  <p className="text-sm text-muted-foreground">Phân bổ theo tháng</p>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry) => (
                        <Cell key={entry.method} fill={PIE_COLORS_MAP[entry.method as keyof typeof PIE_COLORS_MAP]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid var(--color-border)",
                        borderRadius: "12px",
                      }}
                      formatter={(value: any) => `${value.toLocaleString("vi-VN")}₫`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-6 space-y-3">
                  {paymentMethodData.map((item) => (
                    <div key={item.method} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: PIE_COLORS_MAP[item.method as keyof typeof PIE_COLORS_MAP] }}
                        />
                        <span className="text-muted-foreground">{item.method}</span>
                      </div>
                      <span className="font-medium">{item.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Tickets by Route - Bar Chart */}
          <Card className="border">
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Vé bán theo tuyến</h3>
                  <p className="text-sm text-muted-foreground">Top 5 tuyến phổ biến nhất</p>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Lọc
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={routeTicketData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis
                    type="number"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value: number) => value.toLocaleString()}
                  />
                  <YAxis
                    type="category"
                    dataKey="route"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    width={170}
                  />
                    <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid var(--color-border)",
                      borderRadius: "12px",
                      padding: "12px",
                    }}
                    formatter={(value: any, name: string) => {
                      if (name === "tickets") return [value.toLocaleString(), "Vé bán"];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="tickets" fill={COLORS.indigo} radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Staff Management Snapshot & Revenue Table */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Staff Management */}
            <Card className="border">
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Nhân viên hoạt động</h3>
                    <p className="text-sm text-muted-foreground">Hiện đang online</p>
                  </div>
                  <Badge className="bg-success/10 text-success hover:bg-success/10">
                    {kpiData.staffOnline} online
                  </Badge>
                </div>
                <div className="space-y-4">
                  {staffMembers.map((staff) => (
                    <div
                      key={staff.id}
                      className="rounded-lg border bg-background p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary text-white text-sm">
                              {staff.name.split(" ").slice(-2).map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{staff.name}</p>
                            <p className="text-xs text-muted-foreground">{staff.role}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1 text-xs",
                            staff.status === "online"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-background text-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              staff.status === "online" ? "bg-success" : "bg-muted"
                            )}
                          />
                          {staff.shift}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded bg-primary/10 p-2">
                          <p className="text-primary font-medium">{staff.ticketsProcessed}</p>
                          <p className="text-primary">Vé xử lý</p>
                        </div>
                        <div className="rounded bg-secondary/10 p-2">
                          <p className="text-secondary font-medium">{staff.feedbackHandled}</p>
                          <p className="text-secondary">Feedback</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Revenue Detail Table */}
            <Card className="border lg:col-span-2">
              <div className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Chi tiết doanh thu</h3>
                    <p className="text-sm text-muted-foreground">
                      Theo ngày và tuyến
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="gap-2">
                        <Download className="h-4 w-4" />
                        Xuất báo cáo
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleExport("excel")} className="gap-2">
                        <FileSpreadsheet className="h-4 w-4 text-success" />
                        Xuất Excel (.xlsx)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport("pdf")} className="gap-2">
                        <FileText className="h-4 w-4 text-destructive" />
                        Xuất PDF (.pdf)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <ScrollArea className="w-full rounded-lg border">
                  <div className="min-w-[800px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-background">
                          <TableHead>Ngày</TableHead>
                          <TableHead>Tuyến</TableHead>
                          <TableHead className="text-right">Vé bán</TableHead>
                          <TableHead className="text-right">Doanh thu</TableHead>
                          <TableHead className="text-right">Hoàn vé</TableHead>
                          <TableHead className="text-right">Doanh thu ròng</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {detailedData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-muted">
                            <TableCell className="font-medium">{row.date}</TableCell>
                            <TableCell>{row.route}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                                {row.ticketsSold}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {row.revenue.toLocaleString("vi-VN")}₫
                            </TableCell>
                            <TableCell className="text-right text-destructive">
                              -{row.refunds.toLocaleString("vi-VN")}₫
                            </TableCell>
                            <TableCell className="text-right font-medium text-success">
                              {row.netRevenue.toLocaleString("vi-VN")}₫
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ScrollArea>

                <div className="mt-6 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Hiển thị 5 trong 127 kết quả</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Trước
                    </Button>
                    <Button variant="outline" size="sm">
                      Tiếp
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
