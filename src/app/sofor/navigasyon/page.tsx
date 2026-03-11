"use client";

import { useRouter } from "next/navigation";

export default function SoforNavigasyonPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Şoför Paneli
          </p>
          <h1 className="text-xl font-semibold">Navigasyon</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span>➡</span>
              <span>Müşteriye Git</span>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Buluşma Noktası
              </p>
              <p className="mt-1 text-sm font-medium text-slate-50">
                Bağdat Caddesi, Kadıköy (Cafe önünde)
              </p>
            </div>

            <div className="space-y-2 rounded-3xl bg-[#FF4500]/20 px-4 py-4 text-xs text-orange-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-100">
                Müşterinin Arabası
              </p>
              <p className="mt-1 text-sm font-semibold">🚗 Honda Civic</p>
              <div className="mt-2 inline-flex items-center justify-center rounded-md border border-yellow-500 bg-gradient-to-b from-yellow-300 to-yellow-500 px-4 py-1 text-sm font-semibold tracking-[0.25em] text-slate-900">
                34 ZK 4821
              </div>
              <p className="mt-2 text-[11px] text-orange-100">
                Varışında bu arabaya bin, sen süreceksin.
              </p>
            </div>

            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-slate-700" />
                <div className="absolute right-6 top-0 h-full w-px bg-slate-700" />
                <div className="absolute left-0 top-10 h-px w-full bg-slate-700" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-slate-700" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-6 bottom-8 text-xl">🚶</span>
                <span className="absolute right-6 top-8 text-xl">📍</span>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🙂</span>
                  <div>
                    <p className="text-sm font-semibold">Mert</p>
                    <p className="text-[11px] text-slate-400">
                      ★ 4.8 • 120+ sefer
                    </p>
                  </div>
                </div>
                <button className="rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-100">
                  📞 Ara
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sofor/tamamlandi")}
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Müşteriyle Buluştum, Yola Çıkıyorum
          </button>
        </section>
      </main>
    </div>
  );
}

