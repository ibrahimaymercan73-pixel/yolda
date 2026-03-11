"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUser } from "@/lib/auth";
import { getActiveVehicleId } from "@/lib/requests";

type VehicleType =
  | "sedan"
  | "suv"
  | "minivan"
  | "pickup"
  | "motosiklet"
  | "kamyon";

type BreakdownType =
  | "lastik"
  | "aku"
  | "kaza"
  | "motor"
  | "yakit"
  | "diger";

type Transmission = "manuel" | "otomatik";
type DriveType = "2wd" | "4x4";

const VEHICLE_OPTIONS: { key: VehicleType; label: string; icon: string }[] = [
  { key: "sedan", label: "Sedan", icon: "🚗" },
  { key: "suv", label: "SUV", icon: "🚙" },
  { key: "minivan", label: "Minivan", icon: "🚐" },
  { key: "pickup", label: "Pickup", icon: "🛻" },
  { key: "motosiklet", label: "Motosiklet", icon: "🏍️" },
  { key: "kamyon", label: "Kamyon", icon: "🚚" },
];

const BREAKDOWN_OPTIONS: {
  key: BreakdownType;
  label: string;
  icon: string;
}[] = [
  { key: "lastik", label: "Lastik Patladı", icon: "🔴" },
  { key: "aku", label: "Akü Bitti", icon: "🔋" },
  { key: "kaza", label: "Kaza", icon: "💥" },
  { key: "motor", label: "Motor", icon: "⚙️" },
  { key: "yakit", label: "Yakıt", icon: "⛽" },
  { key: "diger", label: "Diğer", icon: "❓" },
];

export default function CekiciDetaylarPage() {
  const router = useRouter();
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownType | null>(null);
  const [transmission, setTransmission] = useState<Transmission | null>(null);
  const [driveType, setDriveType] = useState<DriveType | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasEnoughForSummary = !!vehicleType || !!breakdown || !!transmission || !!driveType;

  const summaryTags = useMemo(() => {
    const tags: string[] = [];
    const vt = VEHICLE_OPTIONS.find((v) => v.key === vehicleType);
    if (vt) tags.push(`${vt.icon} ${vt.label}`);
    const bt = BREAKDOWN_OPTIONS.find((b) => b.key === breakdown);
    if (bt) tags.push(`${bt.icon} ${bt.label}`);
    if (transmission) {
      tags.push(
        transmission === "manuel" ? "🕹️ Manuel" : "🤖 Otomatik"
      );
    }
    if (driveType) {
      tags.push(driveType === "2wd" ? "2WD Normal" : "4x4 / AWD");
    }
    if (note.trim()) {
      tags.push("📝 Not eklendi");
    }
    return tags;
  }, [vehicleType, breakdown, transmission, driveType, note]);

  const handleSubmit = async () => {
    if (!vehicleType || !breakdown || !transmission || !driveType || loading) {
      setError("Lütfen zorunlu alanları doldur.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const user = await getCurrentUser();
      const vehicleId = await getActiveVehicleId();

      const pickup_address = "Kadıköy";
      const dropoff_address = "Yakın Servis";
      const pickup_lat = 40.987;
      const pickup_lng = 29.041;
      const dropoff_lat = 40.979;
      const dropoff_lng = 29.029;

      const { data, error: insertError } = await supabase
        .from("tow_requests")
        .insert({
          customer_id: user.id,
          vehicle_id: vehicleId,
          pickup_address,
          dropoff_address,
          pickup_lat,
          pickup_lng,
          dropoff_lat,
          dropoff_lng,
          vehicle_type: vehicleType,
          breakdown_reason: breakdown,
          transmission,
          drive_type: driveType,
          extra_note: note || null,
          status: "bekliyor",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;

      router.push(
        `/musteri/cekici-cagir/bekleme?request_id=${data.id}`
      );
    } catch (err) {
      console.error(err);
      setError("Talep oluşturulamadı. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Çekici Çağır
          </p>
          <h1 className="text-xl font-semibold">Araç Detayları</h1>
          <p className="mt-1 text-xs text-slate-400">
            Doğru ekipman gelsin, fiyat netleşsin.
          </p>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            {/* Soru 1 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Araç tipi</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {VEHICLE_OPTIONS.map((opt) => {
                  const active = opt.key === vehicleType;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setVehicleType(opt.key)}
                      className={`rounded-2xl px-2 py-2 text-center font-medium ${
                        active
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-950 text-slate-200"
                      }`}
                    >
                      <div>{opt.icon}</div>
                      <div className="mt-1">{opt.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Soru 2 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Ne oldu?</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {BREAKDOWN_OPTIONS.map((opt) => {
                  const active = opt.key === breakdown;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setBreakdown(opt.key)}
                      className={`rounded-2xl px-3 py-2 text-left font-medium ${
                        active
                          ? "bg-red-600 text-white"
                          : "bg-slate-950 text-slate-200"
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Soru 3 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Vites</p>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setTransmission("manuel")}
                  className={`flex-1 rounded-2xl px-3 py-2 font-medium ${
                    transmission === "manuel"
                      ? "bg-slate-100 text-slate-900"
                      : "bg-slate-950 text-slate-200"
                  }`}
                >
                  🕹️ Manuel
                </button>
                <button
                  type="button"
                  onClick={() => setTransmission("otomatik")}
                  className={`flex-1 rounded-2xl px-3 py-2 font-medium ${
                    transmission === "otomatik"
                      ? "bg-slate-100 text-slate-900"
                      : "bg-slate-950 text-slate-200"
                  }`}
                >
                  🤖 Otomatik
                </button>
              </div>
            </div>

            {/* Soru 4 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Çekiş</p>
              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDriveType("2wd")}
                  className={`flex-1 rounded-2xl px-3 py-2 font-medium ${
                    driveType === "2wd"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-950 text-slate-200"
                  }`}
                >
                  2WD Normal
                </button>
                <button
                  type="button"
                  onClick={() => setDriveType("4x4")}
                  className={`flex-1 rounded-2xl px-3 py-2 font-medium ${
                    driveType === "4x4"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-950 text-slate-200"
                  }`}
                >
                  4x4 / AWD
                </button>
              </div>
            </div>

            {/* Soru 5 */}
            <div className="space-y-2">
              <p className="text-sm font-semibold">Ekstra not (isteğe bağlı)</p>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Örn: Araç alçak, dikkatli yüklenmesi gerekiyor."
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none placeholder:text-slate-600"
              />
            </div>

            {/* Canlı özet */}
            <div className="space-y-2 rounded-2xl border border-emerald-700 bg-emerald-950/60 px-4 py-3 text-xs text-emerald-50">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Canlı Özet
              </p>
              {hasEnoughForSummary ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {summaryTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-800/70 px-3 py-1 text-[11px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-1 text-[11px] text-emerald-100">
                  Seçim yaptıkça özet burada yeşil etiketler olarak
                  görünecek.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-emerald-500/40 disabled:bg-slate-700 disabled:text-slate-300"
          >
            {loading ? "Gönderiliyor..." : "Teklif İste"}
          </button>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </section>
      </main>
    </div>
  );
}

