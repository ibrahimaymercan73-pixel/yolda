import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac } from "crypto";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifySession, getSessionCookie } from "@/lib/session";

const PAYTR_URL = "https://www.paytr.com/odeme/api/get-token";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookie())?.value;
    const payload = await verifySession(token || "");
    if (!payload?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const jobId = body.jobId as string;
    if (!jobId) {
      return NextResponse.json({ error: "jobId gerekli" }, { status: 400 });
    }

    const supabase = getSupabaseServer(true);
    const { data: job, error: jobErr } = await supabase
      .from("jobs")
      .select("id, offer_id, request_id")
      .eq("id", jobId)
      .single();
    if (jobErr || !job) {
      return NextResponse.json({ error: "İş bulunamadı" }, { status: 404 });
    }

    const { data: offer } = await supabase
      .from("offers")
      .select("price")
      .eq("id", job.offer_id)
      .single();
    const { data: req } = await supabase
      .from("requests")
      .select("user_id")
      .eq("id", job.request_id)
      .single();
    if (!req || req.user_id !== payload.userId) {
      return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
    }

    const { data: user } = await supabase
      .from("users")
      .select("email, phone, name")
      .eq("id", payload.userId)
      .single();

    const price = Number((offer as { price?: number })?.price ?? 0);
    const payment_amount = Math.round(price * 100); // kuruş
    const email = (user?.email as string) || `${user?.phone || "user"}@yolda.app`;
    const user_name = (user?.name as string) || "YOLDA Kullanıcı";
    const user_ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "127.0.0.1";
    const merchant_id = process.env.PAYTR_MERCHANT_ID!;
    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    if (!merchant_id || !merchant_key || !merchant_salt) {
      return NextResponse.json({ error: "Ödeme ayarları eksik" }, { status: 500 });
    }

    const merchant_oid = jobId;
    const no_installment = 0;
    const max_installment = 0;
    const currency = "TL";
    const test_mode = 1;

    const user_basket = Buffer.from(
      JSON.stringify([[`Şoför Hizmeti`, price.toFixed(2), 1]])
    ).toString("base64");

    const hash_str = `${merchant_id}${user_ip}${merchant_oid}${email}${payment_amount}${user_basket}${no_installment}${max_installment}${currency}${test_mode}`;
    const paytr_token = createHmac("sha256", merchant_key)
      .update(hash_str + merchant_salt)
      .digest("base64");

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yolda-alpha.vercel.app";
    const merchant_ok_url = `${baseUrl}/musteri/aktif-is/${jobId}`;
    const merchant_fail_url = `${baseUrl}/musteri/odeme/basarisiz`;

    const form = new URLSearchParams({
      merchant_id,
      user_ip,
      merchant_oid,
      email,
      payment_amount: String(payment_amount),
      paytr_token,
      user_basket,
      debug_on: "0",
      no_installment: String(no_installment),
      max_installment: String(max_installment),
      user_name,
      user_address: "Türkiye",
      user_phone: (user?.phone as string) || "",
      merchant_ok_url,
      merchant_fail_url,
      timeout_limit: "30",
      currency,
      test_mode: String(test_mode),
    });

    const res = await fetch(PAYTR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const data = await res.json().catch(() => ({}));
    if (data.status !== "success" || !data.token) {
      return NextResponse.json(
        { error: data.reason || "Token alınamadı" },
        { status: 400 }
      );
    }

    await supabase
      .from("jobs")
      .update({ paytr_merchant_oid: merchant_oid })
      .eq("id", jobId);

    return NextResponse.json({ token: data.token });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Ödeme başlatılamadı." },
      { status: 500 }
    );
  }
}
