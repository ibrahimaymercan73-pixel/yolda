"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function SoforOnayBekliyorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      setLoading(true);
      setError(null);
      try {
        const user = await getCurrentUser();
        const { data: profile, error: pErr } = await supabase
          .from("driver_profiles")
          .select("is_approved")
          .eq("user_id", user.id)
          .limit(1);
        if (pErr) throw pErr;
        const approved = Boolean(profile?.[0]?.is_approved);
        if (approved) router.replace("/sofor/anasayfa");
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Durum kontrol edilemedi. Lütfen tekrar dene.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void check();
    const i = setInterval(check, 8000);
    return () => {
      cancelled = true;
      clearInterval(i);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center px-5 py-10 text-center">
        <div className="text-4xl">⏳</div>
        <h1
          className="mt-4 text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Hesabın onay bekliyor
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Belgeler kontrol ediliyor. Onaylandığında otomatik olarak şoför
          paneline yönlendirileceksin.
        </p>

        <div className="mt-6 w-full rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left text-sm">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            Durum
          </p>
          <p className="mt-2 font-semibold text-[var(--text)]">
            {loading ? "Kontrol ediliyor..." : "Onay bekleniyor"}
          </p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>

        <button
          type="button"
          onClick={() => router.replace("/sofor")}
          className="mt-6 w-full bg-transparent py-2 text-[14px] font-medium text-[var(--text-muted)]"
        >
          Giriş ekranına dön
        </button>
      </main>
    </div>
  );
}

