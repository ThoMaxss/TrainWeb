import MapClient from "./MapClient";

export default function MapPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-[60px] py-10">
      <h1 className="text-2xl font-bold mb-6">Bản đồ</h1>
      <MapClient />
    </div>
  );
}
