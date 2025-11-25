"use client";

import { useState } from "react";
import {
  Search,
  HelpCircle,
  Ticket,
  CreditCard,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  FileText,
  Users,
  ShieldCheck,
  BookOpen,
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils/utils";
import { PageHeader } from "@/components/shared/PageHeader";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface SupportTopic {
  id: string;
  icon: any;
  title: string;
  description: string;
  link: string;
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const supportTopics: SupportTopic[] = [
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

  const faqs: FAQ[] = [
    {
      id: "1",
      category: "booking",
      question: "Làm thế nào để đặt vé tàu trực tuyến?",
      answer: "Để đặt vé tàu, bạn cần: 1) Đăng nhập vào tài khoản, 2) Chọn tuyến đường và ngày giờ khởi hành, 3) Chọn loại ghế/toa tàu phù hợp, 4) Điền thông tin hành khách, 5) Thanh toán và nhận vé điện tử qua email.",
    },
    {
      id: "2",
      category: "booking",
      question: "Tôi có thể đặt vé cho bao nhiêu người cùng lúc?",
      answer: "Bạn có thể đặt tối đa 6 vé trong một lần giao dịch. Nếu cần đặt nhiều hơn, vui lòng liên hệ hotline để được hỗ trợ.",
    },
    {
      id: "3",
      category: "booking",
      question: "Thời gian đặt vé trước bao lâu?",
      answer: "Bạn có thể đặt vé trước từ 30 ngày đến 2 giờ trước giờ tàu chạy. Khuyến nghị đặt sớm để có nhiều lựa chọn chỗ ngồi.",
    },
    {
      id: "4",
      category: "payment",
      question: "Có những phương thức thanh toán nào?",
      answer: "Chúng tôi hỗ trợ: ATM/Thẻ nội địa, Visa/Mastercard, Ví điện tử (MoMo, ZaloPay, VNPay), QR Code và chuyển khoản ngân hàng.",
    },
    {
      id: "5",
      category: "payment",
      question: "Thanh toán không thành công thì làm sao?",
      answer: "Nếu thanh toán thất bại, vui lòng kiểm tra: 1) Số dư tài khoản, 2) Thông tin thẻ chính xác, 3) Kết nối internet ổn định. Nếu vẫn gặp lỗi, liên hệ ngân hàng hoặc hotline của chúng tôi.",
    },
    {
      id: "6",
      category: "payment",
      question: "Tôi có nhận được hóa đơn điện tử không?",
      answer: "Có, sau khi thanh toán thành công, bạn sẽ nhận được hóa đơn VAT điện tử qua email đã đăng ký.",
    },
    {
      id: "7",
      category: "refund",
      question: "Chính sách hoàn vé như thế nào?",
      answer: "Hoàn vé trước 24h: phí 20% giá vé. Từ 24h đến 2h trước giờ chạy: phí 30%. Trong vòng 2h hoặc sau giờ chạy: không được hoàn.",
    },
    {
      id: "8",
      category: "refund",
      question: "Bao lâu thì nhận được tiền hoàn?",
      answer: "Tiền hoàn sẽ được chuyển về tài khoản gốc trong vòng 5-7 ngày làm việc kể từ khi yêu cầu được xác nhận.",
    },
    {
      id: "9",
      category: "refund",
      question: "Tôi có thể đổi vé sang chuyến khác không?",
      answer: "Có, bạn có thể đổi vé sang chuyến khác cùng tuyến với phí 10% giá vé. Nếu chuyến mới đắt hơn, bạn cần đóng thêm phần chênh lệch.",
    },
    {
      id: "10",
      category: "account",
      question: "Làm sao để tạo tài khoản?",
      answer: "Nhấn 'Đăng ký' ở góc phải màn hình, điền thông tin cá nhân (email, số điện thoại, mật khẩu), xác thực OTP và hoàn tất.",
    },
    {
      id: "11",
      category: "account",
      question: "Quên mật khẩu thì làm gì?",
      answer: "Nhấn 'Quên mật khẩu' tại trang đăng nhập, nhập email đã đăng ký, làm theo hướng dẫn trong email để đặt lại mật khẩu mới.",
    },
    {
      id: "12",
      category: "account",
      question: "Thông tin cá nhân có được bảo mật không?",
      answer: "Tất cả thông tin cá nhân được mã hóa và bảo mật theo tiêu chuẩn quốc tế. Chúng tôi không chia sẻ thông tin với bên thứ ba khi chưa có sự đồng ý.",
    },
  ];

  const contactChannels = [
    {
      icon: Phone,
      title: "Hotline",
      value: "1900-xxxx",
      description: "Hỗ trợ 24/7",
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      icon: Mail,
      title: "Email",
      value: "support@trainbooking.vn",
      description: "Phản hồi trong 24h",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      value: "Chat ngay",
      description: "8:00 - 22:00 hàng ngày",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: MapPin,
      title: "Văn phòng",
      value: "Hà Nội & TP.HCM",
      description: "Thứ 2 - 6: 8:00 - 17:30",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="space-y-8">
      {/* System Status Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-8">
          <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary p-0 flex items-center min-h-[110px]">
            <CardContent className="flex items-center gap-6 w-full p-6">
              <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-success/10 group-hover:bg-primary transition-colors">
                <ShieldCheck className="h-8 w-8 md:h-10 md:w-10 text-success group-hover:text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-foreground mb-1 truncate">Trạng thái hệ thống</h3>
                <p className="text-sm text-muted-foreground mb-1 truncate">Hệ thống hoạt động ổn định</p>
                <p className="font-bold text-success truncate">Không có sự cố</p>
              </div>
              <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Page Header + Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Trung tâm hỗ trợ"
          description="Chúng tôi luôn sẵn sàng giúp đỡ bạn. Tìm câu trả lời hoặc liên hệ với chúng tôi."
          icon={HelpCircle}
          stats={[
            { icon: BookOpen, label: "Chủ đề", value: supportTopics.length },
            { icon: FileText, label: "Câu hỏi", value: faqs.length },
          ]}
          actions={
            <a href="#contact">
              <Button className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Liên hệ
              </Button>
            </a>
          }
        />

        {/* Search Bar */}
        <div className="mt-4 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm câu hỏi, hướng dẫn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 bg-background text-foreground border-border"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Support Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Chủ đề hỗ trợ phổ biến
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {supportTopics.map((topic) => {
              const Icon = topic.icon;
              return (
                <Card
                  key={topic.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                  onClick={() => setActiveCategory(topic.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6 text-primary group-hover:text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.description}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Câu hỏi thường gặp
            </h2>
            <p className="text-muted-foreground">
              Tìm câu trả lời nhanh chóng cho các thắc mắc phổ biến
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-2 h-auto p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="booking" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Đặt vé
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Thanh toán
              </TabsTrigger>
              <TabsTrigger value="refund" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Hoàn/Đổi vé
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                Tài khoản
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* FAQ Accordion */}
          <Card>
            <CardContent className="p-8 md:p-10 lg:p-12">
              {filteredFAQs.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq, index) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left hover:no-underline hover:text-primary">
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-1">
                            {index + 1}
                          </div>
                          <span className="font-medium">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="ml-9 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Không tìm thấy câu hỏi phù hợp. Vui lòng thử từ khóa khác.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Contact Channels */}
        <div className="mb-16" id="contact">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              if (channel.title === "Hotline") {
                return (
                  // Match "Additional Resources" card style (vertical, gradient, centered icon)
                  <Card key={channel.title} className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border-primary/20 dark:border-primary/30 hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <CardContent className="p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center text-center min-h-[160px]">
                      <Icon className={cn("h-12 w-12 mx-auto mb-4", channel.color || 'text-primary')} />
                      <h3 className="font-semibold text-lg text-foreground mb-2 truncate">{channel.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2 truncate">{channel.description}</p>
                      <p className="font-bold text-primary">{channel.value}</p>
                    </CardContent>
                  </Card>
                );
              } else {
                const gradientClass = channel.title === "Email"
                  ? "bg-gradient-to-br from-success/5 to-success/10 dark:from-success/20 dark:to-success/10 border-success/20 dark:border-success/80"
                  : channel.title === "Live Chat"
                    ? "bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary-950/20 dark:to-secondary-950/10 border-secondary/20"
                    : channel.title === "Văn phòng"
                      ? "bg-gradient-to-br from-warning/5 to-warning/10 dark:from-warning-950/20 dark:to-warning-950/10 border-warning/20"
                      : "bg-card border-border";

                return (
                  <Card key={channel.title} className={cn("hover:shadow-lg transition-shadow", gradientClass)}>
                    <CardContent className="p-8 md:p-10 lg:p-12 flex flex-col items-center justify-center text-center min-h-[160px]">
                      <Icon className={cn("h-12 w-12 mx-auto mb-4", channel.color)} />
                      <h3 className="font-semibold text-lg text-foreground mb-2">
                        {channel.title}
                      </h3>
                      <p className={cn("font-bold mb-2", channel.color)}>
                        {channel.value}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {channel.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Gửi tin nhắn cho chúng tôi</CardTitle>
              <p className="text-muted-foreground">
                Chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc
              </p>
            </CardHeader>
            <CardContent className="p-8 md:p-10 lg:p-12">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      placeholder="Nguyễn Văn A"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      required
                      type="email"
                      placeholder="email@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Chủ đề <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    placeholder="Vấn đề cần hỗ trợ..."
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Nội dung <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    required
                    rows={6}
                    placeholder="Mô tả chi tiết vấn đề của bạn..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto gap-2">
                  <Send className="h-4 w-4" />
                  Gửi tin nhắn
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border-primary/20 dark:border-primary/30">
            <CardContent className="p-8 md:p-10 lg:p-12 text-center">
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Hướng dẫn sử dụng
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tài liệu chi tiết về cách sử dụng dịch vụ
              </p>
              <Button variant="outline" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Xem hướng dẫn
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/5 to-success/10 dark:from-success/20 dark:to-success/10 border-success/20 dark:border-success/80">
            <CardContent className="p-8 md:p-10 lg:p-12 text-center">
              <ShieldCheck className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Chính sách & Điều khoản
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Thông tin về chính sách và quyền lợi
              </p>
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" />
                Xem chi tiết
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/5 to-secondary/10 dark:from-secondary/20 dark:to-secondary/10 border-secondary/20 dark:border-secondary/80">
            <CardContent className="p-8 md:p-10 lg:p-12 text-center">
              <MessageCircle className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-semibold text-lg text-foreground mb-2">
                Cộng đồng
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Tham gia cộng đồng người dùng
              </p>
              <Button variant="outline" className="gap-2">
                <Users className="h-4 w-4" />
                Tham gia ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
