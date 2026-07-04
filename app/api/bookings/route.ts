import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

async function sendEmail(body: {
  name: string;
  phone: string;
  guests_count?: string;
  message?: string;
  event_title: string;
  event_date?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const { data: setting } = await supabaseAdmin()
    .from("site_settings")
    .select("value")
    .eq("key", "notification_email")
    .single();

  const ownerEmail = (setting?.value as string) ?? process.env.OWNER_EMAIL;
  if (!ownerEmail) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const dateStr = body.event_date
    ? new Date(body.event_date + "T12:00:00").toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  await resend.emails.send({
    from: "Kabakeh Website <noreply@kabakeh.com>",
    to: ownerEmail,
    subject: `🎟️ הזמנה חדשה לאירוע — ${body.event_title} (${body.name})`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f9f5ef; padding: 24px; border-radius: 12px;">
        <h2 style="color: #8b1a1a; margin: 0 0 20px;">🎟️ הזמנה חדשה לאירוע</h2>

        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
          <tr style="background: #8b1a1a;">
            <td colspan="2" style="padding: 10px 14px; color: #fff; font-weight: bold; font-size: 15px;">
              ${body.event_title} — ${dateStr}
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64; width: 40%;">שם</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">טלפון</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.phone}</td>
          </tr>
          ${body.guests_count ? `
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">מספר אורחים</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.guests_count}</td>
          </tr>` : ""}
          ${body.message ? `
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64; vertical-align: top;">הערות</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.message}</td>
          </tr>` : ""}
        </table>

        <div style="margin-top: 20px; text-align: center;">
          <a href="https://feedback.kabakeh.com/admin/bookings"
             style="background: #8b1a1a; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            צפה בהזמנות &rarr;
          </a>
        </div>

        <p style="margin-top: 20px; font-size: 12px; color: #7c6f64; text-align: center;">
          הודעה זו נשלחה אוטומטית מאתר Kabakeh
        </p>
      </div>
    `,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (!body.name?.trim() || !body.phone?.trim() || !body.event_title?.trim()) {
    return NextResponse.json({ error: "name, phone and event_title are required" }, { status: 400 });
  }

  const record = {
    event_id: body.event_id ?? null,
    event_title: body.event_title.trim(),
    event_date: body.event_date ?? null,
    name: body.name.trim(),
    phone: body.phone.trim(),
    guests_count: body.guests_count ?? null,
    message: body.message ?? null,
  };

  const { error } = await supabaseAdmin().from("event_bookings").insert([record]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  sendEmail(record).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
