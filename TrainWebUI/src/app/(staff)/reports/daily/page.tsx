import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { CalendarDays, TrendingUp, Ticket, RefreshCcw, Download, BarChart3 } from "lucide-react";
import { getDailyReportMock } from "@/lib/mock/reports";

export default function DailyReportsPage() {
  const report = getDailyReportMock(new Date());
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
        <PageHeader
          title="Báo cáo hàng ngày"
          description="Tổng quan doanh thu, vé bán và hoàn vé trong ngày"
          icon={BarChart3}
          stats={[
            { icon: CalendarDays, label: "Ngày", value: report.date },
            { icon: Ticket, label: "Vé bán", value: report.ticketsSold },
            { icon: RefreshCcw, label: "Hoàn vé", value: report.refundAmount.toLocaleString("vi-VN") + "₫" },
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
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 space-y-6">
        {/* KPI row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-success/5 via-success/10 to-success/20 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success text-primary-foreground">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-0">{report.revenueChangePct}%</Badge>
              </div>
              <h3 className="text-xl font-bold text-success">{report.revenue.toLocaleString("vi-VN")}₫</h3>
              <p className="text-sm font-medium text-success">Doanh thu hôm nay</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-primary/5 via-primary/10 to-secondary/5 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Ticket className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-0">{report.ticketsChangePct}%</Badge>
              </div>
              <h3 className="text-xl font-bold text-primary">{report.ticketsSold}</h3>
              <p className="text-sm font-medium text-primary">Vé đã bán</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-warning/5 via-warning/10 to-warning/20 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning text-primary-foreground">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-0">{report.refundChangePct}%</Badge>
              </div>
              <h3 className="text-xl font-bold text-warning">{report.refundAmount.toLocaleString("vi-VN")}₫</h3>
              <p className="text-sm font-medium text-warning">Hoàn vé</p>
            </div>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-muted via-primary/10 to-primary/20 shadow-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-primary-foreground">
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
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-lg font-bold text-foreground">Chi tiết theo tuyến</h3>
              <p className="text-sm text-muted-foreground">Tổng hợp trong ngày</p>
            </div>
            <div className="rounded-xl border border-primary/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-primary/5 to-primary/10">
                    <TableHead className="font-bold text-primary">Tuyến</TableHead>
                    <TableHead className="text-right font-bold text-primary">Vé bán</TableHead>
                    <TableHead className="text-right font-bold text-primary">Doanh thu</TableHead>
                    <TableHead className="text-right font-bold text-primary">Hoàn vé</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.routes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Chưa có dữ liệu trong ngày.
                      </TableCell>
                    </TableRow>
                  ) : (
                    report.routes.map((r) => (
                      <TableRow key={r.route}>
                        <TableCell className="font-medium">{r.route}</TableCell>
                        <TableCell className="text-right">{r.tickets}</TableCell>
                        <TableCell className="text-right">{r.revenue.toLocaleString("vi-VN")}₫</TableCell>
                        <TableCell className="text-right">{r.refunds.toLocaleString("vi-VN")}₫</TableCell>
                      </TableRow>
                    ))
                  )}
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
    </div>
  );
}