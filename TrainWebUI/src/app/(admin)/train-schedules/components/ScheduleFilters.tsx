import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface ScheduleFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStation: string;
  setFilterStation: (station: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  uniqueStations: string[];
}

export function ScheduleFilters({
  searchQuery,
  setSearchQuery,
  filterStation,
  setFilterStation,
  filterStatus,
  setFilterStatus,
  uniqueStations,
}: ScheduleFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm theo tên tàu, ga..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Select value={filterStation} onValueChange={setFilterStation}>
        <SelectTrigger>
          <SelectValue placeholder="Lọc theo ga" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả ga</SelectItem>
          {uniqueStations.map((station, index) => (
            <SelectItem key={`station-${station}-${index}`} value={station || ""}>
              {station}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger>
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="active">Còn chỗ</SelectItem>
          <SelectItem value="inactive">Hết chỗ</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
