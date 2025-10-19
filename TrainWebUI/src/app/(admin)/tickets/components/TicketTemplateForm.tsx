"use client";
import React, { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TicketTemplateDto } from '@/types';

type Props = {
  initial?: Partial<TicketTemplateDto>;
  onSubmit: (data: Omit<TicketTemplateDto, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void> | void;
  submitting?: boolean;
  codesInUse?: string[]; // to check duplicate code
};

export default function TicketTemplateForm({ initial, onSubmit, submitting, codesInUse = [] }: Props) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    code: initial?.code ?? '',
    defaultPrice: initial?.defaultPrice ?? 0,
    description: initial?.description ?? '',
    isActive: initial?.isActive ?? true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isDuplicateCode = useMemo(() => {
    const code = form.code.trim().toUpperCase();
    const current = initial?.code?.toUpperCase();
    if (!code) return false;
    if (current && code === current) return false; // unchanged
    return codesInUse.map(c => c.toUpperCase()).includes(code);
  }, [form.code, codesInUse, initial?.code]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập tên mẫu vé';
    if (!form.code.trim()) e.code = 'Vui lòng nhập mã';
    if (isDuplicateCode) e.code = 'Mã đã tồn tại';
    if (form.defaultPrice <= 0) e.defaultPrice = 'Giá phải lớn hơn 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      name: form.name.trim(),
      code: form.code.trim(),
      defaultPrice: Number(form.defaultPrice),
      description: form.description?.trim() || '',
      isActive: form.isActive,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Tên mẫu vé</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="VD: Vé thường, Vé VIP"
          />
          {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="code">Mã</Label>
          <Input
            id="code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="VD: ECON, VIP"
          />
          {errors.code && <p className="text-destructive text-sm mt-1">{errors.code}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="defaultPrice">Giá mặc định (VND)</Label>
          <Input
            id="defaultPrice"
            type="number"
            min={0}
            value={form.defaultPrice}
            onChange={(e) => setForm((f) => ({ ...f, defaultPrice: Number(e.target.value) }))}
            placeholder="Nhập giá"
          />
          {errors.defaultPrice && <p className="text-destructive text-sm mt-1">{errors.defaultPrice}</p>}
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch
            id="isActive"
            checked={form.isActive}
            onCheckedChange={(v) => setForm((f) => ({ ...f, isActive: v }))}
          />
          <Label htmlFor="isActive">Kích hoạt</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Mô tả</Label>
        <textarea
          id="description"
          className="w-full min-h-24 px-3 py-2 rounded-md border bg-background text-foreground shadow-sm"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Ghi chú ngắn về mẫu vé"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Đang lưu...' : 'Lưu mẫu vé'}
        </Button>
      </div>
    </form>
  );
}
