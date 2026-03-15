"use client";

import { useEffect, useMemo, useState } from "react";
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

type DriverProfileRow = {
  user_id: string;
  rating: number | null;
  total_trips: number | null;
  region: string | null;
  users: { full_name: string | null }[] | null;
};

export default function SoforListePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);
  const [drivers, setDrivers] = useState<DriverProfileRow[]>([]);
  const [driversLoading, setDriversLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null); // driver user_id
  const [loading, setLoading] = useState(false); // request create
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchActiveVehicle() {
      try {
        const user = await getCurrentUser();
        if (!user) return;
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

  useEffect(() => {
    let cancelled = false;
    async function fetchDrivers() {
      setDriversLoading(true);
      setError(null);
      try {
        const { data, error: dError } = await supabase
          .from("driver_profiles")
          .select("user_id, rating, total_trips, region, users(full_name)")
          .eq("is_online", true)
          .eq("is_approved", true);
        if (dError) throw dError;
        if (!cancelled) {
          const list = (data ?? []) as DriverProfileRow[];
          setDrivers(list);
          setSelectedId(list[0]?.user_id ?? null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Şoförler yüklenemedi. Lütfen tekrar dene.");
      } finally {
        if (!cancelled) setDriversLoading(false);
      }
    }
    fetchDrivers();
    return () => {
      cancelled = true;
    };
  }, []);

  const driverCountText = useMemo(() => {
    if (driversLoading) return "Yükleniyor...";
    if (drivers.length === 0) return "Şu an müsait şoför yok";
    return `${drivers.length} müsait şoför bulundu`;
  }, [drivers.length, driversLoading]);

  const handleContinue = async () => {
    if (!selectedId || loading) return;
    setLoading(true);
    setError(null);

    try {
      const user = await getCurrentUser();
      if (!user) return;
      const vehicleId = await getActiveVehicleId();

      const pickup_address = "Bağdat Caddesi, Kadıköy";
      const dropoff_address = "Moda Sahili";
      const pickup_lat = 40.987;
      const pickup_lng = 29.041;
      const dropoff_lat = 40.979;
      const dropoff_lng = 29.029;

      const chosen = drivers.find((d) => d.user_id === selectedId);
      const rating = chosen?.rating ?? 4.8;
      const trips = chosen?.total_trips ?? 0;
      const base = 280;
      const priceNumber = Math.round(base + (5 - rating) * 30 + Math.min(trips, 400) * 0.2);

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
          driver_id: selectedId,
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
          {driverCountText}
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
              {driversLoading && (
                <div className="flex items-center justify-center rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
                  <div className="flex items-center gap-3 text-sm font-semibold text-[var(--text-dim)]">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#111]" />
                    Şoförler yükleniyor...
                  </div>
                </div>
              )}

              {!driversLoading && drivers.length === 0 && (
                <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center text-sm font-semibold text-[var(--text-dim)]">
                  Şu an müsait şoför yok
                </div>
              )}

              {!driversLoading &&
                drivers.map((driver, idx) => {
                  const active = selectedId === driver.user_id;
                  const name = driver.users?.[0]?.full_name ?? "Şoför";
                  const rating = driver.rating ?? 0;
                  const trips = driver.total_trips ?? 0;
                  const region = driver.region ?? "-";
                  const emoji = idx % 2 === 0 ? "🧑‍✈️" : "👩‍✈️";
                  return (
                    <button
                      key={driver.user_id}
                      type="button"
                      onClick={() => setSelectedId(driver.user_id)}
                      className={`w-full rounded-[16px] border p-4 text-left text-sm transition ${
                        active
                          ? "border-[#111] bg-[var(--bg-card)] ring-2 ring-[#111]"
                          : "border-[var(--border)] bg-[var(--bg-card)]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 text-2xl">{emoji}</span>
                          <div>
                            <p className="font-bold text-[var(--text)]">
                              {name}{" "}
                              <span className="text-xs text-[var(--text-dim)]">
                                ★ {rating ? rating.toFixed(1) : "-"}
                              </span>
                            </p>
                            <p className="mt-1 text-xs text-[var(--text-dim)]">
                              {region} • {trips} sefer
                            </p>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedId || loading || driversLoading || drivers.length === 0}
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
