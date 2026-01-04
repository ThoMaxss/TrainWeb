import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Mail, Phone } from "lucide-react";

interface LocalAdminProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  department?: string;
  avatar?: string;
}

interface ProfileHeaderCardProps {
  profile: LocalAdminProfile;
  avatarPreview: string;
  avatarInputRef: React.RefObject<HTMLInputElement>;
  onAvatarUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  getInitials: (name: string) => string;
}

export function ProfileHeaderCard({ 
  profile, 
  avatarPreview, 
  avatarInputRef, 
  onAvatarUpload,
  getInitials 
}: ProfileHeaderCardProps) {
  return (
    <Card className="border border-border bg-card text-foreground shadow-sm">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="h-24 w-24 rounded-full border-4 border-background shadow-sm bg-secondary/10 flex items-center justify-center text-secondary text-2xl overflow-hidden">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={avatarPreview} 
                  alt={`Ảnh đại diện của ${profile.name}`} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <span>{getInitials(profile.name || "Q T")}</span>
              )}
            </div>
            <button 
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-background text-secondary shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Admin Info */}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="mb-2 text-2xl text-primary-foreground font-bold">
              {profile.name || "--"}
            </h2>
            <Badge className="mb-3 bg-background/20 text-primary-foreground border-white/30">
              {profile.role} - {profile.department}
            </Badge>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-secondary/10">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{profile.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-secondary/10">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{profile.phone || "--"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
