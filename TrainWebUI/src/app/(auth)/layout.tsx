'use client';

import { usePathname } from 'next/navigation';
import AuthFormSet from '@/components/auth/AuthFormSet';
import { Display, H2, Body } from '@/components/ui/typography';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  
  // Use new design for login and register, old design for forgot-password
  const isMainAuthPage = pathname === '/login' || pathname === '/register';
  
  if (isMainAuthPage) {
    return <AuthFormSet />;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="text-center space-y-6">
            <Display className="text-white drop-shadow-lg">TrainBooking</Display>
            <H2 className="text-white/95 font-medium">
              Hệ thống đặt vé tàu hỏa trực tuyến
            </H2>
            <Body className="text-white/90 text-lg">
              Nhanh chóng • Tiện lợi • An toàn
            </Body>
          </div>
        </div>
      </div>
      
      {/* Right side - Auth forms */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-background">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {children}
        </div>
      </div>
    </div>
  )
}
