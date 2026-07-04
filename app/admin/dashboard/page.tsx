import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminToken } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

async function getStats() {
  try {
    const supabase = supabaseAdmin();
    const [
      { count: feedbackCount },
      { count: itemCount },
      { count: eventCount },
      { count: photoCount },
      { count: inquiryCount },
      { count: unreadCount },
    ] = await Promise.all([
      supabase.from("feedback").select("id", { count: "exact", head: true }),
      supabase.from("menu_items").select("id", { count: "exact", head: true }),
      supabase.from("events").select("id", { count: "exact", head: true }),
      supabase.from("gallery_photos").select("id", { count: "exact", head: true }),
      supabase.from("private_inquiries").select("id", { count: "exact", head: true }),
      supabase.from("private_inquiries").select("id", { count: "exact", head: true }).eq("is_read", false),
    ]);
    return {
      feedbackCount: feedbackCount ?? 0,
      itemCount: itemCount ?? 0,
      eventCount: eventCount ?? 0,
      photoCount: photoCount ?? 0,
      inquiryCount: inquiryCount ?? 0,
      unreadCount: unreadCount ?? 0,
    };
  } catch {
    return { feedbackCount: 0, itemCount: 0, eventCount: 0, photoCount: 0, inquiryCount: 0, unreadCount: 0 };
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

  if (!verifyAdminToken(token)) {
    redirect("/admin");
  }

  const stats = await getStats();

  return <DashboardClient {...stats} />;
}
