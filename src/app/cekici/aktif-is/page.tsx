"use client";

import { useRouter } from "next/navigation";

export default function CekiciAktifIsPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Çekici Paneli
          </p>
          <h1 className="text-xl font-semibold">Aktif İş</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-3xl bg-emerald-600/15 px-4 py-4 text-center text-sm text-emerald-200">
              <p className="text-lg font-semibold">SEÇİLDİN! 🎯</p>
              <p className="mt-1 text-xs">
                Müşteri teklifini kabul etti. Şimdi araç konumuna doğru
                ilerleyebilirsin.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-200">
                Müşteri ve Araç Özeti
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">Mert Y.</p>
                  <p className="text-[11px] text-slate-400">
                    ★ 4.7 • 45 çekici işi
                  </p>
                </div>
                <p className="text-[11px] text-slate-400">
                  Kadıköy → Yakın Servis
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-2xl bg-slate-900 px-3 py-2">
                  <p className="text-slate-400">Araç Tipi</p>
                  <p className="mt-1 font-semibold text-slate-100">Sedan</p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-3 py-2">
                  <p className="text-slate-400">Vites</p>
                  <p className="mt-1 font-semibold text-slate-100">Otomatik</p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-3 py-2">
                  <p className="text-slate-400">Çekiş</p>
                  <p className="mt-1 font-semibold text-slate-100">2WD</p>
                </div>
                <div className="rounded-2xl bg-slate-900 px-3 py-2">
                  <p className="text-slate-400">Plaka</p>
                  <p className="mt-1 font-semibold text-slate-100">
                    34 ABC 987
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
            >
              Araç Konumuna Git
            </button>

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
          </div>

          <button
            type="button"
            onClick={() => router.push("/cekici/tamamlandi")}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Araç Teslim Edildi
          </button>
        </section>
      </main>
    </div>
  );
}

