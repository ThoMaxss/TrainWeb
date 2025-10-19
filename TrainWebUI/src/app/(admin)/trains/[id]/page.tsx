"use client";
import { getTrainById, updateTrain, getAllTrains } from '@/lib/api/train';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TrainForm, TrainFormValues } from '../components/TrainForm';

export default function TrainDetailPage({ params }: { params: { id: string } }) {
  const [train, setTrain] = useState<any>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrainById(params.id)
      .then((data) => {
        setTrain(data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Không tìm thấy thông tin tàu');
        setLoading(false);
      });
    getAllTrains().then(list => setCodes(list.map(t => t.code).filter(Boolean)));
  }, [params.id]);

  if (loading) return <div>Đang tải thông tin tàu...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-lg mx-auto bg-card rounded-xl p-6 shadow-sm space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-foreground">Chi tiết tàu: {train.name} ({train.code})</h1>
        <div className="space-y-2">
          <div><strong>Loại tàu:</strong> {train.type}</div>
          <div><strong>Nhà sản xuất:</strong> {train.manufacturer}</div>
          <div><strong>Sức chứa:</strong> {train.capacity} hành khách</div>
          <div><strong>Trạng thái:</strong> {train.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}</div>
          <div><strong>Ngày tạo:</strong> {new Date(train.createdAt).toLocaleString('vi-VN')}</div>
          <div><strong>Cập nhật:</strong> {new Date(train.updatedAt).toLocaleString('vi-VN')}</div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>Chỉnh sửa</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tàu</DialogTitle>
          </DialogHeader>
          <TrainForm
            initial={train}
            codesInUse={codes}
            currentCode={train.code}
            submitting={saving}
            onCancel={() => setOpen(false)}
            onSubmit={async (vals: TrainFormValues) => {
              setSaving(true);
              try {
                const updated = await updateTrain(train.id, vals as any);
                setTrain(updated);
                setOpen(false);
              } finally {
                setSaving(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}