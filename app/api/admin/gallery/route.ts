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
    .from("gallery_photos")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photos: data ?? [] });
}

export async function POST(req: Request) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.url) return NextResponse.json({ error: "url is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin()
    .from("gallery_photos")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photo: data }, { status: 201 });
}
