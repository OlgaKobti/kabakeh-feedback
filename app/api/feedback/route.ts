import { NextResponse } from "next/server";
import { supabaseAnon } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const rating = Number(body.rating);
  const comment = (body.comment ?? "").toString().slice(0, 2000);
  const contact_phone = (body.contact_phone ?? "").toString().slice(0, 50);
  const contact_email = (body.contact_email ?? "").toString().slice(0, 200);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const supabase = supabaseAnon();
  const { error } = await supabase.from("feedback").insert([
    {
      rating,
      comment: comment || null,
      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
    },
  ]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
