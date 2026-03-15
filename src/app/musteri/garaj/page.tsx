"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

type VehicleRow = {
  id: string;
  brand: string;
  model: string;
  color: string | null;
  plate: string;
  is_active: boolean;
};

export default function GarajPage() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchVehicles() {
      setLoading(true);
      setError(null);
      try {
        const user = await getCurrentUser();
        if (!user) {
          if (!cancelled) setVehicles([]);
          return;
        }
        const { data, error: vError } = await supabase
          .from("vehicles")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        if (vError) throw vError;
        if (!cancelled) setVehicles(data ?? []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Araçlar yüklenirken bir hata oluştu.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSetActive = async (id: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) return;
      setError(null);
      await supabase
        .from("vehicles")
        .update({ is_active: false })
        .eq("user_id", user.id);
      const { error: updateError } = await supabase
        .from("vehicles")
        .update({ is_active: true })
        .eq("id", id)
        .eq("user_id", user.id);
      if (updateError) throw updateError;
      setVehicles((prev) =>
        prev.map((v) => ({ ...v, is_active: v.id === id }))
      );
    } catch (err) {
      console.error(err);
      setError("Aktif araç güncellenemedi. Lütfen tekrar dene.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
      setError("Araç silinirken bir hata oluştu.");
    }
  };

  const handleAddNew = () => {
    router.push("/auth/onboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.push("/musteri/anasayfa")}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Araçlarım 🚗
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Buradan garajındaki araçları yönetebilir, aktif aracı değiştirebilirsin.
        </p>

        <section className="mt-6 flex-1 space-y-4">
          {loading && (
            <p className="text-sm text-[var(--text-dim)]">Araçların yükleniyor...</p>
          )}

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {!loading && vehicles.length === 0 && !error && (
            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] px-4 py-6 text-center text-sm text-[var(--text-dim)]">
              Henüz kayıtlı aracın yok.{" "}
              <button
                type="button"
                onClick={handleAddNew}
                className="font-bold text-[var(--text)] underline"
              >
                Hemen ekle
              </button>
              .
            </div>
          )}

          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[var(--text)]">
                    {vehicle.brand} {vehicle.model}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-dim)]">
                    Renk: {vehicle.color ?? "-"}
                  </p>
                </div>
                {vehicle.is_active && (
                  <span className="rounded-full bg-[#111] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Aktif
                  </span>
                )}
              </div>

              <div
                className="mt-2 inline-flex rounded-md px-3 py-1 text-sm font-bold"
                style={{
                  backgroundColor: "var(--yellow)",
                  color: "#92400E",
                }}
              >
                {vehicle.plate}
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => handleSetActive(vehicle.id)}
                  disabled={vehicle.is_active}
                  className="flex-1 rounded-[14px] bg-[#111] px-3 py-3 font-bold text-white disabled:opacity-50"
                >
                  Aktif Yap
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(vehicle.id)}
                  className="flex items-center gap-1 rounded-[14px] bg-[var(--bg-soft)] px-3 py-3 font-semibold text-[var(--text)]"
                >
                  <span>🗑️</span>
                  <span>Sil</span>
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddNew}
            className="flex w-full items-center justify-center gap-2 rounded-[16px] border-2 border-dashed border-[var(--border)] bg-transparent py-4 text-sm font-semibold text-[var(--text-dim)]"
          >
            <span className="text-lg">＋</span>
            <span>Yeni Araç Ekle</span>
          </button>
        </section>

        <div
          className="mt-6 rounded-[16px] border border-[var(--border)] p-4 text-xs"
          style={{ backgroundColor: "var(--yellow-bg)" }}
        >
          <p className="font-bold text-[var(--text)]">Bilgi</p>
          <p className="mt-1 text-[var(--text-dim)]">
            Aktif araç şoföre otomatik gönderilir. Böylece her çağrıda tekrar
            araç seçmek zorunda kalmazsın.
          </p>
        </div>
      </main>
    </div>
  );
}
