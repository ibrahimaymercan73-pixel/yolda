"use client";

import { useRouter } from "next/navigation";

export default function CekiciTamamlandiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/cekici/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          İş Tamamlandı
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--green)]/40 bg-[var(--green)]/10 p-4 text-center">
              <p className="text-3xl">💰</p>
              <p className="mt-2 text-lg font-bold text-[var(--text)]">
                Net Kazanç: <span className="text-[var(--green)]">₺420</span>
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Brüt ₺480 - platform kesintileri.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                İş Özeti
              </p>
              <p className="mt-2 text-sm text-[var(--text)]">
                Araç Kadıköy&apos;den alındı ve Yakın Servis noktasına güvenle
                teslim edildi.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Toplam Süre</p>
                  <p className="mt-1 font-bold text-[var(--text)]">35 dk</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Mesafe</p>
                  <p className="mt-1 font-bold text-[var(--text)]">12 km</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Müşteri Puanı</p>
                  <p className="mt-1">⭐⭐⭐⭐⭐</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/cekici/anasayfa")}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Yeni Talep Bekle
          </button>
        </section>
      </main>
    </div>
  );
}
