"use client"

import React from "react"
import { Train } from "lucide-react"
import { H1, Body } from "@/components/ui/typography"

export default function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        {/* Brand / hero side */}
        <div className="relative flex-1 overflow-hidden rounded-none lg:rounded-r-[48px] bg-gradient-to-br from-indigo-500 via-purple-500 to-orange-400 text-white px-8 py-10 lg:px-12 lg:py-16">
          <div className="absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute -left-10 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute right-0 top-10 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
          </div>

          <div className="relative flex h-full flex-col justify-center gap-6">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
              <Train className="h-5 w-5" />
              GoRail
            </div>

            <div className="max-w-lg">
              <H1 className="text-3xl font-bold leading-tight">Hệ thống đặt vé tàu hỏa trực tuyến</H1>
              <Body className="mt-3 text-base text-white/85">
                Nhanh chóng • Tiện lợi • An toàn
              </Body>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md text-sm text-white/80">
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/15">
                <div className="text-xs uppercase tracking-wide text-white/70">Hỗ trợ</div>
                <div className="font-semibold">24/7</div>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm border border-white/15">
                <div className="text-xs uppercase tracking-wide text-white/70">Thanh toán</div>
                <div className="font-semibold">An toàn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex-1 bg-background px-6 py-10 lg:px-10 lg:py-16 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-3 mb-6">
              <div className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Train className="w-6 h-6" />
              </div>
              <div>
                <H1 className="text-2xl font-bold text-foreground">{title}</H1>
                {subtitle ? <Body className="mt-1 text-muted-foreground text-sm">{subtitle}</Body> : null}
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-xl p-6">
              {children}
              {footer ? <div className="mt-4">{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
