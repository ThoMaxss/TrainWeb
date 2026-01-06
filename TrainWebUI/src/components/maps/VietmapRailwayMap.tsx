"use client";

import { useEffect, useRef } from "react";
import type { Map as VietmapMap } from "@vietmap/vietmap-gl-js";

export default function VietmapRailwayMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<VietmapMap | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; 

    let destroyed = false;

    (async () => {
      const vietmapgl = await import("@vietmap/vietmap-gl-js");
      if (destroyed) return;

      const key = process.env.NEXT_PUBLIC_VIETMAP_API_KEY;
      if (!key) {
        console.error("Missing NEXT_PUBLIC_VIETMAP_API_KEY in .env.local");
        return;
      }

      const map = new vietmapgl.Map({
        container: mapContainerRef.current!,
        style: `https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=${key}`,
        center: [106.7, 10.78],
        zoom: 5,
      });

      map.addControl(new vietmapgl.NavigationControl(), "top-right");
      mapRef.current = map;
    })();

    return () => {
      destroyed = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="w-full h-[560px] rounded-2xl overflow-hidden border bg-white">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
