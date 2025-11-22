import { Camera, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface EmptyTicketStateProps {
  mode: "scan" | "manual"
}

export function EmptyTicketState({ mode }: EmptyTicketStateProps) {
  return (
    <Card className="border-0 bg-background shadow-lg rounded-2xl">
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <Camera className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mb-3 text-lg font-semibold text-foreground">Chưa có vé nào được quét</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {mode === "scan" ? "Quét mã QR trên vé để hiển thị thông tin" : "Nhập mã vé để kiểm tra"}
        </p>

        {/* Tips */}
        <div className="w-full max-w-md rounded-xl bg-primary/5 border border-primary/20 p-4 text-left">
          <h4 className="text-sm mb-3 text-primary font-semibold">Hướng dẫn:</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <span>Quét QR bằng camera hoặc tải ảnh lên</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <span>Tự động tạm dừng sau khi đọc được mã</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-primary" />
              <span>Kiểm tra thông tin và xác nhận check-in</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
