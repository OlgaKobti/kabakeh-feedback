import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function GET() {
  const supabase = supabaseAnon();

  const { data, error } = await supabase
    .from("gallery_photos")
    .select("id, url, caption_he, caption_ar, caption_en, display_order")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photos: data ?? [] });
}
