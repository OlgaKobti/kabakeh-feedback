import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin()
    .from("site_settings")
    .select("key, value");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) settings[row.key] = row.value;

  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Record<string, unknown> = await req.json();
  const supabase = supabaseAdmin();

  const upserts = Object.entries(body).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(upserts, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
