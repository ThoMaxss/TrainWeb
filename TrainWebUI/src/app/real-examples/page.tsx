import { H1, H2, H3, Body, Small, Micro } from "@/components/ui/typography";

// Example Train Booking Card với color system mới
function TrainBookingCard() {
  return (
    <div className="bg-card text-foreground rounded-2xl shadow-card border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <H3 className="text-foreground">SE1 - Reunification Express</H3>
          <Small className="text-muted">Hà Nội → TP. Hồ Chí Minh</Small>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs bg-success/10 text-success border border-success/20">
          Còn chỗ
        </span>
      </div>

      {/* Times & Duration */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
        <div className="text-center">
          <Body className="font-semibold text-foreground">19:30</Body>
          <Micro className="text-muted">Khởi hành</Micro>
        </div>
        <div className="text-center">
          <Micro className="text-muted">31h 30m</Micro>
          <div className="flex items-center justify-center mt-1">
            <div className="h-px bg-border flex-1"></div>
            <div className="px-2">🚂</div>
            <div className="h-px bg-border flex-1"></div>
          </div>
        </div>
        <div className="text-center">
          <Body className="font-semibold text-foreground">03:00+1</Body>
          <Micro className="text-muted">Đến nơi</Micro>
        </div>
      </div>

      {/* Price & Booking */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-accent">1,200,000 VND</span>
            <span className="px-1.5 py-0.5 text-xs bg-accent/10 text-accent rounded">
              -15%
            </span>
          </div>
          <Small className="text-muted line-through">1,400,000 VND</Small>
        </div>
        
        <button className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-hover-primary active:bg-active-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors font-medium">
          Đặt vé
        </button>
      </div>
    </div>
  );
}

// Dashboard Stats Card
function StatsCard({ title, value, change, color }: {
  title: string;
  value: string;
  change: string;
  color: 'primary' | 'accent' | 'success' | 'warning';
}) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10',
    accent: 'text-accent bg-accent/10', 
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10'
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Small className="text-muted font-medium">{title}</Small>
        <span className={`px-2 py-1 rounded text-xs ${colorClasses[color]}`}>
          {change}
        </span>
      </div>
      <H2 className={colorClasses[color].split(' ')[0]}>{value}</H2>
    </div>
  );
}

// Form Example
function BookingForm() {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
      <H2>Thông tin đặt vé</H2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Điểm khởi hành</label>
          <select className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring">
            <option>Hà Nội</option>
            <option>TP. Hồ Chí Minh</option>
            <option>Đà Nẵng</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Điểm đến</label>
          <select className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring">
            <option>TP. Hồ Chí Minh</option>
            <option>Hà Nội</option>
            <option>Đà Nẵng</option>
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Ngày đi</label>
          <input 
            type="date" 
            className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Số hành khách</label>
          <select className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring">
            <option>1 người</option>
            <option>2 người</option>
            <option>3 người</option>
            <option>4+ người</option>
          </select>
        </div>
      </div>
      
      <div className="flex gap-3">
        <button className="flex-1 bg-transparent text-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted/10 focus:outline-none focus:ring-2 focus:ring-ring">
          Hủy
        </button>
        <button className="flex-1 bg-primary text-white rounded-lg px-4 py-2 hover:bg-hover-primary active:bg-active-primary focus:outline-none focus:ring-2 focus:ring-ring">
          Tìm chuyến
        </button>
      </div>
    </div>
  );
}

// Alert Examples
function AlertExamples() {
  return (
    <div className="space-y-4">
      <H2>Alert States</H2>
      
      {/* Success Alert */}
      <div className="rounded-xl p-4 border" style={{ 
        borderColor: "color-mix(in srgb, var(--success), transparent 70%)", 
        background: "color-mix(in srgb, var(--success), transparent 92%)" 
      }}>
        <div className="flex items-start gap-3">
          <div className="text-success">✅</div>
          <div>
            <Body className="text-success font-medium">Đặt vé thành công!</Body>
            <Small className="text-success/80">Vé của bạn đã được gửi qua email.</Small>
          </div>
        </div>
      </div>
      
      {/* Warning Alert */}
      <div className="rounded-xl p-4 border" style={{ 
        borderColor: "color-mix(in srgb, var(--warning), transparent 70%)", 
        background: "color-mix(in srgb, var(--warning), transparent 92%)" 
      }}>
        <div className="flex items-start gap-3">
          <div className="text-warning">⚠️</div>
          <div>
            <Body className="text-warning font-medium">Chỉ còn 3 chỗ trống</Body>
            <Small className="text-warning/80">Nhanh tay đặt vé để đảm bảo chỗ ngồi.</Small>
          </div>
        </div>
      </div>
      
      {/* Error Alert */}
      <div className="rounded-xl p-4 border" style={{ 
        borderColor: "color-mix(in srgb, var(--error), transparent 70%)", 
        background: "color-mix(in srgb, var(--error), transparent 92%)" 
      }}>
        <div className="flex items-start gap-3">
          <div className="text-error">❌</div>
          <div>
            <Body className="text-error font-medium">Thanh toán thất bại</Body>
            <Small className="text-error/80">Vui lòng kiểm tra thông tin thẻ và thử lại.</Small>
          </div>
        </div>
      </div>
      
      {/* Info Alert */}
      <div className="rounded-xl p-4 border" style={{ 
        borderColor: "color-mix(in srgb, var(--info), transparent 70%)", 
        background: "color-mix(in srgb, var(--info), transparent 92%)" 
      }}>
        <div className="flex items-start gap-3">
          <div className="text-info">ℹ️</div>
          <div>
            <Body className="text-info font-medium">Thông tin quan trọng</Body>
            <Small className="text-info/80">Ga tàu sẽ đóng cửa 30 phút trước giờ khởi hành.</Small>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Demo Page
export default function RealExamplesDemo() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        <div className="text-center space-y-4">
          <H1 className="text-primary">Real UI Examples</H1>
          <Body className="text-muted max-w-2xl mx-auto">
            Các component thực tế sử dụng color system mới cho Train Booking App
          </Body>
        </div>

        {/* Dashboard Stats */}
        <section className="space-y-6">
          <H2>Dashboard Overview</H2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard title="Tổng vé bán" value="12,847" change="+8.2%" color="primary" />
            <StatsCard title="Doanh thu" value="2.4B VND" change="+12.5%" color="accent" />
            <StatsCard title="Khách hài lòng" value="98.5%" change="+2.1%" color="success" />
            <StatsCard title="Tàu delay" value="3.2%" change="-1.1%" color="warning" />
          </div>
        </section>

        {/* Train Cards */}
        <section className="space-y-6">
          <H2>Train Search Results</H2>
          <div className="space-y-4">
            <TrainBookingCard />
            
            {/* Loading state với skeleton */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="skeleton h-5 w-48 rounded"></div>
                  <div className="skeleton h-4 w-32 rounded"></div>
                </div>
                <div className="skeleton h-6 w-16 rounded-full"></div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-border">
                <div className="text-center space-y-1">
                  <div className="skeleton h-5 w-12 mx-auto rounded"></div>
                  <div className="skeleton h-3 w-16 mx-auto rounded"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="skeleton h-3 w-12 mx-auto rounded"></div>
                  <div className="skeleton h-4 w-20 mx-auto rounded"></div>
                </div>
                <div className="text-center space-y-1">
                  <div className="skeleton h-5 w-12 mx-auto rounded"></div>
                  <div className="skeleton h-3 w-16 mx-auto rounded"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="skeleton h-6 w-24 rounded"></div>
                  <div className="skeleton h-4 w-20 rounded"></div>
                </div>
                <div className="skeleton h-10 w-20 rounded-lg"></div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <section>
            <BookingForm />
          </section>

          {/* Alerts */}
          <section>
            <AlertExamples />
          </section>
        </div>

        {/* Color Usage Summary */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <H2 className="mb-6">Color System Summary</H2>
          <div className="prose prose-slate max-w-none">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-foreground mb-2">✅ Ưu điểm của hệ thống:</h4>
                <ul className="space-y-1 text-muted">
                  <li>• Giữ nguyên HEX colors bạn thiết kế</li>
                  <li>• Semantic tokens dễ maintain</li>
                  <li>• Dark mode tự động switch</li>
                  <li>• Focus ring a11y compliant</li>
                  <li>• Color-mix() cho alpha blending</li>
                  <li>• Skeleton loading với CSS vars</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">🎨 Cách sử dụng nhanh:</h4>
                <ul className="space-y-1 text-muted">
                  <li>• <code className="bg-muted/20 px-1 rounded">bg-primary</code> - CTA chính</li>
                  <li>• <code className="bg-muted/20 px-1 rounded">bg-accent/10 text-accent</code> - Giá/khuyến mãi</li>
                  <li>• <code className="bg-muted/20 px-1 rounded">bg-secondary/10 text-secondary</code> - Filters/tabs</li>
                  <li>• <code className="bg-muted/20 px-1 rounded">focus:ring-ring</code> - Focus states</li>
                  <li>• <code className="bg-muted/20 px-1 rounded">skeleton</code> - Loading states</li>
                  <li>• <code className="bg-muted/20 px-1 rounded">text-muted</code> - Secondary text</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}