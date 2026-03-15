"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type VehicleType = "sedan" | "suv" | "minivan" | "pickup" | "motosiklet" | "kamyon";
type BreakdownType = "lastik" | "aku" | "kaza" | "motor" | "yakit" | "diger";
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

const BREAKDOWN_OPTIONS: { key: BreakdownType; label: string; icon: string }[] = [
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
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem("cekiciKonum") : null;
    if (!raw) {
      router.replace("/musteri/cekici-cagir/konum");
      return;
    }
    setReady(true);
  }, [router]);

  const summaryTags = useMemo(() => {
    const tags: string[] = [];
    const vt = VEHICLE_OPTIONS.find((v) => v.key === vehicleType);
    if (vt) tags.push(`${vt.icon} ${vt.label}`);
    const bt = BREAKDOWN_OPTIONS.find((b) => b.key === breakdown);
    if (bt) tags.push(`${bt.icon} ${bt.label}`);
    if (transmission) tags.push(transmission === "manuel" ? "🕹️ Manuel" : "🤖 Otomatik");
    if (driveType) tags.push(driveType === "2wd" ? "2WD Normal" : "4x4 / AWD");
    if (note.trim()) tags.push("📝 Not");
    return tags;
  }, [vehicleType, breakdown, transmission, driveType, note]);

  const handleSubmit = () => {
    if (!vehicleType || !breakdown || !transmission || !driveType) return;
    const konumRaw = typeof window !== "undefined" ? window.sessionStorage.getItem("cekiciKonum") : null;
    if (!konumRaw) {
      router.replace("/musteri/cekici-cagir/konum");
      return;
    }
    const konum = JSON.parse(konumRaw) as Record<string, unknown>;
    const payload = {
      ...konum,
      vehicle_details: { type: vehicleType, problem: breakdown, gear: transmission, drive: driveType, extra_note: note.trim() || null },
    };
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("cekiciTalep", JSON.stringify(payload));
    }
    router.push("/musteri/cekici-cagir/talep-olustur");
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
        <p className="text-sm text-[var(--text-dim)]">Yönlendiriliyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button type="button" onClick={() => router.push("/musteri/cekici-cagir/konum")} className="mb-4 flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]">←</button>
        <h1 className="text-[28px] font-extrabold text-[var(--text)]" style={{ letterSpacing: "-0.8px" }}>Araç Detayları</h1>
        <p className="mt-1 text-sm text-[var(--text-dim)]">Doğru ekipman gelsin, fiyat netleşsin.</p>

        <section className="mt-6 flex-1 space-y-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Araç tipi</span>
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              {VEHICLE_OPTIONS.map((opt) => (
                <button key={opt.key} type="button" onClick={() => setVehicleType(opt.key)} className={`rounded-[14px] px-2 py-3 text-center font-bold ${vehicleType === opt.key ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>
                  <div>{opt.icon}</div>
                  <div className="mt-1">{opt.label}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Ne oldu?</span>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              {BREAKDOWN_OPTIONS.map((opt) => (
                <button key={opt.key} type="button" onClick={() => setBreakdown(opt.key)} className={`rounded-[14px] px-3 py-3 text-left font-bold ${breakdown === opt.key ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>
                  <span className="mr-1">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Vites</span>
            <div className="mt-2 flex gap-2 text-xs">
              <button type="button" onClick={() => setTransmission("manuel")} className={`flex-1 rounded-[14px] px-3 py-3 font-bold ${transmission === "manuel" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>🕹️ Manuel</button>
              <button type="button" onClick={() => setTransmission("otomatik")} className={`flex-1 rounded-[14px] px-3 py-3 font-bold ${transmission === "otomatik" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>🤖 Otomatik</button>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Çekiş</span>
            <div className="mt-2 flex gap-2 text-xs">
              <button type="button" onClick={() => setDriveType("2wd")} className={`flex-1 rounded-[14px] px-3 py-3 font-bold ${driveType === "2wd" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>2WD Normal</button>
              <button type="button" onClick={() => setDriveType("4x4")} className={`flex-1 rounded-[14px] px-3 py-3 font-bold ${driveType === "4x4" ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"}`}>4x4 / AWD</button>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Ekstra not (isteğe bağlı)</span>
            <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Örn: Araç alçak, dikkatli yüklenmesi gerekiyor." className="mt-2 w-full rounded-[14px] border border-transparent bg-[var(--bg-soft)] px-4 py-3 text-sm font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]" />
          </div>
          <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">Canlı Özet</span>
            {summaryTags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {summaryTags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--green)]/20 px-3 py-1 text-xs font-semibold text-[var(--green)]">{tag}</span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--text-dim)]">Seçim yaptıkça özet burada görünecek.</p>
            )}
          </div>
        </section>

        <button type="button" onClick={handleSubmit} disabled={!vehicleType || !breakdown || !transmission || !driveType} className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50">Devam Et</button>
      </main>
    </div>
  );
}
