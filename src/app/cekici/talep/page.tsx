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
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/cekici/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Talebi İncele
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">
                🔔 Yeni Çekici Talebi!
              </p>
              <p className="mt-1 text-xs text-[var(--text-dim)]">
                Uygunsan fiyat teklifini gir, değilse bu talebi geçebilirsin.
              </p>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Rota ve Kazanç
              </p>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                Kadıköy → Yakın Servis
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Mesafe</p>
                  <p className="text-sm font-bold text-[var(--text)]">12 km</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Sana Uzaklık</p>
                  <p className="text-sm font-bold text-[var(--text)]">3.2 km</p>
                </div>
                <div>
                  <p className="text-[10px] text-[var(--text-muted)]">Tahmini Kazanç</p>
                  <p className="text-sm font-bold text-[var(--green)]">
                    ₺{price || "0"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--green)]/10 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--green)]">
                Araç Detayları
              </p>
              <div className="mt-3 grid grid-cols-4 gap-2 text-xs">
                <div className="rounded-[14px] bg-[var(--bg-card)] px-2 py-2">
                  <p className="text-[10px] text-[var(--text-muted)]">Tip</p>
                  <p className="mt-0.5 font-bold text-[var(--text)]">Sedan</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-card)] px-2 py-2">
                  <p className="text-[10px] text-[var(--text-muted)]">Vites</p>
                  <p className="mt-0.5 font-bold text-[var(--text)]">Otomatik</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-card)] px-2 py-2">
                  <p className="text-[10px] text-[var(--text-muted)]">Çekiş</p>
                  <p className="mt-0.5 font-bold text-[var(--text)]">2WD</p>
                </div>
                <div className="rounded-[14px] bg-[var(--bg-card)] px-2 py-2">
                  <p className="text-[10px] text-[var(--text-muted)]">Plaka</p>
                  <p className="mt-0.5 font-bold text-[var(--text)]">34 ABC 987</p>
                </div>
              </div>

              <div className="mt-3 rounded-[14px] bg-red-500/20 px-3 py-2 text-xs">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-red-600">
                  Arıza Nedeni
                </p>
                <p className="mt-1 font-semibold text-[var(--text)]">
                  🔴 Lastik Patladı
                </p>
              </div>

              <div className="mt-3 rounded-[14px] bg-[var(--bg-card)] p-3 text-xs">
                <p className="text-[10px] font-bold text-[var(--text-muted)]">
                  Müşteri notu
                </p>
                <p className="mt-1 text-[var(--text)]">
                  Sağ ön lastik tamamen inik, araç müsait bir kenarda bekliyor.
                </p>
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">
                Fiyat Teklifi
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-lg font-bold text-[var(--text-dim)]">₺</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-24 rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-3 py-2 text-2xl font-bold text-[var(--text)] outline-none"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {quickPrices.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPrice(p)}
                    className="rounded-[14px] bg-[var(--bg-soft)] px-4 py-2 font-bold text-[var(--text)]"
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
              className="flex-1 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3 font-bold text-[var(--text)] disabled:opacity-50"
            >
              Bu Talebi Geç
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-[14px] bg-[#111] px-4 py-3 font-bold text-white disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Teklif Gönder 📤"}
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

export default function CekiciTalepPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Çekici talebi yükleniyor...
        </div>
      }
    >
      <CekiciTalepContent />
    </Suspense>
  );
}
