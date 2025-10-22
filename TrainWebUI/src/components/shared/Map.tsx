"use client";
import { useEffect, useState } from "react";
import vietmapgl from "@vietmap/vietmap-gl-js";
import "@vietmap/vietmap-gl-js/dist/vietmap-gl.css";

export default function Map({ route }: { route?: any }) {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    const map = new vietmapgl.Map({
      container: "map",
      style: "https://maps.vietmap.vn/maps/styles/tm/style.json?apikey=YOUR_PUBLIC_STYLE_KEY",
      center: [106, 16],
      zoom: 6,
    });
    setMap(map);
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (map && route) {
      if (map.getSource("route")) map.removeLayer("route-line"), map.removeSource("route");
      map.addSource("route", {
        type: "geojson",
        data: route,
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        paint: { "line-color": "#1E90FF", "line-width": 4 },
      });
    }
  }, [map, route]);

  return <div id="map" className="w-full h-[600px] rounded-lg shadow-lg" />;
}
