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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg mb-6">
            <Train className="w-7 h-7" />
          </div>
          <H1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</H1>
          {subtitle && <Body className="mt-2 text-sm text-gray-600 max-w-sm">{subtitle}</Body>}
        </div>

        {/* Card Section */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
          {children}
          
          {footer && (
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              {footer}
            </div>
          )}
        </div>
        
        {/* Footer Brand */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            &copy; {new Date().getFullYear()} GoRail. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
