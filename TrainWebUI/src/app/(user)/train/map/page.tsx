import VietmapRailwayMap from "@/components/maps/VietmapRailwayMap";

export default function TrainMapPage() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-semibold mb-4">Bản đồ đường sắt</h1>
      <VietmapRailwayMap />
    </div>
  );
}
