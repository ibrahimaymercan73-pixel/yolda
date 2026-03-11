"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type StoredVehicle = {
  id: string;
  brand: string;
  model: string;
  color: string;
  plate: string;
  isActive: boolean;
};

const STORAGE_KEY = "yolda_vehicles";

function loadActiveVehicle(): StoredVehicle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as StoredVehicle[];
    const active = list.find((v) => v.isActive) ?? list[0];
    return active ?? null;
  } catch {
    return null;
  }
}

type Mode = "hemen" | "randevulu";

export default function SoforKonumPage() {
  const router = useRouter();
  const [from, setFrom] = useState("Kadıköy, İstanbul");
  const [to, setTo] = useState("");
  const [mode, setMode] = useState<Mode>("hemen");
  const [vehicle, setVehicle] = useState<StoredVehicle | null>(null);

  useEffect(() => {
    setVehicle(loadActiveVehicle());
  }, []);

  const handleContinue = () => {
    if (mode === "hemen") {
      router.push("/musteri/sofor-iste/liste");
    } else {
      router.push("/musteri/sofor-iste/randevu");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/musteri/anasayfa")}
            className="rounded-full border border-slate-800 bg-slate-950 px-2 py-1 text-sm"
          >
            ←
          </button>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
              Müşteri
            </p>
            <h1 className="text-xl font-semibold">Şoför İste</h1>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            {/* Nereden / Nereye */}
            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#FF4500]" />
                  <span className="h-6 w-px bg-slate-700" />
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Nereden
                    </p>
                    <input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-medium text-slate-50 outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Nereye
                    </p>
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Varış noktasını yaz"
                      className="mt-1 w-full bg-transparent text-sm font-medium text-slate-50 placeholder:text-slate-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Araç bilgisi */}
            <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Şoförün süreceği araç
              </p>
              {vehicle ? (
                <div className="flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🚗</span>
                    <span className="font-medium">
                      {vehicle.brand} {vehicle.model}
                    </span>
                  </div>
                  <div className="inline-flex items-center justify-center rounded-md border border-yellow-500 bg-gradient-to-b from-yellow-300 to-yellow-500 px-3 py-0.5 text-xs font-semibold tracking-[0.18em] text-slate-900">
                    {vehicle.plate}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Aktif araç bulunamadı. Garajından bir araç seç.
                </p>
              )}
              <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                <span>🔒</span>
                <span>Plaka şoföre gösterilir.</span>
              </p>
            </div>

            {/* Mod seçici */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Ne zaman?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode("hemen")}
                  className={`flex-1 rounded-2xl px-3 py-2 text-sm font-semibold ${
                    mode === "hemen"
                      ? "bg-[#FF4500] text-white shadow-sm shadow-orange-500/40"
                      : "bg-slate-900 text-slate-300"
                  }`}
                >
                  ⚡ Hemen
                </button>
                <button
                  type="button"
                  onClick={() => setMode("randevulu")}
                  className={`flex-1 rounded-2xl px-3 py-2 text-sm font-semibold ${
                    mode === "randevulu"
                      ? "bg-[#FF4500] text-white shadow-sm shadow-orange-500/40"
                      : "bg-slate-900 text-slate-300"
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
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm shadow-orange-500/40"
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}

