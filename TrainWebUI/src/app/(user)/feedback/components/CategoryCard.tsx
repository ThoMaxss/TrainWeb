import React from 'react';
import { Train, Armchair, UserCheck, Clock, DollarSign, Smartphone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/utils";

interface FeedbackCategory {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export const categories: FeedbackCategory[] = [
  { id: "train", label: "Tàu & tiện nghi", icon: Train },
  { id: "seat", label: "Ghế ngồi", icon: Armchair },
  { id: "staff", label: "Nhân viên phục vụ", icon: UserCheck },
  { id: "punctuality", label: "Đúng giờ", icon: Clock },
  { id: "price", label: "Giá vé", icon: DollarSign },
  { id: "app", label: "Ứng dụng đặt vé", icon: Smartphone },
];

interface CategoryCardProps {
  selectedCategories: Set<string>;
  onToggleCategory: (categoryId: string) => void;
}

export function CategoryCard({ selectedCategories, onToggleCategory }: CategoryCardProps) {
  return (
    <Card className="border-0 bg-background shadow-md">
      <div className="p-2">
        <Label className="mb-3 block text-lg font-semibold text-foreground">
          Bạn muốn đánh giá về điểm nào? (chọn nhiều)
        </Label>

        <div className="grid gap-3 sm:grid-cols-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            const isSelected = selectedCategories.has(category.id);

            return (
              <div
                key={category.id}
                onClick={() => onToggleCategory(category.id)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border-2 p-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary hover:bg-card"
                )}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onToggleCategory(category.id)}
                  className="pointer-events-none"
                />
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
                    isSelected ? "bg-primary/10" : "bg-card"
                  )}
                >
                  <CategoryIcon
                    className={cn(
                      "h-5 w-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "flex-1 font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {category.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
