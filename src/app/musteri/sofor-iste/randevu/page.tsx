"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type DayKey = "bugun" | "yarin" | "obur";

const DAYS: { key: DayKey; label: string }[] = [
  { key: "bugun", label: "Bugün" },
  { key: "yarin", label: "Yarın" },
  { key: "obur", label: "Öbür gün" },
];

const HOURS = [
  "22:00",
  "22:30",
  "23:00",
  "23:30",
  "00:00",
  "00:30",
  "01:00",
  "01:30",
  "02:00",
] as const;

export default function SoforRandevuPage() {
  const router = useRouter();
  const [day, setDay] = useState<DayKey>("yarin");
  const [hour, setHour] = useState<string>("23:00");
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const preview = useMemo(() => {
    const dayLabel =
      day === "bugun" ? "Bugün" : day === "yarin" ? "Yarın" : "Öbür gün";
    // Örnek gün ismi olarak Pazar kullanalım
    const weekday = "Pazar";
    return `${dayLabel} · ${weekday}, ${hour}`;
  }, [day, hour]);

  const handleContinue = () => {
    if (!selectedDriver) return;
    router.push("/musteri/sofor-iste/randevu-onay");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            Şoför İste
          </p>
          <h1 className="text-xl font-semibold">Randevu Seç</h1>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div className="space-y-5">
            {/* Gün seçici */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Gün</p>
              <div className="flex gap-2">
                {DAYS.map((d) => {
                  const active = d.key === day;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDay(d.key)}
                      className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold ${
                        active
                          ? "bg-[#FF4500] text-white"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Saat seçici */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Saat</p>
              <div className="flex flex-wrap gap-2">
                {HOURS.map((h) => {
                  const active = h === hour;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHour(h)}
                      className={`rounded-2xl px-3 py-2 text-xs font-semibold ${
                        active
                          ? "bg-slate-100 text-slate-900"
                          : "bg-slate-900 text-slate-300"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-xs text-slate-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Önizleme
              </p>
              <p className="mt-1 text-sm">{preview}</p>
            </div>

            {/* Basitleştirilmiş şoför listesi */}
            <div className="space-y-3">
              {["Ahmet", "Zeynep", "Emre"].map((name, index) => {
                const id = String(index + 1);
                const active = selectedDriver === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedDriver(id)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                      active
                        ? "border-[#FF4500] bg-slate-900"
                        : "border-slate-800 bg-slate-950"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {name === "Zeynep" ? "👩‍✈️" : "🧑‍✈️"}
                        </span>
                        <div>
                          <p className="font-semibold">{name}</p>
                          <p className="text-[11px] text-slate-400">
                            Randevulu siparişler için uygun
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-emerald-400">Müsait</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedDriver}
            onClick={handleContinue}
            className={`mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              selectedDriver
                ? "bg-primary text-primary-foreground"
                : "bg-slate-800 text-slate-500"
            }`}
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}

