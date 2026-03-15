"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type OfferRow = {
  id: string;
  request_id: string;
  driver_id: string;
  price: number;
  estimated_minutes: number | null;
  status: string;
  driver_name?: string;
};

export default function CekiciTekliflerPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = params?.requestId as string;
  const [offers, setOffers] = useState<OfferRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;
    const load = async () => {
      const { data, error: e } = await supabase
        .from("offers")
        .select("id, request_id, driver_id, price, estimated_minutes, status")
        .eq("request_id", requestId)
        .eq("status", "pending")
        .order("created_at", { ascending: true });
      if (e) {
        setError("Teklifler yüklenemedi.");
        setLoading(false);
        return;
      }
      const list = (data ?? []) as OfferRow[];
      if (list.length > 0) {
        const ids = [...new Set(list.map((o) => o.driver_id))];
        const { data: users } = await supabase.from("users").select("id, name").in("id", ids);
        const nameMap = new Map((users ?? []).map((u: { id: string; name: string }) => [u.id, u.name]));
        list.forEach((o) => { o.driver_name = nameMap.get(o.driver_id) ?? "Çekici"; });
      }
      setOffers(list);
      setLoading(false);
    };
    load();
  }, [requestId]);

  useEffect(() => {
    if (!requestId) return;
    const channel = supabase
      .channel("offers-cekici-" + requestId)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "offers", filter: `request_id=eq.${requestId}` },
        async (payload) => {
          const row = payload.new as OfferRow;
          if (row.status !== "pending") return;
          const { data: u } = await supabase.from("users").select("name").eq("id", row.driver_id).single();
          setOffers((prev) => [...prev, { ...row, driver_name: (u as { name?: string })?.name ?? "Çekici" }]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [requestId]);

  const handleSelect = async (offerId: string) => {
    setSelecting(offerId);
    setError(null);
    try {
      await supabase.from("offers").update({ status: "rejected" }).eq("request_id", requestId).neq("id", offerId);
      await supabase.from("offers").update({ status: "accepted" }).eq("id", offerId);
      const { data: job, error: jobErr } = await supabase
        .from("jobs")
        .insert({ offer_id: offerId, request_id: requestId, status: "waiting", payment_status: "pending" })
        .select("id")
        .single();
      if (jobErr || !job) throw jobErr || new Error("Job oluşturulamadı");
      await supabase.from("requests").update({ status: "accepted" }).eq("id", requestId);
      router.replace(`/musteri/odeme/${offerId}`);
    } catch (e) {
      console.error(e);
      setError("Seçim kaydedilemedi. Tekrar deneyin.");
    } finally {
      setSelecting(null);
    }
  };

  if (!requestId) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button type="button" onClick={() => router.push("/musteri/anasayfa")} className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]">←</button>
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>Teklifler</h1>
        {loading && offers.length === 0 ? (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#111]" />
            <p className="text-sm text-[var(--text-dim)]">Çekici teklifleri bekleniyor...</p>
          </div>
        ) : offers.length === 0 ? (
          <p className="mt-8 text-sm text-[var(--text-dim)]">Henüz teklif yok. Biraz bekleyin.</p>
        ) : (
          <div className="mt-6 space-y-3">
            {offers.map((o) => (
              <div key={o.id} className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--text)]">{o.driver_name ?? "Çekici"}</p>
                  <p className="text-sm text-[var(--text-dim)]">{Number(o.price).toFixed(0)} TL{o.estimated_minutes != null ? ` · ~${o.estimated_minutes} dk` : ""}</p>
                </div>
                <button type="button" disabled={!!selecting} onClick={() => handleSelect(o.id)} className="rounded-[14px] bg-[#111] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
                  {selecting === o.id ? "..." : "Seç"}
                </button>
              </div>
            ))}
          </div>
        )}
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </main>
    </div>
  );
}
