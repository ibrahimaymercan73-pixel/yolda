import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { createSession, getSessionCookie } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = (body.phone as string)?.replace(/\D/g, "");
    const code = (body.code as string)?.trim();
    if (!phone || !code || code.length !== 6) {
      return NextResponse.json(
        { error: "Telefon ve 6 haneli kodu girin." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer(true);
    const fullPhone = `90${phone}`;

    const { data: rows, error: fetchError } = await supabase
      .from("otp_codes")
      .select("id, expires_at, used")
      .eq("phone", fullPhone)
      .eq("code", code)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError || !rows?.length) {
      return NextResponse.json(
        { error: "Kod doğrulanamadı. Lütfen tekrar dene." },
        { status: 400 }
      );
    }

    const row = rows[0];
    if (row.used) {
      return NextResponse.json(
        { error: "Bu kod zaten kullanıldı." },
        { status: 400 }
      );
    }
    if (new Date(row.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Kodun süresi doldu. Tekrar kod iste." },
        { status: 400 }
      );
    }

    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("id", row.id);

    let userId: string;
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("phone", fullPhone)
      .limit(1)
      .single();

    if (existing?.id) {
      userId = existing.id;
    } else {
      const { data: inserted, error: insertErr } = await supabase
        .from("users")
        .insert({ phone: fullPhone, name: "" })
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

    const token = await createSession(userId);
    const res = NextResponse.json({
      hasUser: !!existing?.id,
      redirect: existing?.id ? "/musteri/anasayfa" : "/auth/onboard",
    });
    res.cookies.set(getSessionCookie(), token, {
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
