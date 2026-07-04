import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import { sendCustomerWhatsApp } from "@/lib/notifyCustomer";

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

  // Fetch booking before update so we have name/phone/event details
  const { data: booking } = await supabaseAdmin()
    .from("event_bookings")
    .select("name, phone, event_title, event_date, status")
    .eq("id", id)
    .single();

  const { error } = await supabaseAdmin()
    .from("event_bookings")
    .update(updates)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send WhatsApp to customer when status actually changes to confirmed / cancelled
  if (booking && body.status && body.status !== booking.status) {
    const name = booking.name;
    const eventTitle = booking.event_title;
    const dateStr = booking.event_date
      ? new Date(booking.event_date + "T12:00:00").toLocaleDateString("he-IL", {
          day: "numeric", month: "long", year: "numeric",
        })
      : "";

    let message = "";
    if (body.status === "confirmed") {
      message =
        `שלום ${name} 👋\n` +
        `הזמנתך לאירוע *${eventTitle}*${dateStr ? ` (${dateStr})` : ""} אושרה! 🎉\n` +
        `נשמח לראותך. לשאלות ניתן ליצור קשר עם המסעדה.\n` +
        `— צוות קבאכה`;
    } else if (body.status === "cancelled") {
      message =
        `שלום ${name},\n` +
        `לצערנו הזמנתך לאירוע *${eventTitle}*${dateStr ? ` (${dateStr})` : ""} בוטלה.\n` +
        `לפרטים נוספים אנא צרו קשר עם המסעדה.\n` +
        `— צוות קבאכה`;
    }

    if (message) {
      sendCustomerWhatsApp(booking.phone, message).catch(() => {});
    }
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
