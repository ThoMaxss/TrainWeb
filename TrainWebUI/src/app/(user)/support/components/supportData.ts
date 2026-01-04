import React from 'react';
import { Ticket, CreditCard, RefreshCw, Users, ShieldCheck, BookOpen } from "lucide-react";

export interface SupportTopic {
  id: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  link: string;
}

export const supportTopics: SupportTopic[] = [
  {
    id: "booking",
    icon: Ticket,
    title: "Đặt vé",
    description: "Hướng dẫn đặt vé, chọn chỗ ngồi và thanh toán",
    link: "#booking",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "Thanh toán",
    description: "Các phương thức thanh toán và xử lý giao dịch",
    link: "#payment",
  },
  {
    id: "refund",
    icon: RefreshCw,
    title: "Hoàn/Đổi vé",
    description: "Chính sách và quy trình hoàn trả, đổi vé",
    link: "#refund",
  },
  {
    id: "account",
    icon: Users,
    title: "Tài khoản",
    description: "Quản lý tài khoản và thông tin cá nhân",
    link: "#account",
  },
  {
    id: "policy",
    icon: ShieldCheck,
    title: "Chính sách",
    description: "Điều khoản sử dụng và chính sách bảo mật",
    link: "#policy",
  },
  {
    id: "guide",
    icon: BookOpen,
    title: "Hướng dẫn",
    description: "Hướng dẫn chi tiết sử dụng dịch vụ",
    link: "#guide",
  },
];
