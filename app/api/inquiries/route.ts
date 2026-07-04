import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name?.trim() || !body.contact?.trim()) {
    return NextResponse.json({ error: "Name and contact are required" }, { status: 400 });
  }

  const { error } = await supabaseAdmin().from("private_inquiries").insert([{
    name: body.name.trim(),
    contact: body.contact.trim(),
    event_type: body.event_type ?? null,
    guests_count: body.guests_count ?? null,
    preferred_date: body.preferred_date ?? null,
    message: body.message ?? null,
  }]);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
