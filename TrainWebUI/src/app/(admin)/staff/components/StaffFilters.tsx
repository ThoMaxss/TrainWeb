import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

interface StaffFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  roleFilter: "all" | UserRole;
  setRoleFilter: (filter: "all" | UserRole) => void;
}

export function StaffFilters({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
}: StaffFiltersProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="search">Tìm kiếm</Label>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm theo tên hoặc email..."
                className="pl-10 h-10"
              />
            </div>
          </div>
          <div>
            <Label>Lọc theo vai trò</Label>
            <Select
              value={roleFilter === "all" ? "all" : String(roleFilter)}
              onValueChange={(v) =>
                setRoleFilter(v === "all" ? "all" : (Number(v) as UserRole))
              }
            >
              <SelectTrigger className="w-full mt-2 h-10">
                <SelectValue placeholder="Tất cả vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value={String(UserRole.Admin)}>Quản trị viên</SelectItem>
                <SelectItem value={String(UserRole.Staff)}>Quản lý</SelectItem>
                <SelectItem value={String(UserRole.Passenger)}>Hành khách</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
