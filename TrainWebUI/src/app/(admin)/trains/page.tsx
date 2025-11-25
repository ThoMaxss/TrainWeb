"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Train, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getAllTrains, createTrain, updateTrain, deleteTrain } from "@/lib/api/train";
import { TrainDto } from "@/types";
import { useToast } from "@/components/ui/toast";
import { TrainStats } from "./components/TrainStats";
import { TrainFilters } from "./components/TrainFilters";
import { TrainTable } from "./components/TrainTable";
import { TrainDialog } from "./components/TrainDialog";
import { DeleteDialog } from "./components/DeleteDialog";

export default function AdminTrainsPage() {
  const router = useRouter();
  const { show } = useToast();
  const [trains, setTrains] = useState<TrainDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<TrainDto | null>(null);
  const [selectedTrain, setSelectedTrain] = useState<TrainDto | null>(null);

  // Form state
  const [formData, setFormData] = useState<TrainDto>({
    name: "",
    type: "",
  });

  useEffect(() => {
    loadTrains();
  }, []);

  const loadTrains = async () => {
    try {
      setLoading(true);
      const data = await getAllTrains();
      setTrains(data);
    } catch (error) {
      console.error("Failed to load trains:", error);
      show("Không thể tải danh sách tàu");
    } finally {
      setLoading(false);
    }
  };

  // Filter trains
  const filteredTrains = trains.filter((train) => {
    const matchesSearch =
      train.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      train.type?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const totalTrains = trains.length;

  // Handle open add dialog
  const handleOpenAddDialog = () => {
    setEditingTrain(null);
    setFormData({
      name: "",
      type: "",
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle open edit dialog
  const handleOpenEditDialog = (train: TrainDto) => {
    setEditingTrain(train);
    setFormData({
      name: train.name || "",
      type: train.type || "",
    });
    setIsAddEditDialogOpen(true);
  };

  // Handle save train
  const handleSaveTrain = async () => {
    try {
      if (editingTrain?.id) {
        await updateTrain(editingTrain.id, formData);
        show("Cập nhật tàu thành công!");
      } else {
        await createTrain(formData);
        show("Tạo tàu thành công!");
      }
      await loadTrains();
      setIsAddEditDialogOpen(false);
    } catch (error) {
      console.error("Error saving train:", error);
      show("Không thể lưu thông tin tàu");
    }
  };

  // Handle delete train
  const handleDeleteTrain = async () => {
    if (selectedTrain?.id) {
      try {
        await deleteTrain(selectedTrain.id);
        show("Xóa tàu thành công!");
        await loadTrains();
      } catch (error) {
        console.error("Error deleting train:", error);
        show("Không thể xóa tàu");
      }
    }
    setIsDeleteDialogOpen(false);
    setSelectedTrain(null);
  };

  // Handle view details
  const handleViewDetails = (train: TrainDto) => {
    if (train.id) {
      router.push(`/trains/${train.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải danh sách tàu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminPageHeader
        title="Quản lý tàu"
        description={`${totalTrains} tàu trong hệ thống`}
        icon={Train}
        actions={
          <Button onClick={handleOpenAddDialog} className="gap-2 h-10">
            <Plus className="h-4 w-4" />
            Thêm tàu
          </Button>
        }
      />

      <div className="container mx-auto px-2 py-5 max-w-7xl space-y-6">
        <TrainStats totalTrains={totalTrains} />

        <TrainFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <TrainTable
          trains={filteredTrains}
          onView={handleViewDetails}
          onEdit={handleOpenEditDialog}
          onDelete={(train) => {
            setSelectedTrain(train);
            setIsDeleteDialogOpen(true);
          }}
        />
      </div>

      <TrainDialog
        open={isAddEditDialogOpen}
        onOpenChange={setIsAddEditDialogOpen}
        editingTrain={editingTrain}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSaveTrain}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        train={selectedTrain}
        onConfirm={handleDeleteTrain}
      />
    </div>
  );
}
