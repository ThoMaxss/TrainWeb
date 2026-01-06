'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/shared/Header';
import { SearchSection } from '@/components/shared/SearchSection';
import { DynamicClientTime } from '@/components/shared/DynamicClientTime';
import { Card } from '@/components/ui/card';
import { MapPin, Sparkles, ShieldCheck, ChevronRight, Clock } from 'lucide-react';
import { Display, H2, H3, Body, Lead } from '@/components/ui/typography';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      {/* HERO SECTION */}
      <section className="relative isolate w-full min-h-[500px] md:min-h-[600px] flex flex-col justify-center overflow-hidden">
        <Image
          src="/image/hero-train.png"
          alt="Tàu hỏa Việt Nam chạy qua cảnh quan thiên nhiên đẹp"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />

        <div className="container mx-auto px-4 md:px-8 py-16 md:py-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center text-center"
          >
            <Display className="w-full relative overflow-hidden flex flex-col items-center py-13 px-0 box-border gap-12 bg-cover bg-no-repeat bg-top text-left text-[60px] text-white font-sans font-bold leading-[150%]">
              <b className="relative tracking-[-0.03em] leading-[100%]">Sẵn sàng cho chuyến đi?</b>
            </Display>

            <div className="mt-3">
              <DynamicClientTime />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="mt-8 w-full max-w-2xl md:max-w-5xl"
          >
            <div className="rounded-2xl bg-background/95 backdrop-blur-md border border-border shadow-2xl px-4 py-6 md:px-8 md:py-8">
              <SearchSection showTitle={false} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY CHOOSE GORAIL */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <Display className="text-3xl md:text-4xl tracking-[-0.02em] leading-[120%]">
            Vì sao nên lựa chọn GoRail?
          </Display>
          <Lead className="mt-3 text-muted-foreground">
            Nhanh – tiện – an toàn, tối ưu trải nghiệm đặt vé tàu cho mọi hành trình.
          </Lead>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              key: 'search',
              icon: MapPin,
              title: 'Tìm kiếm dễ dàng',
              desc: 'Giao diện trực quan giúp bạn nhanh chóng tìm chuyến tàu phù hợp.',
            },
            {
              key: 'seatmap',
              icon: Sparkles,
              title: 'Chọn chỗ bạn thích',
              desc: 'Bản đồ toa/ghế rõ ràng giúp chọn vị trí ngồi dễ dàng.',
            },
            {
              key: 'payment',
              icon: ShieldCheck,
              title: 'Thanh toán an toàn',
              desc: 'Bảo mật cao, bảo vệ thông tin khách hàng và giao dịch.',
            },
          ].map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.08 }}
              >
                <Card className="h-full rounded-2xl border bg-card p-8 text-center transition-all hover:border-primary/60 hover:shadow-lg">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>

                  <H3 className="mb-2 font-semibold">{item.title}</H3>
                  <Body className="text-muted-foreground leading-relaxed">{item.desc}</Body>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ABOUT GORAIL */}
      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px] py-12 sm:py-14 lg:py-[72px]">
        <div className="grid grid-cols-1 lg:grid-cols-[520px_1fr] gap-10 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-[520px]"
          >
            <H2 className="text-3xl md:text-4xl font-bold tracking-tight">Dịch vụ đặt vé tàu hiện đại</H2>

            <Body className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
              Hoạt động như một dịch vụ đặt vé độc lập, GoRail kết nối với Đường sắt Việt Nam (VNR)
              để mở rộng phạm vi toàn quốc.
            </Body>

            <Body className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
              Bên cạnh tính năng đặt vé, GoRail còn hỗ trợ chọn chỗ ngồi chi tiết và thanh toán bảo mật
              với nhiều phương thức.
            </Body>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs md:text-sm font-semibold text-primary">
                Tìm kiếm nhanh
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs md:text-sm font-semibold text-primary">
                Chọn chỗ ngồi
              </span>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs md:text-sm font-semibold text-primary">
                Thanh toán an toàn
              </span>
            </div>
          </motion.div>

          {/* Right image */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
            className="relative w-full overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm
                      aspect-16/10 lg:aspect-video lg:justify-self-end lg:max-w-[820px]"
          >
            <Image
              src="/image/about-gorail.png"
              alt="Hệ thống tàu hỏa hiện đại"
              fill
              className="object-cover object-center"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 820px"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* TRAIN MAP VIETNAM */}
      <section className="relative py-12 sm:py-14 lg:py-[72px]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-[60px]">
          <div className="text-center mb-10 lg:mb-12">
            <Display className="tracking-tight text-3xl sm:text-4xl lg:text-4xl">
              Bản đồ tàu hỏa Việt Nam
            </Display>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-[560px] space-y-6 lg:mt-10"
            >
              <Lead className="text-base sm:text-lg leading-relaxed">
                Bản đồ này làm nổi bật những tuyến đường sắt phổ biến nhất, bao gồm{' '}
                <span className="font-semibold text-foreground">
                  Hà Nội, Huế, Đà Nẵng, Nha Trang và TP.HCM
                </span>
                .
              </Lead>

              <Body className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Tuyến Bắc–Nam lịch sử dài hơn{' '}
                <span className="font-semibold text-foreground">1.700 km</span> là một trong những hành trình
                đường sắt đẹp nhất và hấp dẫn nhất khu vực Đông Nam Á.
              </Body>

              <div className="flex flex-wrap gap-3 pt-1">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary">
                  Tuyến Bắc–Nam
                </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary">
                  Các ga nổi bật
                </span>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs sm:text-sm font-semibold text-primary">
                  Gợi ý hành trình
                </span>
              </div>
            </motion.div>

            {/* Right image card */}
            <motion.div
              initial={{ opacity: 0, x: 22 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
            >
              <div className="relative w-full min-h-[380px] sm:min-h-[460px] lg:min-h-[560px] p-2 sm:p-3">
                <Image
                  src="/image/trainmap.png"
                  alt="Bản đồ tuyến đường sắt Việt Nam"
                  fill
                  className="object-contain object-center"
                  loading="lazy"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/40 via-transparent to-transparent" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* LATEST PROMOTIONS */}
      <section className="bg-muted/30">
        <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px] py-12 sm:py-14 lg:py-[72px]">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <H2 className="text-3xl sm:text-4xl font-bold tracking-tight">Mã giảm giá vé tàu</H2>
              <p className="mt-2 text-sm sm:text-base text-muted-foreground">
                Ưu đãi nổi bật hôm nay — số lượng có hạn.
              </p>
            </div>

            <Link
              href="/promotions"
              className="inline-flex items-center gap-2 rounded-full border bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 transition"
            >
              Xem tất cả <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            navigation
            pagination={{ clickable: true }}
            className="w-full"
          >
            {[
              {
                img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format&fit=crop',
                title: 'Giảm 20% vé đi Đà Lạt Express',
                discount: '20%',
                tag: 'Tuyến hot',
              },
              {
                img: 'https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?w=1200&q=80&auto=format&fit=crop',
                title: 'Giảm 25% chuyến ven biển Đà Nẵng',
                discount: '25%',
                tag: 'Cuối tuần',
              },
              {
                img: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80&auto=format&fit=crop',
                title: 'Giảm 30% vé khứ hồi Nha Trang',
                discount: '30%',
                tag: 'Best deal',
              },
            ].map((promo, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.08 }}
                  className="h-full"
                >
                  <Card className="group relative h-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative h-[220px] w-full">
                      <Image
                        src={promo.img}
                        alt={promo.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent" />

                      <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-foreground backdrop-blur">
                        <span className="text-primary">-{promo.discount}</span>
                        <span className="text-muted-foreground font-semibold">OFF</span>
                      </div>

                      <div className="absolute right-4 top-4 rounded-full bg-black/35 px-3 py-1 text-xs font-semibold text-white">
                        {promo.tag}
                      </div>
                    </div>

                    <div className="p-6">
                      <H3 className="text-lg sm:text-xl font-semibold leading-snug">{promo.title}</H3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Áp dụng cho một số chuyến/tuyến. Kiểm tra điều kiện khi đặt vé.
                      </p>

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">Lấy mã ngay</span>

                        <button
                          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95 transition"
                          type="button"
                        >
                          Nhận ưu đãi
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px] py-12 sm:py-14 lg:py-[72px]">
        <div className="text-center mb-10 lg:mb-12">
          <Display className="text-3xl sm:text-4xl font-bold tracking-tight">Đối tác của chúng tôi</Display>
          <p className="mx-auto mt-3 max-w-[720px] text-sm sm:text-base text-muted-foreground">
            Kết nối với các đối tác vận hành và thanh toán để mang đến trải nghiệm đặt vé an toàn.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 lg:gap-6">
          {[
            { name: 'VNR', img: '/image/partner1.jpg', alt: 'Đường sắt Việt Nam' },
            { name: 'ViettelPay', img: '/image/partner2.png', alt: 'ViettelPay' },
            { name: 'MoMo', img: '/image/partner3.png', alt: 'MoMo' },
            { name: 'VNPay', img: '/image/partner4.jpg', alt: 'VNPay' },
            { name: 'ZaloPay', img: '/image/partner5.png', alt: 'ZaloPay' },
            { name: 'Mastercard', img: '/image/partner6.png', alt: 'Mastercard' },
          ].map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div
                className="relative flex items-center justify-center rounded-2xl border border-black/5 bg-white/60 backdrop-blur shadow-sm
                           transition-all duration-300 hover:shadow-md hover:bg-white/80 hover:border-primary/30
                           h-[88px] sm:h-24"
                role="button"
                tabIndex={0}
                aria-label={partner.alt}
              >
                <Image
                  src={partner.img}
                  alt={partner.alt}
                  fill
                  className="object-contain p-5 opacity-95 transition-all duration-300 group-hover:opacity-100"
                  loading="lazy"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                />

                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/40 via-transparent to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TICKET CLASSES */}
      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px] py-12 sm:py-14 lg:py-[72px]">
        <div className="text-center mb-10 lg:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Loại vé tàu</h2>
          <p className="mx-auto mt-3 max-w-[760px] text-sm sm:text-base text-muted-foreground">
            Chọn từ nhiều hạng vé từ tiết kiệm đến cao cấp, phù hợp với mọi nhu cầu và ngân sách.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              tier: 'Standard Class',
              title: 'Ghế cứng',
              desc: 'Giá rẻ nhất, phù hợp quãng ngắn và khách du lịch tiết kiệm.',
              img: '/image/ticket-seat-hard.jpg',
              tag: 'Tiết kiệm',
            },
            {
              tier: 'Comfort Class',
              title: 'Ghế mềm',
              desc: 'Ghế mềm điều hòa, ngả lưng thoải mái, thích hợp hành trình xa.',
              img: '/image/ticket-seat-soft.png',
              tag: 'Phổ biến',
            },
            {
              tier: 'Premium Class',
              title: 'Giường nằm',
              desc: 'Khoang giường 6/4/2, lý tưởng cho hành trình đêm dài.',
              img: '/image/ticket-seat-hard.jpg',
              tag: 'Cao cấp',
            },
          ].map((c) => (
            <article
              key={c.title}
              className="group h-full overflow-hidden rounded-3xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex flex-col"
            >
              <div className="relative w-full aspect-video bg-muted">
                <Image
                  src={c.img}
                  alt={`${c.title} - khoang tàu`}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/35 via-black/10 to-transparent" />

                <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur">
                  {c.tag}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <p className="text-xs font-semibold text-primary">{c.tier}</p>
                <h3 className="mt-2 text-xl font-bold tracking-tight">{c.title}</h3>
                <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{c.desc}</p>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-full border bg-background px-4 py-2 text-sm font-semibold hover:bg-primary/5 transition"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CUSTOMER SUPPORT BANNER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/90 via-secondary/80 to-accent/70" />
        <div className="relative max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
          <div className="rounded-2xl bg-background/95 backdrop-blur border border-white/20 shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 max-w-4xl">
            <div className="shrink-0">
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

      {/* FOOTER */}
      <footer className="bg-muted/50 border-t">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <H3 className="font-bold mb-4">GoRail Vietnam</H3>
              <Body className="text-sm text-muted-foreground">
                285 Cách Mạng Tháng Tám, Quận 10, TP. Hồ Chí Minh 700000
              </Body>
            </div>
            <div>
              <H3 className="font-bold mb-4">Liên hệ</H3>
              <Body className="text-sm text-muted-foreground mb-2">📍 285 CMT8, Quận 10, TP.HCM</Body>
              <Body className="text-sm text-muted-foreground mb-2">📞 +84 28 3920 1234</Body>
              <Body className="text-sm text-muted-foreground">✉️ support@gorail.vn</Body>
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
            <p>© {new Date().getFullYear()} GoRail Vietnam. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
