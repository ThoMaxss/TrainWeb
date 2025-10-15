import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Display, H1, H2, H3, Body, Lead, Small } from "@/components/ui/typography";

export default function ThemeSystemDemo() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        
        {/* Header với theme toggle */}
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <div>
            <Display className="text-primary">Theme System</Display>
            <Lead className="text-muted">Updated cho color system mới</Lead>
          </div>
          
          <div className="flex items-center gap-3">
            <Small className="text-muted">Full:</Small>
            <ThemeToggle variant="full" />
            <Small className="text-muted">Simple:</Small>
            <ThemeToggle variant="simple" />
          </div>
        </header>

        {/* Demo Cards */}
        <section className="grid md:grid-cols-2 gap-6">
          
          {/* Primary Card */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <H2 className="text-primary">Primary Elements</H2>
            
            <div className="space-y-3">
              <button className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-hover-primary active:bg-active-primary focus:outline-none focus:ring-2 focus:ring-ring transition-colors">
                Primary Button
              </button>
              
              <input 
                placeholder="Input với focus ring"
                className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring transition-colors"
              />
              
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                  Primary Badge
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
                  Accent Badge
                </span>
              </div>
            </div>
          </div>

          {/* Status Colors */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <H2 className="text-foreground">Status Colors</H2>
            
            <div className="space-y-3">
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--success), transparent 70%)", 
                background: "color-mix(in srgb, var(--success), transparent 92%)" 
              }}>
                <Small className="text-success font-medium">✅ Success state</Small>
              </div>
              
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--warning), transparent 70%)", 
                background: "color-mix(in srgb, var(--warning), transparent 92%)" 
              }}>
                <Small className="text-warning font-medium">⚠️ Warning state</Small>
              </div>
              
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--error), transparent 70%)", 
                background: "color-mix(in srgb, var(--error), transparent 92%)" 
              }}>
                <Small className="text-error font-medium">❌ Error state</Small>
              </div>
              
              <div className="rounded-lg p-3 border" style={{ 
                borderColor: "color-mix(in srgb, var(--info), transparent 70%)", 
                background: "color-mix(in srgb, var(--info), transparent 92%)" 
              }}>
                <Small className="text-info font-medium">ℹ️ Info state</Small>
              </div>
            </div>
          </div>
        </section>

        {/* Text Hierarchy */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <H2>Typography Hierarchy</H2>
          
          <div className="space-y-3">
            <Display className="text-foreground">Display Text</Display>
            <H1 className="text-foreground">Heading 1</H1>
            <H2 className="text-foreground">Heading 2</H2>
            <H3 className="text-foreground">Heading 3</H3>
            <Body className="text-foreground">Body text - Lorem ipsum dolor sit amet consectetur adipisicing elit.</Body>
            <Lead className="text-muted">Lead text - Mô tả quan trọng hoặc intro paragraph.</Lead>
            <Small className="text-muted">Small text - Thông tin phụ và chi tiết nhỏ.</Small>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <H2>Interactive Elements</H2>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Buttons */}
            <div className="space-y-4">
              <H3 className="text-foreground">Buttons</H3>
              <div className="space-y-3">
                <button className="w-full bg-primary text-white rounded-lg px-4 py-2 hover:bg-hover-primary focus:outline-none focus:ring-2 focus:ring-ring">
                  Primary
                </button>
                <button className="w-full bg-transparent text-foreground border border-border rounded-lg px-4 py-2 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring">
                  Secondary
                </button>
                <button className="w-full bg-error text-white rounded-lg px-4 py-2 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring">
                  Danger
                </button>
              </div>
            </div>

            {/* Form Elements */}
            <div className="space-y-4">
              <H3 className="text-foreground">Form Elements</H3>
              <div className="space-y-3">
                <select className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring">
                  <option>Chọn tùy chọn</option>
                  <option>Tùy chọn 1</option>
                  <option>Tùy chọn 2</option>
                </select>
                
                <textarea 
                  placeholder="Textarea với theme colors"
                  rows={3}
                  className="w-full rounded-lg bg-background text-foreground border border-border px-3 py-2 outline-none focus:border-transparent focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Skeleton Loading */}
        <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <H2>Loading States</H2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="skeleton h-6 w-48 rounded"></div>
              <div className="skeleton h-4 w-full rounded"></div>
              <div className="skeleton h-4 w-3/4 rounded"></div>
            </div>
            
            <div className="flex gap-4">
              <div className="skeleton h-16 w-16 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-4 w-1/2 rounded"></div>
                <div className="skeleton h-3 w-3/4 rounded"></div>
                <div className="skeleton h-3 w-1/3 rounded"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <H2 className="mb-4">🎯 Cách sử dụng Theme System</H2>
          
          <div className="prose prose-sm max-w-none">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <H3 className="text-primary mb-2">1. Import & Setup</H3>
                <pre className="bg-muted/20 p-3 rounded text-xs overflow-x-auto">
{`// layout.tsx
import { ThemeProvider } from '@/components/theme/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`}
                </pre>
              </div>
              
              <div>
                <H3 className="text-primary mb-2">2. Theme Toggle Usage</H3>
                <pre className="bg-muted/20 p-3 rounded text-xs overflow-x-auto">
{`import { ThemeToggle } from '@/components/theme/ThemeToggle'

// Full toggle (light/dark/system)
<ThemeToggle variant="full" />

// Simple toggle (light/dark only)  
<ThemeToggle variant="simple" />

// Custom alignment
<ThemeToggle variant="full" align="start" />`}
                </pre>
              </div>
            </div>
            
            <div className="mt-6 space-y-2">
              <H3 className="text-primary">✨ Tính năng:</H3>
              <ul className="space-y-1 text-sm text-muted">
                <li>• <strong>Auto persistence:</strong> Lưu preference vào localStorage</li>
                <li>• <strong>System theme detection:</strong> Tự động theo OS preference</li>
                <li>• <strong>Smooth transitions:</strong> Color transitions mượt mà</li>
                <li>• <strong>A11y compliant:</strong> Focus states và ARIA labels</li>
                <li>• <strong>Color-mix() support:</strong> Alpha blending hiện đại</li>
                <li>• <strong>Single source of truth:</strong> Chỉ cần .dark class</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}