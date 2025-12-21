"use client";

import { Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DetailedRevenueRow {
  date: string;
  route: string;
  ticketsSold: number;
  revenue: number;
  refunds: number;
  netRevenue: number;
}

interface RevenueDetailTableProps {
  data: DetailedRevenueRow[];
}

export function RevenueDetailTable({ data }: RevenueDetailTableProps) {
  return (
    <Card className="border-0 bg-background/80 backdrop-blur-sm shadow-xl shadow-primary/10">
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Bảng chi tiết</h3>
            <p className="text-sm text-muted-foreground font-medium">Doanh thu chi tiết theo ngày và tuyến</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-primary hover:bg-primary/10 hover:border-primary transition-colors bg-transparent"
          >
            <Filter className="h-4 w-4" />
            Lọc
          </Button>
        </div>

        <div className="rounded-xl border border-primary/50 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/5 hover:to-primary/10">
                <TableHead className="font-bold text-primary">Ngày</TableHead>
                <TableHead className="font-bold text-primary">Tuyến</TableHead>
                <TableHead className="text-right font-bold text-primary">Vé bán</TableHead>
                <TableHead className="text-right font-bold text-primary">Doanh thu</TableHead>
                <TableHead className="text-right font-bold text-primary">Hoàn vé</TableHead>
                <TableHead className="text-right font-bold text-primary">Doanh thu ròng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-primary/10 transition-colors">
                  <TableCell className="font-semibold text-foreground">{row.date}</TableCell>
                  <TableCell className="font-medium text-foreground">{row.route}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="border-primary bg-primary/10 text-primary font-semibold">
                      {row.ticketsSold}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">
                    {row.revenue.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell className="text-right font-semibold text-warning">
                    {row.refunds.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="border-primary bg-gradient-to-r from-primary/10 to-primary/20 text-primary-foreground font-bold shadow-md shadow-primary/20">
                      {row.netRevenue.toLocaleString("vi-VN")}₫
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
