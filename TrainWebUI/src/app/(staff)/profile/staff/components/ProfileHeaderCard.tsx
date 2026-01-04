"use client";

import { RefObject } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";

interface ProfileHeaderCardProps {
  profile: {
    name: string;
    email: string;
    role: string;
    staffId?: string;
    department?: string;
    avatar?: string;
  };
  avatarPreview: string;
  avatarInputRef: RefObject<HTMLInputElement>;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (name: string) => string;
}

export function ProfileHeaderCard({
  profile,
  avatarPreview,
  avatarInputRef,
  onAvatarUpload,
  getInitials,
}: ProfileHeaderCardProps) {
  return (
    <Card className="border border-border bg-card text-foreground shadow-sm overflow-hidden">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-background shadow-sm bg-success/10 flex items-center justify-center text-success text-2xl font-bold overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt={`Ảnh đại diện của ${profile.name}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{getInitials(profile.name || "N V")}</span>
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-background text-success shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
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

          {/* Staff Info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
              <h2 className="text-2xl font-bold">{profile.name || "Nhân viên"}</h2>
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                {profile.role}
              </Badge>
            </div>
            <p className="text-success/70 mb-1">{profile.email}</p>
            <div className="flex items-center gap-4 text-sm text-success/70 justify-center sm:justify-start">
              {profile.staffId && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Mã NV:</span> {profile.staffId}
                </span>
              )}
              {profile.department && (
                <span className="flex items-center gap-1">
                  <span className="font-medium">Phòng ban:</span> {profile.department}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
