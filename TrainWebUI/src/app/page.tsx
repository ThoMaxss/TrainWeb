'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { SearchSection } from '@/components/shared/SearchSection';
import { DynamicClientTime } from '@/components/shared/DynamicClientTime';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Train,
  MapPin,
  Clock,
  ShieldCheck,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Display, H1, H2, H3, Body, Lead } from '@/components/ui/typography';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <Header />

      {/* HERO SECTION (chuẩn Figma) */}
        <section className="relative isolate h-[660px] w-full overflow-hidden bg-white dark:bg-white text-black dark:text-black">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/image/hero-train.png')" }}
            aria-hidden
          />

          {/* Overlay sáng (giúp ảnh tươi, chữ nổi) */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-transparent" />


          {/* Nội dung */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center"
              style={{ marginTop: "-50px" }}>
            <h1 className="text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] 
                          text-4xl md:text-6xl font-bold tracking-tight">
              Sẵn sàng cho chuyến đi?
            </h1>

            <p className="mt-4 max-w-3xl text-white/95 text-sm md:text-base leading-relaxed">
              Tìm kiếm, so sánh và đặt vé tàu trên toàn quốc một cách dễ dàng. 
              Chọn tuyến tốt nhất, chọn chỗ ngồi ưa thích và tận hưởng chuyến đi thoải mái.
            </p>

            <div className="mt-3 text-sm text-white/90 flex items-center gap-2">
              <DynamicClientTime />
            </div>

            {/* Thẻ tìm kiếm nổi giữa ảnh */}
            <div
              className="mt-5 w-full max-w-[1040px] rounded-2xl 
                        bg-white/92 backdrop-blur-md border border-white/60 
                        shadow-[0_20px_40px_rgba(0,0,0,0.15)]"
            >
              <SearchSection />
            </div>
          </div>
        </section>

      {/* WHY TRAINBOOK */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <H1 className="text-center mb-12">Vì sao nên đi cùng GoRail?</H1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {[
            {
              icon: <MapPin className="h-6 w-6 text-primary" />,
              title: 'Tìm kiếm dễ dàng',
              desc: 'Nhanh chóng tìm chuyến tàu với giao diện trực quan.',
            },
            {
              icon: <Sparkles className="h-6 w-6 text-primary" />,
              title: 'Chọn chỗ bạn thích',
              desc: 'Tự do chọn ghế với bản đồ ghế dễ nhìn.',
            },
            {
              icon: <ShieldCheck className="h-6 w-6 text-primary" />,
              title: 'Đặt vé an toàn',
              desc: 'Thanh toán bảo mật, an tâm tuyệt đối.',
            },
          ].map((f, i) => (
            <Card
              key={i}
              className="border hover:shadow-lg transition-all duration-200"
            >
              <CardHeader className="text-center flex flex-col items-center gap-2 py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  {f.icon}
                </div>
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription className="text-gray-500 text-sm">
                  {f.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-3">
          <Train className="h-6 w-6 text-primary" />
          <H2>TrainBook</H2>
        </div>
        <Body className="max-w-3xl mb-10">
          TrainBook là nền tảng đặt vé tàu hiện đại của Việt Nam, kết nối hành
          khách với mạng lưới đường sắt quốc gia. Thật dễ dàng để khám phá
          những điểm đến nổi bật như Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM
          bằng tàu hỏa.
        </Body>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <H2 className="mb-3">TrainBook là gì?</H2>
            <Body>
              Hoạt động như một dịch vụ đặt vé độc lập, TrainBook kết nối với
              Đường sắt Việt Nam (VNR) để mở rộng phạm vi toàn quốc. Bên cạnh
              tính năng đặt vé, TrainBook còn hỗ trợ chọn chỗ ngồi và thanh
              toán bảo mật.
            </Body>
          </div>
          <div className="rounded-2xl border shadow-md w-full h-[400px] bg-gradient-to-br from-accent/10 via-primary/5 to-secondary/10 flex items-center justify-center">
            <Body className="text-muted-foreground">
              Train Image Placeholder
            </Body>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <H1 className="text-center mb-12">Bản đồ tàu hỏa Việt Nam</H1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Body>
            Bản đồ này làm nổi bật những tuyến đường sắt phổ biến nhất, bao gồm{' '}
            <b>Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM</b>. Tuyến Bắc – Nam
            lịch sử dài hơn 1.700 km là một trong những hành trình đường sắt
            đẹp nhất châu Á.
          </Body>
          <div className="rounded-2xl border shadow-md w-full h-[400px] bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center">
            <Body className="text-muted-foreground">Map Placeholder</Body>
          </div>
        </div>
      </section>

      {/* PROMOTIONS */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-6">
            <H2>Ưu đãi mới nhất</H2>
            <Link
              href="/promotions"
              className="text-sm px-3 py-2 rounded-full border hover:bg-background focus-visible:ring-2 focus-visible:ring-ring transition-colors"
            >
              Xem tất cả các ưu đãi
            </Link>
          </div>

          <div className="relative">
            <button
              aria-label="prev"
              className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-12 w-12 rounded-full border bg-background shadow hover:bg-muted transition"
              onClick={() =>
                document
                  .getElementById('promo-scroll')
                  ?.scrollBy({ left: -340, behavior: 'smooth' })
              }
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              id="promo-scroll"
              className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pr-2"
            >
              {[
                {
                  img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&q=80',
                  tag: 'Ưu đãi & Khuyến mãi',
                  title: 'Đà Lạt: Giảm 20% vé đi Đà Lạt Express',
                },
                {
                  img: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=640&q=80',
                  tag: 'Ưu đãi & Khuyến mãi',
                  title: 'Đà Nẵng: Giảm 25% chuyến ven biển',
                },
                {
                  img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&q=80',
                  tag: 'Ưu đãi & Khuyến mãi',
                  title: 'Nha Trang: Giảm 30% vé khứ hồi',
                },
              ].map((d, i) => (
                <div key={i} className="snap-start min-w-[320px]">
                  <Card className="overflow-hidden border hover:shadow-md transition-shadow">
                    <Image
                      src={d.img}
                      alt={d.title}
                      width={640}
                      height={360}
                      className="h-40 w-full object-cover"
                    />
                    <CardContent className="p-3">
                      <Badge variant="outline" className="mb-3">
                        {d.tag}
                      </Badge>
                      <p className="font-semibold leading-snug">{d.title}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            <button
              aria-label="next"
              className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center h-12 w-12 rounded-full border bg-background shadow hover:bg-muted transition"
              onClick={() =>
                document
                  .getElementById('promo-scroll')
                  ?.scrollBy({ left: 340, behavior: 'smooth' })
              }
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <H1 className="text-center mb-12">Đối tác của chúng tôi</H1>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-center rounded-xl border py-6 bg-card"
            >
              <span className="text-xs text-muted-foreground font-medium">
                Partner {i + 1}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER SERVICE BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="h-[280px] w-full opacity-20 bg-[url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="rounded-2xl bg-background/90 backdrop-blur p-4 sm:p-6 max-w-3xl border border-white/50 shadow-xl">
              <div className="flex items-center gap-3 mb-2 text-primary">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5" />
                </span>
                <H3>Dịch vụ Khách hàng</H3>
              </div>
              <Body>
                Truy cập trang Chăm sóc Khách hàng để tìm thông tin hữu ích khi
                đi tàu, xem Câu hỏi thường gặp (FAQ) và liên hệ để được hỗ trợ
                đặt vé.
              </Body>
              <div className="mt-4">
                <Link
                  href="/support"
                  className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 font-semibold text-primary-foreground hover:bg-accent/90 transition-colors min-h-[48px]"
                >
                  Cần hỗ trợ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-semibold mb-3">TRAINBOOK VIETNAM HQ</h5>
              <Body>
                285 Cách Mạng Tháng Tám, Quận 10, TP. Hồ Chí Minh, 700000 Việt
                Nam
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
                {['FB', 'IG', 'TW', 'YT'].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs font-semibold"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 border-t pt-5 text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} TrainBook. Tất cả quyền được bảo lưu.
          </div>
        </div>
      </footer>
    </div>
  );
}
