import { useRef, useState } from "react"
import { Camera, Pause, Play, RefreshCcw, MonitorUp, SunMedium, Upload, ImageIcon, Scan } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils/utils"

interface ScannerCardProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  canvasRef: React.RefObject<HTMLCanvasElement | null>
  isPaused: boolean
  isScanning: boolean
  cameras: Array<{ id: string; label: string }>
  torchAvailable: boolean
  torchOn: boolean
  isDragging: boolean
  scanState: {
    label: string
    badge: string
  }
  onPause: () => void
  onResume: () => void
  onRefresh: () => void
  onSwitchCamera: () => void
  onToggleTorch: () => void
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void
  setIsDragging: (val: boolean) => void
}

export function ScannerCard({
  videoRef,
  canvasRef,
  isPaused,
  isScanning,
  cameras,
  torchAvailable,
  torchOn,
  isDragging,
  scanState,
  onPause,
  onResume,
  onRefresh,
  onSwitchCamera,
  onToggleTorch,
  onFileChange,
  onDrop,
  setIsDragging,
}: ScannerCardProps) {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <div className="relative">
        <Badge
          className={cn(
            "absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold",
            scanState.badge
          )}
        >
          <Scan className="h-3.5 w-3.5" />
          <span>{scanState.label}</span>
        </Badge>

        {/* Camera preview */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline />
          
          {/* Scan overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 border-2 border-primary/30 rounded-2xl relative">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
              {isScanning && !isPaused && (
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary/50 animate-[scan-line_2s_linear_infinite]" />
              )}
            </div>
          </div>
        </div>

        {isPaused && <canvas ref={canvasRef} className="w-full absolute top-0" />}

        {/* Controls */}
        <div className="p-4 bg-muted space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {!isPaused ? (
              <Button onClick={onPause} variant="outline" size="sm" className="gap-2">
                <Pause className="h-4 w-4" />
                Tạm dừng
              </Button>
            ) : (
              <Button onClick={onResume} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
                <Play className="h-4 w-4" />
                Tiếp tục
              </Button>
            )}
            <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              Làm mới
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button onClick={onSwitchCamera} variant="outline" size="sm" disabled={cameras.length < 2} className="gap-2">
              <MonitorUp className="h-4 w-4" />
              <span className="hidden sm:inline">Camera</span>
            </Button>
            <Button
              onClick={onToggleTorch}
              variant="outline"
              size="sm"
              disabled={!torchAvailable}
              className={cn("gap-2", torchOn && "border-warning bg-warning/10 text-warning")}
            >
              <SunMedium className="h-4 w-4" />
              <span className="hidden sm:inline">{torchOn ? "Tắt" : "Đèn"}</span>
            </Button>
            <label>
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              <Button variant="outline" size="sm" className="w-full gap-2" type="button">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Tải ảnh</span>
              </Button>
            </label>
          </div>

          {/* Drag-drop hint */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={cn(
              "p-4 text-center border-2 border-dashed rounded-lg transition-colors",
              isDragging ? "bg-primary/10 border-primary" : "border-border bg-muted/30"
            )}
          >
            <ImageIcon className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Kéo thả ảnh QR vào đây</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
