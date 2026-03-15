"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type Job = {
  id: string;
  status: string;
  payment_status: string;
  offer_id: string;
  request_id: string;
};

type RequestRow = {
  from_location: { address?: string } | null;
  to_location: { address?: string } | null;
};

const STATUS_LABELS: Record<string, string> = {
  waiting: "Şoför yola çıktı",
  in_progress: "İş başladı",
  completed: "Tamamlandı",
};

export default function AktifIsPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.jobId as string;
  const [job, setJob] = useState<Job | null>(null);
  const [request, setRequest] = useState<RequestRow | null>(null);
  const [driverName, setDriverName] = useState<string>("");
  const [center, setCenter] = useState<[number, number]>([41.0082, 28.9784]);

  useEffect(() => {
    if (!jobId) return;
    const load = async () => {
      const { data: j } = await supabase.from("jobs").select("id, status, payment_status, offer_id, request_id").eq("id", jobId).single();
      if (!j) return;
      setJob(j as Job);
      const { data: req } = await supabase.from("requests").select("from_location, to_location").eq("id", (j as Job).request_id).single();
      if (req) setRequest(req as RequestRow);
      const { data: offer } = await supabase.from("offers").select("driver_id").eq("id", (j as Job).offer_id).single();
      if (offer?.driver_id) {
        const { data: u } = await supabase.from("users").select("name").eq("id", (offer as { driver_id: string }).driver_id).single();
        setDriverName((u as { name?: string })?.name ?? "Şoför");
      }
    };
    load();
  }, [jobId]);

  useEffect(() => {
    if (!jobId) return;
    const channel = supabase
      .channel("job-" + jobId)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "jobs", filter: `id=eq.${jobId}` },
        (payload) => {
          const newRow = payload.new as Job;
          setJob(newRow);
          if (newRow.status === "completed") {
            supabase.from("jobs").update({ payment_status: "released" }).eq("id", jobId).then(() => {});
            router.replace("/musteri/anasayfa");
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [jobId, router]);

  if (!jobId || !job) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-dim)]">Yükleniyor...</p>
      </div>
    );
  }

  const fromAddr = (request?.from_location as { address?: string })?.address ?? "";
  const toAddr = (request?.to_location as { address?: string })?.address ?? "";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
          Aktif İş
        </h1>
        <div className="mt-4 h-[200px] rounded-[16px] overflow-hidden bg-[var(--bg-soft)]">
          <Map center={center} className="h-full w-full" />
        </div>
        <div className="mt-6 rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Durum</p>
          <p className="mt-1 font-semibold text-[var(--text)]">{STATUS_LABELS[job.status] ?? job.status}</p>
          <p className="mt-2 text-sm text-[var(--text-dim)]">{fromAddr} → {toAddr}</p>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
          <div>
            <p className="font-bold text-[var(--text)]">{driverName}</p>
            <p className="text-sm text-[var(--text-dim)]">Şoför</p>
          </div>
          <a href="tel:+905551234567" className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#111] text-white">
            📞
          </a>
        </div>
        <p className="mt-6 text-center text-xs text-[var(--text-dim)]">
          İş tamamlandığında ana sayfaya yönlendirileceksiniz.
        </p>
      </main>
    </div>
  );
}
