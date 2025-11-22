"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Camera } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { SettingsCard } from "./components/SettingsCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { LogoutCard } from "./components/LogoutCard";
import { getUserById, updateUser } from "@/lib/api/user";
import type { UserDto } from "@/types";

type Gender = "Nam" | "Nữ" | "Khác";

interface LocalAdminProfile {
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: Gender;
  avatar?: string;
  role: string;
  department?: string;
}

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserDto | null>(null);
  const [profile, setProfile] = useState<LocalAdminProfile>({ 
    name: "", 
    email: "", 
    phone: "", 
    role: "Quản trị viên" 
  });

  const [language, setLanguage] = useState("vi");

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const [editForm, setEditForm] = useState<LocalAdminProfile>(profile);

  const avatarInputRef = useRef<HTMLInputElement>(null!);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // TODO: replace 'admin-me' with actual admin user id from auth context
        const u = await getUserById("admin-me");
        if (!mounted) return;
        setUser(u);
        const local: LocalAdminProfile = {
          name: u.name ?? "",
          email: u.email ?? "",
          phone: "",
          role: "Quản trị viên",
          department: "Quản lý hệ thống",
        };
        setProfile(local);
        setEditForm(local);
      } catch (e) {
        if (!mounted) return;
        setError("Không thể tải hồ sơ quản trị viên.");
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

  const handleOpenEditDialog = () => {
    setEditForm(profile);
    setAvatarPreview(profile.avatar ?? "");
    setIsEditProfileOpen(true);
  };

  const getInitials = (name: string) => 
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-2 py-5 max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left Column */}
          <div className="space-y-6">
            <ProfileHeaderCard
              profile={profile}
              avatarPreview={avatarPreview}
              avatarInputRef={avatarInputRef}
              onAvatarUpload={handleAvatarUpload}
              getInitials={getInitials}
            />

            <PersonalInfoCard
              profile={profile}
              onEdit={handleOpenEditDialog}
            />

            <SettingsCard
              language={language}
              setLanguage={setLanguage}
              onChangePassword={() => setIsChangePasswordOpen(true)}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <QuickLinksCard
              onNavigate={(path) => router.push(path)}
            />

            <LogoutCard
              onLogout={() => setIsLogoutDialogOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin quản trị viên</DialogTitle>
            <DialogDescription>Cập nhật thông tin tài khoản của bạn</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Avatar Preview */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-secondary/20 dark:border-secondary/80 bg-secondary text-primary-foreground text-2xl flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="Xem trước ảnh đại diện mới" className="h-full w-full object-cover" />
                  ) : (
                    <span>{getInitials(editForm.name || "Q T")}</span>
                  )}
                </div>
                <button 
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary-foreground shadow-lg"
                  aria-label="Chọn ảnh đại diện"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-name">Họ tên</Label>
                <Input 
                  id="edit-name" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  placeholder="Nhập họ tên" 
                />
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input 
                  id="edit-email" 
                  type="email" 
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="email@example.com" 
                />
              </div>

              <div>
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input 
                  id="edit-phone" 
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  placeholder="0912345678" 
                />
              </div>

              <div>
                <Label htmlFor="edit-department">Phòng ban</Label>
                <Input 
                  id="edit-department" 
                  value={editForm.department ?? ""}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  placeholder="Phòng ban" 
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>Nhập mật khẩu hiện tại và mật khẩu mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input id="current-password" type="password" placeholder="Nhập mật khẩu hiện tại" />
            </div>
            <div>
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" placeholder="Nhập mật khẩu mới" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input id="confirm-password" type="password" placeholder="Nhập lại mật khẩu mới" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangePasswordOpen(false)}>Hủy</Button>
            <Button onClick={() => setIsChangePasswordOpen(false)}>Cập nhật mật khẩu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogoutDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={() => router.push("/login")}>Đăng xuất</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
