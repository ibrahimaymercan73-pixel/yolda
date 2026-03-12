"use client";

import { useRouter } from "next/navigation";

export default function SoforTamamlandiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/sofor/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Sefer Tamamlandı
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--green)]/40 bg-[var(--green)]/10 p-4 text-center">
              <p className="text-3xl">💰</p>
              <p className="mt-2 text-lg font-bold text-[var(--text)]">
                Kazanılan: <span className="text-[var(--green)]">₺153</span>
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                ₺180 - %15 komisyon
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Müşterinin Değerlendirmesi
              </p>
              <p className="mt-2 text-2xl">⭐⭐⭐⭐⭐</p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Bugünkü Özet
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Toplam
                  </p>
                  <p className="mt-1 font-bold text-[var(--text)]">₺840</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Sefer
                  </p>
                  <p className="mt-1 font-bold text-[var(--text)]">6</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                    Puan
                  </p>
                  <p className="mt-1 font-bold text-[var(--text)]">4.9</p>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sofor/anasayfa")}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Yeni İş Bekle
          </button>
        </section>
      </main>
    </div>
  );
}
