import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getSupabaseServer } from "@/lib/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const merchant_oid = form.get("merchant_oid") as string;
    const status = form.get("status") as string;
    const total_amount = form.get("total_amount") as string;
    const hash = form.get("hash") as string;

    if (!merchant_oid || !status || !hash) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    const merchant_key = process.env.PAYTR_MERCHANT_KEY!;
    const merchant_salt = process.env.PAYTR_MERCHANT_SALT!;
    if (!merchant_key || !merchant_salt) {
      return new NextResponse("Server error", { status: 500 });
    }

    const paytr_token = `${merchant_oid}${merchant_salt}${status}${total_amount || ""}`;
    const token = createHmac("sha256", merchant_key)
      .update(paytr_token)
      .digest("base64");

    if (token !== hash) {
      return new NextResponse("Invalid hash", { status: 400 });
    }

    if (status === "success") {
      const supabase = getSupabaseServer(true);
      await supabase
        .from("jobs")
        .update({ payment_status: "held" })
        .eq("id", merchant_oid);
    }

    return new NextResponse("OK", { status: 200 });
  } catch (e) {
    console.error(e);
    return new NextResponse("Error", { status: 500 });
  }
}
