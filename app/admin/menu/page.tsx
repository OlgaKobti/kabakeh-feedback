import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import MenuAdminClient from "./MenuAdminClient";

export default async function MenuAdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminToken(token)) {
    redirect("/admin");
  }

  return <MenuAdminClient />;
}
