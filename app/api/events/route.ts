import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function GET() {
  const supabase = supabaseAnon();

  const { data, error } = await supabase
    .from("events")
    .select("id, title_he, title_ar, title_en, description_he, description_ar, description_en, event_date, event_time, image_url, is_sold_out")
    .gte("event_date", new Date().toISOString().slice(0, 10))
    .order("event_date", { ascending: true })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ events: data ?? [] });
}
