"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";

type ColorKey = "beyaz" | "siyah" | "gri" | "kirmizi" | "mavi";

const BRANDS = [
  "Honda",
  "Toyota",
  "VW",
  "Ford",
  "Renault",
  "Fiat",
  "Hyundai",
  "BMW",
  "Mercedes",
] as const;

const MODELS = [
  "Civic",
  "Corolla",
  "Golf",
  "Focus",
  "Clio",
  "Egea",
  "i20",
  "3 Serisi",
  "C Serisi",
] as const;

const COLORS: { key: ColorKey; label: string; display: string }[] = [
  { key: "beyaz", label: "Beyaz", display: "⚪ Beyaz" },
  { key: "siyah", label: "Siyah", display: "⚫ Siyah" },
  { key: "gri", label: "Gri", display: "🩶 Gri" },
  { key: "kirmizi", label: "Kırmızı", display: "🔴 Kırmızı" },
  { key: "mavi", label: "Mavi", display: "🔵 Mavi" },
];

export default function OnboardPage() {
  const router = useRouter();
  const [brand, setBrand] = useState<string>("");
  const [model, setModel] = useState<string>("");
  const [color, setColor] = useState<ColorKey | null>(null);
  const [plate, setPlate] = useState<string>("");
  const [hasExisting, setHasExisting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchVehicles() {
      try {
        const user = await getCurrentUser();
        const { data, error: vError } = await supabase
          .from("vehicles")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);
        if (vError) throw vError;
        if (!cancelled) setHasExisting((data?.length ?? 0) > 0);
      } catch (err) {
        console.error(err);
      }
    }
    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalizedPlate = useMemo(
    () => plate.toUpperCase().replace(/\s+/g, ""),
    [plate]
  );

  const canSubmit = brand && model && color && normalizedPlate.length >= 5;

  const handleSave = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();

      if (!hasExisting) {
        await supabase
          .from("vehicles")
          .update({ is_active: false })
          .eq("user_id", user.id);
      }

      const { error: insertError } = await supabase.from("vehicles").insert({
        user_id: user.id,
        brand,
        model,
        color: COLORS.find((c) => c.key === color)?.label ?? "",
        plate: normalizedPlate,
        is_active: !hasExisting,
      });

      if (insertError) throw insertError;
      router.push("/musteri/anasayfa");
    } catch (err) {
      console.error(err);
      setError("Araç kaydedilirken bir hata oluştu. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/musteri/anasayfa");
  };

  const previewTextBrand = brand || "Marka";
  const previewTextModel = model || "Model";
  const previewTextColor =
    COLORS.find((c) => c.key === color)?.label || "Renk seçilmedi";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-6 rounded-2xl bg-[#FF4500] px-4 py-3 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em]">
                Arabanı Kaydet
              </p>
              <p className="mt-1 text-xs opacity-90">
                Her seferinde tekrar girme.
              </p>
            </div>
            <span className="text-2xl">🚗</span>
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4">
              <label className="text-sm font-medium">
                Marka
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm outline-none"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium">
                Model
                <select
                  className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-3 text-sm outline-none"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="">Seçiniz</option>
                  {MODELS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <p className="text-sm font-medium">Renk</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {COLORS.map((c) => {
                  const active = color === c.key;
                  return (
                    <button
                      key={c.key}
                      type="button"
                      onClick={() => setColor(c.key)}
                      className={`rounded-2xl border px-3 py-1.5 text-xs font-medium transition ${
                        active
                          ? "border-[#FF4500] bg-[#FF4500]/10 text-slate-50"
                          : "border-slate-700 bg-slate-900 text-slate-300"
                      }`}
                    >
                      {c.display}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Plaka
                <div className="mt-2 flex items-center justify-center">
                  <input
                    type="text"
                    maxLength={10}
                    value={plate}
                    onChange={(e) => setPlate(e.target.value)}
                    className="w-40 rounded-lg border border-yellow-400 bg-gradient-to-b from-yellow-300 to-yellow-500 px-3 py-2 text-center text-lg font-semibold tracking-[0.2em] text-slate-900 outline-none shadow-sm shadow-yellow-500/60"
                    placeholder="34 ABC 123"
                  />
                </div>
              </label>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Canlı Önizleme
              </p>
              <div className="mt-3 space-y-2">
                <p className="text-sm">
                  🚗 {previewTextBrand} {previewTextModel} · {previewTextColor}
                </p>
                <div className="inline-flex items-center justify-center rounded-md border border-yellow-500 bg-gradient-to-b from-yellow-300 to-yellow-500 px-4 py-1 text-sm font-semibold tracking-[0.25em] text-slate-900">
                  {normalizedPlate || "34 ABC 123"}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              disabled={!canSubmit || loading}
              onClick={handleSave}
              className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                canSubmit && !loading
                  ? "bg-[#FF4500] text-white shadow-sm shadow-orange-500/40"
                  : "bg-slate-800 text-slate-500"
              }`}
            >
              {loading ? "Kaydediliyor..." : "Arabamı Kaydet"}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="w-full rounded-2xl border border-transparent px-4 py-3 text-sm font-medium text-slate-400 underline underline-offset-4"
            >
              Şimdi Değil, Atla
            </button>

            {error && (
              <p className="text-center text-sm text-red-400">{error}</p>
            )}

            {hasExisting && !error && (
              <p className="pt-1 text-center text-[11px] text-slate-500">
                Garajında kayıtlı araçların var, bu adımı daha sonra da
                tamamlayabilirsin.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

