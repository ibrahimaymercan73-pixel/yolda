"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

type Payload = {
  fromAddress: string;
  toAddress: string;
  fromLat?: number;
  fromLng?: number;
  toLat?: number;
  toLng?: number;
  vehicle_id: string;
  mode: "hemen" | "randevulu";
  scheduled_time: string | null;
};

export default function TalepOlusturPage() {
  const router = useRouter();
  const [payload, setPayload] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem("soforRequest") : null;
    if (!raw) {
      router.replace("/musteri/sofor-iste/konum");
      return;
    }
    try {
      setPayload(JSON.parse(raw) as Payload);
    } catch {
      router.replace("/musteri/sofor-iste/konum");
    }
  }, [router]);

  const handleSubmit = async () => {
    if (!payload) return;
    const user = await getCurrentUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase
        .from("requests")
        .insert({
          user_id: user.id,
          vehicle_id: payload.vehicle_id,
          service_type: "sofor",
          from_location: {
            address: payload.fromAddress,
            lat: payload.fromLat ?? null,
            lng: payload.fromLng ?? null,
          },
          to_location: {
            address: payload.toAddress,
            lat: payload.toLat ?? null,
            lng: payload.toLng ?? null,
          },
          scheduled_time: payload.scheduled_time || null,
          status: "waiting",
        })
        .select("id")
        .single();
      if (err) throw err;
      if (typeof window !== "undefined") window.sessionStorage.removeItem("soforRequest");
      router.replace(`/musteri/sofor-iste/teklifler/${data.id}`);
    } catch (e) {
      console.error(e);
      setError("Talep oluşturulamadı. Tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  if (!payload) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
        Yönlendiriliyor...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/musteri/sofor-iste/konum")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
          Talep özeti
        </h1>
        <div className="mt-6 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 space-y-2">
          <p className="text-sm text-[var(--text)]"><strong>Nereden:</strong> {payload.fromAddress}</p>
          <p className="text-sm text-[var(--text)]"><strong>Nereye:</strong> {payload.toAddress}</p>
          <p className="text-sm text-[var(--text-dim)]">
            {payload.mode === "hemen" ? "⚡ Hemen" : `📅 ${payload.scheduled_time ? new Date(payload.scheduled_time).toLocaleString("tr-TR") : ""}`}
          </p>
        </div>
        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={handleSubmit}
          className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
        >
          {loading ? "Gönderiliyor..." : "Talep Gönder"}
        </button>
      </main>
    </div>
  );
}
