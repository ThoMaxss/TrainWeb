export interface RouteBreakdown {
  route: string;
  tickets: number;
  revenue: number;
  refunds: number;
}

export interface DailyReportMock {
  date: string;
  revenue: number;
  revenueChangePct: number;
  ticketsSold: number;
  ticketsChangePct: number;
  refundAmount: number;
  refundChangePct: number;
  routes: RouteBreakdown[];
}

function seededRand(seed: number) {
  // Simple LCG for deterministic pseudo-random numbers
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashDate(d: Date) {
  return Number(`${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}`);
}

export function getDailyReportMock(date: Date = new Date()): DailyReportMock {
  const seed = hashDate(date);
  const baseRevenue = 60_000_000 + Math.floor(seededRand(seed) * 40_000_000);
  const tickets = 350 + Math.floor(seededRand(seed + 7) * 150);
  const refundAmt = Math.floor(baseRevenue * (0.03 + seededRand(seed + 13) * 0.04));

  const routes: RouteBreakdown[] = [
    { route: "Hà Nội - TP.HCM", tickets: Math.floor(tickets * 0.32), revenue: Math.floor(baseRevenue * 0.38), refunds: Math.floor(refundAmt * 0.35) },
    { route: "Hà Nội - Đà Nẵng", tickets: Math.floor(tickets * 0.22), revenue: Math.floor(baseRevenue * 0.25), refunds: Math.floor(refundAmt * 0.25) },
    { route: "TP.HCM - Nha Trang", tickets: Math.floor(tickets * 0.18), revenue: Math.floor(baseRevenue * 0.18), refunds: Math.floor(refundAmt * 0.18) },
    { route: "Hà Nội - Hải Phòng", tickets: Math.floor(tickets * 0.14), revenue: Math.floor(baseRevenue * 0.12), refunds: Math.floor(refundAmt * 0.12) },
    { route: "TP.HCM - Phan Thiết", tickets: Math.max(0, tickets - Math.floor(tickets * 0.86)), revenue: Math.max(0, baseRevenue - Math.floor(baseRevenue * 0.88)), refunds: Math.max(0, refundAmt - Math.floor(refundAmt * 0.9)) },
  ];

  return {
    date: date.toLocaleDateString("vi-VN"),
    revenue: baseRevenue,
    revenueChangePct: Number(((seededRand(seed + 23) - 0.2) * 30).toFixed(1)),
    ticketsSold: tickets,
    ticketsChangePct: Number(((seededRand(seed + 29) - 0.2) * 25).toFixed(1)),
    refundAmount: refundAmt,
    refundChangePct: Number(((seededRand(seed + 31) - 0.2) * 20).toFixed(1)),
    routes,
  };
}
