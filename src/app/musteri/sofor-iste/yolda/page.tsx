"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SoforYoldaPage() {
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Şoför İste
          </p>
          <h1 className="text-xl font-semibold">Şoför Yolda</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-600/15 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span>✓</span>
              <span>Şoför yola çıktı!</span>
            </div>

            {/* Şoför kartı */}
            <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧑‍✈️</span>
                <div>
                  <p className="text-sm font-semibold">Ahmet</p>
                  <p className="text-xs text-slate-400">
                    Kendi yöntemiyle geliyor. Konumun şoförle paylaşılmaz.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl bg-slate-900 px-3 py-2 text-xs">
                <p className="font-medium">Araç bilgisi</p>
                <p className="mt-1 text-slate-300">
                  Ahmet bu arabayı sürecek: <span className="font-semibold">Honda Civic</span> •{" "}
                  <span className="font-semibold">34 ZK 4821</span>
                </p>
              </div>
            </div>

            {/* Tahmini süre */}
            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="text-slate-400">Tahmini varış süresi</p>
              <p className="text-lg font-semibold">{eta} dakika</p>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div className="h-full w-3/5 bg-primary" />
              </div>
            </div>

            {/* Sahte harita */}
            <div className="relative h-40 overflow-hidden rounded-2xl bg-slate-900">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute left-8 top-0 h-full w-px bg-slate-700" />
                <div className="absolute right-8 top-0 h-full w-px bg-slate-700" />
                <div className="absolute left-0 top-10 h-px w-full bg-slate-700" />
                <div className="absolute left-0 bottom-8 h-px w-full bg-slate-700" />
              </div>
              <div className="relative h-full w-full">
                <span className="absolute left-1/3 top-1/3 text-xl">🚗</span>
                <span className="absolute right-6 bottom-8 text-xl">📍</span>
              </div>
            </div>

            {/* Aksiyon butonları */}
            <div className="flex gap-3 text-sm">
              <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-slate-100">
                📞 Ara
              </button>
              <button className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-slate-100">
                💬 Mesaj
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStart}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Güncelleniyor..." : "Şoför Geldi, Yola Çıktım"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

