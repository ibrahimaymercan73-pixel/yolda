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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Müşteri
          </p>
          <div className="mt-1 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Araçlarım 🚗</h1>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Buradan garajındaki araçları yönetebilir, aktif aracı
            değiştirebilirsin.
          </p>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-4">
            {loading && (
              <p className="text-sm text-slate-400">Araçların yükleniyor...</p>
            )}

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            {!loading && vehicles.length === 0 && !error && (
              <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-4 py-6 text-center text-sm text-slate-400">
                Henüz kayıtlı aracın yok.{" "}
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="font-semibold text-primary underline underline-offset-4"
                >
                  Hemen ekle
                </button>
                .
              </div>
            )}

            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {vehicle.brand} {vehicle.model}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Renk: {vehicle.color ?? "-"}
                    </p>
                  </div>
                  {vehicle.is_active && (
                    <span className="rounded-full bg-[#FF4500]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF4500]">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="mt-1 inline-flex items-center justify-center rounded-md border border-yellow-500 bg-gradient-to-b from-yellow-300 to-yellow-500 px-4 py-1 text-sm font-semibold tracking-[0.25em] text-slate-900">
                  {vehicle.plate}
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSetActive(vehicle.id)}
                    className={`flex-1 rounded-2xl px-3 py-2 font-semibold ${
                      vehicle.is_active
                        ? "bg-slate-800 text-slate-400"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    Aktif Yap
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(vehicle.id)}
                    className="flex items-center gap-1 rounded-2xl bg-slate-900 px-3 py-2 font-medium text-slate-300"
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
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-600 bg-slate-900/40 px-4 py-3 text-sm font-medium text-slate-200"
            >
              <span className="text-lg">＋</span>
              <span>Yeni Araç Ekle</span>
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs text-emerald-200">
            <p className="font-semibold">Bilgi</p>
            <p className="mt-1">
              Aktif araç şoföre otomatik gönderilir. Böylece her çağrıda tekrar
              araç seçmek zorunda kalmazsın.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

