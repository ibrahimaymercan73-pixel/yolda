import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { createSession, getSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email as string)?.trim().toLowerCase();
    const token = (body.token as string)?.trim();
    if (!email || !token) {
      return NextResponse.json(
        { error: "E-posta ve doğrulama kodu gerekli." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer(false);
    const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (verifyError || !authData.user?.id) {
      return NextResponse.json(
        { error: "Kod doğrulanamadı. Lütfen tekrar dene." },
        { status: 400 }
      );
    }

    const authUid = authData.user.id;
    const supabaseAdmin = getSupabaseServer(true);
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("auth_uid", authUid)
      .limit(1)
      .single();

    let userId: string;
    if (existing?.id) {
      userId = existing.id;
    } else {
      const { data: inserted, error: insertErr } = await supabaseAdmin
        .from("users")
        .insert({ email, name: "", auth_uid: authUid })
        .select("id")
        .single();
      if (insertErr || !inserted?.id) {
        return NextResponse.json(
          { error: "Hesap oluşturulamadı." },
          { status: 500 }
        );
      }
      userId = inserted.id;
    }

    const sessionToken = await createSession(userId);
    const res = NextResponse.json({
      hasUser: !!existing?.id,
      redirect: existing?.id ? "/musteri/anasayfa" : "/auth/onboard",
    });
    res.cookies.set(getSessionCookie(), sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}
