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
  { key: "beyaz", label: "Beyaz", display: "⚪" },
  { key: "siyah", label: "Siyah", display: "⚫" },
  { key: "gri", label: "Gri", display: "🩶" },
  { key: "kirmizi", label: "Kırmızı", display: "🔴" },
  { key: "mavi", label: "Mavi", display: "🔵" },
];

const COLOR_LABELS: Record<ColorKey, string> = {
  beyaz: "Beyaz",
  siyah: "Siyah",
  gri: "Gri",
  kirmizi: "Kırmızı",
  mavi: "Mavi",
};

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
        if (!user) {
          if (!cancelled) router.replace("/auth/login");
          return;
        }
        const { data, error: vError } = await supabase
          .from("vehicles")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);
        if (vError) throw vError;
        if (!cancelled) setHasExisting((data?.length ?? 0) > 0);
      } catch (err) {
        console.error(err);
        if (!cancelled) router.replace("/auth/login");
      }
    }
    fetchVehicles();
    return () => {
      cancelled = true;
    };
  }, [router]);

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
      if (!user) {
        router.replace("/auth/login");
        return;
      }

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
  const previewTextColor = color ? COLOR_LABELS[color] : "Renk seçilmedi";

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <div className="mb-2 text-3xl">🚗</div>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Arabanı Kaydet
        </h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">
          Her seferinde tekrar girme.
        </p>

        <div className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Marka
              </span>
              <select
                className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
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
            <label>
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Model
              </span>
              <select
                className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-[15px] text-sm font-semibold text-[var(--text)] outline-none"
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
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Renk
            </span>
            <div className="mt-3 flex gap-4">
              {COLORS.map((c) => {
                const active = color === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setColor(c.key)}
                    className={`flex flex-col items-center gap-1 text-xs font-medium text-[var(--text)] ${
                      active ? "ring-2 ring-[#111] ring-offset-2 rounded-full" : ""
                    }`}
                    style={
                      active
                        ? { borderRadius: "9999px", padding: 2 }
                        : undefined
                    }
                  >
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                      style={{
                        backgroundColor:
                          c.key === "beyaz"
                            ? "#f5f5f5"
                            : c.key === "siyah"
                              ? "#111"
                              : c.key === "gri"
                                ? "#9ca3af"
                                : c.key === "kirmizi"
                                  ? "#ef4444"
                                  : "#3b82f6",
                        border:
                          c.key === "beyaz"
                            ? "1px solid var(--border)"
                            : "none",
                      }}
                    >
                      {c.key === "siyah" ? (
                        <span className="text-white text-lg">🚗</span>
                      ) : (
                        c.display
                      )}
                    </span>
                    {COLOR_LABELS[c.key]}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Plaka
            </span>
            <div className="mt-2 flex justify-center">
              <input
                type="text"
                maxLength={10}
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className="w-44 rounded-[14px] border-[1.5px] px-4 py-3 text-center text-base font-bold tracking-[4px] outline-none"
                style={{
                  backgroundColor: "var(--yellow-bg)",
                  borderColor: "var(--yellow-border)",
                  color: "#92400E",
                }}
                placeholder="34 ABC 123"
              />
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-[13px]">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Önizleme
            </span>
            <p className="mt-2 text-sm font-semibold text-[var(--text)]">
              🚗 {previewTextBrand} {previewTextModel} · {previewTextColor}
            </p>
            <div
              className="mt-2 inline-flex items-center rounded-md px-3 py-1 text-sm font-bold"
              style={{
                backgroundColor: "var(--yellow)",
                color: "#92400E",
              }}
            >
              {normalizedPlate || "34 ABC 123"}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            disabled={!canSubmit || loading}
            onClick={handleSave}
            className="w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="w-full bg-transparent py-2 text-[14px] font-medium text-[var(--text-muted)]"
          >
            Şimdi değil, atla
          </button>
        </div>

        {error && (
          <p className="mt-4 text-center text-sm text-red-500">{error}</p>
        )}
        {hasExisting && !error && (
          <p className="mt-2 text-center text-xs text-[var(--text-dim)]">
            Garajında kayıtlı araçların var, bu adımı daha sonra da
            tamamlayabilirsin.
          </p>
        )}
      </main>
    </div>
  );
}
