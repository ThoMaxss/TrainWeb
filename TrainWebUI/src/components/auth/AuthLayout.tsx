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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-400/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-600/10 text-blue-700 ring-1 ring-blue-600/20 shadow-sm">
            <Train className="h-6 w-6" />
          </div>

          <H1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </H1>

          {subtitle && (
            <Body className="mt-2 text-sm text-slate-500 max-w-sm">
              {subtitle}
            </Body>
          )}
        </div>

        {/* Card Section */}
        <div className="mt-6 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur px-4 py-8 shadow-xl shadow-slate-200/60 sm:px-10">
          {children}

          {footer && (
            <div className="mt-6 pt-6 border-t border-slate-200/60 text-center">
              {footer}
            </div>
          )}
        </div>

        {/* Footer Brand */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} GoRail. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
