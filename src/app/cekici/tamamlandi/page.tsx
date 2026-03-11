"use client";

import { useRouter } from "next/navigation";

export default function CekiciTamamlandiPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Çekici Paneli
          </p>
          <h1 className="text-xl font-semibold">İş Tamamlandı</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-3xl bg-emerald-600/10 px-4 py-4 text-center">
              <p className="text-3xl">💰</p>
              <p className="mt-2 text-lg font-semibold">
                Net Kazanç: <span className="text-emerald-400">₺420</span>
              </p>
              <p className="mt-1 text-xs text-emerald-100">
                Brüt ₺480 - platform kesintileri.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-200">İş Özeti</p>
              <p className="mt-1 text-slate-400">
                Araç Kadıköy&apos;den alındı ve Yakın Servis noktasına güvenle
                teslim edildi.
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[11px]">
                <div>
                  <p className="text-slate-500">Toplam Süre</p>
                  <p className="mt-1 text-slate-100">35 dk</p>
                </div>
                <div>
                  <p className="text-slate-500">Mesafe</p>
                  <p className="mt-1 text-slate-100">12 km</p>
                </div>
                <div>
                  <p className="text-slate-500">Müşteri Puanı</p>
                  <p className="mt-1 text-slate-100">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/cekici/anasayfa")}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white"
          >
            Yeni Talep Bekle
          </button>
        </section>
      </main>
    </div>
  );
}

