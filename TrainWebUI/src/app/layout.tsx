import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthContext'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import ErrorBoundary from '@/components/shared/ErrorBoundary'

// Font configuration
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GoRail - Đặt vé tàu hỏa trực tuyến',
  description: 'Hệ thống đặt vé tàu hỏa trực tuyến nhanh chóng, tiện lợi và an toàn',
  manifest: '/manifest.json',
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#2563eb',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GoRail" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </AuthProvider>
        </ThemeProvider>
        
        {/* Service Worker Registration / Unregister helpers */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            const __GORAIL_ENABLE_SW = ${process.env.NEXT_PUBLIC_ENABLE_SW === 'true' ? 'true' : 'false'};

            if ('serviceWorker' in navigator) {
              window.addEventListener('load', async () => {
                try {
                  if (__GORAIL_ENABLE_SW) {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('SW registered:', registration);
                  } else {
                    const regs = await navigator.serviceWorker.getRegistrations();
                    if (regs && regs.length) {
                      await Promise.all(regs.map(r => r.unregister()));
                      console.log('Gorail: unregistered service workers', regs.map(r => r.scope));
                      if (window.caches) {
                        const keys = await caches.keys();
                        await Promise.all(keys.map(k => caches.delete(k)));
                        console.log('Gorail: cleared caches', keys);
                      }
                      window.location.reload();
                    }
                  }
                } catch (err) {
                  console.warn('Gorail: SW helper error', err);
                }
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
