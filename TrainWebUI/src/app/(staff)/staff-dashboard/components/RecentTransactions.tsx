"use client";

import { CheckCircle, XCircle, AlertCircle, CreditCard, Eye, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface Transaction {
  id: string;
  amount: number;
  status: "success" | "failed" | "pending";
  paymentMethod: string;
  time: string;
  customerName: string;
  trainCode: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  onNavigate: (path: string) => void;
  formatCurrency: (amount: number) => string;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return (
        <Badge className="bg-success/10 text-success hover:bg-success/10 border-success/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Thành công
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 border-destructive/20">
          <XCircle className="mr-1 h-3 w-3" />
          Thất bại
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-warning/10 text-warning hover:bg-warning/10 border-warning/20">
          <AlertCircle className="mr-1 h-3 w-3 animate-pulse" />
          Đang xử lý
        </Badge>
      );
    default:
      return null;
  }
};

export function RecentTransactions({ transactions, onNavigate, formatCurrency }: RecentTransactionsProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Giao dịch gần đây</CardTitle>
          <Button variant="ghost" size="sm" className="gap-2">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((txn) => (
            <div
              key={txn.id}
              className="rounded-lg border border-border p-2 transition-all hover:border-primary hover:bg-primary/10 cursor-pointer"
              onClick={() => onNavigate(`/transactions/${txn.id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-primary">{txn.id}</span>
                  </div>
                  <p className="font-semibold text-lg mb-1">
                    {formatCurrency(txn.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {txn.customerName} • {txn.trainCode}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(txn.status)}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-3 w-3" />
                  <span>{txn.paymentMethod}</span>
                </div>
                <span>{txn.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-3 gap-2"
          onClick={() => onNavigate("/transactions")}
        >
          <Eye className="h-4 w-4" />
          Xem tất cả giao dịch
        </Button>
      </CardContent>
    </Card>
  );
}
