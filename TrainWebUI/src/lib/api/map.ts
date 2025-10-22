export async function getTrainRoute(from: string, to: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/maps/route?from=${from}&to=${to}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Không thể lấy dữ liệu tuyến tàu");
  return res.json();
}
