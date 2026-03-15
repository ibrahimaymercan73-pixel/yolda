"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

const TOTAL_SECONDS = 10;

function SoforTalepContent() {
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
      if (!user) return;
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
          Yeni İş Talebi
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">
                🔔 Yeni İş Talebi!
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Uygun değilsen reddedebilirsin, yoksa süre dolmadan kabul et.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-[#111]" />
                  <span className="h-5 w-px bg-[var(--border)]" />
                  <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
                </div>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Nereden
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                      Bağdat Caddesi, Kadıköy
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                      Nereye
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--text)]">
                      Moda Sahili
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[#111] p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/70">
                Müşterinin Arabası
              </p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">
                  🚗 Honda Civic · <span className="font-bold">34 ZK 4821</span>
                </p>
              </div>
              <p className="mt-2 text-xs text-white/70">Süreceğin araç.</p>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Mesafe
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">
                  6.2 km
                </p>
              </div>
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Ücret
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--text)]">
                  ₺153
                </p>
              </div>
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                  Uzaklık
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--green)]">
                  7 dk
                </p>
              </div>
            </div>

            <div className="space-y-2 text-center">
              <p className="text-xs text-[var(--text-dim)]">
                Talep otomatik kapanmadan önce
              </p>
              <p className="text-4xl font-bold text-[var(--text)]">
                {remaining}s
              </p>
              <div className="mx-auto mt-1 h-2 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full rounded-full bg-[var(--green)] transition-all duration-300"
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
              className="flex-1 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-bold text-red-600 disabled:opacity-50"
            >
              ✗ Reddet
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 rounded-[14px] bg-[var(--green)] px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "✓ Kabul Et"}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default function SoforTalepPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          İş talebi yükleniyor...
        </div>
      }
    >
      <SoforTalepContent />
    </Suspense>
  );
}
