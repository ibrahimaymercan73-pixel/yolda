"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CekiciKonumPage() {
  const router = useRouter();
  const [from, setFrom] = useState("Kadıköy, İstanbul");
  const [to, setTo] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Müşteri
          </p>
          <h1 className="text-xl font-semibold">Çekici Çağır</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            {/* Nerede / Nereye */}
            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-6 w-px bg-slate-700" />
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Araç nerede?
                    </p>
                    <input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1 w-full bg-transparent text-sm font-medium text-slate-50 outline-none"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Nereye götürülsün?
                    </p>
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Varış adresini yaz"
                      className="mt-1 w-full bg-transparent text-sm font-medium text-slate-50 placeholder:text-slate-600 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Hızlı seçenekler */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Hızlı seçenekler</p>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTo("Evim")}
                  className="rounded-2xl bg-slate-900 px-3 py-2"
                >
                  🏠 Evim
                </button>
                <button
                  type="button"
                  onClick={() => setTo("Yakın Servis")}
                  className="rounded-2xl bg-slate-900 px-3 py-2"
                >
                  🔧 Yakın Servis
                </button>
                <button
                  type="button"
                  onClick={() => setTo("Tamirci")}
                  className="rounded-2xl bg-slate-900 px-3 py-2"
                >
                  🔩 Tamirci
                </button>
              </div>
            </div>

            {/* Sahte harita */}
            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-8 top-0 h-full w-px bg-slate-700" />
                <div className="absolute right-10 top-0 h-full w-px bg-slate-700" />
                <div className="absolute left-0 top-10 h-px w-full bg-slate-700" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-slate-700" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-8 bottom-6 text-xl">A</span>
                <span className="absolute right-10 top-6 text-xl">B</span>
                <div className="absolute left-10 top-8 h-1 w-40 rotate-6 bg-slate-500/70" />
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] text-slate-100">
                ~ 12 km • 18 dk
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/musteri/cekici-cagir/detaylar")}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/40"
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}

