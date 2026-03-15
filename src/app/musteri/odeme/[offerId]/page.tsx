"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function OdemePage() {
  const router = useRouter();
  const params = useParams();
  const offerId = params?.offerId as string;
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  useEffect(() => {
    if (!offerId) return;
    let cancelled = false;
    async function run() {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/auth/login");
        return;
      }
      const { data: job } = await supabase
        .from("jobs")
        .select("id")
        .eq("offer_id", offerId)
        .limit(1)
        .single();
      if (!job?.id) {
        if (!cancelled) setError("Ödeme bilgisi bulunamadı.");
        return;
      }
      if (!cancelled) setJobId(job.id);
      const res = await fetch("/api/payment/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!cancelled) {
        if (!res.ok) {
          setError(data.error || "Ödeme başlatılamadı.");
          return;
        }
        if (data.token) setToken(data.token);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [offerId, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-5">
        <p className="text-red-500 text-center">{error}</p>
        <button
          type="button"
          onClick={() => router.push("/musteri/anasayfa")}
          className="mt-4 rounded-[14px] bg-[#111] px-4 py-3 text-sm font-bold text-white"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-dim)]">Ödeme formu yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
          Ödeme
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Kart bilgilerinizi girin ve ödemeyi tamamlayın.
        </p>
        <div className="mt-6 w-full overflow-hidden rounded-[16px] border border-[var(--border)] bg-white min-h-[400px]">
          <iframe
            src={`https://www.paytr.com/odeme/guvenli/${token}`}
            id="paytriframe"
            frameBorder={0}
            scrolling="no"
            className="w-full min-h-[400px]"
            title="PayTR Ödeme"
          />
        </div>
        {jobId && (
          <p className="mt-4 text-center text-xs text-[var(--text-dim)]">
            Ödeme sonrası otomatik yönlendirileceksiniz.
          </p>
        )}
      </main>
      <script src="https://www.paytr.com/js/iframeResizer.min.js" async />
    </div>
  );
}
