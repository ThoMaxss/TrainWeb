"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Calendar, Clock, Train, MapPin } from "lucide-react";
import { getAllTrains, createTrain, updateTrain } from "@/lib/api/train";
import { getAllTrips } from "@/lib/api/trip";
import { TrainDto, TripDto } from "@/types";
import { TrainForm, TrainFormValues } from "./components/TrainForm";
import { useToast } from "@/components/ui/toast";

export default function AdminTrainsPage() {
  const { show } = useToast();
  const [trains, setTrains] = useState<TrainDto[]>([]);
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainDialogOpen, setTrainDialogOpen] = useState(false);
  const [editingTrain, setEditingTrain] = useState<TrainDto | null>(null);

  const [trainForm, setTrainForm] = useState<TrainFormValues>({
    name: "",
    code: "",
    type: "",
    manufacturer: "",
    capacity: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    show(message, type);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [trainsData, tripsData] = await Promise.all([
        getAllTrains(),
        getAllTrips(),
      ]);
      setTrains(trainsData);
      setTrips(tripsData);
    } catch (error) {
      console.error("Failed to load data:", error);
      showToast("Không thể tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrain = async () => {
    try {
      setSaving(true);
      if (editingTrain) {
        await updateTrain(editingTrain.id!, trainForm as unknown as TrainDto);
        showToast("Đã cập nhật tàu!");
      } else {
        await createTrain(trainForm as unknown as TrainDto);
        showToast("Đã thêm tàu mới!");
      }
      
      await loadData();
      setTrainDialogOpen(false);
      setEditingTrain(null);
  setTrainForm({ name: "", code: "", type: "", manufacturer: "", capacity: 0, isActive: true });
    } catch (error) {
      console.error("Error saving train:", error);
      showToast("Không thể lưu thông tin tàu", "error");
    } finally {
      setSaving(false);
    }
  };

  const openEditDialog = (train: TrainDto) => {
    setEditingTrain(train);
    setTrainForm({
      name: train.name || "",
      code: train.code || "",
      type: train.type || "",
      manufacturer: train.manufacturer || "",
      capacity: train.capacity ?? 0,
      isActive: train.isActive ?? true,
    });
    setTrainDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTrain(null);
  setTrainForm({ name: "", code: "", type: "", manufacturer: "", capacity: 0, isActive: true });
    setTrainDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-muted-foreground">Đang tải dữ liệu...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Quản lý tàu hỏa
            </h1>
            <p className="text-muted-foreground mt-2">
              Quản lý thông tin tàu và lịch trình
            </p>
          </div>

          <Dialog open={trainDialogOpen} onOpenChange={setTrainDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-primary hover:bg-hover-primary text-primary-foreground shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm tàu mới
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingTrain ? "Chỉnh sửa tàu" : "Thêm tàu mới"}
                </DialogTitle>
                <DialogDescription>
                  {editingTrain ? "Cập nhật thông tin tàu" : "Thêm tàu mới vào hệ thống"}
                </DialogDescription>
              </DialogHeader>

              <TrainForm
                initial={trainForm}
                onCancel={() => setTrainDialogOpen(false)}
                submitting={saving}
                codesInUse={trains.map(t => t.code).filter(Boolean)}
                currentCode={editingTrain?.code}
                onSubmit={async (vals) => {
                  setTrainForm(vals);
                  await handleSaveTrain();
                }}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng số tàu
              </CardTitle>
              <Train className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{trains.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Chuyến đi
              </CardTitle>
              <MapPin className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{trips.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Hoạt động
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {trips.filter(trip => new Date(trip.departureTime || "") > new Date()).length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Chuyến sắp tới</p>
            </CardContent>
          </Card>
        </div>

  <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Train className="h-5 w-5 text-primary" />
              Danh sách tàu hỏa
            </CardTitle>
            <CardDescription>
              Quản lý thông tin các tàu trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên tàu</TableHead>
                    <TableHead>Loại tàu</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trains.map((train) => (
                    <TableRow key={train.id}>
                      <TableCell className="font-medium">
                        <Link href={`/trains/${train.id}`} className="text-primary hover:underline">
                          {train.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{train.type || "N/A"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{train.id}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(train)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Link href={`/trains/${train.id}`} className="ml-1 inline-flex">
                          <Button variant="ghost" size="sm">Xem</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

  <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-success" />
              Lịch trình chuyến đi
            </CardTitle>
            <CardDescription>
              Xem thông tin các chuyến đi đã lên lịch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tàu</TableHead>
                    <TableHead>Tuyến đường</TableHead>
                    <TableHead>Khởi hành</TableHead>
                    <TableHead>Đến</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trips.map((trip) => {
                    const isUpcoming = new Date(trip.departureTime || "") > new Date();
                    const trainName = trip.train?.name || "N/A";
                    
                    return (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trainName}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{trip.departureStation}</span>
                            <span className="text-muted-foreground"></span>
                            <span>{trip.arrivalStation}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {trip.departureTime ? new Date(trip.departureTime).toLocaleString("vi-VN") : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {trip.arrivalTime ? new Date(trip.arrivalTime).toLocaleString("vi-VN") : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={isUpcoming ? "default" : "secondary"}>
                            {isUpcoming ? "Sắp tới" : "Đã qua"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
