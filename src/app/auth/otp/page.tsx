"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPhoneOtp } from "@/lib/auth";

const OTP_LENGTH = 4;

export default function OtpPage() {
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
      const { error: verifyError } = await verifyPhoneOtp(phone, code);
      if (verifyError) throw verifyError;
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
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#FF7A00]">
            Doğrulama
          </p>
          <h1 className="mt-2 text-2xl font-semibold">SMS Kodu</h1>
          <p className="mt-2 text-sm text-slate-400">
            +90 {phone || "5XX XXX XX XX"} numarasına gönderdik.
          </p>
        </header>

        <section className="mt-4 flex flex-1 flex-col justify-between">
          <div className="space-y-6">
            <div className="flex justify-between gap-3">
              {values.map((v, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  className="h-12 w-12 rounded-2xl border border-slate-700 bg-slate-900 text-center text-xl font-semibold tracking-widest text-slate-50 outline-none focus:border-[#FF7A00]"
                  value={v}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={loading}
              className="text-sm font-medium text-[#FF7A00] disabled:opacity-50"
              onClick={() => router.push(`/auth/login?phone=${encodeURIComponent(phone)}`)}
            >
              Tekrar Gönder
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">
              {error}
            </p>
          )}

          <p className="mt-8 text-xs text-slate-500">
            Kodu girerek YOLDA&apos;nın kullanım şartlarını ve gizlilik
            politikasını kabul edersin.
          </p>
        </section>
      </main>
    </div>
  );
}

