"use client";

import { useRouter } from "next/navigation";

export default function SoforNavigasyonPage() {
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
          Navigasyon
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--green)]/15 px-3 py-1.5 text-xs font-bold text-[var(--green)]">
              <span>➡</span>
              <span>Müşteriye Git</span>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Buluşma Noktası
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                Bağdat Caddesi, Kadıköy (Cafe önünde)
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[#111] p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/70">
                Müşterinin Arabası
              </p>
              <p className="mt-2 text-sm font-bold">🚗 Honda Civic</p>
              <div
                className="mt-2 inline-flex rounded-md px-3 py-1 text-sm font-bold"
                style={{ backgroundColor: "var(--yellow)", color: "#92400E" }}
              >
                34 ZK 4821
              </div>
              <p className="mt-2 text-xs text-white/70">
                Varışında bu arabaya bin, sen süreceksin.
              </p>
            </div>

            <div className="relative h-40 overflow-hidden rounded-[16px] bg-[var(--bg-soft)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-6 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute right-6 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute left-0 top-10 h-px w-full bg-[var(--border)]" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-[var(--border)]" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-6 bottom-8 text-xl">🚶</span>
                <span className="absolute right-6 top-8 text-xl">📍</span>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🙂</span>
                  <div>
                    <p className="font-bold text-[var(--text)]">Mert</p>
                    <p className="text-xs text-[var(--text-dim)]">
                      ★ 4.8 • 120+ sefer
                    </p>
                  </div>
                </div>
                <button className="rounded-[14px] bg-[var(--bg-soft)] px-4 py-2 text-sm font-bold text-[var(--text)]">
                  📞 Ara
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/sofor/tamamlandi")}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Müşteriyle Buluştum, Yola Çıkıyorum
          </button>
        </section>
      </main>
    </div>
  );
}
