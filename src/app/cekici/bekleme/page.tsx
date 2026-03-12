"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function CekiciBeklemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offer_id");
  const initialPrice = searchParams.get("price") ?? "0";
  const [price] = useState(initialPrice);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!offerId) return;

    const channel = supabase
      .channel(`tow_offer_${offerId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tow_offers",
          filter: `id=eq.${offerId}`,
        },
        (payload) => {
          const status = (payload.new as { status?: string }).status;
          if (status === "kabul") {
            router.push("/cekici/aktif-is");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [offerId, router]);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/cekici/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Müşteri Karar Veriyor
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <p className="text-sm font-bold text-[var(--text)]">
                ⏳ Müşteri Karar Veriyor
              </p>
              <p className="mt-2 text-xs text-[var(--text-dim)]">
                Fiyat teklifin müşteriye iletildi. Diğer çekici teklifleriyle
                birlikte listeleniyor.
              </p>

              <div className="mt-3 rounded-[14px] bg-[var(--bg-soft)] p-3 text-sm font-semibold text-[var(--text)]">
                Gönderdiğin fiyat:{" "}
                <span className="text-[var(--green)]">₺{price}</span>
              </div>

              <p className="mt-3 text-xs text-[var(--text-dim)]">
                İpucu: Yüksek puan + uygun fiyat = daha çok seçilme.
              </p>
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
                Müşteri genelde 1-2 dakika içinde seçim yapar.
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}
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
          Müşteri kararı bekleniyor...
        </div>
      }
    >
      <CekiciBeklemeContent />
    </Suspense>
  );
}
