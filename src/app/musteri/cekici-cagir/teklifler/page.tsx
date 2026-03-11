"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type TowOfferRow = {
  id: string;
  tow_provider_id: string;
  price: number;
};

export default function CekiciTekliflerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [offers, setOffers] = useState<TowOfferRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    async function fetchOffers() {
      setLoading(true);
      setError(null);
      try {
        const { data, error: oError } = await supabase
          .from("tow_offers")
          .select("id,tow_provider_id,price,status")
          .eq("tow_request_id", requestId)
          .eq("status", "bekliyor");
        if (oError) throw oError;
        if (!cancelled) {
          setOffers((data ?? []) as TowOfferRow[]);
          setSelectedId(data?.[0]?.id ?? null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Teklifler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchOffers();
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const handleConfirm = async () => {
    if (!selectedId || !requestId || saving) return;
    setSaving(true);
    setError(null);
    try {
      await supabase
        .from("tow_offers")
        .update({ status: "kabul" })
        .eq("id", selectedId);

      await supabase
        .from("tow_offers")
        .update({ status: "red" })
        .eq("tow_request_id", requestId)
        .neq("id", selectedId);

      await supabase
        .from("tow_requests")
        .update({ status: "eslesti" })
        .eq("id", requestId);

      router.push(`/musteri/cekici-cagir/yolda?request_id=${requestId}`);
    } catch (err) {
      console.error(err);
      setError("Teklif onaylanamadı. Lütfen tekrar dene.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Çekici Çağır
          </p>
          <h1 className="text-xl font-semibold">3 Teklif Geldi 🎯</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-3">
            {loading && (
              <p className="text-sm text-slate-400">Teklifler yükleniyor...</p>
            )}
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            {!loading &&
              offers.map((offer) => {
                const active = selectedId === offer.id;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => setSelectedId(offer.id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                      active
                        ? "border-emerald-500 bg-slate-900"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-50">
                          Çekici Teklifi
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                          Sağlayıcı: {offer.tow_provider_id.slice(0, 6)}…
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-emerald-400">
                          ₺{offer.price}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            disabled={!selectedId || saving}
            onClick={handleConfirm}
            className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              selectedId && !saving
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-500/40"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            {saving ? "Onaylanıyor..." : "Seçili Çekiciyi Onayla"}
          </button>
        </section>
      </main>
    </div>
  );
}

