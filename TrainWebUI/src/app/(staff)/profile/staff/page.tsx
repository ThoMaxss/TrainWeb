"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Phone,
  Edit2,
  Settings,
  Globe,
  Moon,
  Lock,
  Bell,
  LogOut,
  Camera,
  ChevronRight,
  Sun,
  Check,
  Users,
  QrCode,
  RefreshCw,
  Ticket,
  BarChart3,
  ClipboardList,
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
import { getUserById, updateUser } from "@/lib/api/user";
import type { User, UserDto } from "@/types";

type Gender = "Nam" | "Nữ" | "Khác";

interface LocalStaffProfile {
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: Gender;
  avatar?: string;
  role: string;
  staffId?: string;
  department?: string;
}

export default function StaffProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<LocalStaffProfile>({ 
    name: "", 
    email: "", 
    phone: "", 
    role: "Staff",
    staffId: "ST001"
  });

  const [language, setLanguage] = useState("vi");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState<LocalStaffProfile>(profile);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // TODO: replace 'staff-me' with actual staff user id from auth context
        const u = await getUserById("staff-me");
        if (!mounted) return;
        setUser(u);
        const local: LocalStaffProfile = {
          name: u.name ?? "",
          email: u.email ?? "",
          phone: "",
          role: "Nhân viên",
          staffId: "ST001",
          department: "Dịch vụ khách hàng",
        };
        setProfile(local);
        setEditForm(local);
      } catch (e) {
        if (!mounted) return;
        setError("Không thể tải hồ sơ nhân viên.");
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
            <button onClick={() => router.push("/staff-dashboard")} className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-card transition-colors">
              <ChevronRight className="h-5 w-5 rotate-180 text-muted-foreground" />
            </button>
            <div>
              <h1 className="text-primary">Hồ sơ Nhân viên</h1>
              <p className="text-sm text-muted-foreground">Quản lý thông tin và công việc</p>
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
              {/* Staff Profile Header Card */}
              <Card className="border-0 bg-gradient-to-br from-green-600 to-green-700 text-primary-foreground shadow-xl">
                <div className="p-2 sm:p-2">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    {/* Avatar */}
                    <div className="relative group">
                      <div className="h-24 w-24 rounded-full border-4 border-white/20 shadow-lg bg-success flex items-center justify-center text-primary-foreground text-2xl overflow-hidden">
                        {profile.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={profile.avatar} alt="avatar" className="h-full w-full object-cover" />
                        ) : (
                          <span>{getInitials(profile.name || "N V")}</span>
                        )}
                      </div>
                      <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-background text-success shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-4 w-4" />
                      </button>
                      <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                    </div>

                    {/* Staff Info */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="mb-2 text-primary-foreground">{profile.name || "--"}</h2>
                      <Badge className="mb-2 bg-background/20 text-primary-foreground border-white/30">
                        ID: {profile.staffId} - {profile.role}
                      </Badge>
                      <div className="space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-100">
                          <Mail className="h-4 w-4" />
                          <span className="text-sm">{profile.email}</span>
                        </div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 text-emerald-100">
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                        <UserIcon className="h-5 w-5 text-success" />
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
                      className="gap-2 border-emerald-200 hover:bg-success/10"
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
                      <Label className="text-xs text-muted-foreground">Mã nhân viên</Label>
                      <p className="mt-1">{profile.staffId}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Phòng ban</Label>
                      <p className="mt-1">{profile.department ?? "--"}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Ngày sinh</Label>
                      <p className="mt-1">{profile.birthDate ?? "--"}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Staff Settings */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                      <Settings className="h-5 w-5 text-success" />
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

            {/* Right Column - Staff Functions & Quick Links */}
            <div className="space-y-3">
              {/* Notifications & Work */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                      <Bell className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="text-foreground">Thông báo công việc</h3>
                  </div>

                  <div className="space-y-3">
                    {/* Notifications Toggle */}
                    <div className="flex items-center justify-between rounded-lg p-2 hover:bg-card transition-colors">
                      <div className="flex-1">
                        <p className="font-medium">Nhận thông báo</p>
                        <p className="text-sm text-muted-foreground">Cập nhật công việc và thông báo quan trọng</p>
                      </div>
                      <input
                        type="checkbox"
                        className="h-5 w-5 accent-green-600"
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Staff Quick Links */}
              <Card className="border-0 bg-background shadow-md">
                <div className="p-2">
                  <h3 className="mb-3 text-foreground">Công việc hàng ngày</h3>

                  <div className="space-y-3">
                    <button onClick={() => router.push("/staff-dashboard")} className="flex w-full items-center gap-3 rounded-lg border-2 border-emerald-200 bg-success/10 p-2 transition-all hover:border-emerald-400 hover:bg-success/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success">
                        <BarChart3 className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-emerald-900">Dashboard</p>
                        <p className="text-sm text-success">Tổng quan công việc</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-success" />
                    </button>

                    <button onClick={() => router.push("/qr-check")} className="flex w-full items-center gap-3 rounded-lg border-2 border-primary bg-primary/10 p-2 transition-all hover:border-primary hover:bg-primary/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <QrCode className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-primary">Kiểm tra QR</p>
                        <p className="text-sm text-primary">Quét vé khách hàng</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>

                    <button onClick={() => router.push("/manage-tickets")} className="flex w-full items-center gap-3 rounded-lg border-2 border-violet-200 bg-violet-50 p-2 transition-all hover:border-violet-400 hover:bg-violet-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-600">
                        <Ticket className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-violet-900">Quản lý vé</p>
                        <p className="text-sm text-violet-700">Xem và xử lý vé</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-violet-600" />
                    </button>

                    <button onClick={() => router.push("/customers")} className="flex w-full items-center gap-3 rounded-lg border-2 border-primary/20 bg-primary/5 p-2 transition-all hover:border-primary/40 hover:bg-primary/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <Users className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-indigo-900">Khách hàng</p>
                        <p className="text-sm text-primary">Hỗ trợ khách hàng</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-indigo-600" />
                    </button>

                    <button onClick={() => router.push("/refunds")} className="flex w-full items-center gap-3 rounded-lg border-2 border-orange-200 bg-orange-50 p-2 transition-all hover:border-orange-400 hover:bg-orange-100">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600">
                        <RefreshCw className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-orange-900">Hoàn tiền</p>
                        <p className="text-sm text-orange-700">Xử lý yêu cầu hoàn tiền</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-orange-600" />
                    </button>

                    <button onClick={() => router.push("/reports/revenue")} className="flex w-full items-center gap-3 rounded-lg border-2 border-destructive/20 bg-error/10 p-2 transition-all hover:border-destructive/40 hover:bg-error/10">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-error">
                        <ClipboardList className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-destructive">Báo cáo</p>
                        <p className="text-sm text-error">Báo cáo công việc</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-error" />
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
                  <p className="mt-2 text-center text-xs text-error">Kết thúc ca làm việc</p>
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
            <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin tài khoản của bạn</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-emerald-100 bg-success text-primary-foreground text-2xl flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="avatar" className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(editForm.name || "N V")}</span>
                  )}
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-success text-primary-foreground shadow-lg">
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
            <Button variant="destructive" onClick={() => { setIsLogoutDialogOpen(false); router.push("/login"); }}>Đăng xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
