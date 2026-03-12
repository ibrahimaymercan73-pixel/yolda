"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  color: string;
  plate: string;
  is_active: boolean;
};

type Mode = "hemen" | "randevulu";

export default function SoforKonumPage() {
  const router = useRouter();
  const [from, setFrom] = useState("Kadıköy, İstanbul");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState<Mode>("hemen");
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await getCurrentUser();
        const { data } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .limit(1);
        if (!cancelled && data?.[0]) setVehicle(data[0] as VehicleRow);
      } catch {
        if (!cancelled) setVehicle(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleContinue = () => {
    if (mode === "hemen") {
      router.push("/musteri/sofor-iste/liste");
    } else {
      router.push("/musteri/sofor-iste/randevu");
    }
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
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Şoför İste
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#111]" />
                  <span className="h-5 w-px bg-[var(--border)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Nereden
                    </span>
                    <input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Nereye
                    </span>
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Varış noktasını yaz"
                      className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Şoförün süreceği araç
              </p>
              {vehicle ? (
                <div className="mt-2 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="font-semibold text-[var(--text)]">
                      {vehicle.brand} {vehicle.model}
                    </span>
                  </div>
                  <div
                    className="rounded-md px-3 py-1 text-xs font-bold"
                    style={{ backgroundColor: "var(--yellow)", color: "#92400E" }}
                  >
                    {vehicle.plate}
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-xs text-[var(--text-dim)]">
                  Aktif araç bulunamadı. Garajından bir araç seç.
                </p>
              )}
              <p className="mt-2 flex items-center gap-1 text-xs text-[var(--text-dim)]">
                <span>🔒</span>
                <span>Plaka şoföre gösterilir.</span>
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Ne zaman?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("hemen")}
                  className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-bold ${
                    mode === "hemen"
                      ? "bg-[#111] text-white"
                      : "bg-[var(--bg-soft)] text-[var(--text)]"
                  }`}
                >
                  ⚡ Hemen
                </button>
                <button
                  type="button"
                  onClick={() => setMode("randevulu")}
                  className={`flex-1 rounded-[14px] px-4 py-3 text-sm font-bold ${
                    mode === "randevulu"
                      ? "bg-[#111] text-white"
                      : "bg-[var(--bg-soft)] text-[var(--text)]"
                  }`}
                >
                  📅 Randevulu
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}
