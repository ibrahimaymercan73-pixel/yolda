"use client";

import { useRouter } from "next/navigation";

export default function CekiciAktifIsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Aktif İş
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--green)]/40 bg-[var(--green)]/10 p-4 text-center text-sm">
              <p className="text-lg font-bold text-[var(--text)]">
                SEÇİLDİN! 🎯
              </p>
              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Müşteri teklifini kabul etti. Şimdi araç konumuna doğru
                ilerleyebilirsin.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Müşteri ve Araç Özeti
              </p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[var(--text)]">Mert Y.</p>
                  <p className="text-xs text-[var(--text-dim)]">
                    ★ 4.7 • 45 çekici işi
                  </p>
                </div>
                <p className="text-xs text-[var(--text-dim)]">
                  Kadıköy → Yakın Servis
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-[14px] bg-[var(--bg-soft)] p-3">
                  <p className="text-[10px] text-[var(--text-muted)]">Araç Tipi</p>
                  <p className="mt-1 font-bold text-[var(--text)]">Sedan</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-soft)] p-3">
                  <p className="text-[10px] text-[var(--text-muted)]">Vites</p>
                  <p className="mt-1 font-bold text-[var(--text)]">Otomatik</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-soft)] p-3">
                  <p className="text-[10px] text-[var(--text-muted)]">Çekiş</p>
                  <p className="mt-1 font-bold text-[var(--text)]">2WD</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-soft)] p-3">
                  <p className="text-[10px] text-[var(--text-muted)]">Plaka</p>
                  <p className="mt-1 font-bold text-[var(--text)]">34 ABC 987</p>
                </div>
              </div>
            </div>

            <button className="w-full rounded-[14px] bg-[#111] px-4 py-3 text-[15px] font-bold text-white">
              Araç Konumuna Git
            </button>

            <div className="relative h-40 overflow-hidden rounded-[16px] bg-[var(--bg-soft)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute right-6 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute left-0 top-10 h-px w-full bg-[var(--border)]" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-[var(--border)]" />
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
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Araç Teslim Edildi
          </button>
        </section>
      </main>
    </div>
  );
}
