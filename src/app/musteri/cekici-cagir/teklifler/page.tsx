"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type TowOfferRow = {
  id: string;
  tow_provider_id: string;
  price: number;
};

function CekiciTekliflerContent() {
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
          3 Teklif Geldi 🎯
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-3">
            {loading && (
              <p className="text-sm text-[var(--text-dim)]">
                Teklifler yükleniyor...
              </p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            {!loading &&
              offers.map((offer) => {
                const active = selectedId === offer.id;
                return (
                  <button
                    key={offer.id}
                    type="button"
                    onClick={() => setSelectedId(offer.id)}
                    className={`w-full rounded-[16px] border p-4 text-left text-sm transition ${
                      active
                        ? "border-[#111] bg-[var(--bg-card)] ring-2 ring-[#111]"
                        : "border-[var(--border)] bg-[var(--bg-card)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[var(--text)]">
                          Çekici Teklifi
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-dim)]">
                          Sağlayıcı: {offer.tow_provider_id.slice(0, 6)}…
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--green)]">
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
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {saving ? "Onaylanıyor..." : "Seçili Çekiciyi Onayla"}
          </button>
        </section>
      </main>
    </div>
  );
}

export default function CekiciTekliflerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Çekici teklifleri yükleniyor...
        </div>
      }
    >
      <CekiciTekliflerContent />
    </Suspense>
  );
}
