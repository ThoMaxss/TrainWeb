import { Eye, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrainDto } from "@/types";

interface TrainTableProps {
  trains: TrainDto[];
  onView: (train: TrainDto) => void;
  onEdit: (train: TrainDto) => void;
  onDelete: (train: TrainDto) => void;
}

export function TrainTable({ trains, onView, onEdit, onDelete }: TrainTableProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <div className="p-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tàu</TableHead>
                <TableHead>Loại tàu</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trains.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    Không tìm thấy tàu
                  </TableCell>
                </TableRow>
              ) : (
                trains.map((train) => (
                  <TableRow key={train.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{train.name}</TableCell>
                    <TableCell>{train.type}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(train)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(train)}
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(train)}
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
