"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchSection } from "@/components/shared/SearchSection";
import { TrainResults } from "../components/TrainResults";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Memoized search parameters to prevent unnecessary re-renders
  const params = useMemo(() => {
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const date = searchParams.get("date") || undefined;
    return {
      originStation: from,
      destinationStation: to,
      departure: date,
    };
  }, [searchParams]);

  const handleViewDetail = useMemo(
    () => (tripId: string, trainId: string) => {
      const urlParams = new URLSearchParams();
      if (tripId) urlParams.set("tripId", tripId);
      if (trainId) urlParams.set("trainId", trainId);
      router.push(`/train/${trainId || "detail"}?${urlParams.toString()}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Search Section */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/20 dark:to-primary/10 border-b">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <SearchSection />
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <TrainResults searchParams={params} onViewDetail={handleViewDetail} />
      </div>
    </div>
  );
}
