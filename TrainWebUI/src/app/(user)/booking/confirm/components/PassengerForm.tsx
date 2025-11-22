import { User, Copy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface PassengerFormData {
  fullName: string
  dateOfBirth: string
  gender: "male" | "female" | "other"
  idNumber: string
  phone: string
  email: string
}

interface PassengerFormProps {
  index: number
  seatNumber: string
  coachNumber: number
  passenger: PassengerFormData
  onUpdate: (field: keyof PassengerFormData, value: string) => void
  onCopyFromPrevious?: () => void
  errors: Record<string, string>
}

export function PassengerForm({
  index,
  seatNumber,
  coachNumber,
  passenger,
  onUpdate,
  onCopyFromPrevious,
  errors,
}: PassengerFormProps) {
  const getError = (field: string) => errors[`passenger-${index}-${field}`]

  return (
    <Card className="border-0 shadow-md">
      <div className="p-2">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-primary" />
            Hành khách {index + 1} - Toa {coachNumber}, Ghế {seatNumber}
          </h3>
          {index > 0 && onCopyFromPrevious && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyFromPrevious}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Sao chép từ HK trước
            </Button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <Label htmlFor={`fullname-${index}`}>
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`fullname-${index}`}
              placeholder="Nhập họ và tên"
              value={passenger.fullName}
              onChange={(e) => onUpdate("fullName", e.target.value)}
              className="mt-1.5"
              data-error={!!getError("fullName")}
            />
            {getError("fullName") && (
              <p className="text-sm text-destructive mt-1">{getError("fullName")}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <Label htmlFor={`dob-${index}`}>
              Ngày sinh <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`dob-${index}`}
              type="text"
              placeholder="DD/MM/YYYY"
              value={passenger.dateOfBirth}
              onChange={(e) => onUpdate("dateOfBirth", e.target.value)}
              className="mt-1.5"
              data-error={!!getError("dateOfBirth")}
            />
            {getError("dateOfBirth") && (
              <p className="text-sm text-destructive mt-1">{getError("dateOfBirth")}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <Label>
              Giới tính <span className="text-destructive">*</span>
            </Label>
            <RadioGroup
              value={passenger.gender}
              onValueChange={(value: any) => onUpdate("gender", value)}
              className="mt-1.5 flex gap-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id={`male-${index}`} />
                <Label htmlFor={`male-${index}`} className="!font-normal cursor-pointer">
                  Nam
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id={`female-${index}`} />
                <Label htmlFor={`female-${index}`} className="!font-normal cursor-pointer">
                  Nữ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id={`other-${index}`} />
                <Label htmlFor={`other-${index}`} className="!font-normal cursor-pointer">
                  Khác
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* ID Number */}
          <div>
            <Label htmlFor={`id-${index}`}>
              CCCD/Hộ chiếu <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`id-${index}`}
              placeholder="Nhập số CCCD hoặc hộ chiếu"
              value={passenger.idNumber}
              onChange={(e) => onUpdate("idNumber", e.target.value)}
              className="mt-1.5"
              data-error={!!getError("idNumber")}
            />
            {getError("idNumber") && (
              <p className="text-sm text-destructive mt-1">{getError("idNumber")}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor={`phone-${index}`}>
              Điện thoại <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`phone-${index}`}
              type="tel"
              placeholder="Nhập số điện thoại"
              value={passenger.phone}
              onChange={(e) => onUpdate("phone", e.target.value)}
              className="mt-1.5"
              data-error={!!getError("phone")}
            />
            {getError("phone") && (
              <p className="text-sm text-destructive mt-1">{getError("phone")}</p>
            )}
          </div>

          {/* Email */}
          <div className="sm:col-span-2">
            <Label htmlFor={`email-${index}`}>
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id={`email-${index}`}
              type="email"
              placeholder="Nhập địa chỉ email"
              value={passenger.email}
              onChange={(e) => onUpdate("email", e.target.value)}
              className="mt-1.5"
              data-error={!!getError("email")}
            />
            {getError("email") && (
              <p className="text-sm text-destructive mt-1">{getError("email")}</p>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
