import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServer } from "@/lib/supabaseServer";
import { verifySession, getSessionCookie } from "@/lib/session";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getSessionCookie())?.value;
    if (token) {
      const payload = await verifySession(token);
      if (payload?.userId) {
        const supabase = getSupabaseServer(true);
        const { data: user, error } = await supabase
          .from("users")
          .select("id, phone, email, name")
          .eq("id", payload.userId)
          .single();
        if (!error && user) {
          return NextResponse.json({
            id: user.id,
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
          });
        }
      }
    }

    const authHeader = request.headers.get("authorization");
    const bearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (bearer) {
      const supabase = getSupabaseServer(false);
      const { data: { user: authUser } } = await supabase.auth.getUser(bearer);
      if (authUser?.id) {
        const supabaseAdmin = getSupabaseServer(true);
        const { data: appUser } = await supabaseAdmin
          .from("users")
          .select("id, phone, email, name")
          .eq("auth_uid", authUser.id)
          .single();
        if (appUser) {
          return NextResponse.json({
            id: appUser.id,
            name: appUser.name || "",
            phone: appUser.phone || "",
            email: appUser.email || "",
          });
        }
      }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Beklenmeyen hata." },
      { status: 500 }
    );
  }
}
