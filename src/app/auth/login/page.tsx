 "use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithPhone } from "@/lib/auth";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState(searchParams.get("phone") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const digitsOnly = phone.replace(/\D/g, "");
  const isValid = digitsOnly.length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { error: authError } = await signInWithPhone(digitsOnly);
      if (authError) throw authError;
      router.push(`/auth/otp?phone=${encodeURIComponent(digitsOnly)}`);
    } catch (err) {
      console.error(err);
      setError("Kod gönderilirken bir hata oluştu. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex min-h-screen w-full max-w-[430px] flex-col bg-background px-5 py-6 text-foreground">
        <header className="mb-6 rounded-2xl bg-[#FF4500] px-4 py-3 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.3em]">
            YOLDA
          </div>
          <p className="mt-1 text-xs opacity-90">Yedek Şoför & Çekici Platformu</p>
        </header>

        <section className="flex flex-1 flex-col justify-between">
          <div>
            <h1 className="text-xl font-semibold">Telefon numaranla devam et</h1>
            <p className="mt-2 text-sm text-slate-400">
              Giriş yapmak için Türkiye telefon numaranı gir.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block text-sm font-medium">
                Telefon Numarası
                <div className="mt-2 flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-3">
                  <div className="flex items-center gap-2 rounded-xl bg-slate-950 px-2 py-1 text-xs">
                    <span className="text-base">🇹🇷</span>
                    <span className="font-semibold text-slate-100">+90</span>
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="5XX XXX XX XX"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-600"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={!isValid || loading}
                className={`mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isValid
                    ? "bg-[#FF4500] text-white shadow-sm shadow-orange-500/40"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {loading ? "Gönderiliyor..." : "Devam Et"}
              </button>
            </form>

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3 text-xs text-slate-500">
              <div className="h-px flex-1 bg-slate-800" />
              <span>veya</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            <div className="mt-4 space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900"
              >
                <span className="text-lg"></span>
                <span>Apple ile Giriş</span>
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900"
              >
                <span className="text-lg">G</span>
                <span>Google ile Giriş</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-500">
            Hesabın yok mu?{" "}
            <button
              type="button"
              className="font-semibold text-[#FF7A00]"
              onClick={() => router.push("/auth/register")}
            >
              Kayıt Ol
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-sm text-slate-400">
          Yükleniyor...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
