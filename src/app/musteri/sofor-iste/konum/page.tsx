"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type VehicleRow = { id: string; brand: string; model: string; plate: string; is_active: boolean };
type Mode = "hemen" | "randevulu";

const NOMINATIM = "https://nominatim.openstreetmap.org";

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  const res = await fetch(
    `${NOMINATIM}/reverse?lat=${lat}&lon=${lon}&format=json`,
    { headers: { "Accept-Language": "tr" } }
  );
  const data = await res.json();
  return data?.display_name ?? `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
}

async function searchAddress(q: string): Promise<Array<{ display_name: string; lat: string; lon: string }>> {
  if (!q.trim() || q.length < 3) return [];
  const res = await fetch(
    `${NOMINATIM}/search?q=${encodeURIComponent(q)}&format=json&countrycodes=tr&limit=5`,
    { headers: { "Accept-Language": "tr" } }
  );
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function SoforKonumPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromCoords, setFromCoords] = useState<[number, number] | null>(null);
  const [toCoords, setToCoords] = useState<[number, number] | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.0082, 28.9784]);
  const [mode, setMode] = useState<Mode>("hemen");
  const [scheduledAt, setScheduledAt] = useState("");
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);
  const [toSuggestions, setToSuggestions] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const toDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await getCurrentUser();
        if (!user) return;
        const { data } = await supabase
          .from("vehicles")
          .select("id, brand, model, plate, is_active")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .limit(1)
          .single();
        if (!cancelled && data) setVehicle(data as VehicleRow);
      } catch {
        if (!cancelled) setVehicle(null);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!navigator?.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setMapCenter([lat, lon]);
        setFromCoords([lat, lon]);
        const addr = await reverseGeocode(lat, lon);
        setFrom(addr);
      },
      () => setFrom("Konum alınamadı")
    );
  }, []);

  const onToChange = useCallback((value: string) => {
    setTo(value);
    setToCoords(null);
    if (toDebounce.current) clearTimeout(toDebounce.current);
    if (value.trim().length < 3) {
      setToSuggestions([]);
      return;
    }
    toDebounce.current = setTimeout(async () => {
      const list = await searchAddress(value);
      setToSuggestions(list);
      toDebounce.current = null;
    }, 400);
  }, []);

  const pickTo = (item: { display_name: string; lat: string; lon: string }) => {
    setTo(item.display_name);
    setToCoords([parseFloat(item.lat), parseFloat(item.lon)]);
    setToSuggestions([]);
  };

  const canContinue = from.trim() && to.trim() && vehicle && (mode !== "randevulu" || scheduledAt);

  const handleContinue = () => {
    if (!canContinue || !vehicle) return;
    const payload = {
      fromAddress: from,
      toAddress: to,
      fromLat: fromCoords?.[0],
      fromLng: fromCoords?.[1],
      toLat: toCoords?.[0],
      toLng: toCoords?.[1],
      vehicle_id: vehicle.id,
      mode,
      scheduled_time: mode === "randevulu" ? scheduledAt : null,
    };
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("soforRequest", JSON.stringify(payload));
    }
    router.push("/musteri/sofor-iste/talep-olustur");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/musteri/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
          Şoför İste
        </h1>

        <div className="mt-4 h-[200px] rounded-[16px] overflow-hidden bg-[var(--bg-soft)]">
          <Map
            center={mapCenter}
            from={fromCoords}
            to={toCoords}
            className="h-full w-full"
          />
        </div>

        <section className="mt-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Nereden</span>
            <input
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none"
              placeholder="Konum alınıyor..."
            />
          </div>
          <div className="relative">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Nereye</span>
            <input
              value={to}
              onChange={(e) => onToChange(e.target.value)}
              className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
              placeholder="Varış adresini yaz"
            />
            {toSuggestions.length > 0 && (
              <ul className="absolute top-full left-0 right-0 z-10 mt-1 rounded-[14px] border border-[var(--border)] bg-white py-2 shadow-lg">
                {toSuggestions.map((item, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      className="w-full px-4 py-2 text-left text-sm text-[var(--text)] hover:bg-[var(--bg-soft)]"
                      onClick={() => pickTo(item)}
                    >
                      {item.display_name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Şoförün süreceği araç</p>
            {vehicle ? (
              <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-[var(--text)]">{vehicle.brand} {vehicle.model}</span>
                <span className="rounded-md px-3 py-1 text-xs font-bold" style={{ backgroundColor: "var(--yellow)", color: "#92400E" }}>
                  {vehicle.plate}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Aktif araç yok. <button type="button" className="underline" onClick={() => router.push("/musteri/garaj")}>Garajdan seç</button>
              </p>
            )}
            <p className="mt-2 flex items-center gap-1 text-xs text-[var(--text-dim)]">🔒 Plaka şoföre gösterilir.</p>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Ne zaman?</span>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("hemen")}
                className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-bold ${mode === "hemen" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}
              >
                ⚡ Hemen
              </button>
              <button
                type="button"
                onClick={() => setMode("randevulu")}
                className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-bold ${mode === "randevulu" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}
              >
                📅 Randevulu
              </button>
            </div>
            {mode === "randevulu" && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm text-[var(--text)]"
              />
            )}
          </div>
        </section>

        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
        >
          Devam Et
        </button>
      </main>
    </div>
  );
}
