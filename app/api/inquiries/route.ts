import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const EVENT_TYPE_LABELS: Record<string, string> = {
  birthday: "יום הולדת",
  corporate: "אירוע חברתי",
  wedding: "חתונה / אירוסים",
  other: "אחר",
};

async function sendEmail(body: {
  name: string;
  contact: string;
  event_type?: string;
  guests_count?: string;
  preferred_date?: string;
  message?: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const ownerEmail = process.env.OWNER_EMAIL;

  if (!apiKey || !ownerEmail) return; // gracefully skip if not configured

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const eventTypeLabel = body.event_type ? (EVENT_TYPE_LABELS[body.event_type] ?? body.event_type) : "—";

  await resend.emails.send({
    from: "Kabakeh Website <noreply@kabakeh.com>",
    to: ownerEmail,
    subject: `📬 פנייה חדשה לאירוע פרטי — ${body.name}`,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #f9f5ef; padding: 24px; border-radius: 12px;">
        <h2 style="color: #8b1a1a; margin: 0 0 20px;">פנייה חדשה לאירוע פרטי</h2>

        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden;">
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64; width: 40%;">שם</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">טלפון / אימייל</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.contact}</td>
          </tr>
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">סוג אירוע</td>
            <td style="padding: 10px 14px; color: #1a1714;">${eventTypeLabel}</td>
          </tr>
          ${body.guests_count ? `
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">מספר אורחים</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.guests_count}</td>
          </tr>` : ""}
          ${body.preferred_date ? `
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">תאריך מועדף</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.preferred_date}</td>
          </tr>` : ""}
          ${body.message ? `
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64; vertical-align: top;">הודעה</td>
            <td style="padding: 10px 14px; color: #1a1714;">${body.message}</td>
          </tr>` : ""}
        </table>

        <div style="margin-top: 20px; text-align: center;">
          <a href="https://feedback.kabakeh.com/admin/inquiries"
             style="background: #8b1a1a; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">
            צפה בפניות &rarr;
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

  if (!body.name?.trim() || !body.contact?.trim()) {
    return NextResponse.json({ error: "Name and contact are required" }, { status: 400 });
  }

  const record = {
    name: body.name.trim(),
    contact: body.contact.trim(),
    event_type: body.event_type ?? null,
    guests_count: body.guests_count ?? null,
    preferred_date: body.preferred_date ?? null,
    message: body.message ?? null,
  };

  const { error } = await supabaseAdmin().from("private_inquiries").insert([record]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send email notification — fire and forget (don't fail the request if email fails)
  sendEmail(record).catch(() => {});

  return NextResponse.json({ ok: true }, { status: 201 });
}
