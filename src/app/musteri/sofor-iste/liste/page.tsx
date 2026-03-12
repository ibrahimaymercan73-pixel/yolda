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
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .limit(1);
        if (!cancelled && data?.[0]) setVehicle(data[0] as VehicleRow);
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

      const pickup_address = "Bağdat Caddesi, Kadıköy";
      const dropoff_address = "Moda Sahili";
      const pickup_lat = 40.987;
      const pickup_lng = 29.041;
      const dropoff_lat = 40.979;
      const dropoff_lng = 29.029;

      const chosenDriver = MOCK_DRIVERS.find((d) => d.id === selectedId)!;
      const priceNumber = Number(chosenDriver.price.replace(/[^\d]/g, ""));

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
          driver_id: chosenDriver.id,
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
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Yakın Şoförler
        </h1>
        <p className="mt-1 text-sm font-semibold text-[var(--green)]">
          3 müsait şoför bulundu
        </p>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-4">
            <div className="relative h-40 overflow-hidden rounded-[16px] bg-[var(--bg-soft)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute right-10 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute left-0 top-6 h-px w-full bg-[var(--border)]" />
                <div className="absolute left-0 top-20 h-px w-full bg-[var(--border)]" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xl">
                  📍
                </span>
                <span className="absolute left-10 top-8 text-lg">🚶</span>
                <span className="absolute right-8 bottom-10 text-lg">🚶</span>
                <span className="absolute right-16 top-5 text-lg">🚶</span>
              </div>
              <p className="absolute bottom-2 right-3 rounded-full bg-black/10 px-3 py-1 text-[10px] text-[var(--text-dim)]">
                Şoförler kendi yöntemleriyle gelir
              </p>
            </div>

            {vehicle && (
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  🚗 Aktif Araç
                </p>
                <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                  {vehicle.brand} {vehicle.model} • {vehicle.color ?? "-"}
                </p>
                <p className="mt-1 text-xs text-[var(--text-dim)]">
                  Şoför bu aracı sürecek.
                </p>
              </div>
            )}

            <div className="space-y-3">
              {MOCK_DRIVERS.map((driver) => {
                const active = selectedId === driver.id;
                return (
                  <button
                    key={driver.id}
                    type="button"
                    onClick={() => setSelectedId(driver.id)}
                    className={`w-full rounded-[16px] border p-4 text-left text-sm transition ${
                      active
                        ? "border-[#111] bg-[var(--bg-card)] ring-2 ring-[#111]"
                        : "border-[var(--border)] bg-[var(--bg-card)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="mt-1 text-2xl">{driver.emoji}</span>
                        <div>
                          <p className="font-bold text-[var(--text)]">
                            {driver.name}{" "}
                            <span className="text-xs text-[var(--text-dim)]">
                              ★ {driver.rating.toFixed(1)}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-[var(--text-dim)]">
                            {driver.region} • {driver.trips} sefer
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <p className="font-bold text-[var(--text)]">
                          {driver.price}
                        </p>
                        <p className="mt-1 text-xs text-[var(--green)]">
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
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Devam Et"}
          </button>
          {error && (
            <p className="mt-3 text-sm text-red-500">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}
