"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { SettingsCard } from "./components/SettingsCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { LogoutCard } from "./components/LogoutCard";
import { EditProfileDialog } from "./components/EditProfileDialog";
import { ChangePasswordDialog } from "./components/ChangePasswordDialog";
import { LogoutConfirmDialog } from "./components/LogoutConfirmDialog";
import { getUserById, updateUser } from "@/lib/api/user";
import type { UserDto } from "@/types";

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

  const [user, setUser] = useState<UserDto | null>(null);
  const [profile, setProfile] = useState<LocalStaffProfile>({ 
    name: "", 
    email: "", 
    phone: "", 
    role: "Nhân viên",
    staffId: "ST001",
    department: "Dịch vụ khách hàng"
  });

  const [language, setLanguage] = useState("vi");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null!);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        // Use current user from localStorage or fallback to staff-001 for demo
        const stored = localStorage.getItem('gorail_user');
        const currentUserId = stored ? JSON.parse(stored)?.id || 'staff-001' : 'staff-001';
        const u = await getUserById(currentUserId);
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

  const handleSaveProfile = async (updatedProfile: LocalStaffProfile, newAvatarPreview: string) => {
    try {
      setLoading(true);
      if (user?.id) {
        const dto: Partial<UserDto> = {
          id: user.id,
          name: updatedProfile.name,
          email: updatedProfile.email,
          phone: updatedProfile.phone,
        } as any;
        const updated = await updateUser(user.id, dto as UserDto);
        setUser(updated as UserDto);
      }
      setProfile({ ...updatedProfile, avatar: newAvatarPreview });
      setAvatarPreview(newAvatarPreview);
      setIsEditProfileOpen(false);
    } catch (e) {
      setError("Không thể lưu thay đổi hồ sơ.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    console.log("Password changed");
  };

  const handleLogout = () => {
    setIsLogoutDialogOpen(false);
    router.push("/login");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải hồ sơ nhân viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
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
              onEdit={() => setIsEditProfileOpen(true)}
            />

            <SettingsCard
              language={language}
              setLanguage={setLanguage}
              onChangePassword={() => setIsChangePasswordOpen(true)}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
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

      <EditProfileDialog
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
        getInitials={getInitials}
      />

      <ChangePasswordDialog
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        onChangePassword={handleChangePassword}
      />

      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirmLogout={handleLogout}
      />
    </div>
  );
}
