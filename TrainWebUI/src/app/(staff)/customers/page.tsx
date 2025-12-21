"use client";

import { useState, useEffect } from "react";
import { UserDto, UserRole } from "@/types";
import { getAllUsers, createUser, updateUser, deleteUser } from "@/lib/api/user";
import { UserManagementHeader } from "./components/UserManagementHeader";
import { UserStatsCards } from "./components/UserStatsCards";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { CreateUserDialog } from "./components/CreateUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { DeleteUserDialog } from "./components/DeleteUserDialog";

export default function UsersManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | UserRole>("all");
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);

  // Dialogs
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<UserDto>>({
    name: "",
    email: "",
    role: UserRole.Passenger,
  });

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Call real API to get all users
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      // Fallback to empty array on error
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email ?? "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Handlers
  const handleCreateUser = async () => {
    try {
      const newUser = await createUser(formData as UserDto);
      setUsers([...users, newUser]);
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      const updated = await updateUser(selectedUser.id!, formData as UserDto);
      setUsers(users.map((u) => (u.id === selectedUser.id ? updated : u)));
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await deleteUser(selectedUser.id!);
      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const openEditDialog = (user: UserDto) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserDto) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: UserRole.Passenger,
    });
    setSelectedUser(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <UserManagementHeader onCreateUser={openCreateDialog} />

      <div className="container mx-auto px-4 py-6 space-y-6">
        <UserStatsCards users={users} />
        
        <UserFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterRole={filterRole}
          onFilterChange={setFilterRole}
        />

        <UserTable
          users={filteredUsers}
          loading={loading}
          onEditUser={openEditDialog}
          onDeleteUser={openDeleteDialog}
        />
      </div>

      <CreateUserDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleCreateUser}
      />

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        formData={formData}
        onFormChange={setFormData}
        onSubmit={handleUpdateUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={selectedUser}
        onConfirm={handleDeleteUser}
      />
    </div>
  );
}
