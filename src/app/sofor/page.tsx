"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { signInWithPhone, verifyPhoneOtp } from "@/lib/auth";

const OTP_LENGTH = 6;

export default function SoforPage() {
  const router = useRouter();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const digitsOnly = useMemo(() => phone.replace(/\D/g, ""), [phone]);
  const isValidPhone = digitsOnly.length >= 10;

  useEffect(() => {
    if (step === "otp") inputsRef.current[0]?.focus();
  }, [step]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhone || loading) return;
    setLoading(true);
    setError(null);
    try {
      // TEST modu için mevcut akışla uyumlu bırakalım: SMS gönderimi sorunluysa yine de OTP ekranını aç.
      const { error: signInError } = await signInWithPhone(digitsOnly);
      if (signInError) {
        // SMS çalışmıyorsa bile test akışını bozmayalım.
        console.warn(signInError);
      }
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError("Kod gönderilemedi. Lütfen tekrar dene.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeOtp = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const next = [...values];
    next[index] = value;
    setValues(next);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (value && index === OTP_LENGTH - 1) {
      void handleVerify(next.join(""));
    }
  };

  const handleKeyDownOtp = (
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
      // TEST modu: 123456 kabul
      if (code !== "123456") {
        const { error: verifyError } = await verifyPhoneOtp(digitsOnly, code);
        if (verifyError) throw verifyError;
      }

      const { data: userData, error: userErr } = await supabase.auth.getUser();
      if (userErr) throw userErr;
      const user = userData.user;
      if (!user) throw new Error("No user");

      const { data: roleRow, error: roleErr } = await supabase
        .from("users")
        .select("id, role")
        .eq("id", user.id)
        .single();

      // Kayıt akışı: users tablosunda satır var mı?
      if (roleErr && roleErr.code === "PGRST116") {
        router.replace("/sofor/kayit");
        return;
      }
      if (roleErr) throw roleErr;

      // Opsiyonel: mevcut rol sofor değilse engelle
      if (roleRow?.role && roleRow.role !== "sofor") {
        await supabase.auth.signOut();
        setError("Bu hesap şoför hesabı değil.");
        setStep("phone");
        setValues(Array(OTP_LENGTH).fill(""));
        return;
      }

      router.replace("/sofor/anasayfa");
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
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#111] text-lg font-bold text-white">
          Y
        </div>

        <h1
          className="text-[34px] font-extrabold leading-tight text-[var(--text)]"
          style={{ letterSpacing: "-0.8px" }}
        >
          Şoför Girişi
        </h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">
          YOLDA şoför paneline hoş geldin.
        </p>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="mt-8 space-y-4">
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
              disabled={!isValidPhone || loading}
              className="w-full rounded-[14px] bg-[#111] px-4 py-4 text-[15px] font-bold text-white disabled:opacity-50"
            >
              {loading ? "Gönderiliyor..." : "Devam Et"}
            </button>

            <p className="text-xs font-semibold text-[var(--green)]">
              Test modu: 123456 kodunu girerek devam edebilirsin.
            </p>

            <p className="pt-2 text-center text-sm text-[var(--text-dim)]">
              Şoför hesabın yok mu?{" "}
              <button
                type="button"
                className="text-[14px] font-medium text-[var(--text-muted)] hover:underline"
                onClick={() => router.push("/sofor/kayit")}
              >
                Kayıt Ol
              </button>
            </p>
          </form>
        ) : (
          <div className="mt-8">
            <div className="mb-2 text-4xl">🔐</div>
            <p className="text-sm font-semibold text-[var(--text)]">
              Doğrulama kodu
            </p>
            <p className="mt-1 text-xs text-[var(--text-dim)]">
              +90 {digitsOnly || "5XX XXX XX XX"} numarasına gönderdik.
            </p>

            <div className="mt-6 flex justify-between gap-2">
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
                  onChange={(e) => handleChangeOtp(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDownOtp(index, e)}
                />
              ))}
            </div>

            <button
              type="button"
              disabled={loading}
              className="mt-4 text-sm font-semibold text-[var(--text-muted)] disabled:opacity-50"
              onClick={() => {
                setValues(Array(OTP_LENGTH).fill(""));
                inputsRef.current[0]?.focus();
                setStep("phone");
              }}
            >
              Tekrar Gönder
            </button>

            <div className="mt-6 rounded-[14px] bg-[var(--bg-soft)] px-4 py-3">
              <p className="text-xs font-bold text-[var(--green)]">
                Test modu: 123456 kodunu girerek devam edebilirsin.
              </p>
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
      </main>
    </div>
  );
}
