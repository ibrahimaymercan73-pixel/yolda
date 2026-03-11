"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SoforAnasayfaPage() {
  const router = useRouter();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!online) return;
    const timer = setTimeout(() => {
      router.push("/sofor/talep");
    }, 1500);
    return () => clearTimeout(timer);
  }, [online, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Şoför Paneli
          </p>
          <h1 className="text-xl font-semibold">Bugünkü Özet</h1>
        </header>

        <section className="space-y-4">
          <div className="rounded-3xl bg-gradient-to-br from-[#FF4500] to-[#FF7A00] px-4 py-4 text-white shadow-sm shadow-orange-500/40">
            <p className="text-xs font-semibold uppercase tracking-[0.28em]">
              Bugünkü Kazancın 💰
            </p>
            <p className="mt-2 text-3xl font-semibold">₺840</p>
            <p className="mt-1 text-xs text-orange-100">6 sefer tamamlandı</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Puan
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-50">4.9</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Sefer
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-50">6</p>
            </div>
            <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Kabul Oranı
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-50">92%</p>
            </div>
          </div>
        </section>

        <section className="mt-6 flex-1 space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-slate-950 px-4 py-3 text-xs">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                Durum
              </p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  online ? "text-emerald-400" : "text-slate-400"
                }`}
              >
                {online ? "ÇEVRİMİÇİ" : "ÇEVRİMDIŞI"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnline((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full border transition ${
                online
                  ? "border-emerald-500 bg-emerald-600"
                  : "border-slate-700 bg-slate-800"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  online ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {online ? (
            <div className="space-y-3 rounded-3xl border border-emerald-700 bg-emerald-950/60 px-4 py-4 text-xs text-emerald-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-200">
                ÇEVRİMİÇİSİN
              </p>
              <p>
                Yeni iş talepleri için görünürsün. Sana en yakın ve puanına
                uygun müşteri talepleri gösterilecek.
              </p>
              <p className="mt-1 text-[11px] text-emerald-200">
                Kısa süre içinde bir iş talebi simüle edilecek.
              </p>
            </div>
          ) : (
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-xs text-slate-300">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                ÇEVRİMDIŞISIN
              </p>
              <p className="flex items-center gap-2">
                <span className="text-2xl">💤</span>
                <span>
                  Rahat bir mola veriyorsun. Yeni iş talepleri şu anda sana
                  gösterilmeyecek.
                </span>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

