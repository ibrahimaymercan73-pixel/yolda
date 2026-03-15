"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

type JobRow = {
  id: string;
  request_id: string;
  created_at: string;
  offers: { price: number } | { price: number }[] | null;
};

type RequestRow = {
  id: string;
  from_location: { address?: string } | null;
  to_location: { address?: string } | null;
  service_type: string;
};

export default function MusteriAnasayfaPage() {
  const router = useRouter();
  const [activeVehicleName, setActiveVehicleName] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [jobs, setJobs] = useState<Array<JobRow & { request?: RequestRow }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await getCurrentUser();
        if (!user) return;
        if (!cancelled) setUserName(user.name || "Kullanıcı");

        const { data: vehicles } = await supabase
          .from("vehicles")
          .select("brand, model")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .limit(1);
        if (!cancelled && vehicles?.[0])
          setActiveVehicleName(`${vehicles[0].brand} ${vehicles[0].model}`);

        const { data: requests } = await supabase
          .from("requests")
          .select("id, from_location, to_location, service_type")
          .eq("user_id", user.id);
        const requestIds = (requests ?? []).map((r) => r.id);
        if (requestIds.length === 0) {
          if (!cancelled) setJobs([]);
          return;
        }

        const { data: jobsData } = await supabase
          .from("jobs")
          .select("id, request_id, created_at, offers(price)")
          .in("request_id", requestIds)
          .eq("status", "completed")
          .order("created_at", { ascending: false })
          .limit(20);
        const reqMap = new Map((requests ?? []).map((r) => [r.id, r]));
        const list = (jobsData ?? []).map((j) => ({
          ...j,
          request: reqMap.get(j.request_id),
        }));
        if (!cancelled) setJobs(list);
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (s: string) => {
    const d = new Date(s);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diff === 0) return "Bugün";
    if (diff === 1) return "Dün";
    if (diff < 7) return `${diff} gün önce`;
    return d.toLocaleDateString("tr-TR");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <section className="flex items-start justify-between gap-3">
          <div>
            <h1
              className="text-[28px] font-extrabold text-[var(--text)]"
              style={{ letterSpacing: "-0.8px" }}
            >
              Günaydın 👋
            </h1>
            <p className="mt-1 text-base font-semibold text-[var(--text)]">
              {userName || "..."}
            </p>
            <p className="mt-2 flex items-center gap-1 text-sm text-[var(--text-dim)]">
              <span>📍</span>
              <span>Kadıköy, İstanbul</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/musteri/garaj")}
            className="shrink-0 rounded-[14px] border border-[var(--border)] bg-[var(--bg-card)] p-3 text-left"
          >
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              🚗 Aktif Araç
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--text)]">
              {activeVehicleName ?? "Araç seçilmedi"}
            </p>
          </button>
        </section>

        <section className="mt-8">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            Servisler
          </span>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/musteri/sofor-iste/konum")}
              className="flex w-full items-center justify-between rounded-[16px] border border-[var(--border)] bg-[#111] p-4 text-left text-white"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/10 text-xl">
                  🚗
                </span>
                <div>
                  <p className="font-bold text-white">Şoför İste</p>
                  <p className="text-xs text-white/70">
                    Arabanı bırak, seni götürsün.
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold">›</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/musteri/cekici-cagir/konum")}
              className="flex w-full items-center justify-between rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-xl">
                  🚛
                </span>
                <div>
                  <p className="font-bold text-[var(--text)]">Çekici Çağır</p>
                  <p className="text-xs text-[var(--text-dim)]">
                    Arabanı nereye istersen götürsün.
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold text-[var(--text)]">›</span>
            </button>
          </div>
        </section>

        <section className="mt-8 flex-1">
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Geçmiş İşlemler
            </p>
            {loading ? (
              <p className="mt-4 text-sm text-[var(--text-dim)]">Yükleniyor...</p>
            ) : jobs.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--text-dim)]">
                Henüz işlem yok
              </p>
            ) : (
              <div className="mt-4 space-y-3 text-sm">
                {jobs.map((job, i) => {
                  const req = job.request;
                  const from = (req?.from_location as { address?: string })?.address ?? "—";
                  const to = (req?.to_location as { address?: string })?.address ?? "—";
                  const offerPrice = job.offers;
                  const price = Array.isArray(offerPrice) ? offerPrice[0]?.price : (offerPrice as { price?: number })?.price ?? 0;
                  const emoji = req?.service_type === "cekici" ? "🚛" : "🚗";
                  return (
                    <div key={job.id}>
                      {i > 0 && <div className="h-px bg-[var(--border)]" />}
                      <div className="flex items-center justify-between gap-3 py-2">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{emoji}</span>
                          <div>
                            <p className="font-semibold text-[var(--text)]">
                              {from} → {to}
                            </p>
                            <p className="text-xs text-[var(--text-dim)]">
                              {formatDate(job.created_at)} • {Number(price).toFixed(0)} TL
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[var(--green)]">✓</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
