import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TrainAdditionalInfo() {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Thông tin bổ sung</CardTitle>
        <CardDescription>Thông tin vận hành và bảo trì</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Bảo trì định kỳ</p>
              <p className="text-sm text-muted-foreground">Lịch bảo trì thường xuyên</p>
            </div>
            <Badge variant="outline">Đã cập nhật</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Kiểm tra an toàn</p>
              <p className="text-sm text-muted-foreground">Kiểm tra an toàn định kỳ</p>
            </div>
            <Badge variant="outline">Đã kiểm tra</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Tình trạng hoạt động</p>
              <p className="text-sm text-muted-foreground">Trạng thái vận hành hiện tại</p>
            </div>
            <Badge variant="outline">Tốt</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
