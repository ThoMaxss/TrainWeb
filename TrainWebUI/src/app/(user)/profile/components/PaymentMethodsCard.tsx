import { CreditCard, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "momo" | "vnpay";
  label: string;
  lastFour?: string;
  linkedInfo?: string;
  icon: any;
}

interface PaymentMethodsCardProps {
  paymentMethods: PaymentMethod[];
  onAddPayment: () => void;
  onDeletePayment: (id: string) => void;
}

export function PaymentMethodsCard({ paymentMethods, onAddPayment, onDeletePayment }: PaymentMethodsCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <CreditCard className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-foreground">Phương thức thanh toán</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddPayment}
            className="gap-2 border-success/30 hover:bg-success/10"
          >
            <Plus className="h-4 w-4" />
            Thêm
          </Button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="group relative flex items-center gap-3 rounded-lg border-2 border-border p-2 transition-all hover:border-primary hover:bg-primary/10"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-card">
                <method.icon className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-muted-foreground">
                  {method.lastFour ? `**** **** **** ${method.lastFour}` : `Liên kết ${method.linkedInfo}`}
                </p>
              </div>
              <button
                onClick={() => onDeletePayment(method.id)}
                className="absolute right-4 flex h-8 w-8 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </button>
              <Badge variant="outline" className="border-success/30 text-success">
                Đã xác minh
              </Badge>
            </div>
          ))}

          {paymentMethods.length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-border p-2 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Chưa có phương thức thanh toán nào
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
