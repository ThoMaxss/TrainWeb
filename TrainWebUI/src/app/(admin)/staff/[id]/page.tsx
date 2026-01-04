"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getUserById, updateUser, deleteUser } from "@/lib/api/user";
import { UserDto, UserRole } from "@/types";
import { useToast } from "@/components/ui/toast";
import { UserProfileCard } from "./components/UserProfileCard";
import { ActivitySummary } from "./components/ActivitySummary";
import { AdditionalInfoCard } from "./components/AdditionalInfoCard";
import { StaffDialog } from "../components/StaffDialog";
import { DeleteDialog } from "../components/DeleteDialog";

export default function StaffDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { show } = useToast();
  const userId = params?.id as string;

  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<UserDto>({
    name: "",
    email: "",
    role: UserRole.Staff,
  });

  useEffect(() => {
    if (userId) {
      loadUser();
    }
  }, [userId]);

  const loadUser = async () => {
    try {
      setLoading(true);
      const data = await getUserById(userId);
      setUser(data);
      setFormData({
        name: data.name || "",
        email: data.email || "",
        role: data.role || UserRole.Staff,
      });
    } catch (error) {
      console.error("Failed to load user:", error);
      show("Unable to load user details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateUser(userId, formData);
      show("User updated successfully!");
      await loadUser();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
      show("Unable to update user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(userId);
      show("User deleted successfully!");
      router.push("/staff");
    } catch (error) {
      console.error("Error deleting user:", error);
      show("Unable to delete user");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải thông tin người dùng...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Không tìm thấy người dùng</p>
          <Button onClick={() => router.push("/staff")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title={user.name || "Thông tin người dùng"}
        description={`ID: ${user.id}`}
        icon={UserIcon}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/staff")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </Button>
          </div>
        }
      />

      <div className="container mx-auto px-2 py-5 max-w-5xl space-y-6">
        <UserProfileCard user={user} />
        <ActivitySummary />
        <AdditionalInfoCard userRole={user.role} />
      </div>

      <StaffDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingUser={user}
        formData={formData}
        setFormData={setFormData}
        onSave={handleUpdate}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={user}
        onConfirm={handleDelete}
      />
    </div>
  );
}
