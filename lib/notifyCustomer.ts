/**
 * Sends a WhatsApp message to a customer via Twilio.
 *
 * Setup (one-time):
 *  1. Create a free Twilio account at https://www.twilio.com
 *  2. Go to Messaging → Try it out → Send a WhatsApp message → Sandbox
 *  3. Set these env vars in Vercel:
 *       TWILIO_ACCOUNT_SID   — from Twilio Console dashboard
 *       TWILIO_AUTH_TOKEN    — from Twilio Console dashboard
 *       TWILIO_WHATSAPP_FROM — sandbox: "whatsapp:+14155238886"
 *                              production: "whatsapp:+YOUR_APPROVED_NUMBER"
 *
 * Phone number format: pass the raw number the customer typed.
 * This function normalises Israeli numbers automatically
 * (e.g. "0501234567" → "+972501234567").
 */
export async function sendCustomerWhatsApp(to: string, message: string): Promise<void> {
  const sid   = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from  = process.env.TWILIO_WHATSAPP_FROM;

  if (!sid || !token || !from) return; // not configured — skip silently

  const normalised = normalisePhone(to);
  if (!normalised) return;

  try {
    const twilio = (await import("twilio")).default;
    const client = twilio(sid, token);
    await client.messages.create({
      from,
      to: `whatsapp:${normalised}`,
      body: message,
    });
  } catch {
    // fire-and-forget — never fail the main request
  }
}

/** Turns "0501234567" or "972501234567" into "+972501234567" */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("972")) return `+${digits}`;
  if (digits.startsWith("0") && digits.length >= 9) return `+972${digits.slice(1)}`;
  if (digits.length >= 10) return `+${digits}`; // international format already
  return null;
}
