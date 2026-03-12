"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...values];
    next[index] = value;
    setValues(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (value && index === OTP_LENGTH - 1) {
      void handleVerify([...next].join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && !values[index] && index > 0) {
      const prevIndex = index - 1;
      inputsRef.current[prevIndex]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (loading || code.length !== OTP_LENGTH) return;
    setLoading(true);
    setError(null);
    try {
      if (code === "123456") {
        router.push("/auth/onboard");
        return;
      }
      router.push("/auth/onboard");
    } catch (err) {
      console.error(err);
      setError("Kod doğrulanamadı. Lütfen tekrar dene.");
      setValues(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 flex h-[38px] w-[38px] items-center justify-center rounded-[12px] bg-[var(--bg-soft)] text-[var(--text)]"
        >
          ←
        </button>

        <div className="mb-2 text-4xl">🔐</div>
        <h1
          className="text-[28px] font-extrabold text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Doğrulama kodu
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          +90 {phone || "5XX XXX XX XX"} numarasına gönderdik.
        </p>

        <div className="mt-8 flex justify-between gap-2">
          {values.map((v, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              className={`h-[54px] w-full max-w-[52px] rounded-[14px] border border-transparent text-center text-xl font-bold text-[var(--text)] outline-none focus:border-[#111] ${
                v ? "bg-[#111] text-white" : "bg-[var(--bg-soft)]"
              }`}
              value={v}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={loading}
          className="mt-4 text-sm font-semibold text-[var(--text-muted)] disabled:opacity-50"
          onClick={() =>
            router.push(`/auth/login?phone=${encodeURIComponent(phone)}`)
          }
        >
          Tekrar Gönder
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

        <div className="mt-6 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3">
          <p className="text-xs font-bold text-[var(--green)]">
            Test modu: 123456 kodunu girerek devam edebilirsin.
          </p>
        </div>

        <p className="mt-6 text-xs text-[var(--text-dim)]">
          Kodu girerek YOLDA&apos;nın kullanım şartlarını ve gizlilik
          politikasını kabul edersin.
        </p>
      </main>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Kod ekranı yükleniyor...
        </div>
      }
    >
      <OtpContent />
    </Suspense>
  );
}
