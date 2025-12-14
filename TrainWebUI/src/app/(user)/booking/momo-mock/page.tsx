"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Smartphone, ArrowLeft } from "lucide-react"

/**
 * Mock MoMo Payment Page
 * Simulates MoMo payment flow without actual integration
 * For demo/testing purposes only
 */

export default function MoMoMockPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"phone" | "otp" | "success" | "failed">("phone")
  const [countdown, setCountdown] = useState(60)
  const [processing, setProcessing] = useState(false)

  const amount = searchParams.get("amount") || "0"
  const orderId = searchParams.get("orderId") || ""
  const orderInfo = searchParams.get("orderInfo") || "Thanh toán vé tàu"
  const returnUrl = searchParams.get("returnUrl") || "/booking/success"

  // Countdown timer for OTP
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [step, countdown])

  // Auto redirect after success
  useEffect(() => {
    if (step === "success") {
      const timer = setTimeout(() => {
        // Redirect back to app with success status
        window.location.href = `${returnUrl}?orderId=${orderId}&resultCode=0&message=Success`
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, returnUrl, orderId])

  const handleSendOTP = () => {
    if (!phone || phone.length < 10) {
      alert("Vui lòng nhập số điện thoại hợp lệ")
      return
    }
    setProcessing(true)
    // Simulate API call
    setTimeout(() => {
      setProcessing(false)
      setStep("otp")
      setCountdown(60)
    }, 1000)
  }

  const handleVerifyOTP = () => {
    if (!otp || otp.length !== 6) {
      alert("Vui lòng nhập mã OTP 6 số")
      return
    }
    setProcessing(true)
    // Simulate verification
    setTimeout(() => {
      setProcessing(false)
      // Demo: accept any OTP
      if (otp === "123456" || otp.length === 6) {
        setStep("success")
      } else {
        setStep("failed")
      }
    }, 1500)
  }

  const handleResendOTP = () => {
    setCountdown(60)
    alert("Mã OTP đã được gửi lại!")
  }

  const handleCancel = () => {
    if (confirm("Bạn có chắc muốn hủy thanh toán?")) {
      window.location.href = `${returnUrl}?orderId=${orderId}&resultCode=1002&message=Transaction%20cancelled`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-pink-600 p-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="bg-white rounded-full p-4">
              <Smartphone className="h-12 w-12 text-purple-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Ví MoMo</h1>
          <p className="text-white/80 text-sm">Thanh toán an toàn & tiện lợi</p>
        </div>

        {/* Phone Step */}
        {step === "phone" && (
          <Card>
            <CardHeader>
              <CardTitle>Xác nhận thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold text-lg text-primary">
                    {parseInt(amount).toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nội dung</span>
                  <span className="text-foreground">{orderInfo}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-muted-foreground">Mã đơn hàng</span>
                  <span className="text-foreground font-mono text-xs">{orderId.substring(0, 12)}...</span>
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Số điện thoại MoMo</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={11}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Nhập số điện thoại đã đăng ký MoMo
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button 
                  onClick={handleSendOTP}
                  disabled={processing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {processing ? "Đang xử lý..." : "Tiếp tục"}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  🔒 Giao dịch được bảo mật bởi MoMo
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <Card>
            <CardHeader>
              <CardTitle>Xác thực OTP</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Mã OTP đã được gửi đến số điện thoại
                </p>
                <p className="font-bold text-lg">{phone}</p>
              </div>

              <div>
                <Label htmlFor="otp">Mã OTP (6 số)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                  className="mt-1 text-center text-2xl tracking-widest"
                />
                <p className="text-xs text-warning mt-1 text-center">
                  💡 Demo: Nhập bất kỳ mã 6 số nào (ví dụ: 123456)
                </p>
              </div>

              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Gửi lại mã sau {countdown}s
                  </p>
                ) : (
                  <Button 
                    variant="link" 
                    onClick={handleResendOTP}
                    className="text-purple-600"
                  >
                    Gửi lại mã OTP
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setStep("phone")}
                  className="flex-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Quay lại
                </Button>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={processing || otp.length !== 6}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  {processing ? "Đang xác thực..." : "Xác nhận"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Step */}
        {step === "success" && (
          <Card className="border-success">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="h-16 w-16 text-success mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-success mb-2">
                Thanh toán thành công!
              </h2>
              <p className="text-muted-foreground mb-4">
                Giao dịch của bạn đã được xử lý
              </p>
              <div className="bg-muted p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Số tiền</span>
                  <span className="font-bold text-success">
                    -{parseInt(amount).toLocaleString()}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Mã giao dịch</span>
                  <span className="font-mono text-xs">{orderId.substring(0, 16)}...</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                <span>Đang chuyển hướng...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Failed Step */}
        {step === "failed" && (
          <Card className="border-destructive">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-destructive mb-2">
                Thanh toán thất bại
              </h2>
              <p className="text-muted-foreground mb-4">
                Mã OTP không chính xác hoặc đã hết hạn
              </p>
              <Button 
                onClick={() => {
                  setStep("otp")
                  setOtp("")
                  setCountdown(60)
                }}
                variant="outline"
                className="mb-2 w-full"
              >
                Thử lại
              </Button>
              <Button 
                onClick={handleCancel}
                variant="ghost"
                className="w-full"
              >
                Hủy thanh toán
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Demo Notice */}
        <div className="mt-4 text-center">
          <Badge variant="secondary" className="bg-white/20 text-white">
            🎭 Chế độ mô phỏng - Không giao dịch thật
          </Badge>
        </div>
      </div>
    </div>
  )
}
