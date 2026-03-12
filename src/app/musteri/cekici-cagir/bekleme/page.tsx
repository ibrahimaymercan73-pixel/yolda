"use client";

import { Suspense } from "react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function MusteriCekiciBeklemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");

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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, router]);

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
          Teklifler Toplanıyor
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">
                📡 Teklifler Toplanıyor
              </p>
              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Rota ve araç detayların çekicilere gönderildi. Fiyatlar kısa
                süre içinde gelecek.
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full bg-[var(--green)]/20 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                  Kadıköy → Yakın Servis
                </span>
                <span className="rounded-full bg-[var(--green)]/20 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                  🚗 Sedan
                </span>
                <span className="rounded-full bg-[var(--green)]/20 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                  💥 Kaza
                </span>
                <span className="rounded-full bg-[var(--green)]/20 px-3 py-1 text-xs font-semibold text-[var(--green)]">
                  2WD Normal
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2">
                <span className="h-2 w-2 animate-dot rounded-full bg-[var(--text-muted)]" />
                <span
                  className="h-2 w-2 animate-dot rounded-full bg-[var(--text-muted)]"
                  style={{ animationDelay: "120ms" }}
                />
                <span
                  className="h-2 w-2 animate-dot rounded-full bg-[var(--text-muted)]"
                  style={{ animationDelay: "240ms" }}
                />
              </div>
              <p className="text-xs text-[var(--text-dim)]">
                Teklifler 2-4 dakika içinde gelir.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default function CekiciBeklemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Teklif bekleme ekranı yükleniyor...
        </div>
      }
    >
      <MusteriCekiciBeklemeContent />
    </Suspense>
  );
}
