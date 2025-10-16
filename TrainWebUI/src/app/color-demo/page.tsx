import { Display, H1, H2, H3, Body, Lead, Small, Micro } from "@/components/ui/typography";

export default function ColorSystemDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <section className="text-center space-y-4">
          <Display className="text-primary">Color System Demo</Display>
          <Lead className="text-muted max-w-2xl mx-auto">
            Hệ thống màu sắc mới với semantic tokens, HEX gốc và dark mode hỗ trợ
          </Lead>
        </section>

        {/* Brand Colors */}
        <section className="space-y-6">
          <H2>Brand Colors</H2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Primary */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <H3>Primary</H3>
              <div className="space-y-3">
                <div className="bg-primary h-16 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#0B5FFF</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-hover-primary h-8 rounded flex-1 flex items-center justify-center">
                    <Micro className="text-white">Hover</Micro>
                  </div>
                  <div className="bg-active-primary h-8 rounded flex-1 flex items-center justify-center">
                    <Micro className="text-white">Active</Micro>
                  </div>
                </div>
                
                {/* Primary usage examples */}
                <div className="space-y-2">
                  <button className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-hover-primary active:bg-active-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                    Primary Button
                  </button>
                  <Small className="text-primary">Primary text link</Small>
                </div>
              </div>
            </div>

            {/* Accent */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <H3>Accent</H3>
              <div className="space-y-3">
                <div className="bg-accent h-16 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#FF6A00</span>
                </div>
                <div className="flex gap-2">
                  <div className="bg-hover-accent h-8 rounded flex-1 flex items-center justify-center">
                    <Micro className="text-white">Hover</Micro>
                  </div>
                  <div className="bg-active-accent h-8 rounded flex-1 flex items-center justify-center">
                    <Micro className="text-white">Active</Micro>
                  </div>
                </div>
                
                {/* Accent usage examples */}
                <div className="space-y-2">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
                    -35% OFF
                  </span>
                  <div className="text-accent font-semibold">2,500,000 VND</div>
                </div>
              </div>
            </div>

            {/* Secondary */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <H3>Secondary</H3>
              <div className="space-y-3">
                <div className="bg-secondary h-16 rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium">#8B5CF6</span>
                </div>
                
                {/* Secondary usage examples */}
                <div className="space-y-2">
                  <button className="w-full px-3 py-2 rounded-lg bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20">
                    Filter Options
                  </button>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded">VIP</span>
                    <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded">Premium</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Colors */}
        <section className="space-y-6">
          <H2>Status Colors</H2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Success */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="bg-success h-12 rounded flex items-center justify-center">
                <span className="text-white font-medium text-sm">Success</span>
              </div>
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--success), transparent 70%)", 
                background: "color-mix(in srgb, var(--success), transparent 92%)" 
              }}>
                <Small className="text-success font-medium">Thanh toán thành công</Small>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="bg-warning h-12 rounded flex items-center justify-center">
                <span className="text-white font-medium text-sm">Warning</span>
              </div>
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--warning), transparent 70%)", 
                background: "color-mix(in srgb, var(--warning), transparent 92%)" 
              }}>
                <Small className="text-warning font-medium">Vé sắp hết</Small>
              </div>
            </div>

            {/* Error */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="bg-error h-12 rounded flex items-center justify-center">
                <span className="text-white font-medium text-sm">Error</span>
              </div>
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--error), transparent 70%)", 
                background: "color-mix(in srgb, var(--error), transparent 92%)" 
              }}>
                <Small className="text-error font-medium">Đặt vé thất bại</Small>
              </div>
            </div>

            {/* Info */}
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <div className="bg-info h-12 rounded flex items-center justify-center">
                <span className="text-white font-medium text-sm">Info</span>
              </div>
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--info), transparent 70%)", 
                background: "color-mix(in srgb, var(--info), transparent 92%)" 
              }}>
                <Small className="text-info font-medium">Thông tin quan trọng</Small>
              </div>
            </div>
          </div>
        </section>

        {/* Form Elements */}
        <section className="space-y-6">
          <H2>Form Elements</H2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Inputs */}
              <div className="space-y-4">
                <H3>Input States</H3>
                
                <div className="space-y-3">
                  <input 
                    placeholder="Normal input"
                    className="w-full rounded-lg bg-background dark:bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring"
                  />
                  
                  <input 
                    placeholder="Disabled input"
                    disabled
                    className="w-full rounded-lg bg-disabled-bg text-disabled-text border border-border px-3 py-2 outline-none cursor-not-allowed"
                  />
                  
                  <input 
                    value="Error state"
                    className="w-full rounded-lg bg-background dark:bg-background text-foreground border border-error px-3 py-2 outline-none focus:border-error focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-4">
                <H3>Button Variants</H3>
                
                <div className="space-y-3">
                  <button className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-hover-primary active:bg-active-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                    Primary Action
                  </button>
                  
                  <button className="w-full bg-transparent text-foreground border border-border rounded-lg px-4 py-2 hover:bg-card focus:outline-none focus:ring-2 focus:ring-ring">
                    Secondary Action
                  </button>
                  
                  <button className="w-full bg-error text-white rounded-lg px-4 py-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring">
                    Destructive Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton & Loading */}
        <section className="space-y-6">
          <H2>Skeleton & Loading</H2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <H3>Loading States</H3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="skeleton h-6 w-40 rounded"></div>
                <div className="skeleton h-4 w-full rounded"></div>
                <div className="skeleton h-4 w-3/4 rounded"></div>
              </div>
              
              <div className="flex gap-4">
                <div className="skeleton h-16 w-16 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/2 rounded"></div>
                  <div className="skeleton h-3 w-3/4 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <H2>Usage Mapping</H2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <H3 className="text-primary">Primary Usage</H3>
              <ul className="space-y-1 text-sm text-muted">
                <li>• CTA chính (Search, Book, Pay)</li>
                <li>• Link trọng tâm</li>
                <li>• Icon highlight</li>
                <li>• Focus ring system</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <H3 className="text-accent">Accent Usage</H3>
              <ul className="space-y-1 text-sm text-muted">
                <li>• Giá / khuyến mãi</li>
                <li>• Số liệu nổi bật trong bảng</li>
                <li>• Badge phần trăm</li>
                <li>• Call-to-action phụ</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <H3 className="text-secondary">Secondary Usage</H3>
              <ul className="space-y-1 text-sm text-muted">
                <li>• Tabs / filter / badge phụ</li>
                <li>• Toggle options</li>
                <li>• Category indicators</li>
                <li>• Supporting elements</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <H3>Text & Surfaces</H3>
              <ul className="space-y-1 text-sm text-muted">
                <li>• <span className="text-foreground">Foreground:</span> chữ chính</li>
                <li>• <span className="text-muted">Muted:</span> chữ phụ</li>
                <li>• <span className="text-disabled-text">Disabled:</span> disable form</li>
                <li>• Background / Card / Border</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dark Mode Toggle Demo */}
        <section className="text-center py-8">
          <Small className="text-muted">
            Toggle dark mode từ system settings hoặc dev tools để test
          </Small>
        </section>
      </div>
    </div>
  );
}