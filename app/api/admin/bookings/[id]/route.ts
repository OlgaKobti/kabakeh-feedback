import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendCustomerEmail } from "@/lib/customerEmail";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const updates: Record<string, unknown> = {};
  if (body.status !== undefined) updates.status = body.status;
  if (body.is_read !== undefined) updates.is_read = body.is_read;

  // Fetch booking before update so we can send email if status changes
  const { data: booking } = await supabaseAdmin()
    .from("event_bookings")
    .select("name, email, event_title, event_date, status")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin()
    .from("event_bookings")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email to customer if they provided one and status actually changed
  if (booking?.email && body.status && body.status !== booking.status) {
    sendCustomerEmail(booking, body.status).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin()
    .from("event_bookings")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
