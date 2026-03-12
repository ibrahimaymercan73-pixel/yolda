"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CekiciKonumPage() {
  const router = useRouter();
  const [from, setFrom] = useState("Kadıköy, İstanbul");
  const [to, setTo] = useState("");

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/musteri/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Çekici Çağır
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-4">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="h-5 w-px bg-[var(--border)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Araç nerede?
                    </span>
                    <input
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Nereye götürülsün?
                    </span>
                    <input
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Varış adresini yaz"
                      className="mt-1 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Hızlı seçenekler
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTo("Evim")}
                  className="rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-semibold text-[var(--text)]"
                >
                  🏠 Evim
                </button>
                <button
                  type="button"
                  onClick={() => setTo("Yakın Servis")}
                  className="rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-semibold text-[var(--text)]"
                >
                  🔧 Yakın Servis
                </button>
                <button
                  type="button"
                  onClick={() => setTo("Tamirci")}
                  className="rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-semibold text-[var(--text)]"
                >
                  🔩 Tamirci
                </button>
              </div>
            </div>

            <div className="relative h-40 overflow-hidden rounded-[16px] bg-[var(--bg-soft)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-8 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute right-10 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute left-0 top-10 h-px w-full bg-[var(--border)]" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-[var(--border)]" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-8 bottom-6 text-xl font-bold text-[var(--text)]">
                  A
                </span>
                <span className="absolute right-10 top-6 text-xl font-bold text-[var(--text)]">
                  B
                </span>
                <div className="absolute left-10 top-8 h-1 w-40 rotate-6 bg-[var(--text-muted)]/50" />
              </div>
              <div className="absolute left-3 top-3 rounded-full bg-black/10 px-3 py-1 text-[10px] font-semibold text-[var(--text)]">
                ~ 12 km • 18 dk
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push("/musteri/cekici-cagir/detaylar")}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}
