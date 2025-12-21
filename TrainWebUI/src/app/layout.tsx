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
        
        {/* Service Worker Registration */}
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                  .then((registration) => {
                    console.log('SW registered:', registration);
                  })
                  .catch((error) => {
                    console.log('SW registration failed:', error);
                  });
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
