"use client";

import { useRouter } from "next/navigation";

export default function SoforTamamlandiPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Şoför Paneli
          </p>
          <h1 className="text-xl font-semibold">Sefer Tamamlandı</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-3xl bg-emerald-600/10 px-4 py-4 text-center">
              <p className="text-3xl">💰</p>
              <p className="mt-2 text-lg font-semibold">
                Kazanılan: <span className="text-emerald-400">₺153</span>
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                ₺180 - %15 komisyon
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <div>
                <p className="font-semibold text-slate-200">
                  Müşterinin Değerlendirmesi
                </p>
                <p className="mt-2 text-2xl">⭐⭐⭐⭐⭐</p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-200">Bugünkü Özet</p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Toplam
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    ₺840
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Sefer
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">6</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                    Puan
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-50">
                    4.9
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sofor/anasayfa")}
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Yeni İş Bekle
          </button>
        </section>
      </main>
    </div>
  );
}

