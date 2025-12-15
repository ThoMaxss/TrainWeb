'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { SearchSection } from '@/components/shared/SearchSection';
import { DynamicClientTime } from '@/components/shared/DynamicClientTime';
import { Card } from '@/components/ui/card';
import { Train, MapPin, Sparkles, ShieldCheck, ChevronRight, Clock } from 'lucide-react';
import { Display, H2, H3, Body, Lead } from '@/components/ui/typography';
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
      <Header />

      {/* HERO SECTION */}
      <section className="relative w-full h-[400px] md:h-[520px] overflow-hidden">
        <Image
          src="/image/hero-train.png"
          alt="Tàu hỏa Việt Nam chạy qua cảnh quan thiên nhiên đẹp"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/50" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 md:px-8 pt-16 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center text-center"
          >
            <Display className="text-white drop-shadow-lg">
              Sẵn sàng cho chuyến đi?
            </Display>
            <Lead className="mt-3 max-w-2xl text-white/90">
              Tìm kiếm, so sánh và đặt vé tàu trên toàn quốc một cách dễ dàng
            </Lead>
            <div className="mt-3">
              <DynamicClientTime />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-8 w-full max-w-2xl md:max-w-5xl"
          >
            <div className="rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-2xl px-4 py-6 md:px-8 md:py-8">
              <SearchSection />
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE TRAINBOOK */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <Display>Tại sao chọn TrainBook?</Display>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: 'Tìm kiếm dễ dàng', desc: 'Giao diện trực quan giúp bạn nhanh chóng tìm chuyến tàu phù hợp' },
            { icon: Sparkles, title: 'Chọn chỗ bạn thích', desc: 'Bản đồ ghế interactif giúp chọn vị trí ngồi một cách dễ dàng' },
            { icon: ShieldCheck, title: 'Thanh toán an toàn', desc: 'Hệ thống bảo mật cao, bảo vệ thông tin khách hàng tuyệt đối' },
          ].map((item, i) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full rounded-2xl border hover:border-primary hover:shadow-lg transition-all p-8 flex flex-col items-center text-center bg-card">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                    <IconComponent className="w-8 h-8 text-primary" aria-hidden="true" />
                  </div>
                  <H3 className="mb-2 font-semibold">{item.title}</H3>
                  <Body className="text-muted-foreground leading-relaxed">{item.desc}</Body>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ABOUT TRAINBOOK */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="flex items-center gap-3 mb-6">
          <Train className="w-7 h-7 text-primary" aria-hidden="true" />
          <H2 className="text-3xl font-bold">TrainBook</H2>
        </div>
        <Body className="max-w-3xl mb-12 text-lg">
          Nền tảng đặt vé tàu hỏa hiện đại của Việt Nam, kết nối hành khách với mạng lưới đường sắt quốc gia. Khám phá những điểm đến nổi bật từ Hà Nội, Huế, Đà Nẵng, Nha Trang đến TP.HCM một cách dễ dàng và tiện lợi.
        </Body>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <H2 className="text-2xl font-bold mb-4">Dịch vụ đặt vé tàu hiện đại</H2>
            <Body className="text-lg text-muted-foreground mb-4">
              Hoạt động như một dịch vụ đặt vé độc lập, TrainBook kết nối với Đường sắt Việt Nam (VNR) để mở rộng phạm vi toàn quốc.
            </Body>
            <Body className="text-lg text-muted-foreground">
              Bên cạnh tính năng đặt vé, TrainBook còn hỗ trợ chọn chỗ ngồi chi tiết và thanh toán bảo mật với nhiều phương thức.
            </Body>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[350px] md:h-[450px] w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800&q=80"
              alt="Hệ thống tàu hỏa hiện đại"
              fill
              className="object-cover rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* TRAIN MAP VIETNAM */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <Display>Bản đồ tàu hỏa Việt Nam</Display>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Lead className="text-lg mb-6">
              Bản đồ này làm nổi bật những tuyến đường sắt phổ biến nhất, bao gồm <span className="font-semibold">Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM</span>.
            </Lead>
            <Body className="text-lg text-muted-foreground">
              Tuyến Bắc–Nam lịch sử dài hơn 1.700 km là một trong những hành trình đường sắt đẹp nhất và hấp dẫn nhất khu vực Đông Nam Á.
            </Body>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[350px] md:h-[450px] w-full"
          >
            <Image
              src="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80"
              alt="Bản đồ tuyến đường sắt Bắc-Nam"
              fill
              className="object-cover rounded-2xl"
              loading="lazy"
            />
          </motion.div>
        </div>
      </section>

      {/* LATEST PROMOTIONS */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-12">
            <H2 className="text-3xl font-bold">Ưu đãi mới nhất</H2>
            <Link href="/promotions" className="text-sm font-medium text-primary hover:underline flex items-center gap-2">
              Xem tất cả <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
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
              { img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&q=80', title: 'Giảm 20% vé đi Đà Lạt Express' },
              { img: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=640&q=80', title: 'Giảm 25% chuyến ven biển Đà Nẵng' },
              { img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=640&q=80', title: 'Giảm 30% vé khứ hồi Nha Trang' },
            ].map((promo, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden rounded-2xl border hover:border-primary hover:shadow-lg transition-all h-full flex flex-col bg-card">
                    <div className="relative h-[200px] w-full">
                      <Image
                        src={promo.img}
                        alt={promo.title}
                        fill
                        className="object-cover"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-end">
                      <H3 className="text-lg font-semibold text-foreground">{promo.title}</H3>
                    </div>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <Display>Đối tác của chúng tôi</Display>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'VNR', img: '/image/partner1.jpg', alt: 'Đường sắt Việt Nam' },
            { name: 'ViettelPay', img: '/image/partner2.png', alt: 'ViettelPay' },
            { name: 'MoMo', img: '/image/partner3.png', alt: 'MoMo' },
            { name: 'VNPay', img: '/image/partner4.jpg', alt: 'VNPay' },
            { name: 'ZaloPay', img: '/image/partner5.png', alt: 'ZaloPay' },
            { name: 'Mastercard', img: '/image/partner6.png', alt: 'Mastercard' },
          ].map((partner) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center rounded-xl border border-border hover:border-primary bg-card p-6 transition-all cursor-pointer"
            >
              <Image
                src={partner.img}
                alt={partner.alt}
                width={100}
                height={50}
                className="object-contain h-12 w-auto grayscale hover:grayscale-0 transition-all duration-300"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* TICKET CLASSES */}
      <section className="bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-12">
            <Display>Loại vé tàu</Display>
            <Lead className="mt-4 max-w-2xl mx-auto">
              Chọn từ nhiều hạng vé từ tiết kiệm đến cao cấp, phù hợp với mọi nhu cầu và ngân sách
            </Lead>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Ghế cứng',
                subtitle: 'Standard Class',
                desc: 'Giá rẻ nhất, phù hợp quãng ngắn và khách du lịch tiết kiệm',
                img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=640&q=80',
              },
              {
                title: 'Ghế mềm',
                subtitle: 'Comfort Class',
                desc: 'Ghế mềm điều hòa, ngả lưng thoải mái, thích hợp hành trình xa',
                img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=640&q=80',
              },
              {
                title: 'Giường nằm',
                subtitle: 'Premium Class',
                desc: 'Khoang giường VIP 6/4/2, lý tưởng cho hành trình đêm dài',
                img: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=640&q=80',
              },
            ].map((ticketClass, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden rounded-2xl border hover:border-primary hover:shadow-lg transition-all flex flex-col h-full bg-card">
                  <div className="relative h-[220px] w-full">
                    <Image
                      src={ticketClass.img}
                      alt={ticketClass.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <Body className="text-sm text-primary font-medium mb-1">{ticketClass.subtitle}</Body>
                    <H3 className="text-xl font-bold mb-3">{ticketClass.title}</H3>
                    <Body className="text-muted-foreground flex-1">{ticketClass.desc}</Body>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOMER SUPPORT BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-secondary/80 to-accent/70" />
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/image/customer-service-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
            loading="lazy"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-2xl bg-background/95 backdrop-blur border border-white/20 shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 max-w-4xl">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10">
                <Clock className="w-10 h-10 text-primary" aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <H2 className="text-2xl font-bold mb-3">Dịch vụ Khách hàng 24/7</H2>
              <Body className="text-lg text-muted-foreground mb-4">
                Cần hỗ trợ? Truy cập trang Chăm sóc Khách hàng, xem FAQ hoặc liên hệ trực tiếp với đội hỗ trợ của chúng tôi.
              </Body>
              <Button asChild className="rounded-xl">
                <Link href="/support">Liên hệ hỗ trợ</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-20 text-center">
        <Display className="mb-6">Bắt đầu hành trình của bạn</Display>
        <Lead className="max-w-2xl mx-auto mb-8">
          Tìm kiếm và đặt vé tàu hỏa với giá tốt nhất trên TrainBook ngay hôm nay
        </Lead>
        <Button asChild size="lg" className="rounded-xl min-w-[200px]">
          <Link href="/search">Tìm kiếm vé tàu</Link>
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <H3 className="font-bold mb-4">TrainBook Vietnam</H3>
              <Body className="text-sm text-muted-foreground">
                285 Cách Mạng Tháng Tám, Quận 10, TP. Hồ Chí Minh 700000
              </Body>
            </div>
            <div>
              <H3 className="font-bold mb-4">Liên hệ</H3>
              <Body className="text-sm text-muted-foreground mb-2">📍 285 CMT8, Quận 10, TP.HCM</Body>
              <Body className="text-sm text-muted-foreground mb-2">📞 +84 28 3920 1234</Body>
              <Body className="text-sm text-muted-foreground">✉️ support@trainbook.vn</Body>
            </div>
            <div>
              <H3 className="font-bold mb-4">Theo dõi chúng tôi</H3>
              <div className="flex items-center gap-3">
                <Link href="https://facebook.com/" className="hover:scale-110 transition-transform" aria-label="Facebook">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20">f</div>
                </Link>
                <Link href="https://instagram.com/" className="hover:scale-110 transition-transform" aria-label="Instagram">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20">📷</div>
                </Link>
                <Link href="https://twitter.com/" className="hover:scale-110 transition-transform" aria-label="Twitter">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20">𝕏</div>
                </Link>
                <Link href="https://youtube.com/" className="hover:scale-110 transition-transform" aria-label="YouTube">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20">▶</div>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} TrainBook Vietnam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}