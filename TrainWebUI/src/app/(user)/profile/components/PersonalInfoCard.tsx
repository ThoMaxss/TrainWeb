"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Calendar, Users, Edit2 } from "lucide-react";

interface PersonalInfoCardProps {
  profile: {
    name: string;
    email: string;
    phone: string;
    birthDate?: string;
    gender?: string;
  };
  onEdit: () => void;
}

export function PersonalInfoCard({ profile, onEdit }: PersonalInfoCardProps) {
  return (
    <Card className="bg-card border border-border shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Họ và tên</p>
              <p className="font-medium">{profile.name || "Chưa cập nhật"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile.email || "Chưa cập nhật"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Số điện thoại</p>
              <p className="font-medium">{profile.phone || "Chưa cập nhật"}</p>
            </div>
          </div>

          {profile.birthDate && (
            <>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Ngày sinh</p>
                  <p className="font-medium">{profile.birthDate}</p>
                </div>
              </div>
            </>
          )}

          {profile.gender && (
            <>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Giới tính</p>
                  <p className="font-medium">{profile.gender}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
