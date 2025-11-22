'use client';

import { ArrowRightLeft, Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TripSearchParams } from '@/types';
import { H2, Small, Display } from '@/components/ui/typography';

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
      originStation: from,
      destinationStation: to,
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
      <div className="container mx-auto px-4 lg:px-8 py-6">
  <Display className="mb-6 text-center">Bạn muốn đi đâu?</Display>
  <Card className="mx-auto max-w-5xl border-0 shadow-xl rounded-2xl">
          <div className="p-6">
            {/* Desktop: 2 rows layout */}
            <div className="flex flex-col gap-4">
              {/* Row 1: From | Swap | To */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                {/* From */}
                <div className="space-y-2">
                  <Small className="block text-muted-foreground font-medium">
                    Điểm đi
                  </Small>
                  <input
                    type="text"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full h-12 rounded-2xl border bg-card px-4 py-3 transition-colors focus:border-primary focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm"
                    placeholder="Chọn điểm đi"
                  />
                </div>

                {/* Swap button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={swapLocations}
                  className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary transition-all shrink-0"
                  aria-label="Đổi điểm đi và điểm đến"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </Button>

                {/* To */}
                <div className="space-y-2">
                  <Small className="block text-muted-foreground font-medium">
                    Điểm đến
                  </Small>
                  <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full h-12 rounded-2xl border bg-card px-4 py-3 transition-colors focus:border-primary focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm"
                    placeholder="Chọn điểm đến"
                  />
                </div>
              </div>

              {/* Row 2: Departure | Return | Search */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
                {/* Departure date */}
                <div className="space-y-2">
                  <Small className="block text-muted-foreground font-medium">
                    Ngày đi
                  </Small>
                  <div className="relative">
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="w-full h-12 rounded-2xl border bg-card px-4 py-3 pr-10 transition-colors focus:border-primary focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>

                {/* Return date */}
                <div className="space-y-2">
                  <Small className="block text-muted-foreground font-medium">
                    Ngày về
                  </Small>
                  <div className="relative">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full h-12 rounded-2xl border bg-card px-4 py-3 pr-10 transition-colors focus:border-primary focus:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-sm"
                    />
                    <Calendar className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>

                {/* Search button */}
                <Button
                  className="h-12 px-8 gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-hover-primary hover:to-hover-primary/90 focus-visible:ring-2 focus-visible:ring-ring font-semibold transition-all shadow-md hover:shadow-lg"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">Tìm chuyến</span>
                  <span className="sm:hidden">Tìm</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
