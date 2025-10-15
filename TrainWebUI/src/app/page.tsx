'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { SearchSection } from '@/components/shared/SearchSection';
import { DynamicClientTime } from '@/components/shared/DynamicClientTime';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, MapPin, Clock, Users, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Display, H1, H2, H3, Body, Lead, Small } from '@/components/ui/typography';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* HERO + SEARCH (ảnh nền + thẻ tìm kiếm nổi) */}
      <section className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        <div className="h-[520px] w-full bg-[url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2">
          <Display className="text-primary-foreground drop-shadow-md text-center">
            Sẵn sàng cho chuyến đi?
          </Display>
          <Lead className="mt-3 max-w-2xl text-primary-foreground/95 text-center">
            Tìm kiếm, so sánh và đặt vé tàu trên toàn quốc một cách dễ dàng. Chọn tuyến tốt nhất, chọn chỗ ngồi ưa thích và tận hưởng chuyến đi thoải mái.
          </Lead>
          <div className="mt-3">
            <DynamicClientTime />
          </div>

          {/* Thẻ Search nổi (giữ nguyên logic của bạn) */}
          <div className="mt-5 w-full max-w-5xl rounded-2xl bg-background/95 backdrop-blur border shadow-2xl">
            <SearchSection />
          </div>
        </div>
      </section>

      {/* "Vì sao nên đi cùng TrainBook?" */}
      <section className="max-w-6xl mx-auto px-2 py-16">
        <H1 className="text-center mb-12">Vì sao nên đi cùng TrainBook?</H1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: <MapPin className="h-6 w-6 text-primary" />, title: 'Tìm kiếm dễ dàng', desc: 'Nhanh chóng tìm chuyến tàu với giao diện trực quan.' },
            { icon: <Sparkles className="h-6 w-6 text-primary" />, title: 'Chọn chỗ bạn thích', desc: 'Tự do chọn ghế với bản đồ ghế dễ nhìn.' },
            { icon: <ShieldCheck className="h-6 w-6 text-primary" />, title: 'Đặt vé an toàn', desc: 'Thanh toán bảo mật, an tâm tuyệt đối.' },
          ].map((f, i) => (
            <Card key={i} className="border hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring">
              <CardHeader className="flex items-center p-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-3">{f.icon}</div>
                <CardTitle className="text-lg mb-2">{f.title}</CardTitle>
                <CardDescription className="leading-relaxed">{f.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* ABOUT TrainBook */}
      <section className="max-w-6xl mx-auto px-2 py-16">
        <div className="flex items-center gap-3 mb-3">
          <Train className="h-6 w-6 text-primary" />
          <H2>TrainBook</H2>
        </div>
        <Body className="max-w-3xl">
          TrainBook là nền tảng đặt vé tàu hiện đại của Việt Nam, kết nối hành khách với mạng lưới đường sắt quốc gia. Thật dễ dàng để
          khám phá những điểm đến nổi bật như Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM bằng tàu hỏa…
        </Body>

        <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5 items-center">
          <div className="order-2 lg:order-1">
            <H2 className="mb-3">TrainBook là gì?</H2>
            <Body>
              Hoạt động như một dịch vụ đặt vé độc lập, TrainBook kết nối với Đường sắt Việt Nam (VNR) để mở rộng phạm vi toàn quốc.
              Bên cạnh tính năng đặt vé, TrainBook còn hỗ trợ chọn chỗ ngồi và thanh toán bảo mật.
            </Body>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-2xl border shadow-md w-full h-[400px] bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 flex items-center justify-center">
              <Body className="text-muted-foreground">Train Image Placeholder</Body>
            </div>
          </div>
        </div>
      </section>

      {/* Bản đồ tàu hỏa Việt Nam */}
      <section className="max-w-6xl mx-auto px-2 py-16">
        <H1 className="text-center mb-12">Bản đồ tàu hỏa Việt Nam</H1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Body>
            Bản đồ này làm nổi bật những tuyến đường sắt phổ biến nhất, bao gồm <b>Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM</b>. 
            Tuyến Bắc – Nam lịch sử dài hơn 1.700 km là một trong những hành trình đường sắt đẹp nhất châu Á.
          </Body>
          <div className="rounded-2xl border shadow-md w-full h-[400px] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
            <Body className="text-muted-foreground">Map Placeholder</Body>
          </div>
        </div>
      </section>

      {/* Ưu đãi mới nhất (slider ngang đơn giản, không đổi logic app) */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-2 py-16">
          <div className="flex items-center justify-between mb-5">
            <H2>Ưu đãi mới nhất</H2>
            <Link href="/promotions" className="text-sm px-2 py-2 rounded-full border hover:bg-background focus-visible:ring-2 focus-visible:ring-ring transition-colors min-h-[48px] flex items-center">
              Xem tất cả các ưu đãi đặc biệt
            </Link>
          </div>

          <div className="relative">
            <button
              aria-label="prev"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-12 w-12 rounded-full border bg-background shadow hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              onClick={() => document.getElementById('promo-scroll')?.scrollBy({ left: -340, behavior: 'smooth' })}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div id="promo-scroll" className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-2">
              {[
                { img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Đà Lạt: "Giảm 20% vé đi Đà Lạt Express"' },
                { img: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Đà Nẵng: "Giảm 25% chuyến ven biển đến Đà Nẵng"' },
                { img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Nha Trang: "Giảm 30% vé khứ hồi đi Nha Trang"' },
                { img: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Hội An: ưu đãi mới' },
              ].map((d, i) => (
                <div key={i} className="snap-start min-w-[320px]">
                  <Card className="overflow-hidden border hover:shadow-md transition-shadow">
                    <Image src={d.img} alt={d.title} width={640} height={360} className="h-40 w-full object-cover" />
                    <CardContent className="p-2">
                      <Badge variant="outline" className="mb-3">{d.tag}</Badge>
                      <p className="font-semibold leading-snug">{d.title}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <button
              aria-label="next"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-12 w-12 rounded-full border bg-background shadow hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring transition-colors"
              onClick={() => document.getElementById('promo-scroll')?.scrollBy({ left: 340, behavior: 'smooth' })}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Đối tác */}
      <section className="max-w-6xl mx-auto px-2 py-16">
        <H1 className="text-center mb-12">Đối tác của chúng tôi</H1>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-center">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map((n) => (
            <div key={n} className="flex items-center justify-center rounded-xl border py-6 bg-card">
              <div className="text-xs text-muted-foreground font-medium">Partner {n}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Loại vé tàu */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-2 py-16">
          <H1 className="text-center">Loại vé tàu</H1>
          <Lead className="text-center mt-3 mb-12">
            TrainBook mang đến nhiều hạng vé từ tiết kiệm đến cao cấp, đáp ứng mọi nhu cầu.
          </Lead>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { title: 'Standard Class – Ghế cứng', desc: 'Giá rẻ nhất, phù hợp quãng ngắn.', img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=640&q=80' },
              { title: 'Comfort Class – Ghế mềm', desc: 'Ghế mềm điều hòa, ngả lưng thoải mái.', img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=640&q=80' },
              { title: 'Premium Class – Giường nằm', desc: 'Khoang giường 6/4/2 VIP, lý tưởng hành trình đêm.', img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=640&q=80' },
            ].map((c, i) => (
              <Card key={i} className="overflow-hidden border hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring">
                <Image src={c.img} alt={c.title} width={640} height={400} className="h-48 w-full object-cover" />
                <CardHeader className="pb-2 p-2">
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-2 pb-3">
                  <CardDescription>{c.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Dịch vụ Khách hàng */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="h-[280px] w-full opacity-20 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-2 w-full">
            <div className="rounded-2xl bg-background/90 backdrop-blur p-2 sm:p-2 max-w-3xl border border-white/60 shadow-xl">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5" />
                </span>
                <H3>Dịch vụ Khách hàng</H3>
              </div>
              <Body>
                Truy cập trang Chăm sóc Khách hàng để tìm thông tin hữu ích khi đi tàu, xem mục Câu hỏi thường gặp (FAQ) và liên hệ để được hỗ trợ đặt vé.
              </Body>
              <div className="mt-3">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-2 py-2 font-semibold text-primary-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent transition-colors min-h-[48px]"
                >
                  Cần hỗ trợ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer 3 cột */}
      <footer className="bg-muted/50">
        <div className="max-w-6xl mx-auto px-2 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-semibold mb-3">TRAINBOOK VIETNAM HQ</h5>
              <Body>
                285 Cách Mạng Tháng Tám, Quận 10, TP. Hồ Chí Minh, 700000 Việt Nam
              </Body>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Liên hệ</h5>
              <Body className="mb-2">T. 285 CMT8, Quận 10, TP. Hồ Chí Minh</Body>
              <Body className="mb-2">F. +84 28 3920 1234</Body>
              <Body>E. support@trainbook.vn</Body>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Media Social</h5>
              <div className="flex items-center gap-3">
                <a href="#" className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs">FB</a>
                <a href="#" className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs">IG</a>
                <a href="#" className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs">TW</a>
                <a href="#" className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs">YT</a>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-5 text-center text-muted-foreground">
            © {new Date().getFullYear()} TrainBook. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}
