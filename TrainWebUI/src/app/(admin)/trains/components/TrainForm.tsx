"use client";

import { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export type TrainFormValues = {
  name: string;
  code: string;
  type: string;
  manufacturer: string;
  capacity: number;
  isActive: boolean;
};

export function TrainForm({
  initial,
  onSubmit,
  onCancel,
  submitting,
  codesInUse = [],
  currentCode,
}: {
  initial: Partial<TrainFormValues>;
  onSubmit: (values: TrainFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitting?: boolean;
  codesInUse?: string[];
  currentCode?: string;
}) {
  const [values, setValues] = useState<TrainFormValues>({
    name: initial.name ?? "",
    code: initial.code ?? "",
    type: initial.type ?? "",
    manufacturer: initial.manufacturer ?? "",
    capacity: initial.capacity ?? 0,
    isActive: initial.isActive ?? true,
  });

  useEffect(() => {
    setValues({
      name: initial.name ?? "",
      code: initial.code ?? "",
      type: initial.type ?? "",
      manufacturer: initial.manufacturer ?? "",
      capacity: initial.capacity ?? 0,
      isActive: initial.isActive ?? true,
    });
  }, [initial.name, initial.code, initial.type, initial.manufacturer, initial.capacity, initial.isActive]);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!values.name.trim()) e.name = "Bắt buộc";
    if (!values.code.trim()) e.code = "Bắt buộc";
    if (!values.type.trim()) e.type = "Bắt buộc";
    if (!values.manufacturer.trim()) e.manufacturer = "Bắt buộc";
    if (!Number.isFinite(values.capacity) || values.capacity <= 0) e.capacity = "> 0";
    const dup = values.code.trim() && values.code.trim() !== (currentCode ?? "") && codesInUse.includes(values.code.trim());
    if (dup) e.code = "Mã tàu đã tồn tại";
    return e;
  }, [values, codesInUse, currentCode]);

  const handleChange = (name: keyof TrainFormValues, val: string | number | boolean) => {
    setValues((prev) => ({ ...prev, [name]: val as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    await onSubmit(values);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="name">Tên tàu</Label>
        <Input id="name" value={values.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="VD: SE1" />
        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="code">Mã tàu</Label>
        <Input id="code" value={values.code} onChange={(e) => handleChange("code", e.target.value)} placeholder="VD: SE1" />
        {errors.code && <p className="text-destructive text-sm mt-1">{errors.code}</p>}
      </div>

      <div>
        <Label htmlFor="type">Loại tàu</Label>
        <Input id="type" value={values.type} onChange={(e) => handleChange("type", e.target.value)} placeholder="Ghế cứng, ghế mềm, giường nằm..." />
        {errors.type && <p className="text-destructive text-sm mt-1">{errors.type}</p>}
      </div>

      <div>
        <Label htmlFor="manufacturer">Nhà sản xuất</Label>
        <Input id="manufacturer" value={values.manufacturer} onChange={(e) => handleChange("manufacturer", e.target.value)} placeholder="VD: Hitachi" />
        {errors.manufacturer && <p className="text-destructive text-sm mt-1">{errors.manufacturer}</p>}
      </div>

      <div>
        <Label htmlFor="capacity">Sức chứa</Label>
        <Input id="capacity" type="number" value={values.capacity} onChange={(e) => handleChange("capacity", Number(e.target.value))} placeholder="VD: 600" />
        {errors.capacity && <p className="text-destructive text-sm mt-1">{errors.capacity}</p>}
      </div>

      <div className="flex items-center justify-between pt-1">
        <Label htmlFor="isActive">Đang hoạt động</Label>
        <Switch id="isActive" checked={values.isActive} onCheckedChange={(v) => handleChange("isActive", v)} />
      </div>

      <div className="flex justify-end gap-2 pt-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Hủy
          </Button>
        )}
        <Button type="submit" disabled={submitting || Object.keys(errors).length > 0}>
          Lưu
        </Button>
      </div>
    </form>
  );
}
