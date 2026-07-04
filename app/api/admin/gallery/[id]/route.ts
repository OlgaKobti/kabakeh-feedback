import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabaseAdmin()
    .from("gallery_photos")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ photo: data });
}

export async function DELETE(_req: Request, { params }: Params) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin().from("gallery_photos").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
