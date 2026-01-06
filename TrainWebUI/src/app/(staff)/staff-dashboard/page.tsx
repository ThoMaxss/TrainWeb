"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DashboardHeader } from "./components/DashboardHeader";
import { KPICards } from "./components/KPICards";
import { RevenueChart } from "./components/RevenueChart";
import { PaymentMethodsChart } from "./components/PaymentMethodsChart";
import { TrainTypeAnalysis } from "./components/TrainTypeAnalysis";
import { UpcomingTrainsList } from "./components/UpcomingTrainsList";
import { RecentTransactions } from "./components/RecentTransactions";
import { CustomerFeedback } from "./components/CustomerFeedback";
import type { UpcomingTrain } from "./components/UpcomingTrainsList";
import type { Transaction } from "./components/RecentTransactions";
import type { Feedback } from "./components/CustomerFeedback";
import { auth } from "@/lib/firebase";

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

  const user = auth.currentUser;
  // Staff info
  const [staffInfo] = useState<StaffStats>({
    name: user?.displayName || "Nguyễn Văn An",
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
    { type: "SE", tickets: 456, revenue: 68400000, fill: "var(--color-primary)", growth: +8.5 },
    { type: "TN", tickets: 389, revenue: 42790000, fill: "var(--color-success)", growth: +12.3 },
    { type: "ĐP", tickets: 402, revenue: 32160000, fill: "var(--color-warning)", growth: -2.1 },
  ]);

  // Payment methods with enhanced data
  const [paymentMethods] = useState([
    { method: "VISA", value: 42, amount: 65880000, fill: "var(--color-primary)", trend: "up" as const },
    { method: "MasterCard", value: 28, amount: 43904000, fill: "var(--color-secondary)", trend: "up" as const },
    { method: "MoMo", value: 18, amount: 28220400, fill: "var(--color-destructive)", trend: "down" as const },
    { method: "VNPay", value: 12, amount: 18813600, fill: "var(--color-success)", trend: "up" as const },
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Navigation functions
  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <DashboardHeader staffInfo={staffInfo} />

        <div className="space-y-6">
          <KPICards data={kpiData} onNavigate={handleNavigation} />

          <div className="grid gap-4 lg:grid-cols-3">
            <RevenueChart
              data={revenueData}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              onNavigateReport={() => handleNavigation("/reports/revenue")}
              formatCurrency={formatCurrency}
            />
            <PaymentMethodsChart data={paymentMethods} formatCurrency={formatCurrency} />
          </div>

          <TrainTypeAnalysis data={ticketsByType} formatCurrency={formatCurrency} />

          <div className="grid gap-4 lg:grid-cols-3">
            <UpcomingTrainsList trains={upcomingTrains} onNavigate={handleNavigation} />
            <RecentTransactions
              transactions={transactions}
              onNavigate={handleNavigation}
              formatCurrency={formatCurrency}
            />
          </div>

          <CustomerFeedback feedbackList={feedbackList} onNavigate={handleNavigation} />
        </div>
      </div>
    </TooltipProvider>
  );
}
