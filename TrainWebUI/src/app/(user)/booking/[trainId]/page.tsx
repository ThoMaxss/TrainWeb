"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { SeatSelectionScreen } from "../../components/SeatSelectionScreen";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

interface BookingPageProps {
  params: Promise<{ trainId: string }>;
}

/**
 * Trang chọn ghế cho chuyến tàu
 * URL: /booking/[trainId]
 */
export default function BookingPage({ params }: BookingPageProps) {
  const { trainId } = use(params);
  const router = useRouter();

  // Xử lý khi quay lại
  const handleBack = () => {
    router.back();
  };

  // Xử lý khi tiếp tục (sau khi chọn ghế)
  const handleContinue = (selectedSeats: SelectedSeat[]) => {
    if (selectedSeats.length === 0) return;

    // Create URL params with selected seats
    const seatIds = selectedSeats.map(seat => seat.id).join(",");
    router.push(`/booking/confirm?tripId=${trainId}&seatIds=${seatIds}`);
  };

  return (
    <SeatSelectionScreen
      tripId={trainId}
      onBack={handleBack}
      onContinue={handleContinue}
      preSelectedSeatType={null}
    />
  );
}
