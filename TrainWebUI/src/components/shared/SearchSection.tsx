'use client';

import { ArrowRightLeft, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripSearchParams } from '@/types';
import { H2, Small } from '@/components/ui/typography';

export function SearchSection() {
  const router = useRouter();
  const [from, setFrom] = useState<string>('Hà Nội (HAN)');
  const [to, setTo] = useState<string>('Sài Gòn (SGN)');
  const [departureDate, setDepartureDate] = useState<string>('2025-11-15');
  const [returnDate, setReturnDate] = useState<string>('2025-11-25');

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    // Chuẩn hóa params cho TripSearchParams
    const params: TripSearchParams = {
      departureStation: from,
      arrivalStation: to,
      departureDate,
    };
    // Truyền params qua URL sang trang kết quả
    const searchParams = new URLSearchParams({
      from,
      to,
      date: departureDate,
      return: returnDate,
    });
    router.push(`/search?${searchParams.toString()}`);
  };

  return (
    <div className="w-full bg-gradient-to-br from-primary/5 via-background to-secondary/5 border-b">
      <div className="container mx-auto px-2 lg:px-2 py-5">
        <H2 className="mb-5 text-center">Bạn muốn đi đâu?</H2>
        <Card className="mx-auto max-w-5xl border-0 shadow-xl">
          <div className="p-2">
            <div className="grid gap-3 md:grid-cols-[2fr_auto_2fr_1fr_1fr_auto] items-end">
              {/* From */}
              <div>
                <Small className="mb-2 block text-muted-foreground">
                  Điểm đi
                </Small>
                <div className="relative">
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full rounded-lg border bg-card px-2 py-2 transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              {/* Swap button */}
              <Button
                variant="outline"
                size="icon"
                onClick={swapLocations}
                className="mb-0.5 h-10 w-10 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary"
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
              {/* To */}
              <div>
                <Small className="mb-2 block text-muted-foreground">
                  Điểm đến
                </Small>
                <div className="relative">
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full rounded-lg border bg-card px-2 py-2 transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              {/* Departure date */}
              <div>
                <Small className="mb-2 block text-muted-foreground">
                  Ngày đi
                </Small>
                <div className="relative">
                  <input
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full rounded-lg border bg-card px-2 py-2 transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              {/* Return date */}
              <div>
                <Small className="mb-2 block text-muted-foreground">
                  Ngày về
                </Small>
                <div className="relative">
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    className="w-full rounded-lg border bg-card px-2 py-2 transition-colors focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              {/* Search button */}
              <Button
                className="h-[52px] gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-hover-primary hover:to-hover-primary/90 focus-visible:ring-2 focus-visible:ring-ring font-semibold min-h-[48px]"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
                Tìm chuyến
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
