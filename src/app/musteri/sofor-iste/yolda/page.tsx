"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function SoforYoldaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [eta] = useState(8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    if (!requestId || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { error: updateError } = await supabase
        .from("ride_requests")
        .update({ status: "yolda" })
        .eq("id", requestId);
      if (updateError) throw updateError;
      router.push(`/musteri/sofor-iste/odeme?request_id=${requestId}`);
    } catch (err) {
      console.error(err);
      setError("Durum güncellenemedi. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

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
          Şoför Yolda
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--green)]/15 px-3 py-1.5 text-xs font-bold text-[var(--green)]">
              <span>✓</span>
              <span>Şoför yola çıktı!</span>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧑‍✈️</span>
                <div>
                  <p className="font-bold text-[var(--text)]">Ahmet</p>
                  <p className="text-xs text-[var(--text-dim)]">
                    Kendi yöntemiyle geliyor. Konumun şoförle paylaşılmaz.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-[14px] bg-[var(--bg-soft)] p-3 text-xs">
                <p className="font-bold text-[var(--text)]">Araç bilgisi</p>
                <p className="mt-1 text-[var(--text-dim)]">
                  Ahmet bu arabayı sürecek:{" "}
                  <span className="font-semibold text-[var(--text)]">
                    Honda Civic
                  </span>{" "}
                  •{" "}
                  <span className="font-semibold text-[var(--text)]">
                    34 ZK 4821
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Tahmini varış süresi
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">
                {eta} dakika
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div className="h-full w-3/5 rounded-full bg-[#111]" />
              </div>
            </div>

            <div className="relative h-40 overflow-hidden rounded-[16px] bg-[var(--bg-soft)]">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-8 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute right-8 top-0 h-full w-px bg-[var(--border)]" />
                <div className="absolute left-0 top-10 h-px w-full bg-[var(--border)]" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-[var(--border)]" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-1/3 top-1/3 text-xl">🚗</span>
                <span className="absolute right-6 bottom-8 text-xl">📍</span>
              </div>
            </div>

            <div className="flex gap-3 text-sm">
              <button className="flex-1 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-bold text-[var(--text)]">
                📞 Ara
              </button>
              <button className="flex-1 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-bold text-[var(--text)]">
                💬 Mesaj
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={loading}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Güncelleniyor..." : "Şoför Geldi, Yola Çıktım"}
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </section>
      </main>
    </div>
  );
}

export default function SoforYoldaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Şoför durumu yükleniyor...
        </div>
      }
    >
      <SoforYoldaContent />
    </Suspense>
  );
}
