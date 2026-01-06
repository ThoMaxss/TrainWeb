"use client";

import { TripDto } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Clock, Calendar, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScheduleTableProps {
  trips: TripDto[];
  onEdit: (trip: TripDto) => void;
  onDelete: (trip: TripDto) => void;
  onViewRoute: (trip: TripDto) => void;
}

export function ScheduleTable({
  trips,
  onEdit,
  onDelete,
  onViewRoute,
}: ScheduleTableProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getStatusBadge = (trip: TripDto) => {
    // No isActive in TripDto; fallback based on seatsAvailable
    if ((trip.seatsAvailable ?? 0) <= 0) {
      return (
        <Badge variant="destructive">
          Hết ghế
        </Badge>
      );
    }
    const available = trip.seatsAvailable ?? 0;

    if (available > 0) {
      return (
        <Badge variant="secondary">
          Còn ghế
        </Badge>
      );
    }
    return null;
  };

  if (trips.length === 0) {
    return (
      <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm p-12 text-center">
        <p className="text-muted-foreground">Chưa có lịch trình nào</p>
      </Card>
    );
  }

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[100px]">Mã tàu</TableHead>
            <TableHead>Tên tàu</TableHead>
            <TableHead>Tuyến</TableHead>
            <TableHead>Khởi hành</TableHead>
            <TableHead>Đến</TableHead>
            <TableHead className="text-center">Chỗ ngồi</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trips.map((trip) => {
            const departure = trip.departure ? formatDateTime(trip.departure) : { date: "—", time: "—" };
            const arrival = trip.arrival ? formatDateTime(trip.arrival) : { date: "—", time: "—" };
            
            return (
              <TableRow key={trip.id} className="hover:bg-muted/50">
                <TableCell className="font-mono font-medium">
                  {trip.trainId}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{trip.trainName || "Không xác định"}</span>
                    <span className="text-xs text-muted-foreground">
                      {trip.trainType || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-primary" />
                        <span className="font-medium">{trip.originStationName}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-destructive" />
                        <span className="font-medium">{trip.destinationStationName}</span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{departure.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Clock className="h-3 w-3" />
                      <span>{departure.time}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span>{arrival.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                      <Clock className="h-3 w-3" />
                      <span>{arrival.time}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-lg">
          {trip.seatsAvailable ?? 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
          &nbsp;
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(trip)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewRoute(trip)}
                      title="Xem bản đồ"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(trip)}
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(trip)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
