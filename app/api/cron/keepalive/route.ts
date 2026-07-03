import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabaseAdmin()
    .from("feedback")
    .select("id")
    .limit(1);

  if (error) {
    console.error("[keepalive] Supabase ping failed:", error.message);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  console.log("[keepalive] Supabase ping ok —", new Date().toISOString());
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
