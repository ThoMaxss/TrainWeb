import { Search, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface UserFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterRole: "all" | UserRole;
  onFilterChange: (role: "all" | UserRole) => void;
}

export function UserFilters({
  searchQuery,
  onSearchChange,
  filterRole,
  onFilterChange,
}: UserFiltersProps) {
  return (
    <Card className="p-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select 
          value={filterRole === "all" ? "all" : String(filterRole)} 
          onValueChange={(value: string) => onFilterChange(value === "all" ? "all" : Number(value) as UserRole)}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả vai trò</SelectItem>
            <SelectItem value={String(UserRole.Admin)}>Quản trị viên</SelectItem>
            <SelectItem value={String(UserRole.Staff)}>Nhân viên</SelectItem>
            <SelectItem value={String(UserRole.Passenger)}>Hành khách</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
