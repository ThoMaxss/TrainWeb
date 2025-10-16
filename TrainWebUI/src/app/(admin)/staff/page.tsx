"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  Lock,
  Save,
  Mail,
  Phone,
  User,
  Shield,
  Key,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Activity,
  Ticket,
  MessageSquare,
  Copy,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  color: string;
  defaultPermissions: string[];
}

interface Staff {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: "active" | "inactive";
  permissions: string[];
  createdAt: string;
  lastActive: string;
  todayStats: {
    ticketsProcessed: number;
    feedbackReplied: number;
    online: boolean;
  };
}

const ROLES: Role[] = [
  {
    id: "staff_ve",
    name: "Nhân viên vé",
    color: "blue",
    defaultPermissions: ["manage_tickets", "qr_checking", "customer_support"],
  },
  {
    id: "cskh",
    name: "CSKH",
    color: "green",
    defaultPermissions: ["customer_support", "refund_exchange"],
  },
  {
    id: "supervisor",
    name: "Supervisor",
    color: "purple",
    defaultPermissions: ["manage_tickets", "qr_checking", "refund_exchange", "customer_support"],
  },
];

const PERMISSIONS: Permission[] = [
  { id: "manage_tickets", name: "Quản lý vé", description: "Xem và quản lý đặt vé" },
  { id: "qr_checking", name: "QR Checking", description: "Quét QR và kiểm tra vé" },
  { id: "refund_exchange", name: "Hoàn/Đổi vé", description: "Xử lý hoàn trả và đổi vé" },
  { id: "customer_support", name: "Hỗ trợ khách hàng", description: "Trả lời phản hồi và hỗ trợ" },
];

export default function AdminStaffPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    role: "staff_ve",
    status: "active" as "active" | "inactive",
  });

  const [tempPermissions, setTempPermissions] = useState<string[]>([]);

  // Mock staff data
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "s1",
      username: "staff01",
      fullName: "Nguyễn Văn A",
      email: "staff01@train.vn",
      phone: "0912345678",
      role: "staff_ve",
      status: "active",
      permissions: ["manage_tickets", "qr_checking", "customer_support"],
      createdAt: "2024-01-15",
      lastActive: "2 giờ trước",
      todayStats: {
        ticketsProcessed: 24,
        feedbackReplied: 8,
        online: true,
      },
    },
    {
      id: "s2",
      username: "staff02",
      fullName: "Trần Thị B",
      email: "staff02@train.vn",
      phone: "0987654321",
      role: "cskh",
      status: "active",
      permissions: ["customer_support", "refund_exchange"],
      createdAt: "2024-02-20",
      lastActive: "30 phút trước",
      todayStats: {
        ticketsProcessed: 0,
        feedbackReplied: 15,
        online: true,
      },
    },
    {
      id: "s3",
      username: "staff03",
      fullName: "Lê Văn C",
      email: "staff03@train.vn",
      phone: "0901234567",
      role: "supervisor",
      status: "active",
      permissions: ["manage_tickets", "qr_checking", "refund_exchange", "customer_support"],
      createdAt: "2023-11-10",
      lastActive: "1 giờ trước",
      todayStats: {
        ticketsProcessed: 18,
        feedbackReplied: 12,
        online: true,
      },
    },
    {
      id: "s4",
      username: "staff04",
      fullName: "Phạm Thị D",
      email: "staff04@train.vn",
      phone: "0909876543",
      role: "staff_ve",
      status: "inactive",
      permissions: ["manage_tickets", "qr_checking"],
      createdAt: "2024-03-05",
      lastActive: "2 ngày trước",
      todayStats: {
        ticketsProcessed: 0,
        feedbackReplied: 0,
        online: false,
      },
    },
    {
      id: "s5",
      username: "staff05",
      fullName: "Hoàng Văn E",
      email: "staff05@train.vn",
      phone: "0938765432",
      role: "cskh",
      status: "active",
      permissions: ["customer_support", "refund_exchange"],
      createdAt: "2024-01-20",
      lastActive: "15 phút trước",
      todayStats: {
        ticketsProcessed: 0,
        feedbackReplied: 20,
        online: true,
      },
    },
  ]);

  // Simple toast replacement
  const showToast = (message: string, type: "success" | "error" = "success") => {
    alert(`${type === "success" ? "✅" : "❌"} ${message}`);
  };

  // Generate random password
  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    setFormData({ ...formData, password });
    return password;
  };

  // Get role info
  const getRoleInfo = (roleId: string) => {
    return ROLES.find((r) => r.id === roleId) || ROLES[0];
  };

  // Get role badge
  const getRoleBadge = (roleId: string) => {
    const role = getRoleInfo(roleId);
    const colorClasses = {
      blue: "bg-primary/10 text-primary hover:bg-primary/10",
      green: "bg-success/10 text-success hover:bg-success/10",
      purple: "bg-violet-100 text-violet-700 hover:bg-violet-100",
    };
    return (
      <Badge className={`gap-1 ${colorClasses[role.color as keyof typeof colorClasses]}`}>
        <Shield className="h-3 w-3" />
        {role.name}
      </Badge>
    );
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    if (status === "active") {
      return (
        <Badge className="gap-1 bg-success/10 text-success hover:bg-success/10">
          <CheckCircle2 className="h-3 w-3" />
          Active
        </Badge>
      );
    }
    return (
      <Badge className="gap-1 bg-card text-foreground hover:bg-card">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  // Filter staff by search query
  const filteredStaff = staffList.filter(
    (staff) =>
      staff.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle open add dialog
  const handleOpenAddDialog = () => {
    setEditingStaff(null);
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      role: "staff_ve",
      status: "active",
    });
    setGeneratedPassword("");
    setIsAddEditDialogOpen(true);
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      username: staff.username,
      password: "",
      fullName: staff.fullName,
      email: staff.email,
      phone: staff.phone,
      role: staff.role,
      status: staff.status,
    });
    setGeneratedPassword("");
    setIsAddEditDialogOpen(true);
  };

  // Handle save staff
  const handleSaveStaff = () => {
    if (editingStaff) {
      // Update existing staff
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === editingStaff.id
            ? {
                ...s,
                username: formData.username,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                status: formData.status,
                permissions: getRoleInfo(formData.role).defaultPermissions,
              }
            : s
        )
      );
      showToast(`Đã cập nhật nhân viên ${formData.fullName}!`);
    } else {
      // Add new staff
      const newStaff: Staff = {
        id: `s${staffList.length + 1}`,
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
        permissions: getRoleInfo(formData.role).defaultPermissions,
        createdAt: new Date().toISOString().split("T")[0],
        lastActive: "Chưa đăng nhập",
        todayStats: {
          ticketsProcessed: 0,
          feedbackReplied: 0,
          online: false,
        },
      };
      setStaffList((prev) => [...prev, newStaff]);
      showToast(`Đã thêm nhân viên ${formData.fullName}!`);
    }
    setIsAddEditDialogOpen(false);
  };

  // Handle delete staff
  const handleDeleteStaff = () => {
    if (selectedStaff) {
      setStaffList((prev) => prev.filter((s) => s.id !== selectedStaff.id));
      showToast(`Đã xóa nhân viên ${selectedStaff.fullName}!`);
    }
    setIsDeleteDialogOpen(false);
    setSelectedStaff(null);
  };

  // Handle reset password
  const handleResetPassword = () => {
    const newPassword = generatePassword();
    showToast(`Mật khẩu cho ${selectedStaff?.fullName} đã được reset!`);
    setIsResetPasswordDialogOpen(false);
    setSelectedStaff(null);
  };

  // Handle toggle status
  const handleToggleStatus = (staff: Staff) => {
    const newStatus = staff.status === "active" ? "inactive" : "active";
    setStaffList((prev) =>
      prev.map((s) => (s.id === staff.id ? { ...s, status: newStatus } : s))
    );
    showToast(`Đã ${newStatus === "active" ? "kích hoạt" : "vô hiệu hóa"} tài khoản ${staff.fullName}!`);
  };

  // Handle open permissions dialog
  const handleOpenPermissionsDialog = (staff: Staff) => {
    setSelectedStaff(staff);
    setTempPermissions([...staff.permissions]);
    setIsPermissionDialogOpen(true);
  };

  // Handle save permissions
  const handleSavePermissions = () => {
    if (selectedStaff) {
      setStaffList((prev) =>
        prev.map((s) =>
          s.id === selectedStaff.id ? { ...s, permissions: [...tempPermissions] } : s
        )
      );
      showToast(`Đã lưu phân quyền cho ${selectedStaff.fullName}!`);
    }
    setIsPermissionDialogOpen(false);
    setSelectedStaff(null);
  };

  // Copy password to clipboard
  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    showToast("Đã sao chép mật khẩu!");
  };

  // Calculate summary stats
  const totalStaff = staffList.length;
  const activeStaff = staffList.filter((s) => s.status === "active").length;
  const onlineStaff = staffList.filter((s) => s.todayStats.online).length;
  const todayTickets = staffList.reduce((sum, s) => sum + s.todayStats.ticketsProcessed, 0);
  const todayFeedback = staffList.reduce((sum, s) => sum + s.todayStats.feedbackReplied, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-2">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              Quản lý nhân viên
            </h1>
            <div className="text-muted-foreground mt-2 flex items-center gap-3">
              <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary text-primary">
                {totalStaff} nhân viên
              </Badge>
              <span className="text-sm">
                {activeStaff} hoạt động • {onlineStaff} đang online
              </span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng nhân viên</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalStaff}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Đang online</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{onlineStaff}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <Activity className="h-6 w-6 text-success" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Vé xử lý hôm nay</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{todayTickets}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <Ticket className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
            <div className="p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Phản hồi hôm nay</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{todayFeedback}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                  <MessageSquare className="h-6 w-6 text-violet-600" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Table Card */}
        <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-lg">
          <div className="p-2 space-y-3">
            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, username, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border"
                />
              </div>
              <Button
                className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full sm:w-auto shadow-lg"
                onClick={handleOpenAddDialog}
              >
                <Plus className="h-4 w-4" />
                Thêm nhân viên
              </Button>
            </div>

            {/* Staff Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-card">
                    <TableHead>Username</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>SĐT</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Hoạt động</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-card">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-primary-foreground">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{staff.username}</p>
                            {staff.todayStats.online && (
                              <div className="flex items-center gap-1 text-xs text-success">
                                <div className="h-1.5 w-1.5 rounded-full bg-success"></div>
                                Online
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{staff.fullName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {staff.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          {staff.phone}
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(staff.role)}</TableCell>
                      <TableCell>{getStatusBadge(staff.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Ticket className="h-3 w-3" />
                            {staff.todayStats.ticketsProcessed} vé
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {staff.todayStats.feedbackReplied} phản hồi
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenPermissionsDialog(staff)}
                            title="Phân quyền"
                          >
                            <Shield className="h-4 w-4 text-violet-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEditDialog(staff)}
                            title="Sửa"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedStaff(staff);
                              setIsResetPasswordDialogOpen(true);
                            }}
                            title="Reset password"
                          >
                            <Lock className="h-4 w-4 text-warning" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleStatus(staff)}
                            title={staff.status === "active" ? "Vô hiệu hóa" : "Kích hoạt"}
                          >
                            {staff.status === "active" ? (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-success" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-error hover:text-error hover:bg-error/10"
                            onClick={() => {
                              setSelectedStaff(staff);
                              setIsDeleteDialogOpen(true);
                            }}
                            title="Xóa"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredStaff.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Không tìm thấy nhân viên nào</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Add/Edit Staff Dialog */}
      <Dialog open={isAddEditDialogOpen} onOpenChange={setIsAddEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {editingStaff ? "Sửa thông tin nhân viên" : "Thêm nhân viên mới"}
            </DialogTitle>
            <DialogDescription>
              {editingStaff
                ? "Cập nhật thông tin tài khoản nhân viên"
                : "Tạo tài khoản mới cho nhân viên. Mật khẩu sẽ được tự động tạo."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-3 pr-3">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="VD: staff01"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!!editingStaff}
                />
              </div>

              {!editingStaff && (
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={generatedPassword}
                        readOnly
                        placeholder="Click 'Tạo mật khẩu' để tạo"
                        className="pr-20"
                      />
                      {generatedPassword && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={copyPassword}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="gap-2"
                      onClick={generatePassword}
                    >
                      <Key className="h-4 w-4" />
                      Tạo mật khẩu
                    </Button>
                  </div>
                  {generatedPassword && (
                    <p className="text-xs text-warning flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Lưu mật khẩu này. Nó sẽ được gửi qua email cho nhân viên.
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Họ tên *</Label>
                <Input
                  id="fullName"
                  placeholder="VD: Nguyễn Văn A"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="VD: staff01@train.vn"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="VD: 0912345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Vai trò *</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <div className="flex items-center gap-3 rounded-lg border p-2">
                  <input
                    type="checkbox"
                    id="status"
                    checked={formData.status === "active"}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.checked ? "active" : "inactive" })
                    }
                    className="h-4 w-4 rounded border-border text-primary focus:ring-blue-500"
                  />
                  <Label htmlFor="status" className="cursor-pointer">
                    {formData.status === "active" ? "Active" : "Inactive"}
                  </Label>
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
              onClick={handleSaveStaff}
            >
              <Save className="h-4 w-4" />
              {editingStaff ? "Cập nhật" : "Thêm nhân viên"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-600" />
              Phân quyền - {selectedStaff?.fullName}
            </DialogTitle>
            <DialogDescription>
              Chọn quyền truy cập cho nhân viên này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {/* Role Preset */}
            <div className="rounded-lg border bg-card p-2">
              <p className="text-sm font-medium mb-2">Vai trò hiện tại:</p>
              {selectedStaff && getRoleBadge(selectedStaff.role)}
              <p className="text-xs text-muted-foreground mt-2">
                Bạn có thể tùy chỉnh quyền chi tiết bên dưới
              </p>
            </div>

            {/* Detailed Permissions */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Quyền chi tiết:</p>
              {PERMISSIONS.map((permission) => (
                <Card key={permission.id} className="border-2">
                  <div className="p-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={permission.id}
                        checked={tempPermissions.includes(permission.id)}
                        onCheckedChange={(checked: boolean | "indeterminate") => {
                          if (checked === true) {
                            setTempPermissions([...tempPermissions, permission.id]);
                          } else {
                            setTempPermissions(tempPermissions.filter((p) => p !== permission.id));
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor={permission.id} className="cursor-pointer">
                          {permission.name}
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600"
              onClick={handleSavePermissions}
            >
              <Save className="h-4 w-4" />
              Lưu phân quyền
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-error" />
              Xác nhận xóa nhân viên
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{selectedStaff?.fullName}</strong> (
              {selectedStaff?.username})? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleDeleteStaff}
              className="bg-error hover:bg-destructive/90"
            >
              Xóa nhân viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-warning" />
              Reset mật khẩu
            </DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn reset mật khẩu cho <strong>{selectedStaff?.fullName}</strong>?
              Mật khẩu mới sẽ được tạo tự động và gửi qua email <strong>{selectedStaff?.email}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleResetPassword}
              className="bg-amber-600 hover:bg-amber-700"
            >
              <Lock className="mr-2 h-4 w-4" />
              Reset mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
