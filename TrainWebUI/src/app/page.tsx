'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { SearchSection } from '@/components/shared/SearchSection';
import { DynamicClientTime } from '@/components/shared/DynamicClientTime';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Train, MapPin, Clock, Users, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Display, H1, H2, H3, Body, Lead, Small } from '@/components/ui/typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* HERO + SEARCH (ảnh nền + thẻ tìm kiếm nổi) */}
      <section className="relative bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20">
        <div className="relative h-[400px] md:h-[520px] w-full overflow-hidden">
          <Image
            src="/image/hero-train.png"
            alt="Tàu hỏa Việt Nam chạy qua cảnh quan thiên nhiên đẹp"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <Display className="text-primary-foreground drop-shadow-md text-center">
              Sẵn sàng cho chuyến đi?
            </Display>
            <Lead className="mt-3 max-w-2xl text-primary-foreground/95 text-center">
              Tìm kiếm, so sánh và đặt vé tàu trên toàn quốc một cách dễ dàng.
            </Lead>
            <div className="mt-3">
              <DynamicClientTime />
            </div>
          </motion.div>

          {/* Thẻ Search nổi */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-5 w-full max-w-xl md:max-w-5xl rounded-2xl bg-background/95 backdrop-blur border shadow-2xl px-4 py-6 md:px-6 md:py-8"
          >
            <SearchSection />
          </motion.div>
        </div>
      </section>

      {/* "Vì sao nên đi cùng TrainBook?" */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <Display className="text-center mb-12">Vì sao nên đi cùng TrainBook?</Display>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: <MapPin className="h-8 w-8 text-primary" aria-hidden="true" />, title: 'Tìm kiếm dễ dàng', desc: 'Nhanh chóng tìm chuyến tàu với giao diện trực quan.' },
            { icon: <Sparkles className="h-8 w-8 text-primary" aria-hidden="true" />, title: 'Chọn chỗ bạn thích', desc: 'Tự do chọn ghế với bản đồ ghế dễ nhìn.' },
            { icon: <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />, title: 'Đặt vé an toàn', desc: 'Thanh toán bảo mật, an tâm tuyệt đối.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="rounded-2xl border hover:shadow-lg transition-all focus-within:ring-2 focus-within:ring-ring flex flex-col items-center justify-center text-center min-h-[260px] p-6 bg-card dark:bg-card h-full">
                <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4 text-primary transition-transform duration-300 group-hover:scale-110">
                  {f.icon}
                </div>
                <H3 className="mb-2 text-xl font-semibold">{f.title}</H3>
                <Body className="leading-relaxed text-base text-muted-foreground">{f.desc}</Body>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ABOUT TrainBook */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-3 mb-3">
          <Train className="h-6 w-6 text-primary" aria-hidden="true" />
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
          <div className="order-1 lg:order-2 relative h-[300px] md:h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=640&q=80"
              alt="Hình ảnh minh họa về TrainBook và hệ thống đường sắt Việt Nam"
              fill
              className="object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Bản đồ tàu hỏa Việt Nam */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <H1 className="text-center mb-12">Bản đồ tàu hỏa Việt Nam</H1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <Body>
            Bản đồ này làm nổi bật những tuyến đường sắt phổ biến nhất, bao gồm <b>Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM</b>. 
            Tuyến Bắc – Nam lịch sử dài hơn 1.700 km là một trong những hành trình đường sắt đẹp nhất châu Á.
          </Body>
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&q=80"
              alt="Bản đồ hệ thống đường sắt Việt Nam với các tuyến chính Bắc-Nam"
              fill
              className="object-cover rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Ưu đãi mới nhất (sử dụng Swiper) */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-5">
            <H2>Ưu đãi mới nhất</H2>
            <Link href="/promotions" className="text-sm px-2 py-2 rounded-full border hover:bg-background focus-visible:ring-2 focus-visible:ring-ring transition-colors min-h-[48px] flex items-center">
              Xem tất cả các ưu đãi đặc biệt
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="w-full"
          >
            {[
              { img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Đà Lạt: "Giảm 20% vé đi Đà Lạt Express"' },
              { img: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Đà Nẵng: "Giảm 25% chuyến ven biển đến Đà Nẵng"' },
              { img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&q=80', tag: 'Ưu đãi & Khuyến mãi', title: 'Nha Trang: "Giảm 30% vé khứ hồi đi Nha Trang"' },
            ].map((d, i) => (
              <SwiperSlide key={i}>
                <Card className="overflow-hidden border rounded-2xl bg-card dark:bg-card w-full h-[300px] flex flex-col">
                  <div className="relative h-[170px] w-full">
                    <Image
                      src={d.img}
                      alt={d.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardContent className="p-2 flex-1 flex flex-col justify-end">
                    <Badge variant="outline" className="mb-3">{d.tag}</Badge>
                    <p className="font-semibold leading-snug text-balance text-primary/90">{d.title}</p>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Đối tác */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
        <H1 className="text-center mb-12">Đối tác của chúng tôi</H1>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 items-center">
          {[
            { name: 'VNR', img: '/image/partner1.jpg', alt: 'Đường sắt Việt Nam (VNR)' },
            { name: 'ViettelPay', img: '/image/partner2.png', alt: 'ViettelPay' },
            { name: 'MoMo', img: '/image/partner3.png', alt: 'MoMo' },
            { name: 'VNPay', img: '/image/partner4.jpg', alt: 'VNPay' },
            { name: 'ZaloPay', img: '/image/partner5.png', alt: 'ZaloPay' },
            { name: 'Mastercard', img: '/image/partner6.png', alt: 'Mastercard' },
          ].map((p, i) => (
            <motion.div
              key={p.name}
              whileHover={{ scale: 1.05, borderColor: "var(--primary)" }}
              className="flex items-center justify-center rounded-xl border py-6 bg-card transition-colors cursor-pointer"
            >
              <Image src={p.img} alt={p.alt} width={80} height={40} className="object-contain h-10 grayscale hover:grayscale-0 transition-all duration-300" loading="lazy" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Loại vé tàu */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
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
              <Card key={i} className="overflow-hidden border rounded-2xl hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-ring flex flex-col items-center text-center bg-card dark:bg-card">
                <div className="relative h-40 w-full">
                  <Image
                    src={c.img}
                    alt={c.title}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>
                <CardHeader className="pb-2 p-2 w-full flex flex-col items-center">
                  <H3 className="text-lg mb-1 text-center w-full">{c.title}</H3>
                </CardHeader>
                <CardContent className="pt-0 px-2 pb-3 w-full flex flex-col items-center">
                  <Body className="text-muted-foreground text-center w-full">{c.desc}</Body>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Banner Dịch vụ Khách hàng */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="relative h-[280px] w-full opacity-20 overflow-hidden">
          <Image
            src="/image/customer-service-bg.jpg"
            alt="Nền hình ảnh dịch vụ khách hàng với nhân viên hỗ trợ"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 w-full">
            <div className="rounded-2xl bg-background/95 backdrop-blur p-4 sm:p-6 max-w-3xl border border-white/60 shadow-2xl flex flex-col sm:flex-row items-center gap-5">
              <div className="flex-shrink-0 flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10">
                <Clock className="h-10 w-10 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <H3 className="mb-2 text-2xl text-primary">Dịch vụ Khách hàng</H3>
                <Body>
                  Truy cập trang <b>Chăm sóc Khách hàng</b> để tìm thông tin hữu ích khi đi tàu, xem mục <b>Câu hỏi thường gặp (FAQ)</b> và liên hệ để được hỗ trợ đặt vé.
                </Body>
                <div className="mt-3">
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 font-semibold text-primary-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent transition-colors min-h-[48px]"
                  >
                    Cần hỗ trợ?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA cuối trang */}
      <section className="py-12 text-center">
        <Button asChild size="lg" className="min-w-[200px]">
          <Link href="/search">Bắt đầu đặt vé ngay</Link>
        </Button>
      </section>

      {/* Footer 3 cột */}
      <footer className="bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16">
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
              <h5 className="font-semibold mb-3">Kết nối mạng xã hội</h5>
              <div className="flex items-center gap-3">
                <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook icon" width={32} height={32} className="rounded shadow-sm hover:scale-110 transition-transform bg-card dark:bg-card p-1" loading="lazy" />
                </a>
                <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram icon" width={32} height={32} className="rounded shadow-sm hover:scale-110 transition-transform bg-card dark:bg-card p-1" loading="lazy" />
                </a>
                <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg" alt="Twitter icon" width={32} height={32} className="rounded shadow-sm hover:scale-110 transition-transform bg-card dark:bg-card p-1" loading="lazy" />
                </a>
                <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <Image src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg" alt="YouTube icon" width={32} height={32} className="rounded shadow-sm hover:scale-110 transition-transform bg-card dark:bg-card p-1" loading="lazy" />
                </a>
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