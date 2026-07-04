import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import BookingsAdminClient from "./BookingsAdminClient";

export default async function BookingsAdminPage() {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) redirect("/admin");
  return <BookingsAdminClient />;
}
