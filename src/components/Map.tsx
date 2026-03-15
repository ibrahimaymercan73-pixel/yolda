"use client";

import { useEffect, useRef, useState } from "react";

type MapProps = {
  center: [number, number];
  from?: [number, number] | null;
  to?: [number, number] | null;
  className?: string;
};

export default function Map({ center, from, to, className = "" }: MapProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ref.current) return;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled) return;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      import("leaflet/dist/leaflet.css");
      const map = L.default.map(ref.current!).setView(center, 13);
      mapRef.current = map;
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
      }).addTo(map);
      if (from) L.default.marker(from).addTo(map);
      if (to) L.default.marker(to).addTo(map);
      if (from && to) {
        L.default.polyline([from, to], { color: "#111", weight: 3 }).addTo(map);
      }
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted, center[0], center[1], from?.[0], from?.[1], to?.[0], to?.[1]]);

  if (!mounted) {
    return (
      <div className={`rounded-[16px] bg-[var(--bg-soft)] ${className}`} style={{ minHeight: 200 }} />
    );
  }

  return (
    <div
      ref={ref}
      className={`rounded-[16px] overflow-hidden ${className}`}
      style={{ height: 200 }}
    />
  );
}
