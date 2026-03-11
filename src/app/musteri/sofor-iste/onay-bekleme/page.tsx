"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const COUNTDOWN_SECONDS = 10;

function SoforOnayBeklemeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");
  const [remaining, setRemaining] = useState(COUNTDOWN_SECONDS);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearTimeout(id);
  }, [remaining]);

  useEffect(() => {
    if (!requestId) return;

    const channel = supabase
      .channel(`ride_request_${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_requests",
          filter: `id=eq.${requestId}`,
        },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === "eslesti") {
            router.push(
              `/musteri/sofor-iste/yolda?request_id=${requestId}`
            );
          }
        }
      );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, router]);

  const progress = ((COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Şoför İste
          </p>
          <h1 className="text-xl font-semibold">Onay Bekleniyor</h1>
        </header>

        <section className="flex flex-1 flex-col items-center justify-between">
          <div className="w-full space-y-6">
            {/* Seçilen şoför örnek kartı */}
            <div className="mx-auto max-w-xs rounded-3xl border border-slate-800 bg-slate-950 px-4 py-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🧑‍✈️</span>
                <p className="text-sm font-semibold">Ahmet</p>
                <p className="text-xs text-slate-400">
                  Kadıköy / Moda • 320+ sefer
                </p>
                <p className="mt-1 text-xs text-yellow-300">★ 4.9</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-center text-sm font-medium">
                Şoförden onay bekleniyor...
              </p>
              <p className="text-center text-xs text-slate-400">
                Onay vermezse sıradakine geçilir.
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400">
                {remaining} saniye içinde yanıt bekleniyor
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-[11px] text-slate-500">
            Şoför onay verdiğinde otomatik olarak sonraki adıma geçilecek.
          </p>
          {error && (
            <p className="mt-2 text-center text-xs text-red-400">
              {error}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}

export default function SoforOnayBeklemePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-slate-400">
          Şoför onay ekranı yükleniyor...
        </div>
      }
    >
      <SoforOnayBeklemeContent />
    </Suspense>
  );
}

