"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, ChevronRight, CreditCard, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUserById, updateUser } from "@/lib/api/user";
import type { UserDto } from "@/types";
import { PageContainer } from "@/components/shared/PageLayout";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileBannerCard } from "./components/ProfileBannerCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { PaymentMethodsCard } from "./components/PaymentMethodsCard";
import { SettingsCard } from "./components/SettingsCard";
import { NotificationsCard } from "./components/NotificationsCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { LogoutCard } from "./components/LogoutCard";
import { LoadingState } from "./components/LoadingState";

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

  const [user, setUser] = useState<UserDto | null>(null);
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
        };
        const updated = await updateUser(user.id, dto as UserDto);
        setUser(updated);
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

  if (loading) return <LoadingState />;

  return (
    <PageContainer>
      <ProfileHeader onBack={() => router.push("/")} />

      {/* Main Content */}
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 lg:grid-cols-[1fr_400px]">
            <div className="space-y-3">
              <ProfileBannerCard
                profile={profile}
                onAvatarUpload={handleAvatarUpload}
                getInitials={getInitials}
              />

              <PersonalInfoCard
                profile={profile}
                onEdit={() => {
                  setEditForm(profile);
                  setAvatarPreview(profile.avatar ?? "");
                  setIsEditProfileOpen(true);
                }}
              />

              <PaymentMethodsCard
                paymentMethods={paymentMethods}
                onAddPayment={() => setIsAddPaymentOpen(true)}
                onDeletePayment={handleDeletePayment}
              />

              <SettingsCard
                language={language}
                theme={theme}
                onLanguageChange={setLanguage}
                onThemeChange={setTheme}
                onChangePassword={() => setIsChangePasswordOpen(true)}
              />
            </div>

            <div className="space-y-3">
              <NotificationsCard
                notificationsEnabled={notificationsEnabled}
                onNotificationsChange={setNotificationsEnabled}
              />

              <QuickLinksCard
                onMyTickets={() => router.push("/my-tickets")}
                onTransactions={() => router.push("/transactions")}
              />

              <LogoutCard onLogout={() => setIsLogoutDialogOpen(true)} />
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
                    <img src={avatarPreview} alt="Xem trước ảnh đại diện mới" className="h-full w-full object-cover" />
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
    </PageContainer>
  );
}
