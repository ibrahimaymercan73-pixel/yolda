"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

export default function MusteriAnasayfaPage() {
  const router = useRouter();
  const [activeVehicleName, setActiveVehicleName] = useState<string | null>(
    null
  );
  const [userName, setUserName] = useState<string>("Misafir Kullanıcı");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const user = await getCurrentUser();
        if (user?.user_metadata?.full_name)
          setUserName(String(user.user_metadata.full_name));
        const { data } = await supabase
          .from("vehicles")
          .select("brand, model")
          .eq("user_id", user.id)
          .eq("is_active", true)
          .limit(1);
        const row = data?.[0];
        if (!cancelled && row)
          setActiveVehicleName(`${row.brand} ${row.model}`);
      } catch {
        if (!cancelled) setActiveVehicleName(null);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        {/* Header */}
        <section className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>
              Günaydın 👋
            </h1>
            <p className="mt-1 text-base font-semibold text-[var(--text)]">
              {userName}
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
            <p className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              <span>🚗</span>
              <span>Aktif Araç</span>
            </p>
            <p className="mt-1 text-xs font-semibold text-[var(--text)]">
              {activeVehicleName ?? "Araç seçilmedi"}
            </p>
          </button>
        </section>

        {/* Servisler */}
        <section className="mt-8">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            Servisler
          </span>
          <div className="mt-3 space-y-3">
            <button
              type="button"
              onClick={() => router.push("/musteri/sofor-iste")}
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
              onClick={() => router.push("/musteri/cekici-cagir")}
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

        {/* Geçmiş */}
        <section className="mt-8 flex-1">
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Geçmiş İşlemler
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚗</span>
                  <div>
                    <p className="font-semibold text-[var(--text)]">
                      Bağdat Caddesi → Moda
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">Dün • 320 TL</p>
                  </div>
                </div>
                <span className="text-[var(--green)] font-bold">✓</span>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚛</span>
                  <div>
                    <p className="font-semibold text-[var(--text)]">
                      Kadıköy → Ataşehir
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      2 gün önce • 1.200 TL
                    </p>
                  </div>
                </div>
                <span className="text-[var(--green)] font-bold">✓</span>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🚗</span>
                  <div>
                    <p className="font-semibold text-[var(--text)]">
                      Cevahir AVM → Üsküdar
                    </p>
                    <p className="text-xs text-[var(--text-dim)]">
                      Geçen hafta • 260 TL
                    </p>
                  </div>
                </div>
                <span className="text-[var(--green)] font-bold">✓</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
