import type { ComponentType } from 'react';
import { Home, Search, Ticket, Users, Train, CreditCard, QrCode, RefreshCw, BarChart3, Shield, UserCog } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  badge?: string;
  exact?: boolean;
};

export const navCommon: NavItem[] = [
  { label: 'Trang chủ', href: '/', icon: Home, exact: true },
  { label: 'Tìm kiếm', href: '/search', icon: Search },
  { label: 'Vé của tôi', href: '/my-tickets', icon: Ticket },
];

export const navUser: NavItem[] = [
  { label: 'Hỗ trợ', href: '/support' },
];

export const navStaff: NavItem[] = [
  { label: 'Dashboard', href: '/staff-dashboard', icon: BarChart3 },
  { label: 'Khách hàng', href: '/customers', icon: Users },
  { label: 'Quản lý vé', href: '/manage-tickets', icon: Ticket },
  { label: 'Kiểm tra QR', href: '/qr-check', icon: QrCode },
  { label: 'Phản hồi', href: '/feedback-management', icon: RefreshCw },
  { label: 'Báo cáo', href: '/reports', icon: BarChart3 },
];

export const navAdmin: NavItem[] = [
  { label: 'Dashboard', href: '/admin-dashboard', icon: Shield },
  { label: 'Nhân viên', href: '/staff', icon: Users },
  { label: 'Tàu', href: '/trains', icon: Train },
  { label: 'Mẫu vé', href: '/tickets', icon: Ticket },
  { label: 'Lịch trình', href: '/train-schedules', icon: Train },
];

export const accountMenu: NavItem[] = [
  { label: 'Hồ sơ', href: '/profile', icon: UserCog },
  { label: 'Thanh toán', href: '/transactions', icon: CreditCard },
];
