import { Keyboard, Search, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ManualInputCardProps {
  manualInput: string
  onInputChange: (value: string) => void
  onCheck: () => void
  onSwitchToScan: () => void
  quickCodes: string[]
}

export function ManualInputCard({ manualInput, onInputChange, onCheck, onSwitchToScan, quickCodes }: ManualInputCardProps) {
  return (
    <Card className="border-0 bg-background shadow-lg rounded-2xl overflow-hidden">
      <div className="p-6">
        <div className="mb-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Keyboard className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-foreground">Nhập mã vé</h3>
          <p className="text-sm text-muted-foreground">Nhập mã vé để kiểm tra thông tin</p>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Nhập mã vé (VD: VNR-12345)"
            value={manualInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCheck()}
            className="h-12 text-center text-base uppercase border-border focus-visible:ring-2 rounded-xl font-medium"
          />

          <Button onClick={onCheck} className="w-full h-12 gap-2 bg-primary hover:bg-primary/90 rounded-xl font-semibold">
            <Search className="h-5 w-5" />
            Kiểm tra vé
          </Button>
        </div>

        {quickCodes.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Gợi ý nhanh:</p>
            <div className="flex flex-wrap gap-2">
              {quickCodes.map((code) => (
                <Button
                  key={code}
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange(code)}
                  className="rounded-full text-xs font-medium"
                >
                  {code}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-4" />

        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-3">Hoặc</p>
          <Button variant="outline" onClick={onSwitchToScan} className="gap-2 rounded-lg">
            <Camera className="h-4 w-4" />
            Quét mã QR
          </Button>
        </div>
      </div>
    </Card>
  )
}
