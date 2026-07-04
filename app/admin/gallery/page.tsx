import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function GalleryAdminPage() {
  const cookieStore = await cookies();
  if (!verifyAdminToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)) redirect("/admin");
  return <GalleryAdminClient />;
}
