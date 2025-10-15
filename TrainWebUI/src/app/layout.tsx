import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthContext'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

// Font configuration
const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'TrainBooking - Đặt vé tàu hỏa trực tuyến',
  description: 'Hệ thống đặt vé tàu hỏa trực tuyến nhanh chóng, tiện lợi và an toàn',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
