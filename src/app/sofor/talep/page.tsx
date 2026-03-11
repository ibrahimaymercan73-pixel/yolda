"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

const TOTAL_SECONDS = 10;

export default function SoforTalepPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setTimeout(
      () => setRemaining((prev) => Math.max(prev - 1, 0)),
      1000
    );
    return () => clearTimeout(id);
  }, [remaining]);

  const progress = ((TOTAL_SECONDS - remaining) / TOTAL_SECONDS) * 100;

  const handleReject = () => {
    if (loading) return;
    router.push("/sofor/anasayfa");
  };

  const handleAccept = async () => {
    if (!requestId || loading) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const { error: updateError } = await supabase
        .from("ride_requests")
        .update({ status: "eslesti", driver_id: user.id })
        .eq("id", requestId);
      if (updateError) throw updateError;
      router.push(`/sofor/navigasyon?request_id=${requestId}`);
    } catch (err) {
      console.error(err);
      setError("Talep kabul edilemedi. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Şoför Paneli
          </p>
          <h1 className="text-xl font-semibold">Yeni İş Talebi</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-2xl bg-amber-500/15 px-4 py-3 text-xs">
              <p className="text-sm font-semibold text-amber-300">
                🔔 Yeni İş Talebi!
              </p>
              <p className="mt-1 text-amber-100">
                Uygun değilsen reddedebilirsin, yoksa süre dolmadan kabul et.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#FF4500]" />
                  <span className="h-6 w-px bg-slate-700" />
                  <span className="h-2 w-2 rounded-full bg-[#059669]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Nereden
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      Bağdat Caddesi, Kadıköy
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                      Nereye
                    </p>
                    <p className="mt-1 text-sm font-medium">Moda Sahili</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-[#FF4500]/20 px-4 py-3 text-xs text-orange-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-100">
                Müşterinin Arabası
              </p>
              <div className="mt-1 flex items-center justify-between gap-3">
                <p className="text-sm">
                  🚗 Honda Civic · <span className="font-semibold">34 ZK 4821</span>
                </p>
              </div>
              <p className="mt-1 text-[11px] text-orange-100">
                Süreceğin araç.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Mesafe
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  6.2 km
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Ücret
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  ₺153
                </p>
              </div>
              <div className="rounded-2xl bg-slate-950 px-3 py-3 text-center">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Uzaklık
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-50">
                  7 dk
                </p>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-xs text-slate-400">
                Talep otomatik kapanmadan önce
              </p>
              <p className="text-4xl font-semibold text-slate-50">
                {remaining}s
              </p>
              <div className="mx-auto mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 text-sm">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="flex-1 rounded-2xl bg-red-600/80 px-4 py-3 font-semibold text-white disabled:bg-slate-700"
            >
              ✗ Reddet
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:bg-slate-700"
            >
              {loading ? "Gönderiliyor..." : "✓ Kabul Et"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

