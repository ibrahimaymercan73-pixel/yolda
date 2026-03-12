"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CekiciYoldaPage() {
  const router = useRouter();
  const [eta] = useState(14);

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
          Çekici Yolda
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--green)]/15 px-3 py-1.5 text-xs font-bold text-[var(--green)]">
              <span>✓</span>
              <span>Çekici yola çıktı!</span>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="font-bold text-[var(--text)]">
                Anadolu Oto Kurtarma
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Plaka: <span className="font-semibold text-[var(--text)]">34 ABC 987</span>
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Ekipman: Hidrolik platform, halat, çelik vinç.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Tahmini varış süresi
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">
                {eta} dakika
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div className="h-full w-2/3 rounded-full bg-[var(--green)]" />
              </div>
            </div>

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

            <button className="w-full rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-bold text-[var(--text)]">
              📞 Ara
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/musteri/cekici-cagir/odeme")}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Araç Teslim Edildi
          </button>
        </section>
      </main>
    </div>
  );
}
