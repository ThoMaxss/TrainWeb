import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/types";

interface AdditionalInfoCardProps {
  userRole?: UserRole;
}

export function AdditionalInfoCard({ userRole }: AdditionalInfoCardProps) {
  return (
    <Card className="bg-background/70 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Thông tin bổ sung</CardTitle>
        <CardDescription>Quyền hạn và cài đặt người dùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Thông báo Email</p>
              <p className="text-sm text-muted-foreground">Nhận cập nhật qua email</p>
            </div>
            <Badge variant="outline">Bật</Badge>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium">Xác thực hai yếu tố</p>
              <p className="text-sm text-muted-foreground">Lớp bảo mật bổ sung</p>
            </div>
            <Badge variant="outline">Tắt</Badge>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Truy cập API</p>
              <p className="text-sm text-muted-foreground">Quyền truy cập API</p>
            </div>
            <Badge variant="outline">
              {userRole === UserRole.Admin ? "Bật" : "Tắt"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
