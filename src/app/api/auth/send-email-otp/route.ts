import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Geçerli e-posta adresi girin." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer(false);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: undefined },
    });
    if (error) {
      console.error("signInWithOtp:", error);
      return NextResponse.json(
        { error: error.message || "E-posta gönderilemedi." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      redirect: `/auth/otp?method=email&to=${encodeURIComponent(email)}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}
