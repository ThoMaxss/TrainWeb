"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Star,
  Ticket,
  Mail,
  Phone,
  Clock,
  CheckCheck,
  MessageSquare,
  RotateCcw,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "unread" | "replied" | "pending";
  unreadCount: number;
  lastFeedbackTime: string;
  ticketCount: number;
  recentTicket?: string;
}

interface Message {
  id: string;
  sender: "customer" | "staff";
  message: string;
  timestamp: string;
  rating?: number;
}

interface Conversation {
  customerId: string;
  messages: Message[];
}

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "replied">("all");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("1");
  const [replyText, setReplyText] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  // Mock data
  const customers: Customer[] = [
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      phone: "0912 345 678",
      status: "unread",
      unreadCount: 2,
      lastFeedbackTime: "10 phút trước",
      ticketCount: 3,
      recentTicket: "VNR-12345",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "tranthib@email.com",
      phone: "0923 456 789",
      status: "pending",
      unreadCount: 1,
      lastFeedbackTime: "25 phút trước",
      ticketCount: 1,
      recentTicket: "VNR-12346",
    },
    {
      id: "3",
      name: "Lê Văn C",
      email: "levanc@email.com",
      phone: "0934 567 890",
      status: "replied",
      unreadCount: 0,
      lastFeedbackTime: "2 giờ trước",
      ticketCount: 5,
      recentTicket: "VNR-12347",
    },
    {
      id: "4",
      name: "Phạm Thị D",
      email: "phamthid@email.com",
      phone: "0945 678 901",
      status: "unread",
      unreadCount: 1,
      lastFeedbackTime: "3 giờ trước",
      ticketCount: 2,
      recentTicket: "VNR-12348",
    },
    {
      id: "5",
      name: "Hoàng Văn E",
      email: "hoangvane@email.com",
      phone: "0956 789 012",
      status: "replied",
      unreadCount: 0,
      lastFeedbackTime: "1 ngày trước",
      ticketCount: 4,
      recentTicket: "VNR-12349",
    },
  ];

  const conversations: Record<string, Conversation> = {
    "1": {
      customerId: "1",
      messages: [
        {
          id: "1",
          sender: "customer",
          message: "Chào bạn, tôi muốn hỏi về việc đổi vé tàu. Vé của tôi là ngày 15/10 nhưng tôi cần đổi sang ngày 16/10. Có thể được không?",
          timestamp: "14:30",
          rating: 3,
        },
        {
          id: "2",
          sender: "staff",
          message: "Xin chào anh/chị! Cảm ơn anh/chị đã liên hệ. Để hỗ trợ anh/chị tốt nhất, cho em xin mã vé của anh/chị ạ.",
          timestamp: "14:32",
        },
        {
          id: "3",
          sender: "customer",
          message: "Mã vé của tôi là VNR-12345. Cảm ơn bạn!",
          timestamp: "14:35",
        },
      ],
    },
    "2": {
      customerId: "2",
      messages: [
        {
          id: "1",
          sender: "customer",
          message: "Tôi chưa nhận được e-ticket sau khi thanh toán. Đã 30 phút rồi.",
          timestamp: "13:45",
          rating: 2,
        },
      ],
    },
    "3": {
      customerId: "3",
      messages: [
        {
          id: "1",
          sender: "customer",
          message: "Chuyến tàu có phục vụ đồ ăn không?",
          timestamp: "12:20",
          rating: 5,
        },
        {
          id: "2",
          sender: "staff",
          message: "Xin chào anh/chị! Các chuyến tàu của chúng tôi đều có phục vụ đồ ăn. Anh/chị có thể đặt suất ăn khi đặt vé hoặc mua trực tiếp trên tàu.",
          timestamp: "12:25",
        },
        {
          id: "3",
          sender: "customer",
          message: "Cảm ơn bạn! Rất hữu ích.",
          timestamp: "12:27",
        },
      ],
    },
    "4": {
      customerId: "4",
      messages: [
        {
          id: "1",
          sender: "customer",
          message: "Làm thế nào để yêu cầu hoàn tiền? Tôi không thể đi chuyến này nữa.",
          timestamp: "11:30",
          rating: 1,
        },
      ],
    },
    "5": {
      customerId: "5",
      messages: [
        {
          id: "1",
          sender: "customer",
          message: "Dịch vụ tuyệt vời! Cảm ơn.",
          timestamp: "Hôm qua",
          rating: 5,
        },
        {
          id: "2",
          sender: "staff",
          message: "Cảm ơn anh/chị đã tin tưởng sử dụng dịch vụ của chúng tôi! Chúc anh/chị có chuyến đi an toàn và vui vẻ.",
          timestamp: "Hôm qua",
        },
      ],
    },
  };

  const quickReplyTemplates = [
    {
      id: "1",
      title: "Chào mừng",
      message: "Xin chào anh/chị! Cảm ơn anh/chị đã liên hệ với chúng tôi. Chúng tôi có thể giúp gì cho anh/chị?",
    },
    {
      id: "2",
      title: "Yêu cầu thông tin",
      message: "Để hỗ trợ anh/chị tốt nhất, vui lòng cung cấp mã vé hoặc mã đặt chỗ của anh/chị.",
    },
    {
      id: "3",
      title: "Chính sách hoàn vé",
      message: "Anh/chị có thể yêu cầu hoàn vé trước 24 giờ khởi hành với phí 20%. Sau thời gian này, vé sẽ không được hoàn lại.",
    },
    {
      id: "4",
      title: "Đổi vé",
      message: "Để đổi vé, anh/chị vui lòng truy cập mục 'Quản lý vé' hoặc liên hệ hotline 1900-xxxx. Phí đổi vé là 10% giá trị vé.",
    },
    {
      id: "5",
      title: "E-ticket chưa nhận",
      message: "Em sẽ gửi lại e-ticket cho anh/chị qua email đã đăng ký. Vui lòng kiểm tra hộp thư spam nếu chưa thấy email.",
    },
    {
      id: "6",
      title: "Cảm ơn",
      message: "Cảm ơn anh/chị đã tin tưởng sử dụng dịch vụ của chúng tôi! Nếu cần hỗ trợ thêm, đừng ngần ngại liên hệ nhé.",
    },
  ];

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !customer.name.toLowerCase().includes(query) &&
        !customer.email.toLowerCase().includes(query) &&
        !customer.recentTicket?.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Tab filter
    if (filterTab === "unread" && customer.status !== "unread") return false;
    if (filterTab === "replied" && customer.status !== "replied") return false;

    return true;
  });

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const currentConversation = conversations[selectedCustomerId];

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return (
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10">
            Chưa xử lý
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning/10 text-warning hover:bg-warning/10">
            Đang chờ
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-success/10 text-success hover:bg-success/10">
            Đã trả lời
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get rating stars
  const getRatingStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3.5 w-3.5",
              star <= rating ? "fill-warning text-warning" : "text-muted-foreground"
            )}
          />
        ))}
      </div>
    );
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!replyText.trim()) return;

    // In production, send to API
    console.log("Sending message:", replyText);
    
    // Clear input
    setReplyText("");
    setShowTemplates(false);
  };

  // Handle template click
  const handleTemplateClick = (template: string) => {
    setReplyText(template);
    setShowTemplates(false);
  };

  return (
    <div className="flex h-screen flex-col bg-card">
      {/* Header */}
      <header className="border-b bg-background shadow-sm">
        <div className="flex h-16 items-center justify-between px-2 lg:px-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/staff-dashboard')}
              className="hover:bg-primary/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-purple-700">
                <MessageSquare className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-primary">Hỗ trợ khách hàng</h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm khách hàng theo tên, email, mã vé"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 border-border"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="hidden sm:flex">
              {filteredCustomers.length} khách hàng
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Customer List Sidebar */}
        <aside className="w-80 border-r bg-background hidden lg:flex flex-col">
          {/* Filter Tabs */}
          <div className="p-2 border-b">
            <Tabs value={filterTab} onValueChange={(v) => setFilterTab(v as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" className="text-xs">
                  Tất cả
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Chưa xử lý
                </TabsTrigger>
                <TabsTrigger value="replied" className="text-xs">
                  Đã trả lời
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Customer List */}
          <ScrollArea className="flex-1">
            <div className="divide-y">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={cn(
                    "p-2 cursor-pointer transition-colors hover:bg-card",
                    selectedCustomerId === customer.id && "bg-primary/10 border-l-4 border-l-blue-600"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={cn(
                          customer.status === "unread" && "bg-primary/10 text-primary",
                          customer.status === "pending" && "bg-warning/10 text-warning",
                          customer.status === "replied" && "bg-success/10 text-success"
                        )}>
                          {customer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {customer.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-xs text-primary-foreground">
                          {customer.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate">
                          {customer.name}
                        </h4>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {customer.lastFeedbackTime}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        {customer.email}
                      </p>
                      <div className="flex items-center justify-between">
                        {getStatusBadge(customer.status)}
                        <span className="text-xs text-muted-foreground">
                          {customer.ticketCount} vé
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-card">
          {selectedCustomer && currentConversation ? (
            <>
              {/* Customer Info Header */}
              <div className="border-b bg-background p-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-violet-100 text-violet-700">
                        {selectedCustomer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedCustomer.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <span>{selectedCustomer.email}</span>
                        <span>•</span>
                        <Phone className="h-3.5 w-3.5" />
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedCustomer.status)}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-2">
                <div className="space-y-3 max-w-4xl mx-auto">
                  {currentConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender === "staff" ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender === "customer" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-foreground text-xs">
                            {selectedCustomer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-2 py-2",
                          message.sender === "staff"
                            ? "bg-primary text-primary-foreground rounded-br-sm"
                            : "bg-background border border-border rounded-bl-sm"
                        )}
                      >
                        {message.rating && (
                          <div className="mb-2 pb-2 border-b border-border">
                            {getRatingStars(message.rating)}
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <div
                          className={cn(
                            "mt-2 flex items-center gap-1 text-xs",
                            message.sender === "staff" ? "text-primary-foreground" : "text-muted-foreground"
                          )}
                        >
                          <Clock className="h-3 w-3" />
                          <span>{message.timestamp}</span>
                          {message.sender === "staff" && (
                            <CheckCheck className="h-3.5 w-3.5 ml-1" />
                          )}
                        </div>
                      </div>

                      {message.sender === "staff" && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            NV
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Quick Reply Templates */}
              {showTemplates && (
                <div className="border-t bg-background p-2">
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Mẫu trả lời nhanh</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplates(false)}
                      >
                        Đóng
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {quickReplyTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant="outline"
                          size="sm"
                          onClick={() => handleTemplateClick(template.message)}
                          className="justify-start h-auto py-2 px-2 text-left"
                        >
                          <div className="truncate">
                            <div className="font-medium text-xs">{template.title}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {template.message.substring(0, 30)}...
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Reply Box */}
              <div className="border-t bg-background p-2">
                <div className="max-w-4xl mx-auto">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Nhập phản hồi của bạn…"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        className="min-h-[80px] resize-none border-border"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="gap-2"
                          >
                            <FileText className="h-4 w-4" />
                            <span className="hidden sm:inline">Mẫu trả lời</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="hidden sm:inline">Đính kèm</span>
                          </Button>
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={!replyText.trim()}
                          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <Send className="h-4 w-4" />
                          Gửi phản hồi
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div className="flex-1 flex items-center justify-center p-2">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mb-3">
                  <MessageSquare className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="mb-2 text-foreground">Chọn khách hàng để bắt đầu</h3>
                <p className="text-muted-foreground">
                  Chọn một khách hàng từ danh sách để xem và trả lời phản hồi
                </p>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel - Tools */}
        <aside className="w-80 border-l bg-background hidden xl:flex flex-col">
          <div className="p-2 border-b">
            <h3 className="font-medium">Công cụ hỗ trợ</h3>
          </div>

          <ScrollArea className="flex-1 p-2">
            {selectedCustomer && (
              <>
                {/* Customer Summary */}
                <Card className="mb-3 border-0 bg-gradient-to-br from-purple-50 to-blue-50 p-2">
                  <h4 className="text-sm font-medium mb-3">Thông tin khách hàng</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tổng số vé:</span>
                      <span className="font-medium">{selectedCustomer.ticketCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Vé gần nhất:</span>
                      <span className="font-medium">{selectedCustomer.recentTicket}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Trạng thái:</span>
                      {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </div>
                </Card>

                {/* Quick Actions */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium mb-3">Hành động nhanh</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      size="sm"
                    >
                      <Ticket className="h-4 w-4" />
                      Tra cứu vé
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      size="sm"
                    >
                      <Mail className="h-4 w-4" />
                      Gửi lại e-ticket
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-2"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Tạo yêu cầu hoàn/đổi
                    </Button>
                  </div>
                </div>

                <Separator className="my-3" />
              </>
            )}

            {/* FAQ & Resources */}
            <div>
              <h4 className="text-sm font-medium mb-3">Tài liệu & FAQ</h4>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-2 h-auto py-2"
                  size="sm"
                >
                  <span className="text-sm">Chính sách hoàn vé</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-2 h-auto py-2"
                  size="sm"
                >
                  <span className="text-sm">Quy định đổi vé</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-2 h-auto py-2"
                  size="sm"
                >
                  <span className="text-sm">Hướng dẫn đi tàu</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-between gap-2 h-auto py-2"
                  size="sm"
                >
                  <span className="text-sm">Câu hỏi thường gặp</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Tips */}
            <Card className="mt-3 border-0 bg-primary/10 p-2">
              <h4 className="text-sm font-medium mb-2 text-primary">
                💡 Mẹo hỗ trợ hiệu quả
              </h4>
              <ul className="space-y-2 text-xs text-primary">
                <li>• Luôn xác nhận thông tin khách hàng trước khi xử lý</li>
                <li>• Sử dụng mẫu trả lời nhanh để tiết kiệm thời gian</li>
                <li>• Đánh dấu "Đã trả lời" sau khi hoàn thành</li>
                <li>• Ưu tiên xử lý feedback có rating thấp</li>
              </ul>
            </Card>
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
