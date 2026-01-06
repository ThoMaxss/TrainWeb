"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Plus, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/api/user";
import { UserDto, UserRole } from "@/types";
import { useToast } from "@/components/ui/toast";
import { StaffStats } from "./components/StaffStats";
import { StaffFilters } from "./components/StaffFilters";
import { StaffTable } from "./components/StaffTable";
import { StaffDialog } from "./components/StaffDialog";
import { DeleteDialog } from "./components/DeleteDialog";

export default function AdminStaffPage() {
  const router = useRouter();
  const { show } = useToast();

  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Form state
  const [formData, setFormData] = useState<UserDto>({
    id: "",
    name: "",
    email: "",
    cccd: "",
    phone: "",
    avatarURL: "",
    role: UserRole.Staff,
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      show("Unable to load users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Calculate stats
  const totalUsers = users.length;
  const staffCount = users.filter((u) => u.role === UserRole.Staff).length;
  const adminCount = users.filter((u) => u.role === UserRole.Admin).length;
  const passengerCount = users.filter((u) => u.role === UserRole.Passenger).length;
console.log("Total users:", staffCount, adminCount, passengerCount);
console.log("Filtered users:", users.filter((u) => u.role === UserRole.Staff));
  // Handle open add dialog
  const handleOpenAddDialog = () => {
    setEditingUser(null);
    setFormData({
      id: "",
      name: "",
      email: "",
      cccd: "",
      phone: "",
      avatarURL: "",
      role: UserRole.Staff,
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (user: UserDto) => {
    setEditingUser(user);
    setFormData({
      id: user.id || "",
      name: user.name || "",
      email: user.email || "",
      cccd: user.cccd || "",
      phone: user.phone || "",
      avatarURL: user.avatarURL || "",
      role: user.role || UserRole.Staff,
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle save user
  const handleSaveUser = async () => {
    try {
      if (editingUser?.id) {
        const updateData = {
          ...formData,
          cccd: formData.cccd || undefined,
          phone: formData.phone || undefined,
          avatarURL: formData.avatarURL || undefined,
        };
        await updateUser(editingUser.id, updateData);
        show("User updated successfully!");
      } else {
        var createData = {
          ...formData,
          cccd: formData.cccd || undefined,
          phone: formData.phone || undefined,
          avatarURL: formData.avatarURL || undefined,
        };
        await createUser(createData);
        show("User created successfully!");
      }
      await loadUsers();
      setIsAddEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving user:", error);
      show("Unable to save user");
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (selectedUser?.id) {
      try {
        await deleteUser(selectedUser.id);
        show("User deleted successfully!");
        await loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        show("Unable to delete user");
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle view details
  const handleViewDetails = (user: UserDto) => {
    if (user.id) {
      router.push(`/staff/${user.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải người dùng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title="Quản lý nhân viên"
        description={`${totalUsers} người dùng • ${staffCount} nhân viên • ${adminCount} quản trị viên`}
        icon={Users}
        stats={[
          { icon: Users, label: "Tổng người dùng", value: totalUsers },
          { icon: Shield, label: "Nhân viên", value: staffCount },
          { icon: Activity, label: "Đang hoạt động", value: totalUsers },
        ]}
        actions={
          <Button onClick={handleOpenAddDialog} className="gap-2 h-10">
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </Button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 space-y-6">
        <StaffStats
          totalUsers={totalUsers}
          staffCount={staffCount}
          adminCount={adminCount}
          passengerCount={passengerCount}
        />

        <StaffFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
        />

        <StaffTable
          users={filteredUsers}
          onView={handleViewDetails}
          onEdit={handleOpenEditDialog}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <StaffDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        editingUser={editingUser}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveUser}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
