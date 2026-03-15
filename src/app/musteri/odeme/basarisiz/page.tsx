"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BasarisizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const offerId = searchParams.get("offerId");

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-5">
      <div className="text-4xl mb-4">❌</div>
      <h1 className="text-xl font-bold text-[var(--text)] text-center">
        Ödeme başarısız
      </h1>
      <p className="mt-2 text-sm text-[var(--text-dim)] text-center">
        Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin.
      </p>
      <div className="mt-8 flex flex-col gap-3 w-full max-w-[320px]">
        {offerId && (
          <button
            type="button"
            onClick={() => router.push(`/musteri/odeme/${offerId}`)}
            className="w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white"
          >
            Tekrar Dene
          </button>
        )}
        <button
          type="button"
          onClick={() => router.push("/musteri/anasayfa")}
          className="w-full rounded-[14px] bg-[var(--bg-soft)] px-4 py-4 text-[15px] font-bold text-[var(--text)]"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    </div>
  );
}

export default function OdemeBasarisizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg)]" />}>
      <BasarisizContent />
    </Suspense>
  );
}
