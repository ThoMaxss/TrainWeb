import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TicketTypeFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TicketTypeFilters({ searchQuery, setSearchQuery }: TicketTypeFiltersProps) {
  return (
    <Card className="border">
      <div className="p-6">
        <div className="w-full md:w-1/2">
          <Label htmlFor="search">Tìm kiếm</Label>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên mẫu vé..."
              className="pl-10 h-10"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
