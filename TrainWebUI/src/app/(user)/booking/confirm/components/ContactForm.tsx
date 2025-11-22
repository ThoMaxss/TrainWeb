import { Mail } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface ContactInfo {
  fullName: string
  phone: string
  email: string
}

interface ContactFormProps {
  contactInfo: ContactInfo
  onChange: (field: keyof ContactInfo, value: string) => void
  errors: Record<string, string>
}

export function ContactForm({ contactInfo, onChange, errors }: ContactFormProps) {
  return (
    <Card className="border-0 shadow-md">
      <div className="p-2">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Mail className="h-5 w-5 text-primary" />
          Thông tin liên hệ (nhận vé QR)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="contact-name">
              Họ và tên liên hệ <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-name"
              placeholder="Nhập họ và tên"
              value={contactInfo.fullName}
              onChange={(e) => onChange("fullName", e.target.value)}
              className="mt-1.5"
              data-error={!!errors["contact-fullName"]}
            />
            {errors["contact-fullName"] && (
              <p className="text-sm text-destructive mt-1">{errors["contact-fullName"]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact-phone">
              Số điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={contactInfo.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="mt-1.5"
              data-error={!!errors["contact-phone"]}
            />
            {errors["contact-phone"] && (
              <p className="text-sm text-destructive mt-1">{errors["contact-phone"]}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contact-email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={contactInfo.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="mt-1.5"
              data-error={!!errors["contact-email"]}
            />
            {errors["contact-email"] && (
              <p className="text-sm text-destructive mt-1">{errors["contact-email"]}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
