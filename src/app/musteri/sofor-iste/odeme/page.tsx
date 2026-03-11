"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function SoforOdemePage() {
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Şoför İste
          </p>
          <h1 className="text-xl font-semibold">Ödeme</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-3xl bg-emerald-600/10 px-4 py-4 text-center">
              <p className="text-3xl">🎉</p>
              <p className="mt-2 text-lg font-semibold">Eve Ulaştın!</p>
              <p className="mt-1 text-xs text-emerald-100">
                Şoförün seni ve aracını güvenle bıraktı.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <div>
                <p className="font-semibold text-slate-200">Rota Özeti</p>
                <p className="mt-1 text-slate-400">
                  Bağdat Caddesi → Moda, yaklaşık 18 dakika sürdü.
                </p>
              </div>

              <div className="h-px bg-slate-800" />

              <div className="space-y-1">
                <p className="font-semibold text-slate-200">Ücret Detayı</p>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Mesafe</span>
                  <span>260 TL</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Platform hizmeti</span>
                  <span>40 TL</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm font-semibold">
                  <span>Toplam</span>
                  <span>300 TL</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-3 text-xs">
              <p className="font-semibold text-slate-200">
                Şoförü Değerlendir
              </p>
              <div className="mt-2 flex justify-center gap-2 text-2xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={star <= rating ? "text-yellow-300" : "text-slate-500"}
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
            className="mt-6 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "İşleniyor..." : "Ödemeyi Tamamla"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

