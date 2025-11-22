"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Train as TrainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getTrainById, updateTrain, deleteTrain } from "@/lib/api/train";
import { TrainDto } from "@/types";
import { useToast } from "@/components/ui/toast";
import { TrainProfileCard } from "./components/TrainProfileCard";
import { TrainActivitySummary } from "./components/TrainActivitySummary";
import { TrainAdditionalInfo } from "./components/TrainAdditionalInfo";
import { TrainDialog } from "../components/TrainDialog";
import { DeleteDialog } from "../components/DeleteDialog";

export default function TrainDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { show } = useToast();
  const trainId = params?.id as string;

  const [train, setTrain] = useState<TrainDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState<TrainDto>({
    name: "",
    type: "",
  });

  useEffect(() => {
    if (trainId) {
      loadTrain();
    }
  }, [trainId]);

  const loadTrain = async () => {
    try {
      setLoading(true);
      const data = await getTrainById(trainId);
      setTrain(data);
      setFormData({
        name: data.name || "",
        type: data.type || "",
      });
    } catch (error) {
      console.error("Failed to load train:", error);
      show("Không thể tải thông tin tàu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateTrain(trainId, formData);
      show("Cập nhật tàu thành công!");
      await loadTrain();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating train:", error);
      show("Không thể cập nhật tàu");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTrain(trainId);
      show("Xóa tàu thành công!");
      router.push("/trains");
    } catch (error) {
      console.error("Error deleting train:", error);
      show("Không thể xóa tàu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-muted-foreground">Đang tải thông tin tàu...</p>
        </div>
      </div>
    );
  }

  if (!train) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Không tìm thấy tàu</p>
          <Button onClick={() => router.push("/trains")}>
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
        title={train.name || "Thông tin tàu"}
        description={`Mã tàu: ${train.id}`}
        icon={TrainIcon}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => router.push("/trains")}>
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
        <TrainProfileCard train={train} />
        <TrainActivitySummary />
        <TrainAdditionalInfo />
      </div>

      <TrainDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingTrain={train}
        formData={formData}
        setFormData={setFormData}
        onSave={handleUpdate}
      />

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        train={train}
        onConfirm={handleDelete}
      />
    </div>
  );
}
