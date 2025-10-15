"use client";
import { useEffect, useState } from 'react';
import { createTrain, getAllTrains } from '@/lib/api/train';
import { useRouter } from 'next/navigation';
import { TrainForm, TrainFormValues } from '../components/TrainForm';

export default function NewTrainPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    getAllTrains().then((list) => setCodes(list.map(t => t.code).filter(Boolean)));
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-card rounded-xl p-6 shadow-sm">
      <h1 className="text-2xl font-bold mb-2 text-foreground">Thêm tàu mới</h1>
      <TrainForm
        initial={{ name: '', code: '', type: '', manufacturer: '', capacity: 0, isActive: true }}
        submitting={saving}
        codesInUse={codes}
        onSubmit={async (vals: TrainFormValues) => {
          setSaving(true);
          try {
            await createTrain(vals as any);
            router.push('/trains');
          } finally {
            setSaving(false);
          }
        }}
      />
    </div>
  );
}