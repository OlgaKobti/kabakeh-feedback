import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "kabakeh_admin";

function sign(value: string) {
  const secret = process.env.ADMIN_SECRET!;
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

export function makeAdminToken() {
  const payload = `${Date.now()}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  return sign(payload) === sig;
}
