"use client";

import dynamic from "next/dynamic";

const VietmapRailwayMap = dynamic(
  () => import("@/components/maps/VietmapRailwayMap"),
  { ssr: false }
);

export default function MapClient() {
  return <VietmapRailwayMap />;
}
