import { useRef, useState } from "react"
import { Camera, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Gender = "Nam" | "Nữ" | "Khác"

interface LocalStaffProfile {
  name: string
  email: string
  phone: string
  birthDate?: string
  gender?: Gender
  avatar?: string
  role: string
  staffId?: string
  department?: string
}

interface EditProfileDialogProps {
  isOpen: boolean
  onClose: () => void
  profile: LocalStaffProfile
  onSave: (updatedProfile: LocalStaffProfile, avatarPreview: string) => void
  getInitials: (name: string) => string
}

export function EditProfileDialog({ isOpen, onClose, profile, onSave, getInitials }: EditProfileDialogProps) {
  const [editForm, setEditForm] = useState<LocalStaffProfile>(profile)
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "")
  const avatarInputRef = useRef<HTMLInputElement>(null!)

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setAvatarPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(editForm, avatarPreview)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
          <DialogDescription>Cập nhật thông tin tài khoản của bạn</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Avatar Preview */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-green-100 dark:border-green-900 bg-green-600 text-primary-foreground text-2xl font-bold flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatarPreview} alt="Xem trước ảnh đại diện mới" className="h-full w-full object-cover" />
                ) : (
                  <span>{getInitials(editForm.name || "N V")}</span>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-primary-foreground shadow-lg hover:bg-green-700 transition-colors"
                aria-label="Chọn ảnh đại diện"
              >
                <Camera className="h-4 w-4" />
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Họ và tên</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nhập họ và tên đầy đủ"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Số điện thoại</Label>
              <Input
                id="edit-phone"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                placeholder="0912345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-birthDate">Ngày sinh</Label>
              <Input
                id="edit-birthDate"
                type="date"
                value={editForm.birthDate}
                onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-gender">Giới tính</Label>
              <select
                id="edit-gender"
                value={editForm.gender}
                onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as Gender })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4 mr-2" />
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
