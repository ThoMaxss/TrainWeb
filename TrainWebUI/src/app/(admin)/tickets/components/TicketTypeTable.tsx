import { Eye, Edit, Trash2, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TicketTypeDto } from "@/types";

interface TicketTypeTableProps {
  ticketTypes: TicketTypeDto[];
  onEdit: (ticketType: TicketTypeDto) => void;
  onDelete: (ticketType: TicketTypeDto) => void;
}

export function TicketTypeTable({ ticketTypes, onEdit, onDelete }: TicketTypeTableProps) {
  const formatDiscount = (discount?: number | null) => {
    if (discount === undefined || discount === null) return "0%";
    return `${(discount)}%`;
  };

  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên mẫu vé</TableHead>
                <TableHead>Giảm giá</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ticketTypes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Không tìm thấy mẫu vé
                  </TableCell>
                </TableRow>
              ) : (
                ticketTypes.map((ticketType) => (
                  <TableRow key={ticketType.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{ticketType.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="gap-1">
                        <Percent className="h-3 w-3" />
                        {formatDiscount(ticketType.discountPercent)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(ticketType)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(ticketType)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
