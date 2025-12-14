
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileHeaderCard } from "./components/ProfileHeaderCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { SettingsCard } from "./components/SettingsCard";
import { QuickLinksCard } from "./components/QuickLinksCard";
import { LogoutCard } from "./components/LogoutCard";
import { getUserById, updateUser } from "@/lib/api/user";

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
	const [error, setError] = useState<string | null>(null);

	const [user, setUser] = useState<any>(null);
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

	useEffect(() => {
		let mounted = true;
		async function load() {
			try {
				setLoading(true);
				setError(null);
				// TODO: replace 'user-me' with actual user id from auth context
				const u = await getUserById("user-me");
				if (!mounted) return;
				setUser(u);
				const local: LocalUserProfile = {
					name: u.name ?? "",
					email: u.email ?? "",
					phone: "",
					role: "Khách hàng",
					userId: u.id ?? "U001",
				};
				setProfile(local);
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

	const handleSaveProfile = async (updatedProfile: LocalUserProfile, newAvatarPreview: string) => {
		try {
			setLoading(true);
			if (user?.id) {
				const dto: Partial<any> = {
					id: user.id,
					name: updatedProfile.name,
					email: updatedProfile.email,
					phone: updatedProfile.phone,
				};
				const updated = await updateUser(user.id, dto as any);
				setUser(updated);
			}
			setProfile({ ...updatedProfile, avatar: newAvatarPreview });
			setAvatarPreview(newAvatarPreview);
		} catch (e) {
			setError("Không thể lưu thay đổi hồ sơ.");
		} finally {
			setLoading(false);
		}
	};

	const handleChangePassword = () => {
		// Implement password change logic
		console.log("Password changed");
	};

	const handleLogout = () => {
		router.push("/login");
	};

	const getInitials = (name: string) =>
		name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

	if (loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-success mx-auto mb-3"></div>
					<p className="text-muted-foreground">Đang tải hồ sơ người dùng...</p>
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
							onEdit={() => {}}
						/>

						<SettingsCard
							language={language}
							setLanguage={setLanguage}
							onChangePassword={handleChangePassword}
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
							onLogout={handleLogout}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
