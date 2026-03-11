import { supabase } from "./supabaseClient";

export async function signInWithPhone(phone: string) {
  const fullPhone = phone.startsWith("+90") ? phone : `+90${phone}`;
  return supabase.auth.signInWithOtp({
    phone: fullPhone,
    options: {
      channel: "sms",
    },
  });
}

export async function verifyPhoneOtp(phone: string, token: string) {
  const fullPhone = phone.startsWith("+90") ? phone : `+90${phone}`;
  return supabase.auth.verifyOtp({
    phone: fullPhone,
    token,
    type: "sms",
  });
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

