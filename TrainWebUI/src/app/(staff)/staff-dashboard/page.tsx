"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Train,
  TrendingUp,
  Ticket,
  DollarSign,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  ChevronRight,
  Calendar,
  Users,
  CreditCard,
  Camera,
  RefreshCw,
  Home,
  Activity,
  BarChart3,
  PieChart,
  Filter,
  Download,
  Eye,
  Zap,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { cn } from "@/lib/utils/utils";

interface Transaction {
  id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  paymentMethod: string;
  time: string;
  customerName: string;
  trainCode: string;
}

interface UpcomingTrain {
  code: string;
  route: string;
  departureTime: string;
  totalTickets: number;
  checkedIn: number;
  cancelled: number;
  status: "on-time" | "delayed" | "cancelled";
  delayMinutes?: number;
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  passengerName: string;
  date: string;
  trainCode: string;
  category: "service" | "comfort" | "punctuality" | "cleanliness";
}

interface StaffStats {
  name: string;
  role: string;
  avatar?: string;
  todayStats: {
    ticketsProcessed: number;
    customersHelped: number;
    issuesResolved: number;
    rating: number;
  };
}

export default function StaffDashboardPage() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [refreshing, setRefreshing] = useState(false);

  // Staff info
  const [staffInfo] = useState<StaffStats>({
    name: "Nguyễn Văn An",
    role: "Nhân viên kiểm soát",
    avatar: "/avatars/staff-01.jpg",
    todayStats: {
      ticketsProcessed: 89,
      customersHelped: 47,
      issuesResolved: 12,
      rating: 4.8,
    },
  });

  // KPI Data with comparisons
  const [kpiData] = useState({
    todayTickets: 1247,
    todayRevenue: 156780000,
    upcomingTrains: 24,
    newFeedback: 38,
    activeIssues: 5,
    completionRate: 92.5,
    // Comparisons with yesterday
    ticketsChange: +12.5,
    revenueChange: +8.3,
    trainsChange: -2,
    feedbackChange: +15.2,
  });

  // Revenue data with enhanced details
  const [revenueData] = useState([
    { day: "T2", revenue: 142500, target: 140000, tickets: 982 },
    { day: "T3", revenue: 158200, target: 145000, tickets: 1156 },
    { day: "T4", revenue: 134800, target: 140000, tickets: 934 },
    { day: "T5", revenue: 167300, target: 150000, tickets: 1203 },
    { day: "T6", revenue: 189400, target: 165000, tickets: 1389 },
    { day: "T7", revenue: 175600, target: 160000, tickets: 1278 },
    { day: "CN", revenue: 156780, target: 150000, tickets: 1247 },
  ]);

  // Hourly performance data
  const [hourlyData] = useState([
    { hour: "6h", tickets: 45, revenue: 6750 },
    { hour: "8h", tickets: 89, revenue: 13350 },
    { hour: "10h", tickets: 134, revenue: 20100 },
    { hour: "12h", tickets: 178, revenue: 26700 },
    { hour: "14h", tickets: 203, revenue: 30450 },
    { hour: "16h", tickets: 189, revenue: 28350 },
    { hour: "18h", tickets: 156, revenue: 23400 },
    { hour: "20h", tickets: 123, revenue: 18450 },
  ]);

  // Tickets by train type with enhanced details
  const [ticketsByType] = useState([
    { type: "SE", tickets: 456, revenue: 68400000, fill: "#3B82F6", growth: +8.5 },
    { type: "TN", tickets: 389, revenue: 42790000, fill: "#10B981", growth: +12.3 },
    { type: "ĐP", tickets: 402, revenue: 32160000, fill: "#F59E0B", growth: -2.1 },
  ]);

  // Payment methods with enhanced data
  const [paymentMethods] = useState([
    { method: "VISA", value: 42, amount: 65880000, fill: "#3B82F6", trend: "up" },
    { method: "MasterCard", value: 28, amount: 43904000, fill: "#8B5CF6", trend: "up" },
    { method: "MoMo", value: 18, amount: 28220400, fill: "#EC4899", trend: "down" },
    { method: "VNPay", value: 12, amount: 18813600, fill: "#10B981", trend: "up" },
  ]);

  // Enhanced upcoming trains with real-time status
  const [upcomingTrains] = useState<UpcomingTrain[]>([
    {
      code: "SE1",
      route: "Hà Nội → Sài Gòn",
      departureTime: "19:30",
      totalTickets: 456,
      checkedIn: 389,
      cancelled: 12,
      status: "on-time",
    },
    {
      code: "SE3",
      route: "Sài Gòn → Hà Nội", 
      departureTime: "20:00",
      totalTickets: 432,
      checkedIn: 398,
      cancelled: 8,
      status: "delayed",
      delayMinutes: 15,
    },
    {
      code: "TN2",
      route: "Hà Nội → Vinh",
      departureTime: "21:15",
      totalTickets: 312,
      checkedIn: 276,
      cancelled: 5,
      status: "on-time",
    },
    {
      code: "ĐP1",
      route: "Hà Nội → Lào Cai",
      departureTime: "21:45",
      totalTickets: 198,
      checkedIn: 167,
      cancelled: 3,
      status: "on-time",
    },
  ]);

  // Enhanced transactions with more details
  const [transactions] = useState<Transaction[]>([
    {
      id: "TXN001234",
      amount: 1350000,
      status: "success",
      paymentMethod: "VISA",
      time: "14:23",
      customerName: "Nguyễn Văn A",
      trainCode: "SE1",
    },
    {
      id: "TXN001235", 
      amount: 890000,
      status: "success",
      paymentMethod: "MoMo",
      time: "14:18",
      customerName: "Trần Thị B",
      trainCode: "TN2",
    },
    {
      id: "TXN001236",
      amount: 1200000,
      status: "pending",
      paymentMethod: "VNPay",
      time: "14:12",
      customerName: "Lê Văn C",
      trainCode: "SE3",
    },
    {
      id: "TXN001237",
      amount: 650000,
      status: "failed",
      paymentMethod: "VISA",
      time: "14:05",
      customerName: "Phạm Thị D",
      trainCode: "ĐP1",
    },
    {
      id: "TXN001238",
      amount: 1450000,
      status: "success", 
      paymentMethod: "MasterCard",
      time: "13:58",
      customerName: "Hoàng Văn E",
      trainCode: "SE1",
    },
  ]);

  // Enhanced customer feedback with categories
  const [feedbackList] = useState<Feedback[]>([
    {
      id: "FB001",
      rating: 5,
      comment: "Dịch vụ tuyệt vời, nhân viên nhiệt tình và chu đáo!",
      passengerName: "Nguyễn Văn A",
      date: "14:30",
      trainCode: "SE1",
      category: "service",
    },
    {
      id: "FB002",
      rating: 4,
      comment: "Tàu sạch sẽ, đúng giờ. Chỉ có điều ghế hơi cứng một chút.",
      passengerName: "Trần Thị B",
      date: "13:45",
      trainCode: "TN2",
      category: "comfort",
    },
    {
      id: "FB003",
      rating: 5,
      comment: "Rất hài lòng với chuyến đi. Chắc chắn sẽ quay lại!",
      passengerName: "Lê Văn C",
      date: "12:20",
      trainCode: "SE3",
      category: "service",
    },
    {
      id: "FB004",
      rating: 3,
      comment: "Tàu khởi hành muộn 15 phút, ảnh hưởng đến lịch trình.",
      passengerName: "Phạm Thị D",
      date: "11:30", 
      trainCode: "ĐP1",
      category: "punctuality",
    },
    {
      id: "FB005",
      rating: 4,
      comment: "Vệ sinh toa tàu khá tốt, Wi-Fi ổn định.",
      passengerName: "Hoàng Văn E",
      date: "10:15",
      trainCode: "SE1",
      category: "cleanliness",
    },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time data updates
      setRefreshing(true);
      setTimeout(() => setRefreshing(false), 1000);
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Get status badge with enhanced styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/10 border-emerald-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Thành công
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-error/10 text-error hover:bg-error/10 border-destructive/20">
            <XCircle className="mr-1 h-3 w-3" />
            Thất bại
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10 border-warning/20">
            <AlertCircle className="mr-1 h-3 w-3 animate-pulse" />
            Đang xử lý
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get train status badge
  const getTrainStatusBadge = (train: UpcomingTrain) => {
    switch (train.status) {
      case "on-time":
        return (
          <Badge className="bg-success/10 text-success border-emerald-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đúng giờ
          </Badge>
        );
      case "delayed":
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20">
            <Clock className="mr-1 h-3 w-3" />
            Trễ {train.delayMinutes}p
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-error/10 text-error border-destructive/20">
            <XCircle className="mr-1 h-3 w-3" />
            Đã hủy
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get feedback category color
  const getFeedbackCategoryColor = (category: Feedback["category"]) => {
    switch (category) {
      case "service":
        return "bg-primary/10 text-primary border-primary";
      case "comfort":
        return "bg-success/10 text-success border-emerald-200";
      case "punctuality":
        return "bg-warning/10 text-warning border-warning/20";
      case "cleanliness":
        return "bg-violet-100 text-violet-700 border-violet-200";
      default:
        return "bg-card text-foreground border-border";
    }
  };

  // Navigation functions
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Enhanced Header */}
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm">
          <div className="container mx-auto px-2 lg:px-2">
            <div className="flex h-16 items-center justify-between">
              {/* Logo + Staff Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
                  <Train className="h-6 w-6 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={staffInfo.avatar} alt={staffInfo.name} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {staffInfo.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-lg font-semibold text-primary">
                      Staff Dashboard
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {staffInfo.name} – {staffInfo.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="hidden md:flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-success" />
                  <span className="font-medium">{staffInfo.todayStats.ticketsProcessed}</span>
                  <span className="text-muted-foreground">vé xử lý</span>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-warning fill-current" />
                  <span className="font-medium">{staffInfo.todayStats.rating}</span>
                  <span className="text-muted-foreground">đánh giá</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRefreshing(true)}
                      className={cn("relative", refreshing && "animate-pulse")}
                    >
                      <Activity className={cn("h-5 w-5", refreshing && "animate-spin")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cập nhật dữ liệu</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute right-1 top-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-error"></span>
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>5 thông báo mới</TooltipContent>
                </Tooltip>

                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Separator orientation="vertical" className="h-8" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNavigation("/")}
                  className="text-error hover:bg-error/10 hover:text-error"
                >
                  <Home className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-2 lg:px-2 py-5">
          {/* Enhanced KPI Cards */}
          <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Today's Tickets */}
            <Card 
              className="border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => handleNavigation("/manage-tickets")}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-foreground">Vé hôm nay</p>
                    <h2 className="mt-2 text-3xl font-bold text-primary-foreground">
                      {kpiData.todayTickets.toLocaleString()}
                    </h2>
                    <div className="mt-2 flex items-center gap-1 text-sm text-primary-foreground">
                      {kpiData.ticketsChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{Math.abs(kpiData.ticketsChange)}% so với hôm qua</span>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
                    <Ticket className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Revenue */}
            <Card className="border-0 bg-gradient-to-br from-green-500 to-green-600 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-100">Doanh thu hôm nay</p>
                    <h2 className="mt-2 text-3xl font-bold text-primary-foreground">
                      {(kpiData.todayRevenue / 1000000).toFixed(1)}M
                    </h2>
                    <div className="mt-2 flex items-center gap-1 text-sm text-emerald-100">
                      {kpiData.revenueChange > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4" />
                      )}
                      <span>{Math.abs(kpiData.revenueChange)}% so với hôm qua</span>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
                    <DollarSign className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Trains */}
            <Card className="border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-100">Tàu sắp khởi hành</p>
                    <h2 className="mt-2 text-3xl font-bold text-primary-foreground">{kpiData.upcomingTrains}</h2>
                    <div className="mt-2 flex items-center gap-1 text-sm text-orange-100">
                      <Clock className="h-4 w-4" />
                      <span>Trong 24 giờ tới</span>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
                    <Train className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card className="border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-violet-100">Hiệu suất hoàn thành</p>
                    <h2 className="mt-2 text-3xl font-bold text-primary-foreground">{kpiData.completionRate}%</h2>
                    <div className="mt-2 w-full bg-background/20 rounded-full h-2">
                      <div 
                        className="bg-background rounded-full h-2 transition-all duration-500"
                        style={{ width: `${kpiData.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/20 backdrop-blur-sm">
                    <Zap className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Enhanced */}
          <div className="mb-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Card 
              className="border-0 bg-gradient-to-r from-green-600 to-green-700 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => handleNavigation("/qr-check")}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">Kiểm tra QR</h3>
                      <p className="text-xs text-emerald-100">Quét mã vé</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => handleNavigation("/refunds")}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20">
                      <RefreshCw className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">Hoàn/Đổi vé</h3>
                      <p className="text-xs text-violet-100">Xử lý yêu cầu</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-gradient-to-r from-indigo-600 to-indigo-700 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => handleNavigation("/customers")}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20">
                      <Users className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">Khách hàng</h3>
                      <p className="text-xs text-indigo-100">Hỗ trợ & quản lý</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-0 bg-gradient-to-r from-teal-600 to-teal-700 text-primary-foreground shadow-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              onClick={() => handleNavigation("/reports/daily")}
            >
              <CardContent className="p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/20">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-foreground">Báo cáo</h3>
                      <p className="text-xs text-teal-100">Thống kê chi tiết</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Charts Section */}
          <div className="mb-5 grid gap-3 lg:grid-cols-3">
            {/* Revenue Chart with dual axis */}
            <Card className="border-0 bg-background shadow-md lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Doanh thu & Vé bán</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      7 ngày gần nhất với mục tiêu
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Hôm nay</SelectItem>
                        <SelectItem value="week">7 ngày</SelectItem>
                        <SelectItem value="month">30 ngày</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="day"
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      yAxisId="revenue"
                      stroke="#6B7280"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `${value / 1000}K`}
                    />
                    <YAxis
                      yAxisId="tickets"
                      orientation="right"
                      stroke="#10B981"
                      fontSize={12}
                      tickLine={false}
                    />
                    <RechartsTooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                        fontSize: "14px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number, name: string) => [
                        name === "revenue" ? formatCurrency(value * 1000) : value,
                        name === "revenue" ? "Doanh thu" : name === "target" ? "Mục tiêu" : "Số vé",
                      ]}
                    />
                    <Area
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                    <Line
                      yAxisId="revenue"
                      type="monotone"
                      dataKey="target"
                      stroke="#F59E0B"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                    <Bar
                      yAxisId="tickets"
                      dataKey="tickets"
                      fill="#10B981"
                      fillOpacity={0.6}
                      radius={[2, 2, 0, 0]}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                
                {/* Enhanced Report Button */}
                <div className="mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    className="w-full gap-2 hover:bg-primary/10 hover:text-primary hover:border-primary"
                    onClick={() => handleNavigation("/reports/revenue")}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Xem báo cáo chi tiết
                    <ChevronRight className="h-4 w-4 ml-auto" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Payment Methods */}
            <Card className="border-0 bg-background shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground">Phương thức thanh toán</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tỷ lệ và xu hướng hôm nay
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <RechartsPieChart>
                    <Pie
                      data={paymentMethods}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ method, percent }: any) =>
                        `${method} ${((percent || 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethods.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value}% (${formatCurrency(props.payload.amount)})`, 
                        "Tỷ lệ"
                      ]}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>

                <div className="mt-3 space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.method}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: method.fill }}
                        />
                        <span className="font-medium">{method.method}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {formatCurrency(method.amount)}
                        </span>
                        {method.trend === "up" ? (
                          <ArrowUpRight className="h-3 w-3 text-success" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-error" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Tickets by Train Type */}
          <Card className="mb-5 border-0 bg-background shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Phân tích theo loại tàu</CardTitle>
                  <p className="text-sm text-muted-foreground">Doanh số và tăng trưởng hôm nay</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Lọc
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Chi tiết
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={ticketsByType} margin={{ top: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="type"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB", 
                      borderRadius: "8px",
                      fontSize: "14px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      name === "tickets" ? `${value} vé` : formatCurrency(value),
                      name === "tickets" ? "Số vé" : "Doanh thu"
                    ]}
                  />
                  <Bar dataKey="tickets" radius={[8, 8, 0, 0]}>
                    {ticketsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Growth indicators */}
              <div className="mt-3 grid grid-cols-3 gap-3">
                {ticketsByType.map((type) => (
                  <div
                    key={type.type}
                    className="flex items-center justify-between p-2 rounded-lg border-2 border-border/50 hover:border-primary transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: type.fill }}
                        />
                        <span className="font-semibold text-lg">{type.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(type.revenue)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-medium",
                        type.growth > 0 ? "text-success" : "text-error"
                      )}>
                        {type.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                        <span>{Math.abs(type.growth)}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">vs hôm qua</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bottom Section: Enhanced Trains + Transactions + Feedback */}
          <div className="grid gap-3 lg:grid-cols-3">
            {/* Enhanced Upcoming Trains */}
            <Card className="border-0 bg-background shadow-md lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Chuyến tàu sắp khởi hành</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-2">
                    Xem tất cả
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingTrains.map((train) => (
                    <div
                      key={train.code}
                      className="rounded-lg border-2 border-border p-2 transition-all hover:border-primary hover:bg-primary/10/50 cursor-pointer"
                      onClick={() => handleNavigation(`/trains/${train.code}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge
                              variant="outline"
                              className="border-primary text-primary font-semibold"
                            >
                              {train.code}
                            </Badge>
                            <span className="font-medium text-lg">{train.route}</span>
                            {getTrainStatusBadge(train)}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {train.departureTime}
                            </div>
                            <Separator orientation="vertical" className="h-4" />
                            <span>Tổng: {train.totalTickets} vé</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar for check-in rate */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-muted-foreground">Tỷ lệ check-in</span>
                          <span className="text-sm font-medium">
                            {Math.round((train.checkedIn / train.totalTickets) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(train.checkedIn / train.totalTickets) * 100} 
                          className="h-2"
                        />
                      </div>

                      <div className="flex gap-3">
                        <div className="flex items-center gap-2 rounded-md bg-success/10 px-2 py-1 text-sm">
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-success font-medium">
                            {train.checkedIn} đã check-in
                          </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-md bg-card px-2 py-1 text-sm">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground font-medium">
                            {train.totalTickets - train.checkedIn - train.cancelled} chưa check-in
                          </span>
                        </div>
                        {train.cancelled > 0 && (
                          <div className="flex items-center gap-2 rounded-md bg-error/10 px-2 py-1 text-sm">
                            <XCircle className="h-4 w-4 text-error" />
                            <span className="text-error font-medium">
                              {train.cancelled} đã hủy
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Recent Transactions */}
            <Card className="border-0 bg-background shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">Giao dịch gần đây</CardTitle>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="rounded-lg border border-border p-2 transition-all hover:border-primary hover:bg-primary/10/50 cursor-pointer"
                      onClick={() => handleNavigation(`/transactions/${txn.id}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-primary">{txn.id}</span>
                          </div>
                          <p className="font-semibold text-lg mb-1">
                            {formatCurrency(txn.amount)}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {txn.customerName} • {txn.trainCode}
                          </p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(txn.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3 w-3" />
                          <span>{txn.paymentMethod}</span>
                        </div>
                        <span>{txn.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-3 gap-2"
                  onClick={() => handleNavigation("/transactions")}
                >
                  <Eye className="h-4 w-4" />
                  Xem tất cả giao dịch
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Customer Feedback Section */}
          <Card className="mt-3 border-0 bg-background shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground">Đánh giá của khách hàng</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Phản hồi mới nhất từ hành khách
                  </p>
                </div>
                <Button variant="ghost" size="sm" className="gap-2">
                  Xem tất cả
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {feedbackList.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="rounded-lg border-2 border-border p-2 transition-all hover:border-warning/30 hover:bg-warning/10/50 cursor-pointer"
                    onClick={() => handleNavigation(`/feedback/${feedback.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < feedback.rating
                                ? "fill-warning text-warning"
                                : "text-muted-foreground"
                            )}
                          />
                        ))}
                      </div>
                      <Badge 
                        variant="outline"
                        className={getFeedbackCategoryColor(feedback.category)}
                      >
                        {feedback.category}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-foreground line-clamp-3 mb-3 leading-relaxed">
                      "{feedback.comment}"
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{feedback.passengerName}</p>
                        <p className="text-xs text-muted-foreground">{feedback.trainCode}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{feedback.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleNavigation("/feedback")}
                >
                  <MessageSquare className="h-4 w-4" />
                  Quản lý phản hồi
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => handleNavigation("/reports/feedback")}
                >
                  <BarChart3 className="h-4 w-4" />
                  Báo cáo đánh giá
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
