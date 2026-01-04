"use client";

import { useState } from "react";
import { Search, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onFilterChange: (filters: {
    originStation: string;
    destinationStation: string;
    date: string;
    timeRange: string;
  }) => void;
}

// Danh sách ga phổ biến (có thể fetch từ API sau)
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

const TIME_RANGES = [
  { value: "all", label: "Cả ngày" },
  { value: "morning", label: "Sáng (00:00 - 12:00)" },
  { value: "afternoon", label: "Chiều (12:00 - 18:00)" },
  { value: "evening", label: "Tối (18:00 - 24:00)" },
];

export function FilterBar({ onFilterChange }: FilterBarProps) {
  const [filters, setFilters] = useState({
    originStation: "",
    destinationStation: "",
    date: new Date().toISOString().split("T")[0],
    timeRange: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
  };

  return (
    <Card className="border sticky top-4 z-[25]">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Departure Station */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-primary" />
              Ga đi
            </Label>
            <Select
              value={filters.originStation}
              onValueChange={(value) => handleFilterChange("originStation", value)}
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

          {/* Arrival Station */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-destructive" />
              Ga đến
            </Label>
            <Select
              value={filters.destinationStation}
              onValueChange={(value) => handleFilterChange("destinationStation", value)}
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

          {/* Date */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4" />
              Ngày đi
            </Label>
            <Input
              type="date"
              value={filters.date}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          {/* Time Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4 text-warning" />
              Khung giờ
            </Label>
            <Select
              value={filters.timeRange}
              onValueChange={(value) => handleFilterChange("timeRange", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_RANGES.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search Button */}
          <div className="space-y-2">
            <Label className="text-transparent">.</Label>
            <Button 
              onClick={handleApplyFilter} 
              className="w-full gap-2"
              size="lg"
            >
              <Search className="h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
