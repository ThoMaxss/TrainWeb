"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { getAllBookings } from '@/lib/api/booking';
import { BookingDto, BookingStatus } from '@/types';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { BadgeStatus } from '@/components/shared/BadgeStatus';

function statusToBadge(status: BookingStatus) {
  switch (status) {
    case BookingStatus.PAID:
      return { status: 'success' as const, label: 'Đã thanh toán' };
    case BookingStatus.RESERVED:
      return { status: 'info' as const, label: 'Đã đặt chỗ' };
    case BookingStatus.CANCELLED:
      return { status: 'cancelled' as const, label: 'Đã hủy' };
    default:
      return { status: 'info' as const, label: String(status) };
  }
}

export default function TicketTemplatesPage() {
  const [items, setItems] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllBookings();
        setItems(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter(b => {
      const code = b.bookingCode?.toLowerCase() || '';
      const user = b.user?.name?.toLowerCase?.() || b.user?.email?.toLowerCase?.() || '';
      const route = `${b.trip?.departureStation} - ${b.trip?.arrivalStation}`.toLowerCase();
      return code.includes(term) || user.includes(term) || route.includes(term);
    });
  }, [items, q]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Quản lý vé</h1>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-muted-foreground">Danh sách vé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo mã vé, khách hàng, tuyến" />
            </div>
          </div>

          {loading ? (
            <p className="text-muted-foreground">Đang tải...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground">Không có vé</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="py-2">Mã vé</th>
                    <th className="py-2">Khách hàng</th>
                    <th className="py-2">Tuyến</th>
                    <th className="py-2">Thời gian</th>
                    <th className="py-2">Số ghế</th>
                    <th className="py-2">Tổng tiền</th>
                    <th className="py-2">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => {
                    const d = b.trip?.departureTime ? new Date(b.trip.departureTime) : null;
                    const a = b.trip?.arrivalTime ? new Date(b.trip.arrivalTime) : null;
                    const badge = statusToBadge(b.status);
                    return (
                      <tr key={b.id} className="border-t border-border">
                        <td className="py-2 font-medium">{b.bookingCode}</td>
                        <td className="py-2">
                          <div className="flex flex-col">
                            <span className="text-foreground">{b.user?.name || '—'}</span>
                            <span className="text-muted-foreground">{b.user?.email || '—'}</span>
                          </div>
                        </td>
                        <td className="py-2">
                          {b.trip ? (
                            <div className="flex flex-col">
                              <span className="text-foreground">{b.trip.departureStation} → {b.trip.arrivalStation}</span>
                              <span className="text-muted-foreground">Tàu: {b.trip.train?.name || '—'}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {d ? format(d, "HH:mm dd/MM/yyyy", { locale: vi }) : '—'}
                          {a ? ` • ${format(a, "HH:mm dd/MM", { locale: vi })}` : ''}
                        </td>
                        <td className="py-2">{b.seats?.length ?? 0}</td>
                        <td className="py-2">{b.totalAmount?.toLocaleString()}₫</td>
                        <td className="py-2">
                          <BadgeStatus status={badge.status} label={badge.label} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}