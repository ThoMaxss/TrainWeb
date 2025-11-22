import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TrainFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TrainFilters({ searchQuery, setSearchQuery }: TrainFiltersProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="w-full md:w-1/2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên hoặc loại tàu..."
              className="pl-10 h-10"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
