"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function SoforAnasayfaPage() {
  const router = useRouter();
  const [online, setOnline] = useState(false);
  const [savingOnline, setSavingOnline] = useState(false);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requests, setRequests] = useState<
    Array<{
      id: string;
      pickup_address: string | null;
      dropoff_address: string | null;
      price: number | null;
      status: string | null;
      created_at: string | null;
    }>
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function bootstrap() {
      try {
        const user = await getCurrentUser();
        const { data: roleRow, error: roleErr } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        if (roleErr) throw roleErr;
        if (roleRow?.role !== "sofor") {
          router.replace("/sofor");
          return;
        }

        const { data: profile, error: pErr } = await supabase
          .from("driver_profiles")
          .select("is_online")
          .eq("user_id", user.id)
          .limit(1);
        if (!cancelled && !pErr) {
          setOnline(Boolean(profile?.[0]?.is_online));
        }
      } catch (err) {
        console.error(err);
      }
    }
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const fetchRequests = async () => {
    setRequestsLoading(true);
    setError(null);
    try {
      const { data, error: rErr } = await supabase
        .from("ride_requests")
        .select("id,pickup_address,dropoff_address,price,status,created_at")
        .eq("status", "bekliyor")
        .order("created_at", { ascending: false });
      if (rErr) throw rErr;
      setRequests((data ?? []) as any);
    } catch (err) {
      console.error(err);
      setError("Talepler yüklenemedi. Lütfen tekrar dene.");
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    void fetchRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleToggleOnline = async () => {
    if (savingOnline) return;
    setSavingOnline(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const next = !online;
      const { error: updErr } = await supabase
        .from("driver_profiles")
        .update({ is_online: next })
        .eq("user_id", user.id);
      if (updErr) throw updErr;
      setOnline(next);
    } catch (err) {
      console.error(err);
      setError("Durum güncellenemedi. Lütfen tekrar dene.");
    } finally {
      setSavingOnline(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setError(null);
    try {
      const user = await getCurrentUser();
      const { error: updErr } = await supabase
        .from("ride_requests")
        .update({ status: "eslesti", driver_id: user.id })
        .eq("id", requestId)
        .eq("status", "bekliyor");
      if (updErr) throw updErr;
      router.push(`/sofor/navigasyon?request_id=${requestId}`);
    } catch (err) {
      console.error(err);
      setError("Talep kabul edilemedi. Lütfen tekrar dene.");
    }
  };

  const subtitle = useMemo(() => {
    if (requestsLoading) return "Talepler yükleniyor...";
    if (requests.length === 0) return "Şu an bekleyen talep yok.";
    return `${requests.length} yeni talep var`;
  }, [requests.length, requestsLoading]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
          Şoför Paneli
        </p>
        <h1
          className="mt-1 text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Şoför Ana Sayfa
        </h1>
        <p className="mt-1 text-sm font-semibold text-[var(--green)]">
          {subtitle}
        </p>

        <section className="mt-6 space-y-4">
          <div className="rounded-[16px] border border-[var(--border)] bg-[#111] px-4 py-4 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/70">
              Bugünkü Kazancın 💰
            </p>
            <p className="mt-2 text-3xl font-bold">₺840</p>
            <p className="mt-1 text-xs text-white/70">6 sefer tamamlandı</p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Puan
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">4.9</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Sefer
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">6</p>
            </div>
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Kabul Oranı
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text)]">92%</p>
            </div>
          </div>
        </section>

        <section className="mt-6 flex-1 space-y-4">
          <div className="flex items-center justify-between rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Durum
              </p>
              <p
                className={`mt-1 text-sm font-bold ${
                  online ? "text-[var(--green)]" : "text-[var(--text-dim)]"
                }`}
              >
                {online ? "ÇEVRİMİÇİ" : "ÇEVRİMDIŞI"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleOnline}
              disabled={savingOnline}
              className={`relative h-7 w-12 rounded-full border transition ${
                online
                  ? "border-[var(--green)] bg-[var(--green)]"
                  : "border-[var(--border)] bg-[var(--bg-soft)]"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  online ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Gelen iş talepleri
              </p>
              <button
                type="button"
                onClick={() => void fetchRequests()}
                className="rounded-[14px] bg-[var(--bg-soft)] px-3 py-2 text-xs font-bold text-[var(--text)]"
              >
                Yenile
              </button>
            </div>

            {requestsLoading && (
              <div className="mt-4 flex items-center gap-3 text-sm font-semibold text-[var(--text-dim)]">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--border)] border-t-[#111]" />
                Talepler yükleniyor...
              </div>
            )}

            {!requestsLoading && requests.length === 0 && (
              <p className="mt-4 text-sm font-semibold text-[var(--text-dim)]">
                Şu an bekleyen talep yok.
              </p>
            )}

            {!requestsLoading && requests.length > 0 && (
              <div className="mt-4 space-y-3">
                {requests.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-[14px] bg-[var(--bg-soft)] p-4"
                  >
                    <p className="text-sm font-bold text-[var(--text)]">
                      {r.pickup_address ?? "-"} → {r.dropoff_address ?? "-"}
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-dim)]">
                      Ücret:{" "}
                      <span className="font-bold text-[var(--text)]">
                        ₺{r.price ?? "-"}
                      </span>
                    </p>
                    <button
                      type="button"
                      onClick={() => void handleAccept(r.id)}
                      className="mt-3 w-full rounded-[14px] bg-[var(--green)] px-4 py-3 text-sm font-bold text-white"
                    >
                      Kabul Et
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </section>
      </main>
    </div>
  );
}
