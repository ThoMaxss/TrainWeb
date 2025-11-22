import { useRef } from "react";
import { Camera, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProfileBannerCardProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (name: string) => string;
}

export function ProfileBannerCard({ profile, onAvatarUpload, getInitials }: ProfileBannerCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card className="border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-primary-foreground shadow-xl">
      <div className="p-2 sm:p-2">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-white/20 shadow-lg bg-primary flex items-center justify-center text-primary-foreground text-2xl overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={`Ảnh đại diện của ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getInitials(profile.name || "U N")}</span>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Thay đổi ảnh đại diện"
            >
              <Camera className="h-4 w-4" aria-hidden="true" />
            </button>
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              className="hidden"
            />
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
  );
}
