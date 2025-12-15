import jsPDF from 'jspdf';

interface TicketData {
  ticketId: string;
  trainNumber: string;
  passengerName: string;
  route: string;
  departureDate: string;
  departureTime: string;
  seatNumber: string;
  price: number;
  qrCodeDataUrl?: string;
}

export async function generateTicketPDF(ticket: TicketData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;

  // Header
  doc.setFillColor(37, 99, 235); // primary color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.text('GoRail', margin, 20);
  
  doc.setFontSize(12);
  doc.text('VÉ TÀU ĐIỆN TỬ', margin, 30);

  // Reset color
  doc.setTextColor(0, 0, 0);
  
  let y = 60;
  const lineHeight = 10;

  // Ticket info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('THÔNG TIN VÉ', margin, y);
  y += lineHeight;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  const fields = [
    ['Mã vé:', ticket.ticketId],
    ['Tàu:', ticket.trainNumber],
    ['Hành khách:', ticket.passengerName],
    ['Tuyến:', ticket.route],
    ['Ngày khởi hành:', ticket.departureDate],
    ['Giờ khởi hành:', ticket.departureTime],
    ['Số ghế:', ticket.seatNumber],
    ['Giá vé:', `${ticket.price.toLocaleString('vi-VN')}₫`],
  ];

  fields.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 50, y);
    y += lineHeight;
  });

  // QR Code
  if (ticket.qrCodeDataUrl) {
    y += 10;
    doc.text('Quét mã QR để kiểm tra:', margin, y);
    y += 10;
    doc.addImage(ticket.qrCodeDataUrl, 'PNG', margin, y, 50, 50);
  }

  // Footer
  y = doc.internal.pageSize.getHeight() - 30;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text('Vui lòng xuất trình vé này khi lên tàu.', margin, y);
  doc.text('Liên hệ: support@gorail.vn | Hotline: 1900-xxxx', margin, y + 5);
  doc.text(`In lúc: ${new Date().toLocaleString('vi-VN')}`, margin, y + 10);

  // Save
  doc.save(`Ve_${ticket.ticketId}.pdf`);
}

export async function generateMultipleTicketsPDF(tickets: TicketData[]): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < tickets.length; i++) {
    if (i > 0) doc.addPage();
    
    const ticket = tickets[i];
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Reuse same layout
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('GoRail', margin, 20);
    doc.setFontSize(12);
    doc.text('VÉ TÀU ĐIỆN TỬ', margin, 30);
    doc.setTextColor(0, 0, 0);

    let y = 60;
    const lineHeight = 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('THÔNG TIN VÉ', margin, y);
    y += lineHeight;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const fields = [
      ['Mã vé:', ticket.ticketId],
      ['Tàu:', ticket.trainNumber],
      ['Hành khách:', ticket.passengerName],
      ['Tuyến:', ticket.route],
      ['Ngày khởi hành:', ticket.departureDate],
      ['Giờ khởi hành:', ticket.departureTime],
      ['Số ghế:', ticket.seatNumber],
      ['Giá vé:', `${ticket.price.toLocaleString('vi-VN')}₫`],
    ];

    fields.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 50, y);
      y += lineHeight;
    });

    if (ticket.qrCodeDataUrl) {
      y += 10;
      doc.text('Quét mã QR để kiểm tra:', margin, y);
      y += 10;
      doc.addImage(ticket.qrCodeDataUrl, 'PNG', margin, y, 50, 50);
    }

    y = doc.internal.pageSize.getHeight() - 30;
    doc.setFontSize(9);
    doc.setTextColor(128, 128, 128);
    doc.text('Vui lòng xuất trình vé này khi lên tàu.', margin, y);
    doc.text('Liên hệ: support@gorail.vn | Hotline: 1900-xxxx', margin, y + 5);
    doc.text(`In lúc: ${new Date().toLocaleString('vi-VN')}`, margin, y + 10);
  }

  doc.save(`Ve_${tickets.length}_tickets.pdf`);
}
