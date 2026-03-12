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
    const weekday = "Pazar";
    return `${dayLabel} · ${weekday}, ${hour}`;
  }, [day, hour]);

  const handleContinue = () => {
    if (!selectedDriver) return;
    router.push("/musteri/sofor-iste/randevu-onay");
  };

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
          Randevu Seç
        </h1>

        <section className="mt-6 flex flex-1 flex-col">
          <div className="space-y-5">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Gün
              </span>
              <div className="flex gap-2">
                {DAYS.map((d) => {
                  const active = d.key === day;
                  return (
                    <button
                      key={d.key}
                      type="button"
                      onClick={() => setDay(d.key)}
                      className={`flex-1 rounded-[14px] px-3 py-3 text-sm font-bold ${
                        active
                          ? "bg-[#111] text-white"
                          : "bg-[var(--bg-soft)] text-[var(--text)]"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Saat
              </span>
              <div className="flex flex-wrap gap-2">
                {HOURS.map((h) => {
                  const active = h === hour;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHour(h)}
                      className={`rounded-[14px] px-3 py-2 text-xs font-bold ${
                        active
                          ? "bg-[#111] text-white"
                          : "bg-[var(--bg-soft)] text-[var(--text)]"
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
                Önizleme
              </span>
              <p className="mt-2 text-sm font-semibold text-[var(--text)]">
                {preview}
              </p>
            </div>

            <div className="space-y-3">
              {["Ahmet", "Zeynep", "Emre"].map((name, index) => {
                const id = String(index + 1);
                const active = selectedDriver === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedDriver(id)}
                    className={`w-full rounded-[16px] border p-4 text-left text-sm ${
                      active
                        ? "border-[#111] ring-2 ring-[#111] bg-[var(--bg-card)]"
                        : "border-[var(--border)] bg-[var(--bg-card)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">
                          {name === "Zeynep" ? "👩‍✈️" : "🧑‍✈️"}
                        </span>
                        <div>
                          <p className="font-bold text-[var(--text)]">{name}</p>
                          <p className="text-xs text-[var(--text-dim)]">
                            Randevulu siparişler için uygun
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-[var(--green)]">
                        Müsait
                      </p>
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
            className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            Devam Et
          </button>
        </section>
      </main>
    </div>
  );
}
