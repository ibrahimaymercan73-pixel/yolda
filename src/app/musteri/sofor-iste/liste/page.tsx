"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";
import { getActiveVehicleId } from "@/lib/requests";

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  color: string | null;
  plate: string;
  is_active: boolean;
};

type Driver = {
  id: string;
  name: string;
  emoji: string;
  rating: number;
  trips: number;
  region: string;
  price: string;
  eta: string;
};

const MOCK_DRIVERS: Driver[] = [
  {
    id: "1",
    name: "Ahmet",
    emoji: "🧑‍✈️",
    rating: 4.9,
    trips: 320,
    region: "Kadıköy / Moda",
    price: "320 TL",
    eta: "8 dk",
  },
  {
    id: "2",
    name: "Zeynep",
    emoji: "👩‍✈️",
    rating: 4.8,
    trips: 210,
    region: "Üsküdar / Altunizade",
    price: "340 TL",
    eta: "11 dk",
  },
  {
    id: "3",
    name: "Emre",
    emoji: "🧑‍✈️",
    rating: 4.7,
    trips: 180,
    region: "Ataşehir / Kozyatağı",
    price: "300 TL",
    eta: "15 dk",
  },
];

export default function SoforListePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchActiveVehicle() {
      try {
        const user = await getCurrentUser();
        const { data, error: vError } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .single();
        if (vError) return;
        if (!cancelled) setVehicle(data as VehicleRow);
      } catch (err) {
        console.error(err);
      }
    }
    fetchActiveVehicle();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContinue = async () => {
    if (!selectedId || loading) return;
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      const vehicleId = await getActiveVehicleId();

      // Şimdilik sabit adres / koordinatlar
      const pickup_address = "Bağdat Caddesi, Kadıköy";
      const dropoff_address = "Moda Sahili";
      const pickup_lat = 40.987;
      const pickup_lng = 29.041;
      const dropoff_lat = 40.979;
      const dropoff_lng = 29.029;

      const chosenDriver = MOCK_DRIVERS.find((d) => d.id === selectedId)!;
      const priceNumber = Number(
        chosenDriver.price.replace(/[^\d]/g, "")
      );

      const { data, error: insertError } = await supabase
        .from("ride_requests")
        .insert({
          customer_id: user.id,
          vehicle_id: vehicleId,
          pickup_address,
          pickup_lat,
          pickup_lng,
          dropoff_address,
          dropoff_lat,
          dropoff_lng,
          type: "hemen",
          scheduled_at: null,
          status: "bekliyor",
          driver_id: chosenDriver.id, // gerçek driver id ile değiştirilebilir
          price: priceNumber,
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      router.push(
        `/musteri/sofor-iste/onay-bekleme?request_id=${data.id}`
      );
    } catch (err) {
      console.error(err);
      setError("Talep oluşturulamadı. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Şoför İste
              </p>
              <h1 className="text-xl font-semibold">Yakın Şoförler</h1>
            </div>
            <p className="text-[11px] font-semibold text-emerald-400">
              3 müsait şoför bulundu
            </p>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            {/* Sahte harita */}
            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-slate-700" />
                <div className="absolute right-10 top-0 h-full w-px bg-slate-700" />
                <div className="absolute left-0 top-6 h-px w-full bg-slate-700" />
                <div className="absolute left-0 top-20 h-px w-full bg-slate-700" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                  📍
                </span>
                <span className="absolute left-10 top-8 text-lg">🚶</span>
                <span className="absolute right-8 bottom-10 text-lg">🚶</span>
                <span className="absolute right-16 top-5 text-lg">🚶</span>
              </div>
              <p className="absolute bottom-2 right-3 rounded-full bg-black/40 px-3 py-1 text-[10px] text-slate-200">
                Şoförler kendi yöntemleriyle gelir
              </p>
            </div>

            {/* Aktif araç bandı */}
            {vehicle && (
              <div className="rounded-2xl bg-[#FF4500]/15 px-4 py-3 text-xs text-[#FFD7C2]">
                <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em]">
                  <span>🚗</span>
                  <span>Aktif Araç</span>
                </p>
                <p className="mt-1 text-sm text-white">
                  {vehicle.brand} {vehicle.model} • {vehicle.color ?? "-"}
                </p>
                <p className="mt-1 text-[11px] text-orange-100">
                  Şoför bu aracı sürecek.
                </p>
              </div>
            )}

            {/* Şoför listesi */}
            <div className="space-y-3">
              {MOCK_DRIVERS.map((driver) => {
                const active = selectedId === driver.id;
                return (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setSelectedId(driver.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? "border-[#FF4500] bg-slate-900"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-2xl">{driver.emoji}</span>
                        <div>
                          <p className="text-sm font-semibold">
                            {driver.name}{" "}
                            <span className="text-xs text-yellow-300">
                              ★ {driver.rating.toFixed(1)}
                            </span>
                          </p>
                          <p className="mt-1 text-[11px] text-slate-400">
                            {driver.region} • {driver.trips} sefer
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-semibold text-slate-50">
                          {driver.price}
                        </p>
                        <p className="mt-1 text-[11px] text-emerald-400">
                          {driver.eta} tahmini
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedId || loading}
            onClick={handleContinue}
            className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              selectedId && !loading
                ? "bg-primary text-primary-foreground shadow-sm shadow-orange-500/40"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {loading ? "Gönderiliyor..." : "Devam Et"}
          </button>
          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

