"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CekiciYoldaPage() {
  const router = useRouter();
  const [eta] = useState(14);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Çekici Çağır
          </p>
          <h1 className="text-xl font-semibold">Çekici Yolda</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span>✓</span>
              <span>Çekici yola çıktı!</span>
            </div>

            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs">
              <p className="text-sm font-semibold text-slate-100">
                Anadolu Oto Kurtarma
              </p>
              <p className="text-slate-400">
                Plaka: <span className="font-semibold">34 ABC 987</span>
              </p>
              <p className="text-slate-400">
                Ekipman: Hidrolik platform, halat, çelik vinç.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="text-slate-400">Tahmini varış süresi</p>
              <p className="text-lg font-semibold">{eta} dakika</p>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-2/3 bg-emerald-500" />
              </div>
            </div>

            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-slate-700" />
                <div className="absolute right-6 top-0 h-full w-px bg-slate-700" />
                <div className="absolute left-0 top-10 h-px w-full bg-slate-700" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-slate-700" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-6 bottom-8 text-xl">🚛</span>
                <span className="absolute right-6 top-8 text-xl">📍</span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-slate-100">
                📞 Ara
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/musteri/cekici-cagir/odeme")}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Araç Teslim Edildi
          </button>
        </section>
      </main>
    </div>
  );
}

