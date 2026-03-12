"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [loading, setLoading] = useState(false);

  const digitsOnly = phone.replace(/\D/g, "");
  const isValid = digitsOnly.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    router.push(`/auth/otp?phone=${encodeURIComponent(digitsOnly)}&test=1`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <main className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-5 py-6">
        <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#111] text-lg font-bold text-white">
          Y
        </div>

        <h1
          className="text-[34px] font-extrabold leading-tight text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Hoş
          <br />
          geldin.
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          Giriş yapmak için telefon numaranı gir.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-[2px] text-[var(--text-muted)]">
              Telefon
            </span>
            <div className="mt-2 flex items-center gap-2 rounded-[14px] bg-[var(--bg-soft)] px-4 py-[15px]">
              <span className="text-base">🇹🇷</span>
              <span className="text-sm font-semibold text-[var(--text)]">
                +90
              </span>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="5XX XXX XX XX"
                className="flex-1 bg-transparent text-sm font-semibold text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
          >
            {loading ? "Gönderiliyor..." : "Devam Et"}
          </button>
        </form>

        <p className="mt-3 text-xs text-[var(--green)]">
          Test modu: SMS gönderilmiyor, bir sonraki ekranda 123456 gir.
        </p>

        <div className="mt-8 flex items-center gap-3 text-sm text-[var(--text-dim)]">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span>veya</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--bg-soft)] px-4 py-[14px] text-sm font-semibold text-[var(--text)]"
          >
            <span className="text-lg"></span>
            <span>Apple ile Giriş</span>
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-[var(--bg-soft)] px-4 py-[14px] text-sm font-semibold text-[var(--text)]"
          >
            <span className="text-lg">G</span>
            <span>Google ile Giriş</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-[var(--text-dim)]">
          Hesabın yok mu?{" "}
          <button
            type="button"
            className="text-[14px] font-medium text-[var(--text-muted)] hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Kayıt Ol
          </button>
        </p>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--bg)] text-sm text-[var(--text-dim)]">
          Yükleniyor...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
