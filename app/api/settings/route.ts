import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function GET() {
  const supabase = supabaseAnon();

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["opening_hours", "about_he", "about_ar", "about_en"]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({ settings });
}
