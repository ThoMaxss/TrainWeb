import { CheckCircle } from "lucide-react"

interface SuccessHeaderProps {
  title?: string
  subtitle?: string
}

export function SuccessHeader({ 
  title = "Thanh toán thành công 🎉",
  subtitle = "Vé điện tử đã được phát hành. Vui lòng xuất trình QR code khi lên tàu."
}: SuccessHeaderProps) {
  return (
    <div className="bg-success text-primary-foreground">
      <div className="container mx-auto px-2 lg:px-2 py-5 lg:py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-3 flex justify-center">
            <div className="rounded-full bg-primary-foreground/20 p-2 backdrop-blur-sm">
              <CheckCircle className="h-16 w-16" />
            </div>
          </div>
          <h1 className="mb-3 text-primary-foreground">{title}</h1>
          <p className="text-lg text-primary-foreground/90">{subtitle}</p>
        </div>
      </div>
    </div>
  )
}
