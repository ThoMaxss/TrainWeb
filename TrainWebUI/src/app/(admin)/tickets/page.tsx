"use client";

import { useState, useEffect } from "react";
import { Ticket, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAllTicketTypes, createTicketType, updateTicketType, deleteTicketType } from "@/lib/api/ticketType";
import { TicketTypeDto } from "@/types";
import { useToast } from "@/components/ui/toast";
import { TicketTypeStats } from "./components/TicketTypeStats";
import { TicketTypeFilters } from "./components/TicketTypeFilters";
import { TicketTypeTable } from "./components/TicketTypeTable";
import { TicketTypeDialog } from "./components/TicketTypeDialog";
import { DeleteDialog } from "./components/DeleteDialog";

export default function AdminTicketsPage() {
  const { show } = useToast();
  const [ticketTypes, setTicketTypes] = useState<TicketTypeDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTicketType, setEditingTicketType] = useState<TicketTypeDto | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketTypeDto | null>(null);

  // Form state
  const [formData, setFormData] = useState<TicketTypeDto>({
    name: "",
    discount: 0,
  });

  useEffect(() => {
    loadTicketTypes();
  }, []);

  const loadTicketTypes = async () => {
    try {
      setLoading(true);
      const data = await getAllTicketTypes();
      setTicketTypes(data);
    } catch (error) {
      console.error("Failed to load ticket types:", error);
      show("Không thể tải danh sách mẫu vé");
    } finally {
      setLoading(false);
    }
  };

  // Filter ticket types
  const filteredTicketTypes = ticketTypes.filter((ticketType) => {
    const matchesSearch =
      ticketType.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const totalTypes = ticketTypes.length;

  // Handle open add dialog
  const handleOpenAddDialog = () => {
    setEditingTicketType(null);
    setFormData({
      name: "",
      discount: 0,
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (ticketType: TicketTypeDto) => {
    setEditingTicketType(ticketType);
    setFormData({
      name: ticketType.name || "",
      discount: ticketType.discount ?? 0,
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle save ticket type
  const handleSaveTicketType = async () => {
    try {
      if (editingTicketType?.id) {
        await updateTicketType(editingTicketType.id, formData);
        show("Cập nhật mẫu vé thành công!");
      } else {
        await createTicketType(formData);
        show("Tạo mẫu vé thành công!");
      }
      await loadTicketTypes();
      setIsAddEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving ticket type:", error);
      show("Không thể lưu mẫu vé");
    }
  };

  // Handle delete ticket type
  const handleDeleteTicketType = async () => {
    if (selectedTicketType?.id) {
      try {
        await deleteTicketType(selectedTicketType.id);
        show("Xóa mẫu vé thành công!");
        await loadTicketTypes();
      } catch (error) {
        console.error("Error deleting ticket type:", error);
        show("Không thể xóa mẫu vé");
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedTicketType(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải danh sách mẫu vé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title="Quản lý mẫu vé"
        description={`${totalTypes} mẫu vé trong hệ thống`}
        icon={Ticket}
        actions={
          <Button onClick={handleOpenAddDialog} className="gap-2 h-10">
            <Plus className="h-4 w-4" />
            Thêm mẫu vé
          </Button>
        }
      />

      <div className="container mx-auto px-2 py-5 max-w-7xl space-y-6">
        <TicketTypeStats totalTypes={totalTypes} />

        <TicketTypeFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TicketTypeTable
          ticketTypes={filteredTicketTypes}
          onEdit={handleOpenEditDialog}
          onDelete={(ticketType) => {
            setSelectedTicketType(ticketType);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <TicketTypeDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        editingTicketType={editingTicketType}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveTicketType}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        ticketType={selectedTicketType}
        onConfirm={handleDeleteTicketType}
      />
    </div>
  );
}
