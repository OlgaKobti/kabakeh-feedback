/**
 * Sends a WhatsApp message via CallMeBot (free, personal WhatsApp).
 *
 * Setup (one-time, takes ~2 minutes):
 *  1. Add this number to your WhatsApp contacts: +34 644 59 90 07
 *  2. Send it the message: "I allow callmebot to send me messages"
 *  3. You'll receive your API key within 60 seconds.
 *  4. Set env vars:
 *       CALLMEBOT_PHONE   = your WhatsApp number in international format, no +  (e.g. 972501234567)
 *       CALLMEBOT_APIKEY  = the key you received in step 3
 */
export async function sendWhatsApp(text: string): Promise<void> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apiKey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apiKey) return; // silently skip if not configured

  const url =
    `https://api.callmebot.com/whatsapp.php` +
    `?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}` +
    `&apikey=${encodeURIComponent(apiKey)}`;

  try {
    await fetch(url);
  } catch {
    // fire-and-forget — never fail the main request
  }
}
