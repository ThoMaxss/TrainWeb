// 🎨 Enhanced search page with unified design system and dark mode
"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchSection } from "@/components/shared/SearchSection";
import { TrainResults } from "../components/TrainResults";
import { PageContainer } from "@/components/shared/PageLayout";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <PageContainer className="space-y-5">
      <SearchSection />
      <div className="container mx-auto px-2 lg:px-2 pb-12">
        <TrainResults
          searchParams={params}
          onViewDetail={(tripId, trainId) => {
            const urlParams = new URLSearchParams();
            if (tripId) urlParams.set("tripId", tripId);
            if (trainId) urlParams.set("trainId", trainId);
            router.push(`/train/${trainId || "detail"}?${urlParams.toString()}`);
          }}
        />
      </div>
    </PageContainer>
  );
}
