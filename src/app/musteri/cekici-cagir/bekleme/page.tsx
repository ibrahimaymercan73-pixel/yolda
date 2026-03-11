"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CekiciBeklemePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`tow_offers_for_${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tow_offers",
          filter: `tow_request_id=eq.${requestId}`,
        },
        () => {
          router.push(
            `/musteri/cekici-cagir/teklifler?request_id=${requestId}`
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIPTION_ERROR") {
          setError("Teklifler gerçek zamanlı izlenemiyor.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Çekici Çağır
          </p>
          <h1 className="text-xl font-semibold">Teklifler Toplanıyor</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-3xl bg-slate-950 px-4 py-4 text-xs">
              <p className="text-sm font-medium text-slate-100">
                📡 Teklifler Toplanıyor
              </p>
              <p className="mt-2 text-slate-400">
                Rota ve araç detayların çekicilere gönderildi. Fiyatlar kısa
                süre içinde gelecek.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-emerald-900/70 px-3 py-1 text-[11px] text-emerald-100">
                  Kadıköy → Yakın Servis
                </span>
                <span className="rounded-full bg-emerald-900/70 px-3 py-1 text-[11px] text-emerald-100">
                  🚗 Sedan
                </span>
                <span className="rounded-full bg-emerald-900/70 px-3 py-1 text-[11px] text-emerald-100">
                  💥 Kaza
                </span>
                <span className="rounded-full bg-emerald-900/70 px-3 py-1 text-[11px] text-emerald-100">
                  2WD Normal
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100" />
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100 [animation-delay:240ms]" />
              </div>
              <p className="text-xs text-slate-400">
                Teklifler 2-4 dakika içinde gelir.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-center text-xs text-red-400">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

