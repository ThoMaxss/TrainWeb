"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeStatus } from '@/components/shared/BadgeStatus';
import { useToast } from '@/components/ui/toast';
import { getAllTickets, updateTicket } from '@/lib/api/ticket';
import { getAllBookings } from '@/lib/api/booking';
import { BookingDto, TicketDto, TicketStatus } from '@/types';

function ticketStatusBadge(status: TicketStatus) {
  switch (status) {
    case TicketStatus.ACTIVE:
      return { status: 'success' as const, label: 'Đang hoạt động' };
    case TicketStatus.USED:
      return { status: 'completed' as const, label: 'Đã sử dụng' };
    case TicketStatus.CANCELLED:
      return { status: 'cancelled' as const, label: 'Đã hủy' };
    default:
      return { status: 'info' as const, label: String(status) };
  }
}

export default function TicketsIndexPage() {
  const { show } = useToast();
  const [tickets, setTickets] = useState<TicketDto[]>([]);
  const [bookings, setBookings] = useState<Record<string, BookingDto>>({});
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');

  // Edit dialog state
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<TicketDto | null>(null);
  const [qr, setQr] = useState('');
  const [status, setStatus] = useState<TicketStatus>(TicketStatus.ACTIVE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [ts, bs] = await Promise.all([getAllTickets(), getAllBookings()]);
        setTickets(Array.isArray(ts) ? ts : []);
        const bMap: Record<string, BookingDto> = {};
        (Array.isArray(bs) ? bs : []).forEach(b => { bMap[b.id] = b; });
        setBookings(bMap);
      } catch (e) {
        console.error(e);
        show('Không thể tải danh sách vé', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [show]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return tickets.filter(t => {
      const matchStatus = statusFilter === 'all' ? true : t.status === statusFilter;
      if (!term) return matchStatus;
      const booking = bookings[t.bookingId];
      const bookingCode = booking?.bookingCode?.toLowerCase?.() || '';
      const route = booking?.trip ? `${booking.trip.departureStation} - ${booking.trip.arrivalStation}`.toLowerCase() : '';
      return matchStatus && (
        t.id.toLowerCase().includes(term) ||
        t.bookingId.toLowerCase().includes(term) ||
        t.qrCode?.toLowerCase?.().includes(term) ||
        bookingCode.includes(term) ||
        route.includes(term)
      );
    });
  }, [tickets, bookings, q, statusFilter]);

  function openEdit(ticket: TicketDto) {
    setEditing(ticket);
    setQr(ticket.qrCode || '');
    setStatus(ticket.status);
    setOpen(true);
  }

  async function handleSave() {
    if (!editing) return;
    try {
      setSubmitting(true);
      const updated = await updateTicket(editing.id, { id: editing.id, qrCode: qr, status });
      setTickets(prev => prev.map(t => (t.id === editing.id ? updated : t)));
      setOpen(false);
      setEditing(null);
      show('Đã cập nhật vé');
    } catch (e) {
      console.error(e);
      show('Không thể cập nhật vé', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Quản lý vé</h1>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base text-muted-foreground">Danh sách vé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Tìm kiếm</Label>
              <Input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo mã vé, booking, QR, tuyến" />
            </div>
            <div>
              <Label>Trạng thái</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Tất cả" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={TicketStatus.ACTIVE}>Đang hoạt động</SelectItem>
                  <SelectItem value={TicketStatus.USED}>Đã sử dụng</SelectItem>
                  <SelectItem value={TicketStatus.CANCELLED}>Đã hủy</SelectItem>
                </SelectContent>
              </Select>
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
                    <th className="py-2">Booking</th>
                    <th className="py-2">Tuyến</th>
                    <th className="py-2">QR</th>
                    <th className="py-2">Trạng thái</th>
                    <th className="py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(t => {
                    const b = bookings[t.bookingId];
                    const badge = ticketStatusBadge(t.status);
                    return (
                      <tr key={t.id} className="border-t border-border">
                        <td className="py-2 font-medium">{t.id}</td>
                        <td className="py-2">
                          <div className="flex flex-col">
                            <span className="text-foreground">{b?.bookingCode || '—'}</span>
                            <span className="text-muted-foreground">{t.bookingId}</span>
                          </div>
                        </td>
                        <td className="py-2">
                          {b?.trip ? (
                            <div className="flex flex-col">
                              <span className="text-foreground">{b.trip.departureStation} → {b.trip.arrivalStation}</span>
                              <span className="text-muted-foreground">Tàu: {b.trip.train?.name || '—'}</span>
                            </div>
                          ) : '—'}
                        </td>
                        <td className="py-2 truncate max-w-[240px]" title={t.qrCode}>{t.qrCode}</td>
                        <td className="py-2"><BadgeStatus status={badge.status} label={badge.label} /></td>
                        <td className="py-2 text-right">
                          <Dialog open={open && editing?.id === t.id} onOpenChange={(v) => { if (!v) { setOpen(false); setEditing(null); } }}>
                            <DialogTrigger asChild>
                              <Button variant="secondary" size="sm" onClick={() => openEdit(t)}>Sửa</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-lg">
                              <DialogHeader>
                                <DialogTitle>Sửa vé</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="qr">QR Code</Label>
                                  <Input id="qr" value={qr} onChange={(e) => setQr(e.target.value)} placeholder="Nhập QR code" />
                                </div>
                                <div>
                                  <Label>Trạng thái</Label>
                                  <Select value={status} onValueChange={(v) => setStatus(v as TicketStatus)}>
                                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={TicketStatus.ACTIVE}>Đang hoạt động</SelectItem>
                                      <SelectItem value={TicketStatus.USED}>Đã sử dụng</SelectItem>
                                      <SelectItem value={TicketStatus.CANCELLED}>Đã hủy</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="secondary" onClick={() => { setOpen(false); setEditing(null); }}>Hủy</Button>
                                  <Button onClick={handleSave} disabled={submitting}>{submitting ? 'Đang lưu...' : 'Lưu'}</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
