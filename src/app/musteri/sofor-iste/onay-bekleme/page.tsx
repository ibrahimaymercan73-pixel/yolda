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
          const status = (payload.new as { status?: string }).status;
          if (status === "eslesti") {
            router.push(
              `/musteri/sofor-iste/yolda?request_id=${requestId}`
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId, router]);

  const progress = ((COUNTDOWN_SECONDS - remaining) / COUNTDOWN_SECONDS) * 100;

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
          Onay Bekleniyor
        </h1>

        <section className="mt-6 flex flex-1 flex-col items-center justify-between">
          <div className="w-full space-y-6">
            <div className="mx-auto max-w-xs rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-center">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🧑‍✈️</span>
                <p className="font-bold text-[var(--text)]">Ahmet</p>
                <p className="text-xs text-[var(--text-dim)]">
                  Kadıköy / Moda • 320+ sefer
                </p>
                <p className="mt-1 text-xs text-[var(--text-dim)]">★ 4.9</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-center text-sm font-semibold text-[var(--text)]">
                Şoförden onay bekleniyor...
              </p>
              <p className="text-center text-xs text-[var(--text-dim)]">
                Onay vermezse sıradakine geçilir.
              </p>
            </div>

            <div className="mx-auto flex w-full max-w-xs flex-col items-center gap-3">
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-[var(--bg-soft)]">
                <div
                  className="h-full bg-[#111] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-[var(--text-dim)]">
                {remaining} saniye içinde yanıt bekleniyor
              </p>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-[var(--text-dim)]">
            Şoför onay verdiğinde otomatik olarak sonraki adıma geçilecek.
          </p>
          {error && (
            <p className="mt-2 text-center text-sm text-red-500">{error}</p>
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
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Şoför onay ekranı yükleniyor...
        </div>
      }
    >
      <SoforOnayBeklemeContent />
    </Suspense>
  );
}
