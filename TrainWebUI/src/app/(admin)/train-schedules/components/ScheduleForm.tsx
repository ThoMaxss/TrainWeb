"use client";

import { useState, useEffect } from "react";
import { TripDto, TrainDto } from "@/types";
import { getAllTrains } from "@/lib/api/train";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Train as TrainIcon } from "lucide-react";

interface ScheduleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: TripDto | null;
  onSave: (tripData: Partial<TripDto>) => Promise<void>;
  mode: "create" | "edit";
}

// Danh sách ga
const STATIONS = [
  "Hà Nội",
  "Sài Gòn",
  "Đà Nẵng",
  "Huế",
  "Nha Trang",
  "Vinh",
  "Lào Cai",
  "Hải Phòng",
  "Quy Nhơn",
];

export function ScheduleForm({
  open,
  onOpenChange,
  trip,
  onSave,
  mode,
}: ScheduleFormProps) {
  const [trains, setTrains] = useState<TrainDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    trainId: "",
    originStation: "",
    destinationStation: "",
    departure: "",
    arrival: "",
    // fields not in TripDto are removed
  });

  useEffect(() => {
    loadTrains();
  }, []);

  useEffect(() => {
    if (trip && mode === "edit") {
      setFormData({
        trainId: trip.train?.id || "",
        originStation: trip.originStation || "",
        destinationStation: trip.destinationStation || "",
        departure: trip.departure ? new Date(trip.departure).toISOString().slice(0, 16) : "",
        arrival: trip.arrival ? new Date(trip.arrival).toISOString().slice(0, 16) : "",
      });
    } else if (mode === "create") {
      // Reset form for create mode
      setFormData({
        trainId: "",
        originStation: "",
        destinationStation: "",
        departure: "",
        arrival: "",
      });
    }
  }, [trip, mode, open]);

  const loadTrains = async () => {
    try {
      const data = await getAllTrains();
      // TrainDto only has id, name, type. Keep all trains.
      setTrains(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load trains:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave({
        train: formData.trainId ? { id: formData.trainId } : undefined,
        originStation: formData.originStation,
        destinationStation: formData.destinationStation,
        departure: formData.departure ? new Date(formData.departure).toISOString() : undefined,
        arrival: formData.arrival ? new Date(formData.arrival).toISOString() : undefined,
      } as Partial<TripDto>);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainChange = (trainId: string) => {
    setFormData({
      ...formData,
      trainId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo lịch trình mới" : "Chỉnh sửa lịch trình"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Điền thông tin để tạo lịch trình tàu mới"
              : "Cập nhật thông tin lịch trình tàu"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Train Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TrainIcon className="h-4 w-4 text-primary" />
              Tàu <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.trainId}
              onValueChange={handleTrainChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tàu" />
              </SelectTrigger>
              <SelectContent>
                {trains.map((train, idx) => (
                  <SelectItem key={train.id ?? String(idx)} value={train.id ?? ""}>
                    {train.name} ({train.type || 'N/A'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Ga đi <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.originStation}
                onValueChange={(value) =>
                  setFormData({ ...formData, originStation: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ga đi" />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                Ga đến <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.destinationStation}
                onValueChange={(value) =>
                  setFormData({ ...formData, destinationStation: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ga đến" />
                </SelectTrigger>
                <SelectContent>
                  {STATIONS.map((station) => (
                    <SelectItem key={station} value={station}>
                      {station}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Thời gian khởi hành <span className="text-destructive">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={formData.departure}
                onChange={(e) =>
                  setFormData({ ...formData, departure: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-destructive" />
                Thời gian đến <span className="text-destructive">*</span>
              </Label>
              <Input
                type="datetime-local"
                value={formData.arrival}
                onChange={(e) =>
                  setFormData({ ...formData, arrival: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Fields removed: basePrice, totalSeats, availableSeats, isActive (not in TripDto) */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : mode === "create" ? "Tạo mới" : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
