"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SEC = 120;

function OtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const method = (searchParams.get("method") || "phone") as "phone" | "email";
  const to = searchParams.get("to") ?? "";
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SEC);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

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
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code: string) => {
    if (loading || code.length !== OTP_LENGTH) return;
    setLoading(true);
    setError(null);
    try {
      const endpoint =
        method === "phone"
          ? "/api/auth/verify-otp"
          : "/api/auth/verify-email-otp";
      const body =
        method === "phone"
          ? { phone: to.replace(/\D/g, ""), code }
          : { email: to.trim().toLowerCase(), token: code };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Kod doğrulanamadı.");
        setValues(Array(OTP_LENGTH).fill(""));
        inputsRef.current[0]?.focus();
        return;
      }
      if (data.redirect) router.push(data.redirect);
    } catch (err) {
      setError("Bağlantı hatası. Tekrar dene.");
      setValues(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    setError(null);
    const endpoint =
      method === "phone" ? "/api/auth/send-otp" : "/api/auth/send-email-otp";
    const body =
      method === "phone"
        ? { phone: to.replace(/\D/g, "") }
        : { email: to.trim().toLowerCase() };
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setCooldown(RESEND_COOLDOWN_SEC);
    } else {
      const d = await res.json().catch(() => ({}));
      setError(d.error || "Tekrar gönderilemedi.");
    }
  };

  const toDisplay =
    method === "phone"
      ? `+90 ${to.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")}`
      : to;

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
          {method === "phone"
            ? `${toDisplay} numarasına gönderdik.`
            : `${toDisplay} adresine gönderdik.`}
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
              className={`h-[54px] w-full max-w-[52px] rounded-[14px] border border-transparent text-center text-xl font-bold outline-none focus:border-[#111] ${
                v ? "bg-[#111] text-white" : "bg-[var(--bg-soft)] text-[var(--text)]"
              }`}
              value={v}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        <button
          type="button"
          disabled={loading || cooldown > 0}
          className="mt-4 text-sm font-semibold text-[var(--text-muted)] disabled:opacity-50"
          onClick={handleResend}
        >
          {cooldown > 0
            ? `Tekrar Gönder (${cooldown}s)`
            : "Tekrar Gönder"}
        </button>

        {error && (
          <p className="mt-4 text-sm text-red-500">{error}</p>
        )}

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
