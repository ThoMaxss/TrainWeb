"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  Camera,
  Keyboard,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Train,
  User,
  MapPin,
  Clock,
  RotateCcw,
  SunMedium,
  RefreshCcw,
  MonitorUp,
  Image as ImageIcon,
  Pause,
  Play,
  Upload,
  Sparkles,
  Activity,
  History,
  Scan,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageHeader } from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils/utils"
import { getAllBookings } from "@/lib/api/booking"
import type { BookingDto as ApiBookingDto } from "@/types"

type TicketStatus = "not-checked-in" | "checked-in" | "cancelled"

interface ScannedTicket {
  id: string
  trainCode: string
  route: string
  passengerName: string
  seat: string
  price: number
  travelDate: string
  departureTime: string
  ticketClass: string
  status: TicketStatus
  checkedInAt?: string
  checkedInBy?: string
}

interface RecentScan {
  ticketId: string
  passengerName: string
  seat: string
  status: TicketStatus
  scannedAt: string
}

export default function QRCheckPage() {
  const router = useRouter()

  // ===== Video/Canvas/Scanner =====
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const scannerRef = useRef<any>(null)

  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([])
  const [activeCameraId, setActiveCameraId] = useState<string | null>(null)
  const [torchAvailable, setTorchAvailable] = useState(false)
  const [torchOn, setTorchOn] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  // ===== App states =====
  const [mode, setMode] = useState<"scan" | "manual">("scan")
  const [manualInput, setManualInput] = useState("")
  const [scannedTicket, setScannedTicket] = useState<ScannedTicket | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "warning" | "error"
    message: string
  } | null>(null)
  const [recentScans, setRecentScans] = useState<RecentScan[]>([])
  const [bookingsCache, setBookingsCache] = useState<ApiBookingDto[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const scanStats = useMemo(() => {
    const total = recentScans.length
    const checkedIn = recentScans.filter((scan) => scan.status === "checked-in").length
    const pending = recentScans.filter((scan) => scan.status === "not-checked-in").length
    const cancelled = recentScans.filter((scan) => scan.status === "cancelled").length

    const stateConfig =
      mode === "manual"
        ? { label: "Đang nhập thủ công", badge: "bg-primary/10 text-primary" }
        : isPaused
          ? { label: "Tạm dừng", badge: "bg-amber-100 text-amber-700" }
          : isScanning
            ? { label: "Đang quét", badge: "bg-emerald-100 text-emerald-700" }
            : { label: "Đang khởi tạo", badge: "bg-primary/10 text-primary" }

    return {
      total,
      checkedIn,
      pending,
      cancelled,
      lastScanAt: recentScans[0]?.scannedAt ?? null,
      state: stateConfig,
    }
  }, [recentScans, isPaused, isScanning, mode])

  const quickCodes = useMemo(() => {
    if (recentScans.length === 0) {
      return ["VNR-12345", "SE3-2025", "VRN-00001"]
    }

    const uniqueCodes = Array.from(new Set(recentScans.map((scan) => scan.ticketId.toUpperCase())))
    return uniqueCodes.slice(0, 3)
  }, [recentScans])

  // ===== Bookings helpers =====
  const mapBookingToView = (booking: ApiBookingDto): ScannedTicket => {
    const firstSeat = booking.seats?.[0] ?? null
    const seatLabel = firstSeat?.seatNumber || ""
    const ticketClass = firstSeat?.type ? String(firstSeat.type) : ""
    const travelDate = booking.trip?.departureTime
      ? new Date(booking.trip.departureTime).toISOString().slice(0, 10)
      : ""
    const departureTime = booking.trip?.departureTime
      ? new Date(booking.trip.departureTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""
    const baseStatus: TicketStatus = booking.status === "Cancelled" ? "cancelled" : "not-checked-in"
    const price = firstSeat?.price ?? booking.totalAmount ?? 0

    return {
      id: booking.id || "",
      trainCode: booking.trip?.train?.name || "",
      route:
        booking.trip?.departureStation && booking.trip?.arrivalStation
          ? `${booking.trip.departureStation} → ${booking.trip.arrivalStation}`
          : "",
      passengerName: booking.user?.name || "",
      seat: seatLabel,
      price,
      travelDate,
      departureTime,
      ticketClass,
      status: baseStatus,
    }
  }

  const ensureBookingsLoaded = async (): Promise<ApiBookingDto[]> => {
    if (bookingsCache) return bookingsCache
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAllBookings()
      setBookingsCache(data)
      return data
    } catch (e: any) {
      setError(e?.message || "Không thể tải danh sách vé")
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

  // ===== Decode flow =====
  const extractBookingId = (decoded: string) => {
    try {
      const obj = JSON.parse(decoded)
      return obj.bookingId || obj.id || decoded
    } catch {
      return decoded
    }
  }

  const afterDecodeFreezeFrame = () => {
    // chụp frame hiện tại lên canvas để “đóng băng” khung hình (debug/đối chiếu)
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    const w = video.videoWidth
    const h = video.videoHeight
    if (!w || !h) return
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, w, h)
  }

  const handleDecodedText = async (decodedText: string) => {
    const code = (extractBookingId(decodedText) || "").toString().trim().toUpperCase()
    if (!code) {
      setNotification({ type: "error", message: "QR không hợp lệ." })
      return
    }

    const bookings = await ensureBookingsLoaded()
    const booking =
      bookings.find((b) => (b.id || "").toUpperCase() === code) ||
      (bookings as any).find((b: any) => (b.bookingCode || "").toUpperCase() === code)

    if (!booking) {
      setNotification({ type: "error", message: `Không tìm thấy vé với mã "${code}".` })
      setScannedTicket(null)
      return
    }

    const ticket = mapBookingToView(booking)
    setScannedTicket(ticket)
    showNotificationForTicket(ticket)

    setRecentScans((prev) => [
      {
        ticketId: ticket.id,
        passengerName: ticket.passengerName,
        seat: ticket.seat,
        status: ticket.status,
        scannedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 4),
    ])

    // TỰ ĐỘNG PAUSE sau khi decode 1 lần + freeze frame vào canvas
    pauseScanner()
    afterDecodeFreezeFrame()
  }

  const showNotificationForTicket = (ticket: ScannedTicket) => {
    if (ticket.status === "cancelled") {
      setNotification({ type: "error", message: "Vé đã bị hủy. Không thể check-in." })
    } else if (ticket.status === "checked-in") {
      setNotification({ type: "warning", message: `Vé đã được check-in lúc ${ticket.checkedInAt}.` })
    } else {
      setNotification({ type: "success", message: "Vé hợp lệ. Có thể xác nhận check-in." })
    }
  }

  // ===== Manual check =====
  const handleManualCheck = async () => {
    const ticketId = manualInput.trim().toUpperCase()
    if (!ticketId) {
      setNotification({ type: "error", message: "Vui lòng nhập mã vé để kiểm tra." })
      return
    }

    const bookings = await ensureBookingsLoaded()
    const booking = bookings.find((b) => (b.id || "").toUpperCase() === ticketId)

    if (!booking) {
      setNotification({ type: "error", message: `Không tìm thấy vé với mã "${ticketId}". Vui lòng kiểm tra lại.` })
      setScannedTicket(null)
      return
    }

    const ticket = mapBookingToView(booking)
    setScannedTicket(ticket)
    setManualInput("")
    showNotificationForTicket(ticket)

    setRecentScans((prev) => [
      {
        ticketId: ticket.id,
        passengerName: ticket.passengerName,
        seat: ticket.seat,
        status: ticket.status,
        scannedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 4),
    ])

    // Không liên quan camera, không cần pause
  }

  // ===== File upload / Drag & Drop scan =====
  const [isDragging, setIsDragging] = useState(false)

  const scanImageFile = async (file: File) => {
    try {
      const { default: QrScanner } = await import("qr-scanner")
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      } as any)
      const text = (result as any)?.data ?? (result as any) ?? ""
      if (!text) throw new Error("Không đọc được QR từ ảnh.")
      handleDecodedText(String(text))
    } catch (err: any) {
      setNotification({ type: "error", message: err?.message || "Không đọc được QR từ ảnh." })
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) scanImageFile(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) scanImageFile(file)
  }

  // ===== Check-in actions =====
  const handleCheckIn = () => {
    if (!scannedTicket) return
    const updatedTicket: ScannedTicket = {
      ...scannedTicket,
      status: "checked-in",
      checkedInAt: new Date().toLocaleString("vi-VN"),
      checkedInBy: "Staff001",
    }
    setScannedTicket(updatedTicket)
    setRecentScans((prev) => [
      {
        ticketId: updatedTicket.id,
        passengerName: updatedTicket.passengerName,
        seat: updatedTicket.seat,
        status: "checked-in",
        scannedAt: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      },
      ...prev.slice(0, 4),
    ])
    setNotification({ type: "success", message: "✅ Check-in thành công! Hành khách có thể lên tàu." })
  }

  const handleCancelCheckIn = () => {
    if (!scannedTicket) return
    const updatedTicket: ScannedTicket = {
      ...scannedTicket,
      status: "not-checked-in",
      checkedInAt: undefined,
      checkedInBy: undefined,
    }
    setScannedTicket(updatedTicket)
    setNotification({ type: "warning", message: "Check-in đã được hủy." })
  }

  // ===== Scanner lifecycle =====
  useEffect(() => {
    let canceled = false
    if (mode !== "scan") {
      if (scannerRef.current) {
        scannerRef.current.stop()
        setIsScanning(false)
      }
      return
    }

    ;(async () => {
      try {
        setPermissionError(null)
        const { default: QrScanner } = await import("qr-scanner")
        if (!videoRef.current) return

        const qr = new QrScanner(
          videoRef.current,
          (res: any) => {
            const text = typeof res === "string" ? res : res?.data
            if (!text || isPaused) return
            handleDecodedText(String(text))
          },
          {
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            returnDetailedScanResult: true,
          }
        )

        scannerRef.current = qr

        const cams = await QrScanner.listCameras(true)
        if (!canceled) {
          setCameras(cams)
          if (cams[0]?.id) setActiveCameraId(cams[0].id)
        }

        await qr.start()
        if (!canceled) {
          setIsScanning(true)
          setIsPaused(false)
        }

        try {
          const hasFlash = await qr.hasFlash?.()
          if (!canceled) setTorchAvailable(!!hasFlash)
        } catch {}
      } catch (err: any) {
        setPermissionError(
          err?.message || "Không thể truy cập camera. Hãy dùng HTTPS (hoặc localhost) và cho phép quyền camera."
        )
        setIsScanning(false)
      }
    })()

    return () => {
      canceled = true
      if (scannerRef.current) {
        scannerRef.current.stop()
        scannerRef.current.destroy?.()
        scannerRef.current = null
      }
      setIsScanning(false)
      setTorchAvailable(false)
      setTorchOn(false)
      setIsPaused(false)
    }
  }, [mode])

  // ===== Controls =====
  const refreshScanner = async () => {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.stop()
      await scannerRef.current.start()
      setIsScanning(true)
      setIsPaused(false)
    } catch {
      setNotification({ type: "error", message: "Không thể khởi động lại camera." })
    }
  }

  const switchCamera = async () => {
    if (!scannerRef.current || cameras.length < 2) return
    const currentIdx = cameras.findIndex((c) => c.id === activeCameraId)
    const next = cameras[(currentIdx + 1) % cameras.length]
    try {
      await scannerRef.current.setCamera(next.id)
      setActiveCameraId(next.id)
    } catch {
      setNotification({ type: "error", message: "Không thể chuyển camera." })
    }
  }

  const toggleTorch = async () => {
    if (!scannerRef.current || !torchAvailable) return
    try {
      const next = !torchOn
      await (next ? scannerRef.current.turnFlashOn?.() : scannerRef.current.turnFlashOff?.())
      setTorchOn(next)
    } catch {
      setNotification({ type: "error", message: "Thiết bị không hỗ trợ bật đèn." })
    }
  }

  const pauseScanner = async () => {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.stop()
      setIsScanning(false)
      setIsPaused(true)
    } catch {}
  }

  const resumeScanner = async () => {
    if (!scannerRef.current) return
    try {
      await scannerRef.current.start()
      setIsScanning(true)
      setIsPaused(false)
      // xoá khung hình freeze cũ
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext("2d")
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    } catch {
      setNotification({ type: "error", message: "Không thể tiếp tục quét." })
    }
  }

  // ===== Notification UI =====
  const renderNotification = () => {
    if (!notification) return null
    const config = {
      success: {
        className: "border-emerald-200 bg-emerald-50 text-emerald-900",
        icon: <CheckCircle className="h-5 w-5 text-emerald-600" />,
      },
      warning: {
        className: "border-amber-200 bg-amber-50 text-amber-900",
        icon: <AlertTriangle className="h-5 w-5 text-warning" />,
      },
      error: {
        className: "border-destructive/20 bg-error/10 text-destructive",
        icon: <XCircle className="h-5 w-5 text-error" />,
      },
    }
    const { className, icon } = config[notification.type]
    return (
      <Alert className={cn("mb-3 shadow-sm border-l-4", className)}>
        <div className="flex items-center gap-3">
          {icon}
          <AlertDescription className="m-0 font-medium">{notification.message}</AlertDescription>
        </div>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Kiểm tra vé QR"
        description="Quét mã QR hoặc nhập thủ công để xác thực vé"
        icon={Scan}
        stats={[
          { icon: Activity, label: "Đã quét", value: scanStats.total },
          { icon: CheckCircle, label: "Check-in", value: scanStats.checkedIn },
          { icon: Clock, label: "Chờ", value: scanStats.pending },
          { icon: XCircle, label: "Hủy", value: scanStats.cancelled },
        ]}
        actions={
          <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1.5">
            <Button
              variant={mode === "scan" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("scan")}
              className={cn(
                "gap-2 transition-all duration-200 rounded-lg",
                mode === "scan"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                  : "hover:bg-border/70",
              )}
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Scan QR</span>
            </Button>
            <Button
              variant={mode === "manual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("manual")}
              className={cn(
                "gap-2 transition-all duration-200 rounded-lg",
                mode === "manual"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                  : "hover:bg-border/70",
              )}
            >
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline font-medium">Nhập mã vé</span>
            </Button>
          </div>
        }
      />

      {/* Overview */}
      <div className="space-y-3 mt-6">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary via-secondary to-primary text-primary-foreground shadow-2xl rounded-3xl relative">
            <div className="absolute -top-16 -right-10 h-40 w-40 rounded-full bg-accent/40 blur-3xl" />
            <div className="absolute -bottom-12 -left-16 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
            <div className="relative p-2 sm:p-2">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-primary-foreground/80 font-medium">
                    <Sparkles className="h-4 w-4" />
                    Trạng thái hệ thống
                  </div>
                  <h2 className="mt-3 text-2xl sm:text-3xl font-semibold">
                    {scanStats.state.label}
                  </h2>
                  <p className="mt-3 max-w-lg text-sm text-primary-foreground/75 leading-relaxed">
                    {scannedTicket
                      ? `Đang hiển thị vé ${scannedTicket.passengerName || "khách"} • ${scannedTicket.id}`
                      : mode === "scan"
                        ? "Máy quét đã sẵn sàng. Hướng camera vào mã QR để tự động nhận diện."
                        : "Nhập mã vé thủ công để tra cứu nhanh và xác nhận hành khách."}
                  </p>
                  {scanStats.lastScanAt && (
                    <p className="mt-3 flex items-center gap-2 text-xs font-medium text-primary-foreground/55 uppercase tracking-wide">
                      <History className="h-4 w-4" />
                      Lần quét gần nhất: {scanStats.lastScanAt}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 self-stretch">
                  <div className="hidden sm:flex flex-col gap-3">
                    <span className="text-xs font-medium uppercase text-primary-foreground/60 tracking-[0.2em]">Trạng thái</span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold shadow-md backdrop-blur-sm",
                        scanStats.state.badge,
                      )}
                    >
                      <Scan className="h-4 w-4" />
                      {scanStats.state.label}
                    </span>
                  </div>
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-background/15 backdrop-blur-sm shadow-lg">
                    <Camera className="h-8 w-8 sm:h-10 sm:w-10" />
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-background/12 px-2 py-2 flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">Vé đã check-in</p>
                    <p className="text-lg font-semibold">{scanStats.checkedIn}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-background/12 px-2 py-2 flex items-center gap-3">
                  <Activity className="h-5 w-5 text-amber-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">Đang chờ xử lý</p>
                    <p className="text-lg font-semibold">{scanStats.pending}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-background/12 px-2 py-2 flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-rose-200" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary-foreground/60">Vé bị từ chối</p>
                    <p className="text-lg font-semibold">{scanStats.cancelled}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="rounded-3xl border border-primary/50/70 bg-background/80 backdrop-blur-sm shadow-lg">
              <div className="p-2">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Tổng quét</p>
                    <p className="text-2xl font-semibold text-foreground">{scanStats.total}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <History className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Theo dõi số lượt quét trong ca làm việc. Hệ thống tự động lưu tối đa 5 vé gần nhất để bạn kiểm tra lại.
                </p>
              </div>
            </Card>
            <Card className="rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-primary/5 to-card shadow-lg">
              <div className="p-2">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Mẹo nhanh</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Dùng chế độ tạm dừng khi cần kiểm tra lại vé. Bạn có thể tiếp tục quét bất kỳ lúc nào mà không cần tải lại trang.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-5 py-5">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Left Column: Scanner / Input */}
          <div className="space-y-3">
            {/* Notification */}
            {renderNotification()}

            {/* Permission / camera error */}
            {permissionError && (
              <Alert className="border-destructive/20 bg-error/10 text-destructive mb-2">
                <AlertDescription className="m-0">
                  {permissionError} — Hãy đảm bảo đang dùng <b>HTTPS</b> (hoặc <b>localhost</b>) và cho phép camera.
                </AlertDescription>
              </Alert>
            )}

            {isLoading && (
              <Alert className="border-primary bg-primary/10 text-primary mb-2 shadow-sm">
                <AlertDescription className="m-0 flex items-center gap-2">
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                  Đang đồng bộ danh sách vé từ hệ thống...
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-amber-200 bg-amber-50 text-amber-900 mb-2 shadow-sm">
                <AlertDescription className="m-0 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* QR Scanner / Manual Input */}
            <Card className="border border-border/60 bg-background shadow-xl overflow-hidden rounded-2xl">
              {mode === "scan" ? (
                // ======= Scan Mode with camera + canvas freeze + upload/drag-drop =======
                <div className="relative">
                  <div
                    className={cn(
                      "absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-2 py-2 text-xs font-semibold shadow-lg backdrop-blur-sm",
                      scanStats.state.badge,
                    )}
                  >
                    <Scan className="h-4 w-4" />
                    <span>{scanStats.state.label}</span>
                  </div>
                  {/* Camera preview */}
                  <div className="aspect-square bg-slate-950 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 opacity-90" />
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.12),_transparent_55%)]" />
                    <video ref={videoRef} muted playsInline className="absolute inset-0 h-full w-full object-cover" />
                    {/* Overlay khung quét */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="relative w-72 h-72">
                        <div className="absolute inset-0 border-2 border-white/20 rounded-3xl" />
                        <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-primary rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-primary rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-primary rounded-bl-2xl" />
                        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-primary rounded-br-2xl" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse shadow-lg shadow-blue-400/50" />
                      </div>
                    </div>
                  </div>

                  {/* Freeze canvas (hiện khi pause sau decode) */}
                  <div className={cn("hidden", isPaused && "block")}>
                    <canvas ref={canvasRef} className="w-full" />
                  </div>

                  {/* Controls */}
                  <div className="flex flex-wrap gap-2 p-2 border-t border-border bg-muted/50">
                    {!isPaused ? (
                      <Button onClick={pauseScanner} variant="outline" className="gap-2 rounded-lg">
                        <Pause className="h-4 w-4" />
                        Tạm dừng
                      </Button>
                    ) : (
                      <Button onClick={resumeScanner} className="gap-2 rounded-lg bg-primary hover:bg-hover-primary">
                        <Play className="h-4 w-4" />
                        Tiếp tục quét
                      </Button>
                    )}
                    <Button onClick={refreshScanner} variant="outline" className="gap-2 rounded-lg">
                      <RefreshCcw className="h-4 w-4" />
                      Làm mới
                    </Button>
                    <Button onClick={switchCamera} variant="outline" disabled={cameras.length < 2} className="gap-2 rounded-lg">
                      <MonitorUp className="h-4 w-4" />
                      Đổi camera
                    </Button>
                    <Button
                      onClick={toggleTorch}
                      variant="outline"
                      disabled={!torchAvailable}
                      className={cn("gap-2 rounded-lg", torchOn ? "border-warning/30 bg-warning/10 text-warning" : "")}
                    >
                      <SunMedium className="h-4 w-4" />
                      {torchOn ? "Tắt đèn" : "Bật đèn"}
                    </Button>

                    {/* Upload image button */}
                    <label className="ml-auto">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onFileChange}
                      />
                      <Button variant="outline" className="gap-2 rounded-lg" asChild={false}>
                        <span className="flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Tải ảnh QR
                        </span>
                      </Button>
                    </label>
                  </div>

                  {/* Drag & drop zone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault()
                      setIsDragging(true)
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    className={cn(
                      "p-2 border-t border-dashed border-border bg-gradient-to-br from-slate-50 to-white text-center transition-all duration-200",
                      isDragging ? "border-primary bg-primary/10/80 shadow-inner" : "",
                    )}
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-medium">Kéo & thả ảnh QR vào đây</p>
                      <p className="text-xs text-muted-foreground">Hoặc bấm “Tải ảnh QR” để chọn từ máy</p>
                    </div>
                  </div>
                </div>
              ) : (
                // ======= Manual Input Mode =======
                <div className="p-10">
                  <div className="mb-5 text-center">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 mb-5 shadow-sm">
                      <Keyboard className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-foreground">Nhập mã vé thủ công</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">Nhập mã vé để kiểm tra thông tin</p>
                  </div>

                  <div className="space-y-5">
                    <div className="relative">
                      <Input
                        placeholder="VNR-XXXXX hoặc mã vé"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleManualCheck()}
                        className="h-14 text-center text-lg uppercase border-border focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-primary rounded-xl font-medium tracking-wider transition-all duration-200"
                      />
                    </div>

                    <Button
                      onClick={handleManualCheck}
                      className="w-full h-13 gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-medium text-base"
                    >
                      <Search className="h-5 w-5" />
                      Kiểm tra vé
                    </Button>
                  </div>

                  {quickCodes.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/70">
                        Gợi ý nhanh
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {quickCodes.map((code) => (
                          <Button
                            key={code}
                            variant="outline"
                            size="sm"
                            onClick={() => setManualInput(code)}
                            className="rounded-full border-border bg-background/80 px-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:bg-primary/10 hover:text-primary"
                          >
                            {code}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="my-5 bg-border" />

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-3 font-medium">Hoặc chuyển sang chế độ quét QR</p>
                    <Button
                      variant="outline"
                      onClick={() => setMode("scan")}
                      className="gap-2 border-border hover:bg-muted/50 hover:border-border transition-all duration-200 rounded-lg"
                    >
                      <Camera className="h-4 w-4" />
                      Quét mã QR
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Recent Scans (Mobile) */}
            <Card className="border border-border/60 bg-background shadow-lg lg:hidden rounded-2xl">
              <div className="p-2">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">Lịch sử quét gần đây</h3>
                    <Badge variant="outline" className="text-xs font-medium border-border text-foreground/90 px-2.5 py-1">
                      {recentScans.length} vé
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                    onClick={() => setRecentScans([])}
                    disabled={recentScans.length === 0}
                    aria-label="Xóa lịch sử quét"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 border border-border/50 hover:border-border hover:shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-all duration-200",
                            scan.status === "checked-in" ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary",
                          )}
                        >
                          {scan.status === "checked-in" ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{scan.passengerName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {scan.seat} • {scan.ticketId}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{scan.scannedAt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Ticket Detail */}
          <div className="space-y-3">
            {scannedTicket ? (
              <>
                
                {/* Ticket Detail */}
                <Card className="border border-border/60 bg-background shadow-xl overflow-hidden rounded-2xl">
                  <div className="p-2">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="mb-1.5 text-xl font-semibold text-foreground">Thông tin vé tàu</h3>
                        <p className="text-sm text-muted-foreground font-medium">{scannedTicket.id}</p>
                      </div>
                      {getStatusBadge(scannedTicket.status)}
                    </div>

                    <Separator className="mb-3 bg-border" />

                    <div className="mb-5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-primary/50 p-2 shadow-sm">
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
                          <Train className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground">Thông tin chuyến tàu</h4>
                      </div>
                      <div className="space-y-3">
                        <Row label="Mã tàu:" value={scannedTicket.trainCode} />
                        <Row label="Tuyến:" value={scannedTicket.route} />
                        <Row label="Ngày đi:" value={new Date(scannedTicket.travelDate).toLocaleDateString("vi-VN")} />
                        <Row label="Giờ khởi hành:" value={scannedTicket.departureTime} />
                      </div>
                    </div>

                    <div className="mb-5 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 p-2 shadow-sm">
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 shadow-sm">
                          <User className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground">Hành khách</h4>
                      </div>
                      <div className="space-y-3">
                        <Row label="Họ tên:" value={scannedTicket.passengerName} />
                      </div>
                    </div>

                    <div className="mb-5 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-2 shadow-sm">
                      <div className="mb-3 flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 shadow-sm">
                          <MapPin className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h4 className="text-base font-semibold text-foreground">Thông tin vé</h4>
                      </div>
                      <div className="space-y-3">
                        <Row label="Loại vé:" value={scannedTicket.ticketClass} />
                        <Row label="Ghế:" value={scannedTicket.seat} />
                        <Row label="Giá vé:" value={formatCurrency(scannedTicket.price)} />
                      </div>
                    </div>

                    {scannedTicket.status === "checked-in" && (
                      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-border p-2 shadow-sm">
                        <div className="mb-3 flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-600 shadow-sm">
                            <Clock className="h-5 w-5 text-primary-foreground" />
                          </div>
                          <h4 className="text-base font-semibold text-foreground">Thông tin check-in</h4>
                        </div>
                        <div className="space-y-3">
                          <Row label="Thời gian:" value={scannedTicket.checkedInAt || ""} />
                          <Row label="Nhân viên:" value={scannedTicket.checkedInBy || ""} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-border bg-gradient-to-br from-slate-50 to-slate-100/50 p-2 space-y-3">
                    {scannedTicket.status === "not-checked-in" && (
                      <Button
                        onClick={handleCheckIn}
                        className="w-full h-13 gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-semibold text-base"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Xác nhận check-in
                      </Button>
                    )}

                    {scannedTicket.status === "checked-in" && (
                      <Button
                        onClick={handleCancelCheckIn}
                        variant="outline"
                        className="w-full h-13 gap-2 border-2 border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200 rounded-xl font-semibold text-base bg-transparent"
                      >
                        <RotateCcw className="h-5 w-5" />
                        Hủy check-in
                      </Button>
                    )}

                    {scannedTicket.status === "cancelled" && (
                      <div className="text-center py-2">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 mb-3">
                          <XCircle className="h-9 w-9 text-error" />
                        </div>
                        <p className="text-sm text-muted-foreground font-medium">Vé đã bị hủy, không thể check-in</p>
                      </div>
                    )}
                  </div>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 text-primary-foreground shadow-xl rounded-2xl overflow-hidden">
                  <div className="p-2">
                    <h4 className="mb-5 text-primary-foreground font-semibold text-lg">Quét vé tiếp theo</h4>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Button
                        onClick={() => {
                          setScannedTicket(null)
                          setNotification(null)
                          setManualInput("")
                          if (mode === "scan") resumeScanner()
                        }}
                        variant="outline"
                        className="h-12 bg-background text-primary hover:bg-primary/10 border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-semibold"
                      >
                        <Camera className="h-5 w-5 mr-2" />
                        Quét vé mới
                      </Button>
                      <Button
                        onClick={() => setMode("manual")}
                        variant="outline"
                        className="h-12 bg-background/90 text-primary hover:bg-background border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-xl font-semibold"
                      >
                        <Keyboard className="h-5 w-5 mr-2" />
                        Nhập mã thủ công
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="border border-border/60 bg-background shadow-xl rounded-2xl">
                <div className="flex flex-col items-center justify-center py-20 px-5 text-center">
                  <div className="mb-3 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 shadow-md">
                    <Camera className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">Chưa có vé nào được quét</h3>
                  <p className="text-muted-foreground mb-5 leading-relaxed max-w-sm">
                    {mode === "scan" ? "Quét mã QR trên vé để hiển thị thông tin" : "Nhập mã vé để kiểm tra"}
                  </p>

                  {/* Quick Tips */}
                  <div className="w-full max-w-md rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-primary p-2 text-left shadow-sm">
                    <h4 className="text-sm mb-3 text-primary font-semibold flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
                      Hướng dẫn sử dụng:
                    </h4>
                    <ul className="space-y-3 text-sm text-primary">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="leading-relaxed">Quét mã QR bằng camera hoặc tải ảnh QR lên/drag-drop</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="leading-relaxed">Tự động tạm dừng sau khi đọc — bấm “Tiếp tục quét” để quét vé kế</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary" />
                        <span className="leading-relaxed">Kiểm tra thông tin và xác nhận check-in</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            )}

            {/* Recent Scans (Desktop) */}
            <Card className="border border-border/60 bg-background shadow-lg hidden lg:block rounded-2xl">
              <div className="p-2">
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">Lịch sử quét gần đây</h3>
                    <Badge variant="outline" className="text-xs font-medium border-border text-foreground/90 px-2.5 py-1">
                      {recentScans.length} vé
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
                    onClick={() => setRecentScans([])}
                    disabled={recentScans.length === 0}
                    aria-label="Xóa lịch sử quét"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-200 border border-border/50 hover:border-border hover:shadow-sm cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-11 w-11 items-center justify-center rounded-xl shadow-sm transition-all duration-200",
                            scan.status === "checked-in" ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary",
                          )}
                        >
                          {scan.status === "checked-in" ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm text-foreground">{scan.passengerName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {scan.seat} • {scan.ticketId}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">{scan.scannedAt}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ===== Small UI helper row ===== */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

/* ===== Status badge helper (giữ như cũ) ===== */
function getStatusBadge(status: TicketStatus) {
  switch (status) {
    case "not-checked-in":
      return <Badge className="bg-primary/10 text-primary hover:bg-primary/10 font-medium px-2 py-1">Chưa check-in</Badge>
    case "checked-in":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 font-medium px-2 py-1">Đã check-in</Badge>
      )
    case "cancelled":
      return <Badge className="bg-error/10 text-error hover:bg-error/10 font-medium px-2 py-1">Đã hủy</Badge>
    default:
      return null
  }
}
