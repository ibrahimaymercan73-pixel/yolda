import { supabase } from "./supabaseClient";

export type AppUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
};

/** Şoför paneli (/sofor) için Supabase telefon OTP – müşteri paneli custom OTP kullanır */
export function signInWithPhone(phone: string) {
  const fullPhone = phone.startsWith("+90") ? phone : `+90${phone}`;
  return supabase.auth.signInWithOtp({
    phone: fullPhone,
    options: { channel: "sms" },
  });
}

/** Şoför paneli (/sofor) için Supabase OTP doğrulama */
export function verifyPhoneOtp(phone: string, token: string) {
  const fullPhone = phone.startsWith("+90") ? phone : `+90${phone}`;
  return supabase.auth.verifyOtp({
    phone: fullPhone,
    token,
    type: "sms",
  });
}

export async function getCurrentUser(): Promise<AppUser | null> {
  try {
    const res = await fetch("/api/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    return data as AppUser;
  } catch {
    return null;
  }
}

export async function getCurrentUserOrThrow(): Promise<AppUser> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Oturum bulunamadı.");
  return user;
}
