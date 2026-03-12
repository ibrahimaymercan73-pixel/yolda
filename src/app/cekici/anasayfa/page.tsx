"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CekiciAnasayfaPage() {
  const router = useRouter();
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (!online) return;
    const timer = setTimeout(() => {
      router.push("/cekici/talep");
    }, 1500);
    return () => clearTimeout(timer);
  }, [online, router]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
          Çekici Paneli
        </p>
        <h1
          className="mt-1 text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Bugünkü Özet
        </h1>

        <section className="mt-6 space-y-4">
          <div className="rounded-[16px] border border-[var(--border)] bg-[#111] px-4 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/70">
              Bugünkü Kazancın 💰
            </p>
            <p className="mt-2 text-3xl font-bold">₺1.240</p>
            <p className="mt-1 text-xs text-white/70">
              4 çekici işi tamamlandı
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Puan
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">4.8</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                İş
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">4</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Teslim Oranı
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">100%</p>
            </div>
          </div>
        </section>

        <section className="mt-6 flex-1 space-y-4">
          <div className="flex items-center justify-between rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Durum
              </p>
              <p
                className={`mt-1 text-sm font-bold ${
                  online ? "text-[var(--green)]" : "text-[var(--text-dim)]"
                }`}
              >
                {online ? "ÇEVRİMİÇİ" : "ÇEVRİMDIŞI"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOnline((prev) => !prev)}
              className={`relative h-7 w-12 rounded-full border transition ${
                online
                  ? "border-[var(--green)] bg-[var(--green)]"
                  : "border-[var(--border)] bg-[var(--bg-soft)]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  online ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {online ? (
            <div className="rounded-[16px] border border-[var(--green)]/40 bg-[var(--green)]/10 p-4 text-sm">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--green)]">
                ÇEVRİMİÇİSİN
              </p>
              <p className="mt-2 text-[var(--text)]">
                Yakın çevrendeki çekici talepleri sana gösterilecek. Fiyat
                teklifinle diğer sağlayıcılarla yarışacaksın.
              </p>
              <p className="mt-2 text-xs text-[var(--green)]">
                Kısa süre içinde bir çekici talebi simüle edilecek.
              </p>
            </div>
          ) : (
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-sm">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                ÇEVRİMDIŞISIN
              </p>
              <p className="mt-2 flex items-center gap-2 text-[var(--text-dim)]">
                <span className="text-2xl">💤</span>
                <span>
                  Yeni çekici talepleri şu anda sana gösterilmeyecek.
                </span>
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
