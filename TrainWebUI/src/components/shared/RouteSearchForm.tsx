"use client";
import { useState } from "react";

export default function RouteSearchForm({ onSearch }: { onSearch: (from: string, to: string) => void }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  return (
    <div className="flex gap-2 items-center mb-4">
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="Ga đi (vd: 105.8,21.0)"
        className="border p-2 rounded w-full"
      />
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="Ga đến (vd: 108.2,16.0)"
        className="border p-2 rounded w-full"
      />
      <button
        onClick={() => onSearch(from, to)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Tìm tuyến
      </button>
    </div>
  );
}
