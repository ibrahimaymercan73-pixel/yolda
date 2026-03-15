import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabaseServer";

const NETGSM_URL = "https://api.netgsm.com.tr/sms/send/get";
const OTP_EXPIRE_MINUTES = 5;

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = (body.phone as string)?.replace(/\D/g, "");
    if (!phone || phone.length < 10) {
      return NextResponse.json(
        { error: "Geçerli telefon numarası girin." },
        { status: 400 }
      );
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);
    const supabase = getSupabaseServer(true);

    const { error: insertError } = await supabase.from("otp_codes").insert({
      phone: `90${phone}`,
      code,
      expires_at: expiresAt.toISOString(),
      used: false,
    });
    if (insertError) {
      console.error("otp_codes insert:", insertError);
      return NextResponse.json(
        { error: "Kod kaydedilemedi. Tekrar deneyin." },
        { status: 500 }
      );
    }

    const usercode = process.env.NETGSM_USERCODE;
    const password = process.env.NETGSM_PASSWORD;
    const header = process.env.NETGSM_HEADER || "YOLDA";
    if (usercode && password) {
      const params = new URLSearchParams({
        usercode,
        password,
        gsmno: `90${phone}`,
        message: `YOLDA doğrulama kodun: ${code}`,
        msgheader: header,
      });
      const res = await fetch(`${NETGSM_URL}?${params.toString()}`, {
        method: "GET",
      });
      const text = await res.text();
      if (!res.ok || (text !== "00" && text !== "01" && text !== "02")) {
        console.error("Netgsm response:", text);
        // Devam et; test ortamında SMS gitmese de kod kaydedildi
      }
    }

    return NextResponse.json({
      redirect: `/auth/otp?method=phone&to=${encodeURIComponent(phone)}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}
