 "use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

function CekiciTalepContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const towRequestId = searchParams.get("request_id");
  const [price, setPrice] = useState<string>("420");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrices = ["390", "420", "480", "520"];

  const handleSubmit = async () => {
    if (!towRequestId || loading) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const numericPrice = Number(price);

      const { data, error: insertError } = await supabase
        .from("tow_offers")
        .insert({
          tow_request_id: towRequestId,
          tow_provider_id: user.id,
          price: numericPrice,
          status: "bekliyor",
        })
        .select("id")
        .single();
      if (insertError) throw insertError;

      router.push(
        `/cekici/bekleme?offer_id=${data.id}&price=${numericPrice}`
      );
    } catch (err) {
      console.error(err);
      setError("Teklif gönderilemedi. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (loading) return;
    router.push("/cekici/anasayfa");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Çekici Paneli
          </p>
          <h1 className="text-xl font-semibold">Talebi İncele</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-2xl bg-emerald-500/15 px-4 py-3 text-xs">
              <p className="text-sm font-semibold text-emerald-300">
                🔔 Yeni Çekici Talebi!
              </p>
              <p className="mt-1 text-emerald-100">
                Uygunsan fiyat teklifini gir, değilse bu talebi geçebilirsin.
              </p>
            </div>

            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-4 text-xs">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                Rota ve Kazanç
              </p>
              <p className="mt-1 text-sm font-medium text-slate-50">
                Kadıköy → Yakın Servis
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[11px] text-slate-500">Mesafe</p>
                  <p className="text-sm font-semibold text-slate-100">
                    12 km
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Sana Uzaklık</p>
                  <p className="text-sm font-semibold text-slate-100">3.2 km</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">Tahmini Kazanç</p>
                  <p className="text-sm font-semibold text-emerald-400">
                    ₺{price || "0"}
                  </p>
                </div>
              </div>
            </div>

            {/* Araç detayları */}
            <div className="space-y-3 rounded-3xl bg-gradient-to-br from-emerald-700 to-emerald-500 px-4 py-4 text-xs text-emerald-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-100">
                Araç Detayları
              </p>
              <div className="grid grid-cols-4 gap-2 text-[11px]">
                <div className="rounded-2xl bg-emerald-900/50 px-2 py-1.5">
                  <p className="text-emerald-200">Tip</p>
                  <p className="mt-0.5 font-semibold">Sedan</p>
                </div>
                <div className="rounded-2xl bg-emerald-900/50 px-2 py-1.5">
                  <p className="text-emerald-200">Vites</p>
                  <p className="mt-0.5 font-semibold">Otomatik</p>
                </div>
                <div className="rounded-2xl bg-emerald-900/50 px-2 py-1.5">
                  <p className="text-emerald-200">Çekiş</p>
                  <p className="mt-0.5 font-semibold">2WD</p>
                </div>
                <div className="rounded-2xl bg-emerald-900/50 px-2 py-1.5">
                  <p className="text-emerald-200">Plaka</p>
                  <p className="mt-0.5 font-semibold">34 ABC 987</p>
                </div>
              </div>

              <div className="rounded-2xl bg-red-600/90 px-3 py-2 text-xs text-red-50">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em]">
                  Arıza Nedeni
                </p>
                <p className="mt-1 text-sm font-semibold">🔴 Lastik Patladı</p>
              </div>

              <div className="rounded-2xl bg-emerald-900/60 px-3 py-2 text-[11px]">
                <p className="text-emerald-100">Müşteri notu</p>
                <p className="mt-1">
                  Sağ ön lastik tamamen inik, araç müsait bir kenarda bekliyor.
                </p>
              </div>
            </div>

            {/* Fiyat teklifi */}
            <div className="space-y-2 rounded-2xl bg-slate-950 px-4 py-4 text-xs">
              <p className="text-sm font-semibold text-slate-100">
                Fiyat Teklifi
              </p>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-semibold text-slate-400">₺</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24 bg-transparent text-3xl font-semibold text-slate-50 outline-none"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {quickPrices.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrice(p)}
                    className="rounded-2xl bg-slate-900 px-3 py-1.5 font-medium text-slate-100"
                  >
                    ₺{p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 text-sm">
            <button
              type="button"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-slate-200 disabled:bg-slate-800 disabled:text-slate-500"
            >
              Bu Talebi Geç
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 font-semibold text-white disabled:bg-slate-700 disabled:text-slate-300"
            >
              {loading ? "Gönderiliyor..." : "Teklif Gönder 📤"}
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

export default function CekiciTalepPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-slate-400">
          Çekici talebi yükleniyor...
        </div>
      }
    >
      <CekiciTalepContent />
    </Suspense>
  );
}

