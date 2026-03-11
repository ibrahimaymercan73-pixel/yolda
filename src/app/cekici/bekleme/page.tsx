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
          const status = (payload.new as any).status;
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-success">
            Çekici Paneli
          </p>
          <h1 className="text-xl font-semibold">Müşteri Karar Veriyor</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="rounded-2xl bg-slate-950 px-4 py-4 text-xs">
              <p className="text-sm font-medium text-slate-100">
                ⏳ Müşteri Karar Veriyor
              </p>
              <p className="mt-2 text-slate-400">
                Fiyat teklifin müşteriye iletildi. Diğer çekici teklifleriyle
                birlikte listeleniyor.
              </p>

              <div className="mt-3 rounded-2xl bg-slate-900 px-3 py-2 text-sm">
                Gönderdiğin fiyat:{" "}
                <span className="font-semibold text-emerald-400">
                  ₺{price}
                </span>
              </div>

              <p className="mt-3 text-[11px] text-slate-400">
                İpucu: Yüksek puan + uygun fiyat = daha çok seçilme.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-center gap-2">
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100" />
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-dot rounded-full bg-slate-100 [animation-delay:240ms]" />
              </div>
              <p className="text-xs text-slate-400">
                Müşteri genelde 1-2 dakika içinde seçim yapar.
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

export default function CekiciBeklemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-slate-400">
          Müşteri kararı bekleniyor...
        </div>
      }
    >
      <CekiciBeklemeContent />
    </Suspense>
  );
}

