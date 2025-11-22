import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarDays, TrendingUp, Ticket, RefreshCcw, Download, BarChart3 } from "lucide-react";

export default function DailyReportsPage() {
  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="p-2 lg:p-2">
        <PageHeader
          title="Báo cáo hàng ngày"
          description="Tổng quan doanh thu, vé bán và hoàn vé trong ngày"
          icon={BarChart3}
          stats={[
            { icon: CalendarDays, label: "Ngày", value: new Date().toLocaleDateString("vi-VN") },
            { icon: Ticket, label: "Vé bán", value: 0 },
            { icon: RefreshCcw, label: "Hoàn vé", value: 0 },
          ]}
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
          }
        />
      </div>

      <div className="flex-1 overflow-y-auto p-2 lg:p-2 space-y-3">
        {/* KPI row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 shadow-xl">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-primary-foreground">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-0">0%</Badge>
              </div>
              <h3 className="text-xl font-bold text-emerald-900">0₫</h3>
              <p className="text-sm font-medium text-success">Doanh thu hôm nay</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 shadow-xl">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-primary-foreground">
                  <Ticket className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-0">0%</Badge>
              </div>
              <h3 className="text-xl font-bold text-primary">0</h3>
              <p className="text-sm font-medium text-primary">Vé đã bán</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-primary-foreground">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-error/10 text-error border-0">0%</Badge>
              </div>
              <h3 className="text-xl font-bold text-amber-900">0₫</h3>
              <p className="text-sm font-medium text-amber-700">Hoàn vé</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 shadow-xl">
            <div className="p-2">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-700 text-primary-foreground">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground">{new Date().toLocaleDateString("vi-VN")}</h3>
              <p className="text-sm font-medium text-muted-foreground">Ngày làm việc</p>
            </div>
          </Card>
        </div>

        {/* Detail table placeholder */}
        <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl">
          <div className="p-2">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground">Chi tiết theo tuyến</h3>
              <p className="text-sm text-muted-foreground">Tổng hợp trong ngày</p>
            </div>
            <div className="rounded-xl border border-primary/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableHead className="font-bold text-primary">Tuyến</TableHead>
                    <TableHead className="text-right font-bold text-primary">Vé bán</TableHead>
                    <TableHead className="text-right font-bold text-primary">Doanh thu</TableHead>
                    <TableHead className="text-right font-bold text-primary">Hoàn vé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu trong ngày.
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <p className="font-medium">Hiển thị 0 kết quả</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Tải CSV
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}