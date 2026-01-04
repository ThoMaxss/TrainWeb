"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { SettingsCard } from "./components/SettingsCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { LogoutCard } from './components/LogoutCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { getUserById, updateUser } from "@/lib/api/user";
import { getCurrentUserId } from "@/lib/utils/auth";
import { UserDto } from "@/types";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

type Gender = "Nam" | "Nữ" | "Khác";

interface LocalUserProfile {
  name: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: Gender;
  avatar?: string;
  role: string;
  userId?: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [user, setUser] = useState<UserDto | null>(null);
  const [profile, setProfile] = useState<LocalUserProfile>({
    name: "",
    email: "",
    phone: "",
    role: "Khách hàng",
    userId: "U001",
  });

  const [language, setLanguage] = useState("vi");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const avatarInputRef = useRef<HTMLInputElement>(null!);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar ?? "");

  // Load user data on mount
  const loadUserProfile = useCallback(async () => {
    let mounted = true;
    try {
      setLoading(true);
      setError(null);
      
      // Get userId from localStorage or auth context
      const userId = getCurrentUserId() || "user-me";
      const userData = await getUserById(userId);
      
      if (!mounted) return;
      
      setUser(userData);
      const local: LocalUserProfile = {
        name: userData?.name ?? "",
        email: userData?.email ?? "",
        phone: "",
        role: "Khách hàng",
        userId: userData?.id ?? "U001",
      };
      setProfile(local);
    } catch (err) {
      if (!mounted) return;
      setError("Không thể tải hồ sơ người dùng. Vui lòng thử lại.");
      console.error("Error loading user profile:", err);
    } finally {
      if (mounted) setLoading(false);
    }
    
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (
    updatedProfile: LocalUserProfile,
    newAvatarPreview: string
  ) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      if (user?.id) {
        const dto = {
          id: user.id,
          name: updatedProfile.name ?? "",
          email: updatedProfile.email ?? "",
        };
        const updated = await updateUser(user.id, dto);
        setUser(updated);
      }
      
      setProfile({ ...updatedProfile, avatar: newAvatarPreview });
      setAvatarPreview(newAvatarPreview);
      setSuccess("Hồ sơ đã được cập nhật thành công!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Không thể lưu thay đổi hồ sơ. Vui lòng thử lại.");
      console.error("Error saving profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = () => {
    router.push("/profile/change-password");
  };

  const handleLogout = () => {
    // Use centralized logout route
    router.push("/logout");
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Loading state
  if (loading) {
    return <LoadingSpinner message="Đang tải hồ sơ người dùng..." />;
  }

  // Error state
  if (error && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-6 text-center border">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-lg font-semibold mb-2">Lỗi tải dữ liệu</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => loadUserProfile()}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Thử lại
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-success), transparent 95%)", borderColor: "color-mix(in srgb, var(--color-success), transparent 70%)" }}>
            <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-success)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border flex items-center gap-3" style={{ backgroundColor: "color-mix(in srgb, var(--color-destructive), transparent 95%)", borderColor: "color-mix(in srgb, var(--color-destructive), transparent 70%)" }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-destructive)" }} />
            <p className="text-sm font-medium" style={{ color: "var(--color-destructive)" }}>{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          {/* Left Column - Profile Info */}
          <div className="space-y-6">
            <ProfileHeaderCard
              profile={profile}
              avatarPreview={avatarPreview}
              avatarInputRef={avatarInputRef}
              onAvatarUpload={handleAvatarUpload}
              getInitials={getInitials}
            />

            <PersonalInfoCard profile={profile} onEdit={() => {}} />

            <SettingsCard
              language={language}
              setLanguage={setLanguage}
              onChangePassword={handleChangePassword}
              notificationsEnabled={notificationsEnabled}
              onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </div>

          {/* Right Column - Quick Links */}
          <div className="space-y-6">
            <QuickLinksCard onNavigate={(path) => router.push(path)} />
            <LogoutCard onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
}
