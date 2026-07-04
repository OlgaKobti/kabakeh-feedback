import { supabaseAdmin } from "@/lib/supabase";

type BookingSnapshot = {
  name: string;
  email: string | null;
  event_title: string;
  event_date: string | null;
};

export async function sendCustomerEmail(
  booking: BookingSnapshot,
  newStatus: "confirmed" | "cancelled" | string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !booking.email) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const dateStr = booking.event_date
    ? new Date(booking.event_date + "T12:00:00").toLocaleDateString("he-IL", {
        day: "numeric", month: "long", year: "numeric",
      })
    : "";

  const isConfirmed = newStatus === "confirmed";

  const subject = isConfirmed
    ? `✅ הזמנתך אושרה — ${booking.event_title}`
    : `❌ הזמנתך בוטלה — ${booking.event_title}`;

  const headingColor = isConfirmed ? "#065f46" : "#7f1d1d";
  const headingBg   = isConfirmed ? "#d1fae5" : "#fee2e2";
  const headingText = isConfirmed ? "✅ ההזמנה אושרה!" : "❌ ההזמנה בוטלה";

  const bodyText = isConfirmed
    ? `שלום ${booking.name},<br><br>אנחנו שמחים לאשר את הזמנתך! נשמח לראותך באירוע.<br>לשאלות ניתן ליצור קשר עם המסעדה.`
    : `שלום ${booking.name},<br><br>לצערנו נאלצנו לבטל את הזמנתך. אנו מתנצלים על אי הנוחות.<br>לפרטים נוספים ניתן ליצור קשר עם המסעדה.`;

  // Fetch restaurant phone from settings if available
  const { data: phoneSetting } = await supabaseAdmin()
    .from("site_settings")
    .select("value")
    .eq("key", "phone")
    .single();
  const restaurantPhone = (phoneSetting?.value as string) ?? "";

  await resend.emails.send({
    from: "Kabakeh <noreply@kabakeh.com>",
    to: booking.email,
    subject,
    html: `
      <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #f9f5ef; padding: 24px; border-radius: 12px;">
        <div style="background: ${headingBg}; color: ${headingColor}; padding: 16px 20px; border-radius: 10px; font-size: 20px; font-weight: 800; margin-bottom: 20px; text-align: center;">
          ${headingText}
        </div>

        <table style="width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64; width: 35%;">אירוע</td>
            <td style="padding: 10px 14px; color: #1a1714; font-weight: 700;">${booking.event_title}</td>
          </tr>
          ${dateStr ? `
          <tr style="border-bottom: 1px solid #ede8e1;">
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">תאריך</td>
            <td style="padding: 10px 14px; color: #1a1714;">${dateStr}</td>
          </tr>` : ""}
          <tr>
            <td style="padding: 10px 14px; font-weight: bold; color: #7c6f64;">שם</td>
            <td style="padding: 10px 14px; color: #1a1714;">${booking.name}</td>
          </tr>
        </table>

        <p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">${bodyText}</p>

        ${restaurantPhone ? `<p style="color: #7c6f64; font-size: 13px; margin: 0;">📞 ${restaurantPhone}</p>` : ""}

        <p style="margin-top: 24px; font-size: 12px; color: #9ca3af; text-align: center; border-top: 1px solid #e5e0d8; padding-top: 16px;">
          הודעה זו נשלחה אוטומטית מאתר Kabakeh
        </p>
      </div>
    `,
  });
}
