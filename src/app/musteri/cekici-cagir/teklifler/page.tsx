"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type TowProfileRow = {
  user_id: string;
  rating: number | null;
  total_jobs: number | null;
  equipment_type: string | null;
  capacity_ton: number | null;
  users: { full_name: string | null }[] | null;
};

function CekiciTekliflerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [providers, setProviders] = useState<TowProfileRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null); // tow_provider user_id
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    async function fetchProviders() {
      setLoading(true);
      setError(null);
      try {
        // Tow provider list (online + approved)
        const { data, error: pError } = await supabase
          .from("tow_profiles")
          .select("user_id, rating, total_jobs, equipment_type, capacity_ton, users(full_name)")
          .eq("is_online", true)
          .eq("is_approved", true);
        if (pError) throw pError;
        if (!cancelled) {
          const list = (data ?? []) as TowProfileRow[];
          setProviders(list);
          setSelectedId(list[0]?.user_id ?? null);
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Çekiciler yüklenemedi.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchProviders();
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const handleConfirm = async () => {
    if (!selectedId || !requestId || saving) return;
    setSaving(true);
    setError(null);
    try {
      // Demo akışı: müşteri seçimiyle kabul edilmiş bir teklif oluşturuyoruz
      const chosen = providers.find((p) => p.user_id === selectedId);
      const base = 650;
      const jobs = chosen?.total_jobs ?? 0;
      const cap = chosen?.capacity_ton ?? 0;
      const price = Math.round(base + Math.min(jobs, 200) * 1.2 + cap * 40);

      const { error: insertError } = await supabase.from("tow_offers").insert({
        tow_request_id: requestId,
        tow_provider_id: selectedId,
        price,
        estimated_minutes: 15,
        status: "kabul",
      });
      if (insertError) throw insertError;

      const { error: statusError } = await supabase
        .from("tow_requests")
        .update({ status: "eslesti" })
        .eq("id", requestId);
      if (statusError) throw statusError;

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
          Çekici Seç
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-3">
            {loading && (
              <div className="flex items-center justify-center rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6">
                <div className="flex items-center gap-3 text-sm font-semibold text-[var(--text-dim)]">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#111]" />
                  Çekiciler yükleniyor...
                </div>
              </div>
            )}
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            {!loading && providers.length === 0 && !error && (
              <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-6 text-center text-sm font-semibold text-[var(--text-dim)]">
                Şu an müsait çekici yok
              </div>
            )}

            {!loading &&
              providers.map((p) => {
                const active = selectedId === p.user_id;
                const name = p.users?.[0]?.full_name ?? "Çekici";
                const rating = p.rating ?? 0;
                const jobs = p.total_jobs ?? 0;
                const equip = p.equipment_type ?? "-";
                const cap = p.capacity_ton ?? null;
                return (
                  <button
                    key={p.user_id}
                    type="button"
                    onClick={() => setSelectedId(p.user_id)}
                    className={`w-full rounded-[16px] border p-4 text-left text-sm transition ${
                      active
                        ? "border-[#111] bg-[var(--bg-card)] ring-2 ring-[#111]"
                        : "border-[var(--border)] bg-[var(--bg-card)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[var(--text)]">
                          {name}{" "}
                          <span className="text-xs text-[var(--text-dim)]">
                            ★ {rating ? rating.toFixed(1) : "-"}
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-dim)]">
                          {jobs} iş • {equip}
                          {cap !== null ? ` • ${cap} ton` : ""}
                        </p>
                      </div>
                      <div className="text-right text-xs font-semibold text-[var(--green)]">
                        Müsait
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          <button
            type="button"
            disabled={!selectedId || saving || loading || providers.length === 0}
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
