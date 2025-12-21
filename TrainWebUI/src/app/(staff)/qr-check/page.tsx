"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Camera, Keyboard, CheckCircle, XCircle, AlertTriangle, RefreshCcw, Activity, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageHeader } from "@/components/shared/PageHeader"
import { cn } from "@/lib/utils/utils"
import { getAllBookings } from "@/lib/api/booking"
import { BookingStatus, type BookingDto as ApiBookingDto } from "@/types"
import { ScanOverviewCard } from "./components/ScanOverviewCard"
import { ScannerCard } from "./components/ScannerCard"
import { ManualInputCard } from "./components/ManualInputCard"
import { TicketInfoCard } from "./components/TicketInfoCard"
import { EmptyTicketState } from "./components/EmptyTicketState"
import { RecentScansCard } from "./components/RecentScansCard"

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

interface ScanStats {
  total: number
  checkedIn: number
  pending: number
  cancelled: number
  lastScanAt: string | null
  state: {
    label: string
    badge: string
  }
}

export default function QRCheckPage() {
  // Video/Canvas/Scanner
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

  // App states
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
  const [isDragging, setIsDragging] = useState(false)

  const scanStats: ScanStats = useMemo(() => {
    const total = recentScans.length
    const checkedIn = recentScans.filter((scan) => scan.status === "checked-in").length
    const pending = recentScans.filter((scan) => scan.status === "not-checked-in").length
    const cancelled = recentScans.filter((scan) => scan.status === "cancelled").length

    const stateConfig =
      mode === "manual"
        ? { label: "Đang nhập thủ công", badge: "bg-primary/10 text-primary" }
        : isPaused
          ? { label: "Tạm dừng", badge: "bg-warning/10 text-warning" }
          : isScanning
            ? { label: "Đang quét", badge: "bg-success/10 text-success" }
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

  const quickCodes: string[] = useMemo(() => {
    if (recentScans.length === 0) {
      return ["VNR-12345", "SE3-2025", "VRN-00001"]
    }

    const uniqueCodes = Array.from(new Set(recentScans.map((scan) => scan.ticketId.toUpperCase())))
    return uniqueCodes.slice(0, 3)
  }, [recentScans])

  // ===== Bookings helpers =====
  const mapBookingToView = (booking: ApiBookingDto): ScannedTicket => {
    const seat = booking.seat ?? null
    const seatLabel = seat?.seatNumber || ""
    const ticketClass = seat?.type ? String(seat.type) : ""
    const travelDate = booking.trip?.departure
      ? new Date(booking.trip.departure).toISOString().slice(0, 10)
      : ""
    const departureTime = booking.trip?.departure
      ? new Date(booking.trip.departure).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
      : ""
    
    // Determine ticket status based on booking status
    const baseStatus: TicketStatus = 
      booking.status === BookingStatus.Cancelled 
        ? "cancelled" 
        : booking.status === BookingStatus.Paid 
          ? "not-checked-in"  // Valid for check-in
          : "cancelled";  // Reserved bookings are not valid for check-in
    
    const price = seat?.price ?? 0

    return {
      id: booking.id || "",
      trainCode: booking.trip?.train?.name || "",
      route:
        booking.trip?.originStation && booking.trip?.destinationStation
          ? `${booking.trip.originStation} → ${booking.trip.destinationStation}`
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

        await qr.start().catch((err) => {
          // Suppress "play() interrupted" warnings from video element
          if (err?.name !== 'AbortError' && !err?.message?.includes('play()')) {
            throw err;
          }
        })
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
      await scannerRef.current.start().catch((err: any) => {
        // Suppress "play() interrupted" warnings
        if (err?.name !== 'AbortError' && !err?.message?.includes('play()')) {
          throw err;
        }
      })
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
      await scannerRef.current.start().catch((err: any) => {
        // Suppress "play() interrupted" warnings
        if (err?.name !== 'AbortError' && !err?.message?.includes('play()')) {
          throw err;
        }
      })
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
        className: "border-success/20 bg-success/10 text-success",
        icon: <CheckCircle className="h-5 w-5 text-success" />,
      },
      warning: {
        className: "border-warning/20 bg-warning/10 text-warning",
        icon: <AlertTriangle className="h-5 w-5 text-warning" />,
      },
      error: {
        className: "border-destructive/20 bg-destructive/10 text-destructive",
        icon: <XCircle className="h-5 w-5 text-destructive" />,
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

  // useEffect cho auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <PageHeader
        title="Kiểm tra vé QR"
        description="Quét mã QR hoặc nhập thủ công để xác thực vé"
        icon={Scan}
        actions={
          <div className="flex items-center gap-1.5 rounded-xl bg-muted p-1.5">
            <Button
              variant={mode === "scan" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("scan")}
              className={cn("gap-2", mode === "scan" && "bg-primary hover:bg-primary/90")}
            >
              <Camera className="h-4 w-4" />
              <span className="hidden sm:inline">Scan QR</span>
            </Button>
            <Button
              variant={mode === "manual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode("manual")}
              className={cn("gap-2", mode === "manual" && "bg-primary hover:bg-primary/90")}
            >
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline">Nhập mã</span>
            </Button>
          </div>
        }
      />

      {/* Notifications */}
      {renderNotification()}

      {permissionError && (
        <Alert className="border-destructive/20 bg-destructive/10 text-destructive">
          <AlertDescription>{permissionError}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <Alert className="border-primary bg-primary/10 text-primary">
          <AlertDescription className="flex items-center gap-2">
            <RefreshCcw className="h-4 w-4 animate-spin" />
            Đang tải danh sách vé...
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="border-warning/20 bg-warning/10 text-warning">
          <AlertDescription className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Overview */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ScanOverviewCard stats={scanStats} scannedTicket={scannedTicket} mode={mode} />
        </div>
        <RecentScansCard scans={recentScans} onClear={() => setRecentScans([])} />
      </div>

      {/* Main Content */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Left: Scanner/Input */}
        <div>
          {mode === "scan" ? (
            <ScannerCard
              videoRef={videoRef}
              canvasRef={canvasRef}
              isPaused={isPaused}
              isScanning={isScanning}
              cameras={cameras}
              torchAvailable={torchAvailable}
              torchOn={torchOn}
              isDragging={isDragging}
              scanState={scanStats.state}
              onPause={pauseScanner}
              onResume={resumeScanner}
              onRefresh={refreshScanner}
              onSwitchCamera={switchCamera}
              onToggleTorch={toggleTorch}
              onFileChange={onFileChange}
              onDrop={onDrop}
              setIsDragging={setIsDragging}
            />
          ) : (
            <ManualInputCard
              manualInput={manualInput}
              onInputChange={setManualInput}
              onCheck={handleManualCheck}
              onSwitchToScan={() => setMode("scan")}
              quickCodes={quickCodes}
            />
          )}
        </div>

        {/* Right: Ticket Info */}
        <div>
          {scannedTicket ? (
            <TicketInfoCard
              ticket={scannedTicket}
              formatCurrency={formatCurrency}
              onCheckIn={handleCheckIn}
              onCancelCheckIn={handleCancelCheckIn}
              onScanNew={() => {
                setScannedTicket(null)
                setNotification(null)
                setManualInput("")
                if (mode === "scan") resumeScanner()
              }}
              onManualInput={() => setMode("manual")}
            />
          ) : (
            <EmptyTicketState mode={mode} />
          )}
        </div>
      </div>
    </div>
  )
}
