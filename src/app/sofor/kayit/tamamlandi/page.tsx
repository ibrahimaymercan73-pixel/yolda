"use client";

import { useRouter } from "next/navigation";

export default function SoforKayitTamamlandiPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col items-center justify-center px-5 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green)]/15 text-3xl text-[var(--green)]">
          ✓
        </div>
        <h1
          className="mt-5 text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Başvurun alındı!
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Belgeler incelendikten sonra hesabın aktif edilecek. Genellikle 24
          saat sürer.
        </p>

        <div className="mt-6 w-full rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] p-4 text-left text-sm text-[var(--text-dim)]">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
            Bilgi
          </p>
          <p className="mt-2">
            Onay tamamlanana kadar çevrimiçi olamazsın ve iş talepleri
            gösterilmez.
          </p>
        </div>

        <button
          type="button"
          onClick={() => router.replace("/sofor/onay-bekliyor")}
          className="mt-6 w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
        >
          Devam Et
        </button>
      </main>
    </div>
  );
}

