"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

function SoforOdemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async () => {
    if (!requestId || loading) return;
    if (rating === 0) {
      setError("Lütfen bir puan seç.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      const { data: req, error: reqError } = await supabase
        .from("ride_requests")
        .select("driver_id")
        .eq("id", requestId)
        .single();
      if (reqError) throw reqError;

      const driverId = req.driver_id as string;

      const { error: reviewError } = await supabase.from("reviews").insert({
        reviewer_id: user.id,
        reviewee_id: driverId,
        request_id: requestId,
        request_type: "ride",
        rating,
        comment: null,
      });
      if (reviewError) throw reviewError;

      const { error: statusError } = await supabase
        .from("ride_requests")
        .update({ status: "tamamlandi" })
        .eq("id", requestId);
      if (statusError) throw statusError;

      const { data: avgData, error: avgError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewee_id", driverId)
        .eq("request_type", "ride");
      if (avgError) throw avgError;

      const avg =
        (avgData?.reduce((sum, r) => sum + r.rating, 0) ?? 0) /
        (avgData?.length || 1);

      await supabase
        .from("driver_profiles")
        .update({ rating: avg })
        .eq("user_id", driverId);

      router.push("/musteri/anasayfa");
    } catch (err) {
      console.error(err);
      setError("İşlem tamamlanamadı. Lütfen tekrar dene.");
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
          Ödeme
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--green)]/10 p-4 text-center">
              <p className="text-3xl">🎉</p>
              <p className="mt-2 text-lg font-bold text-[var(--text)]">
                Eve Ulaştın!
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Şoförün seni ve aracını güvenle bıraktı.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Rota Özeti
              </p>
              <p className="mt-2 text-sm text-[var(--text)]">
                Bağdat Caddesi → Moda, yaklaşık 18 dakika sürdü.
              </p>

              <div className="mt-4 h-px bg-[var(--border)]" />

              <p className="mt-4 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Ücret Detayı
              </p>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center justify-between text-[var(--text)]">
                  <span className="text-[var(--text-dim)]">Mesafe</span>
                  <span>260 TL</span>
                </div>
                <div className="flex items-center justify-between text-[var(--text)]">
                  <span className="text-[var(--text-dim)]">Platform hizmeti</span>
                  <span>40 TL</span>
                </div>
                <div className="flex items-center justify-between pt-2 font-bold text-[var(--text)]">
                  <span>Toplam</span>
                  <span>300 TL</span>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Şoförü Değerlendir
              </p>
              <div className="mt-3 flex justify-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={
                      star <= rating
                        ? "text-[var(--yellow)] opacity-100"
                        : "text-[var(--text-muted)]"
                    }
                    style={
                      star <= rating
                        ? { color: "var(--yellow)" }
                        : undefined
                    }
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            disabled={loading}
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "İşleniyor..." : "Ödemeyi Tamamla"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default function SoforOdemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Ödeme ekranı yükleniyor...
        </div>
      }
    >
      <SoforOdemeContent />
    </Suspense>
  );
}
