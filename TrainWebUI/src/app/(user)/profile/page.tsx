// 🎨 Enhanced user profile with unified design system and dark mode
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Edit2,
  CreditCard,
  Plus,
  Settings,
  Globe,
  Moon,
  Lock,
  Bell,
  Shield,
  Ticket,
  Receipt,
  LogOut,
  Camera,
  X,
  ChevronRight,
  Sun,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getUserById, updateUser } from "@/lib/api/user";
import type { User, UserDto } from "@/types";
import { CardSection } from "@/components/shared/CardSection";
import { InfoRow } from "@/components/shared/InfoRow";
import { PageContainer, PageHeader, PageContent } from "@/components/shared/PageLayout";

type Gender = "Nam" | "Nữ" | "Khác";
interface LocalUserProfile {
  name: string;
  email: string;
  phone: string;
  birthDate?: string; // mapped from dateOfBirth when available
  gender?: Gender;
  avatar?: string;
}

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "momo" | "vnpay";
  label: string;
  lastFour?: string;
  linkedInfo?: string;
  icon: any;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LocalUserProfile>({ name: "", email: "", phone: "" });

  // Saved payment methods (placeholder: no backend endpoint yet)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const [language, setLanguage] = useState("vi");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  const [editForm, setEditForm] = useState<LocalUserProfile>(profile);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // TODO: replace 'me' with actual user id from auth context
        const u = await getUserById("me");
        if (!mounted) return;
        setUser(u);
        const local: LocalUserProfile = {
          name: u.name ?? "",
          email: u.email ?? "",
          phone: "",
        };
        setProfile(local);
        setEditForm(local);
      } catch (e) {
        if (!mounted) return;
        setError("Không thể tải hồ sơ người dùng.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const dto: Partial<UserDto> = {
          id: user.id,
          name: editForm.name,
          email: editForm.email,
          phone: editForm.phone,
        } as any;
        const updated = await updateUser(user.id, dto as UserDto);
        setUser(updated as unknown as User);
      }
      setProfile({ ...editForm, avatar: avatarPreview });
      setIsEditProfileOpen(false);
    } catch (e) {
      setError("Không thể lưu thay đổi hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="border-b bg-background shadow-sm">
        <div className="container mx-auto px-2 lg:px-2 py-2">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors">
              <ChevronRight className="h-5 w-5 rotate-180 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-primary">Tài khoản của tôi</h1>
              <p className="text-sm text-muted-foreground">Quản lý thông tin cá nhân và cài đặt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_400px]">
            {/* Left Column - Profile & Settings */}
            <div className="space-y-3">
              {/* Profile Header Card */}
              <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-primary-foreground shadow-xl">
                <div className="p-2 sm:p-2">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Avatar */}
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full border-4 border-white/20 shadow-lg bg-primary flex items-center justify-center text-primary-foreground text-2xl overflow-hidden">
                        {profile.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span>{getInitials(profile.name || "U N")}</span>
                        )}
                      </div>
                      <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-4 w-4" />
                      </button>
                      <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </div>

                    {/* User Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="mb-2 text-primary-foreground">{profile.name || "--"}</h2>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-primary-foreground">
                          <Phone className="h-4 w-4" />
                          <span className="text-sm">{profile.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Personal Information */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-foreground">Thông tin cá nhân</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditForm(profile);
                        setAvatarPreview(profile.avatar ?? "");
                        setIsEditProfileOpen(true);
                      }}
                      className="gap-2 border-primary hover:bg-primary/10"
                    >
                      <Edit2 className="h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">Họ tên</Label>
                      <p className="mt-1">{profile.name || "--"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="mt-1">{profile.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Số điện thoại</Label>
                      <p className="mt-1">{profile.phone}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                      <p className="mt-1">{profile.birthDate ?? "--"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Giới tính</Label>
                      <p className="mt-1">{profile.gender ?? "--"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <CreditCard className="h-5 w-5 text-success" />
                      </div>
                      <h3 className="text-foreground">Phương thức thanh toán</h3>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsAddPaymentOpen(true)} className="gap-2 border-emerald-200 hover:bg-success/10">
                      <Plus className="h-4 w-4" />
                      Thêm
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="group relative flex items-center gap-3 rounded-lg border-2 border-border p-2 transition-all hover:border-primary hover:bg-primary/10/50">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                          <method.icon className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{method.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {method.lastFour ? `**** **** **** ${method.lastFour}` : `Liên kết ${method.linkedInfo}`}
                          </p>
                        </div>
                        <button onClick={() => handleDeletePayment(method.id)} className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full bg-error text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
                          <X className="h-4 w-4" />
                        </button>
                        <Badge variant="outline" className="border-emerald-200 text-success">
                          Đã xác minh
                        </Badge>
                      </div>
                    ))}

                    {paymentMethods.length === 0 && (
                      <div className="rounded-lg border-2 border-dashed border-border p-2 text-center">
                        <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Chưa có phương thức thanh toán nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Settings */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                      <Settings className="h-5 w-5 text-violet-600" />
                    </div>
                    <h3 className="text-foreground">Cài đặt</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Language */}
                    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Ngôn ngữ</p>
                          <p className="text-sm text-muted-foreground">Chọn ngôn ngữ hiển thị</p>
                        </div>
                      </div>
                      <select className="border rounded px-2 py-2" value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <Separator />

                    {/* Theme */}
                    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex items-center gap-3">
                        {theme === "light" ? <Sun className="h-5 w-5 text-muted-foreground" /> : <Moon className="h-5 w-5 text-muted-foreground" />}
                        <div>
                          <p className="font-medium">Giao diện</p>
                          <p className="text-sm text-muted-foreground">{theme === "light" ? "Sáng" : "Tối"}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant={theme === "light" ? "default" : "outline"} size="sm" onClick={() => setTheme("light")} className="gap-2">
                          <Sun className="h-4 w-4" />
                          Sáng
                        </Button>
                        <Button variant={theme === "dark" ? "default" : "outline"} size="sm" onClick={() => setTheme("dark")} className="gap-2">
                          <Moon className="h-4 w-4" />
                          Tối
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {/* Change Password */}
                    <button onClick={() => setIsChangePasswordOpen(true)} className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                          <p className="font-medium">Đổi mật khẩu</p>
                          <p className="text-sm text-muted-foreground">Cập nhật mật khẩu của bạn</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Notifications & Quick Links */}
            <div className="space-y-3">
              {/* Notifications & Privacy */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-foreground">Thông báo & Quyền riêng tư</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">Nhận thông báo</p>
                        <p className="text-sm text-muted-foreground">Nhận cập nhật về chuyến đi và khuyến mãi</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-blue-600"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      />
                    </div>

                    <Separator />

                    {/* Privacy Policy */}
                    <button className="flex w-full items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <div className="text-left">
                          <p className="font-medium">Chính sách bảo mật</p>
                          <p className="text-sm text-muted-foreground">Xem chính sách của chúng tôi</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <h3 className="mb-3 text-foreground">Liên kết nhanh</h3>

                  <div className="space-y-3">
                    <button onClick={() => router.push("/my-tickets")} className="flex w-full items-center gap-3 rounded-lg border-2 border-primary bg-primary/10 p-2 transition-all hover:border-primary hover:bg-primary/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <Ticket className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-primary">Vé của tôi</p>
                        <p className="text-sm text-primary">Xem và quản lý vé đã đặt</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>

                    <button onClick={() => router.push("/transactions")} className="flex w-full items-center gap-3 rounded-lg border-2 border-emerald-200 bg-success/10 p-2 transition-all hover:border-emerald-400 hover:bg-success/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
                        <Receipt className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-emerald-900">Giao dịch của tôi</p>
                        <p className="text-sm text-success">Xem lịch sử thanh toán</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-success" />
                    </button>
                  </div>
                </div>
              </Card>

              {/* Logout Button */}
              <Card className="border-0 border-destructive/20 bg-error/10 shadow-md">
                <div className="p-2">
                  <Button variant="destructive" size="lg" onClick={() => setIsLogoutDialogOpen(true)} className="w-full gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    <LogOut className="h-5 w-5" />
                    Đăng xuất
                  </Button>
                  <p className="mt-2 text-center text-xs text-error">Bạn sẽ cần đăng nhập lại để sử dụng dịch vụ</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
            <DialogDescription>Cập nhật thông tin tài khoản của bạn</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-primary/50 bg-primary text-primary-foreground text-2xl flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(editForm.name || "U N")}</span>
                  )}
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-3">
              <div>
                <Label htmlFor="edit-name">Họ tên</Label>
                <Input id="edit-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Nhập họ tên" />
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} placeholder="email@example.com" />
              </div>

              <div>
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input id="edit-phone" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} placeholder="0912345678" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="edit-birthdate">Ngày sinh</Label>
                  <Input id="edit-birthdate" value={editForm.birthDate ?? ""} onChange={(e) => setEditForm({ ...editForm, birthDate: e.target.value })} placeholder="DD/MM/YYYY" />
                </div>

                <div>
                  <Label>Giới tính</Label>
                  <div className="flex gap-3 mt-2">
                    <label className="flex items-center gap-2"><input type="radio" name="gender" checked={editForm.gender === "Nam"} onChange={() => setEditForm({ ...editForm, gender: "Nam" })} /> Nam</label>
                    <label className="flex items-center gap-2"><input type="radio" name="gender" checked={editForm.gender === "Nữ"} onChange={() => setEditForm({ ...editForm, gender: "Nữ" })} /> Nữ</label>
                    <label className="flex items-center gap-2"><input type="radio" name="gender" checked={editForm.gender === "Khác"} onChange={() => setEditForm({ ...editForm, gender: "Khác" })} /> Khác</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveProfile} className="gap-2"><Check className="h-4 w-4" />Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>Đảm bảo mật khẩu mới có ít nhất 8 ký tự</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div>
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input id="confirm-password" type="password" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>Hủy</Button>
            <Button onClick={() => { console.log("Password changed"); setIsChangePasswordOpen(false); }}>Đổi mật khẩu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn đăng xuất? Bạn sẽ cần đăng nhập lại để sử dụng dịch vụ.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={() => { setIsLogoutDialogOpen(false); router.push("/"); }}>Đăng xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddPaymentOpen} onOpenChange={setIsAddPaymentOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm phương thức thanh toán</DialogTitle>
            <DialogDescription>Chọn loại phương thức thanh toán bạn muốn thêm</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            {[{ type: "visa", label: "Thẻ VISA", icon: CreditCard }, { type: "mastercard", label: "Thẻ MasterCard", icon: CreditCard }, { type: "momo", label: "Ví MoMo", icon: Phone }, { type: "vnpay", label: "VNPay", icon: CreditCard }].map((method) => (
              <button key={method.type} className="flex items-center gap-3 rounded-lg border-2 border-border p-2 transition-all hover:border-primary hover:bg-primary/10" onClick={() => { console.log("Add payment method:", method.type); setIsAddPaymentOpen(false); }}>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                  <method.icon className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{method.label}</p>
                  <p className="text-sm text-muted-foreground">Liên kết {method.label.toLowerCase()}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
