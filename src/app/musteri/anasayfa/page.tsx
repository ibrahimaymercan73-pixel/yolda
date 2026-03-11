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

function loadActiveVehicleName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const list = JSON.parse(raw) as StoredVehicle[];
    const active = list.find((v) => v.isActive) ?? list[0];
    if (!active) return null;
    return `${active.brand} ${active.model}`;
  } catch {
    return null;
  }
}

export default function MusteriAnasayfaPage() {
  const router = useRouter();
  const [activeVehicleName, setActiveVehicleName] = useState<string | null>(
    null
  );

  useEffect(() => {
    setActiveVehicleName(loadActiveVehicleName());
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF4500] to-[#FF7A00] p-4 text-white shadow-sm shadow-orange-500/40">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]">
                Günaydın 🌅
              </p>
              <p className="mt-1 text-lg font-semibold">Misafir Kullanıcı</p>
              <p className="mt-2 flex items-center gap-1 text-xs text-orange-100">
                <span>📍</span>
                <span>Kadıköy, İstanbul</span>
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/musteri/garaj")}
              className="rounded-2xl bg-white/15 px-3 py-2 text-left text-xs backdrop-blur-sm"
            >
              <p className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-100">
                <span>🚗</span>
                <span>Aktif Araç</span>
              </p>
              <p className="mt-1 text-xs font-medium text-white">
                {activeVehicleName ?? "Araç seçilmedi"}
              </p>
            </button>
          </div>
        </section>

        {/* Hizmet butonları */}
        <section className="mt-6 space-y-4">
          <button
            type="button"
            onClick={() => router.push("/musteri/sofor-iste")}
            className="flex w-full items-center justify-between rounded-3xl bg-[#FF4500] px-4 py-4 text-left text-white shadow-sm shadow-orange-500/40"
          >
            <div>
              <p className="flex items-center gap-2 text-base font-semibold">
                <span>🚗</span>
                <span>Şoför İste</span>
              </p>
              <p className="mt-1 text-xs text-orange-100">
                Arabanı bırak, seni götürsün.
              </p>
            </div>
            <span className="text-lg">›</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/musteri/cekici-cagir")}
            className="flex w-full items-center justify-between rounded-3xl bg-emerald-600 px-4 py-4 text-left text-white shadow-sm shadow-emerald-500/40"
          >
            <div>
              <p className="flex items-center gap-2 text-base font-semibold">
                <span>🚛</span>
                <span>Çekici Çağır</span>
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                Arabanı nereye istersen götürsün.
              </p>
            </div>
            <span className="text-lg">›</span>
          </button>
        </section>

        {/* Geçmiş işlemler */}
        <section className="mt-8 flex-1">
          <div className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Geçmiş İşlemler
            </p>

            <div className="mt-3 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚗</span>
                  <div>
                    <p className="font-medium">Bağdat Caddesi → Moda</p>
                    <p className="text-xs text-slate-500">Dün • 320 TL</p>
                  </div>
                </div>
                <span className="text-sm text-emerald-400">✓</span>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚛</span>
                  <div>
                    <p className="font-medium">Kadıköy → Ataşehir</p>
                    <p className="text-xs text-slate-500">
                      2 gün önce • 1.200 TL
                    </p>
                  </div>
                </div>
                <span className="text-sm text-emerald-400">✓</span>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚗</span>
                  <div>
                    <p className="font-medium">Cevahir AVM → Üsküdar</p>
                    <p className="text-xs text-slate-500">
                      Geçen hafta • 260 TL
                    </p>
                  </div>
                </div>
                <span className="text-sm text-emerald-400">✓</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

