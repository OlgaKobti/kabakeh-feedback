"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../components/AdminShell";

type Inquiry = {
  id: string;
  name: string;
  contact: string;
  event_type: string | null;
  guests_count: string | null;
  preferred_date: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

const EVENT_TYPE_LABELS: Record<string, string> = {
  birthday: "יום הולדת",
  corporate: "אירוע חברתי",
  wedding: "חתונה",
  other: "אחר",
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 640);
    c(); window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

export default function InquiriesAdminClient() {
  const isMobile = useIsMobile();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/inquiries");
    if (res.ok) {
      const d = await res.json();
      setInquiries(d.inquiries ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function markRead(inq: Inquiry) {
    await fetch(`/api/admin/inquiries/${inq.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !inq.is_read }),
    });
    await load();
  }

  async function deleteInquiry(id: string) {
    if (!confirm("למחוק פנייה זו?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    await load();
  }

  const unread = inquiries.filter((i) => !i.is_read).length;

  return (
    <AdminShell active="inquiries">
      <div style={{ padding: isMobile ? "16px 12px" : "24px 32px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1a1714", margin: 0, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            📬 פניות אירועים פרטיים
            {unread > 0 && (
              <span style={{ background: "#8b1a1a", color: "#fff", borderRadius: 20, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                {unread} חדש
              </span>
            )}
          </h1>
          <p style={{ color: "#7c6f64", fontSize: 13, margin: "4px 0 0" }}>בקשות לאירועים פרטיים וקייטרינג</p>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", color: "#7c6f64", padding: 40 }}>טוען...</p>
        ) : inquiries.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px dashed #e5e0d8" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>📭</p>
            <p style={{ color: "#7c6f64", margin: 0 }}>אין פניות עדיין</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                style={{
                  background: inq.is_read ? "#fff" : "#fef9f0",
                  border: `1.5px solid ${inq.is_read ? "#e5e0d8" : "#f6c543"}`,
                  borderRadius: 12,
                  padding: isMobile ? "14px 14px" : "16px 20px",
                  direction: "rtl",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: "#1a1714" }}>{inq.name}</span>
                      {!inq.is_read && (
                        <span style={{ background: "#8b1a1a", color: "#fff", borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>חדש</span>
                      )}
                      {inq.event_type && (
                        <span style={{ background: "#f3f4f6", color: "#374151", borderRadius: 4, padding: "1px 7px", fontSize: 12 }}>
                          {EVENT_TYPE_LABELS[inq.event_type] ?? inq.event_type}
                        </span>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "auto auto auto", gap: "4px 16px", fontSize: 13, color: "#7c6f64", marginBottom: 8 }}>
                      <span>📞 {inq.contact}</span>
                      {inq.guests_count && <span>👥 {inq.guests_count} אורחים</span>}
                      {inq.preferred_date && <span>📅 {inq.preferred_date}</span>}
                    </div>

                    {inq.message && (
                      <div style={{ fontSize: 14, color: "#374151", background: "#f9f5ef", borderRadius: 8, padding: "8px 12px", lineHeight: 1.6 }}>
                        {inq.message}
                      </div>
                    )}

                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>
                      {new Date(inq.created_at).toLocaleDateString("he-IL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button
                      onClick={() => markRead(inq)}
                      title={inq.is_read ? "סמן כלא-נקרא" : "סמן כנקרא"}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 14 }}
                    >
                      {inq.is_read ? "✉️" : "✅"}
                    </button>
                    <button
                      onClick={() => deleteInquiry(inq.id)}
                      style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", cursor: "pointer", fontSize: 14 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
