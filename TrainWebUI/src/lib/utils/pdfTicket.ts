import jsPDF from "jspdf";
import QRCode from "qrcode";
import { SelectedSeat, Passenger } from "@/types/booking";

/** Xuất 1 file PDF chung cho cả nhóm */
export async function generateGroupPdfTicket(
  ticketId: string,
  trainId: string,
  from: string,
  to: string,
  date: string,
  time: string,
  seats: SelectedSeat[],
  passengers: Passenger[],
  total: number
) {
  const doc = new jsPDF();
  doc.setFontSize(18).text("VÉ TÀU ĐIỆN TỬ (NHÓM)", 105, 20, { align: "center" });
  doc.setFontSize(12).text(`Mã đặt chỗ: ${ticketId}`, 105, 28, { align: "center" });

  doc.setFontSize(14).text(`Tàu: ${trainId}`, 20, 50);
  doc.setFontSize(12).text(`${from} → ${to}`, 20, 60);
  doc.text(`Ngày: ${date} | Giờ: ${time}`, 20, 70);

  passengers.forEach((p, i) => {
    const seat = seats[i];
    const passengerName = (p as any).fullName || p.name || "";
    const seatType = (seat as any).seatType || seat.type || "";
    const coach = (seat as any).coachNumber ? `Toa ${(seat as any).coachNumber}, ` : "";
    doc.text(
      `${i + 1}. ${passengerName} - ${coach}Ghế ${seat.seatNumber} (${seatType})`,
      20,
      90 + i * 8
    );
  });

  doc.text(`Tổng cộng: ${total.toLocaleString("vi-VN")}đ`, 20, 130);

  const qr = await QRCode.toDataURL(ticketId);
  doc.addImage(qr, "PNG", 150, 50, 40, 40);

  doc.save(`group-ticket-${ticketId}.pdf`);
}

/** Xuất 1 file PDF riêng cho từng hành khách */
export async function generateIndividualTickets(
  ticketId: string,
  trainId: string,
  from: string,
  to: string,
  date: string,
  time: string,
  seats: SelectedSeat[],
  passengers: Passenger[]
) {
  for (let i = 0; i < passengers.length; i++) {
    const doc = new jsPDF();
    const p = passengers[i];
    const seat = seats[i];

    doc.setFontSize(18).text("VÉ TÀU ĐIỆN TỬ", 105, 20, { align: "center" });
    doc.setFontSize(12).text(`Mã vé: ${ticketId}-${i + 1}`, 105, 28, { align: "center" });

    const passengerName = (p as any).fullName || p.name || "";
    const seatType = (seat as any).seatType || seat.type || "";
    const coach = (seat as any).coachNumber ? `Toa ${(seat as any).coachNumber}, ` : "";
    doc.setFontSize(14).text(`${passengerName}`, 20, 50);
    doc.setFontSize(12).text(`${coach}Ghế ${seat.seatNumber} (${seatType})`, 20, 60);
    doc.text(`Tàu: ${trainId}`, 20, 70);
    doc.text(`${from} → ${to}`, 20, 80);
    doc.text(`Ngày: ${date} | Giờ: ${time}`, 20, 90);
    doc.text(`Giá: ${seat.price.toLocaleString("vi-VN")}đ`, 20, 100);

    const qr = await QRCode.toDataURL(`${ticketId}-${i + 1}`);
    doc.addImage(qr, "PNG", 150, 50, 40, 40);

    doc.save(`ticket-${ticketId}-${i + 1}.pdf`);
  }
}
