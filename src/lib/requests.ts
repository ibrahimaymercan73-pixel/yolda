import { supabase } from "./supabaseClient";
import { getCurrentUser } from "./auth";

// Aktif aracı döndürür, yoksa hata fırlatır
export async function getActiveVehicleId() {
  const user = await getCurrentUser();
  const { data, error } = await supabase
    .from("vehicles")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    throw new Error("Aktif araç bulunamadı. Lütfen garajdan seçin.");
  }

  return data.id as string;
}

