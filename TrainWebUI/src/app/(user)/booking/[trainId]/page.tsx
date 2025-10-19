"use client";

import { useRouter } from "next/navigation";
import { SeatSelectionScreen } from "../../components/SeatSelectionScreen";

interface SelectedSeat {
  id: string;
  coachNumber: number;
  seatNumber: string;
  seatType: string;
  price: number;
}

/**
 * Trang chọn ghế cho chuyến tàu
 * URL: /booking/[trainId]
 */
export default function BookingPage({ params }: { params: { trainId: string } }) {
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
    router.push(`/booking/confirm?tripId=${params.trainId}&seatIds=${seatIds}`);
  };

  return (
    <SeatSelectionScreen
      tripId={params.trainId}
      onBack={handleBack}
      onContinue={handleContinue}
      preSelectedSeatType={null}
    />
  );
}
