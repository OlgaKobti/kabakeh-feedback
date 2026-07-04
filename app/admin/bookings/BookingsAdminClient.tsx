"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../components/AdminShell";

type Booking = {
  id: string;
  event_id: string | null;
  event_title: string;
  event_date: string | null;
  name: string;
  phone: string;
  guests_count: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "cancelled";
  is_read: boolean;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "ממתין",  color: "#92400e", bg: "#fef3c7" },
  confirmed: { label: "אושר",   color: "#065f46", bg: "#d1fae5" },
  cancelled: { label: "בוטל",   color: "#7f1d1d", bg: "#fee2e2" },
};

/** Build a wa.me link with a pre-filled message to the customer */
function waLink(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalised = digits.startsWith("972")
    ? digits
    : digits.startsWith("0")
    ? `972${digits.slice(1)}`
    : digits;
  return `https://wa.me/${normalised}?text=${encodeURIComponent(message)}`;
}

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 640);
    c(); window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

export default function BookingsAdminClient() {
  const isMobile = useIsMobile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/bookings");
    if (res.ok) {
      const d = await res.json();
      setBookings(d.bookings ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function setStatus(b: Booking, status: Booking["status"]) {
    await fetch(`/api/admin/bookings/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, is_read: true }),
    });
    await load();
  }

  async function markRead(b: Booking) {
    await fetch(`/api/admin/bookings/${b.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !b.is_read }),
    });
    await load();
  }

  async function deleteBooking(id: string) {
    if (!confirm("למחוק הזמנה זו?")) return;
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    await load();
  }

  const unread = bookings.filter((b) => !b.is_read).length;
  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <AdminShell active="bookings">
      <div style={{ padding: isMobile ? "16px 12px" : "24px 32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1a1714", margin: 0, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            🎟️ הזמנות לאירועים
            {unread > 0 && (
              <span style={{ background: "#8b1a1a", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                {unread} חדש
              </span>
            )}
            {pending > 0 && (
              <span style={{ background: "#f59e0b", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                {pending} ממתין
              </span>
            )}
          </h1>
          <p style={{ color: "#7c6f64", fontSize: 13, margin: "4px 0 0" }}>בקשות הזמנה מאתר המסעדה — יש ליצור קשר עם הלקוח לאישור</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#7c6f64", padding: 40 }}>טוען...</p>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px dashed #e5e0d8" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>🎟️</p>
            <p style={{ color: "#7c6f64", margin: 0 }}>אין הזמנות עדיין</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bookings.map((b) => {
              const st = STATUS_LABELS[b.status] ?? STATUS_LABELS.pending;
              const dateStr = b.event_date
                ? new Date(b.event_date + "T12:00:00").toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
                : null;
              return (
                <div
                  key={b.id}
                  style={{
                    background: b.is_read ? "#fff" : "#fef9f0",
                    border: `1.5px solid ${b.is_read ? "#e5e0d8" : "#f6c543"}`,
                    borderRadius: 12,
                    padding: isMobile ? "14px" : "16px 20px",
                    direction: "rtl",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ flex: 1 }}>
                      {/* Event info */}
                      <div style={{ fontSize: 12, color: "#8b1a1a", fontWeight: 700, marginBottom: 4, display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span>🎟️ {b.event_title}</span>
                        {dateStr && <span style={{ color: "#7c6f64", fontWeight: 400 }}>· {dateStr}</span>}
                      </div>

                      {/* Guest info */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1714" }}>{b.name}</span>
                        {!b.is_read && (
                          <span style={{ background: "#8b1a1a", color: "#fff", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>חדש</span>
                        )}
                        <span style={{ background: st.bg, color: st.color, borderRadius: 4, padding: "1px 7px", fontSize: 12, fontWeight: 600 }}>
                          {st.label}
                        </span>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto auto", gap: "4px 16px", fontSize: 13, color: "#7c6f64", marginBottom: 8 }}>
                        <span>📞 {b.phone}</span>
                        {b.guests_count && <span>👥 {b.guests_count} אורחים</span>}
                      </div>

                      {b.message && (
                        <div style={{ fontSize: 14, color: "#374151", background: "#f9f5ef", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6, marginBottom: 8 }}>
                          {b.message}
                        </div>
                      )}

                      {/* Status actions */}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                        {b.status !== "confirmed" && (
                          <button
                            onClick={() => setStatus(b, "confirmed")}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #86efac", background: "#f0fdf4", color: "#065f46", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                          >
                            ✅ אשר
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            onClick={() => setStatus(b, "cancelled")}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                          >
                            ✕ בטל
                          </button>
                        )}
                        {b.status !== "pending" && (
                          <button
                            onClick={() => setStatus(b, "pending")}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #fde68a", background: "#fffbeb", color: "#92400e", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
                          >
                            ↩ ממתין
                          </button>
                        )}

                        {/* WhatsApp quick-reply button */}
                        {(() => {
                          const dateStr = b.event_date
                            ? new Date(b.event_date + "T12:00:00").toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric" })
                            : "";
                          const confirmedMsg =
                            `שלום ${b.name} 👋\nהזמנתך לאירוע *${b.event_title}*${dateStr ? ` (${dateStr})` : ""} אושרה! 🎉\nנשמח לראותך. לשאלות צרו קשר.\n— קבאכה`;
                          const cancelledMsg =
                            `שלום ${b.name},\nלצערנו הזמנתך לאירוע *${b.event_title}*${dateStr ? ` (${dateStr})` : ""} בוטלה.\nלפרטים נוספים צרו קשר.\n— קבאכה`;
                          const msg = b.status === "confirmed" ? confirmedMsg : b.status === "cancelled" ? cancelledMsg : confirmedMsg;
                          return (
                            <a
                              href={waLink(b.phone, msg)}
                              target="_blank"
                              rel="noreferrer"
                              style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #86efac", background: "#f0fff4", color: "#065f46", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
                            >
                              📲 שלח WhatsApp
                            </a>
                          );
                        })()}
                      </div>

                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                        {new Date(b.created_at).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>

                    {/* Right actions */}
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button
                        onClick={() => markRead(b)}
                        title={b.is_read ? "סמן כלא-נקרא" : "סמן כנקרא"}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 14 }}
                      >
                        {b.is_read ? "✉️" : "✅"}
                      </button>
                      <button
                        onClick={() => deleteBooking(b.id)}
                        style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", cursor: "pointer", fontSize: 14 }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
