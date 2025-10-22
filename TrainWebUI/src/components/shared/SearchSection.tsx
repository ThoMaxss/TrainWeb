"use client";

import { useState } from "react";
import { ArrowRightLeft, Calendar, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/utils";

export function SearchSection() {
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  const [from, setFrom] = useState("Hà Nội (HAN)");
  const [to, setTo] = useState("Sài Gòn (SGN)");
  const [departureDate, setDepartureDate] = useState("2025-11-15");
  const [returnDate, setReturnDate] = useState("2025-11-25");
  const [passengers, setPassengers] = useState("1");

  const swapLocations = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex justify-center mt-8 px-4">
      <Card className="w-full max-w-5xl rounded-2xl border border-gray-200/80 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md p-6">
        {/* Loại chuyến đi */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200/80 pb-4">
          <Button
            onClick={() => setTripType("oneway")}
            className={cn(
              "rounded-xl px-5 py-2 font-semibold transition-all duration-200",
              tripType === "oneway"
                ? "bg-[#1363DF] text-white shadow-md"
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            )}
          >
            ← Một chiều
          </Button>
          <Button
            onClick={() => setTripType("roundtrip")}
            className={cn(
              "rounded-xl px-5 py-2 font-semibold transition-all duration-200",
              tripType === "roundtrip"
                ? "bg-[#1363DF] text-white shadow-md"
                : "bg-transparent text-gray-500 hover:bg-gray-100"
            )}
          >
            ↻ Khứ hồi
          </Button>
        </div>

        {/* Form tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_auto_1.5fr_1.3fr] gap-4 items-end">
          {/* From */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Từ
            </label>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/30 outline-none transition-all"
            />
          </div>

          {/* Nút đảo */}
          <div className="flex justify-center items-center mb-4">
            <Button
              variant="outline"
              size="icon"
              onClick={swapLocations}
              className="rounded-full border-gray-300 hover:border-[#1363DF] hover:text-[#1363DF] transition-all"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* To */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Đến
            </label>
            <input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/30 outline-none transition-all"
            />
          </div>

          {/* Ngày đi */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Ngày đi
            </label>
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/30 outline-none transition-all"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Ngày về + hành khách (chỉ khi khứ hồi) */}
        {tripType === "roundtrip" && (
          <div className="grid sm:grid-cols-2 md:grid-cols-[1.5fr_1.3fr] gap-4 mt-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Ngày về
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/30 outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Hành khách
              </label>
              <input
                type="number"
                min="1"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-800 focus:border-[#1363DF] focus:ring-2 focus:ring-[#1363DF]/30 outline-none transition-all"
              />
            </div>
          </div>
        )}

        {/* Nút tìm chuyến */}
        <div className="flex justify-center mt-8">
          <Button className="flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-[#1363DF] hover:bg-[#0B4CC1] font-semibold text-lg shadow-md transition-all">
            <Search className="h-5 w-5" />
            Tìm chuyến
          </Button>
        </div>
      </Card>
    </div>
  );
}
