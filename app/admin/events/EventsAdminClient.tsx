"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../components/AdminShell";

type AdminEvent = {
  id: string;
  title_he: string;
  title_ar: string;
  title_en: string;
  description_he: string;
  description_ar: string;
  description_en: string;
  event_date: string;
  event_time: string;
  image_url: string | null;
  is_published: boolean;
  is_sold_out: boolean;
};

type EventForm = Omit<AdminEvent, "id">;

const EMPTY_FORM: EventForm = {
  title_he: "",
  title_ar: "",
  title_en: "",
  description_he: "",
  description_ar: "",
  description_en: "",
  event_date: "",
  event_time: "",
  image_url: null,
  is_published: true,
  is_sold_out: false,
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

export default function EventsAdminClient() {
  const isMobile = useIsMobile();
  const fileRef = useRef<HTMLInputElement>(null);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<EventForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function loadEvents() {
    setLoading(true);
    const res = await fetch("/api/admin/events");
    if (res.ok) {
      const d = await res.json();
      setEvents(d.events ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { loadEvents(); }, []);

  function openNew() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(ev: AdminEvent) {
    setEditingId(ev.id);
    setForm({
      title_he: ev.title_he,
      title_ar: ev.title_ar,
      title_en: ev.title_en,
      description_he: ev.description_he ?? "",
      description_ar: ev.description_ar ?? "",
      description_en: ev.description_en ?? "",
      event_date: ev.event_date,
      event_time: ev.event_time ?? "",
      image_url: ev.image_url ?? null,
      is_published: ev.is_published,
      is_sold_out: ev.is_sold_out,
    });
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/events/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { filename } = await res.json();
      const url = `${SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`;
      setForm((prev) => ({ ...prev, image_url: url }));
    } else {
      const d = await res.json();
      setError(d.error ?? "שגיאה בהעלאת תמונה");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave() {
    if (!form.title_he.trim()) { setError("נא להזין כותרת בעברית"); return; }
    if (!form.event_date) { setError("נא לבחור תאריך"); return; }

    setSaving(true);
    setError("");

    const body = {
      ...form,
      title_ar: form.title_ar || form.title_he,
      title_en: form.title_en || form.title_he,
      event_time: form.event_time || null,
      description_he: form.description_he || null,
      description_ar: form.description_ar || null,
      description_en: form.description_en || null,
    };

    const url = editingId ? `/api/admin/events/${editingId}` : "/api/admin/events";
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await loadEvents();
      closeModal();
    } else {
      const d = await res.json();
      setError(d.error ?? "שגיאה בשמירה");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק אירוע זה?")) return;
    await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    await loadEvents();
  }

  async function togglePublish(ev: AdminEvent) {
    await fetch(`/api/admin/events/${ev.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !ev.is_published }),
    });
    await loadEvents();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e5e0d8",
    fontSize: 14, fontFamily: "inherit", background: "#faf8f4", color: "#1a1714", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: 12, fontWeight: 700, color: "#7c6f64", marginBottom: 5,
    textTransform: "uppercase", letterSpacing: "0.05em",
  };

  return (
    <AdminShell active="events">
      <div style={{ padding: isMobile ? "16px 12px" : "24px 32px", maxWidth: 800, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1a1714", margin: 0 }}>🗓️ ניהול אירועים</h1>
            <p style={{ color: "#7c6f64", fontSize: 13, margin: "4px 0 0" }}>אירועים מפורסמים יופיעו בדף הבית של האתר</p>
          </div>
          <button onClick={openNew} style={{ background: "#8b1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            + אירוע חדש
          </button>
        </div>

        {/* List */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#7c6f64", padding: 40 }}>טוען...</p>
        ) : events.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px dashed #e5e0d8" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>🗓️</p>
            <p style={{ color: "#7c6f64", margin: 0 }}>אין אירועים עדיין. לחצו על "אירוע חדש" כדי להוסיף.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map((ev) => (
              <div key={ev.id} style={{ background: "#fff", border: "1px solid #e5e0d8", borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, opacity: ev.is_published ? 1 : 0.55 }}>
                {/* Date badge */}
                <div style={{ background: "#8b1a1a", color: "#fff", borderRadius: 8, minWidth: 52, padding: "8px 6px", textAlign: "center", flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{new Date(ev.event_date + "T12:00:00").getDate()}</div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                    {new Date(ev.event_date + "T12:00:00").toLocaleDateString("he-IL", { month: "short" })}
                  </div>
                </div>

                {/* Thumbnail */}
                {ev.image_url && (
                  <img src={ev.image_url} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                )}

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#1a1714" }}>{ev.title_he}</div>
                  {ev.event_time && <div style={{ fontSize: 12, color: "#7c6f64", marginTop: 2 }}>🕐 {ev.event_time}</div>}
                  {!ev.is_published && <span style={{ fontSize: 11, background: "#f3f3f3", color: "#999", borderRadius: 4, padding: "1px 6px", marginTop: 4, display: "inline-block" }}>מוסתר</span>}
                  {ev.is_sold_out && <span style={{ fontSize: 11, background: "#fee2e2", color: "#7f1d1d", borderRadius: 4, padding: "1px 6px", marginTop: 4, display: "inline-block", marginInlineStart: 4, fontWeight: 700 }}>SOLD OUT</span>}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: isMobile ? "wrap" : "nowrap" }}>
                  <button onClick={() => togglePublish(ev)} title={ev.is_published ? "הסתר" : "פרסם"} style={{ padding: "6px 10px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 14 }}>
                    {ev.is_published ? "👁️" : "🙈"}
                  </button>
                  <button onClick={() => openEdit(ev)} style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    ✏️ עריכה
                  </button>
                  <button onClick={() => handleDelete(ev.id)} style={{ padding: "6px 12px", borderRadius: 6, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : 16, padding: isMobile ? "20px 16px 28px" : "28px 28px 24px", width: "100%", maxWidth: isMobile ? undefined : 520, maxHeight: isMobile ? "92vh" : "90vh", overflowY: "auto", direction: "rtl" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1a1714" }}>{editingId ? "עריכת אירוע" : "אירוע חדש"}</h2>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#999", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <div>
                <label style={labelStyle}>תאריך *</label>
                <input type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>שעה (אופציונלי)</label>
                <input type="time" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} style={inputStyle} />
              </div>

              <div style={{ gridColumn: isMobile ? undefined : "1 / -1" }}>
                <label style={labelStyle}>כותרת בעברית *</label>
                <input value={form.title_he} onChange={(e) => setForm({ ...form, title_he: e.target.value })} placeholder="ערב מוזיקה חיה" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>כותרת בערבית</label>
                <input value={form.title_ar} onChange={(e) => setForm({ ...form, title_ar: e.target.value })} placeholder="أمسية موسيقية" style={{ ...inputStyle, direction: "rtl" }} />
              </div>
              <div>
                <label style={labelStyle}>כותרת באנגלית</label>
                <input value={form.title_en} onChange={(e) => setForm({ ...form, title_en: e.target.value })} placeholder="Live music night" style={{ ...inputStyle, direction: "ltr" }} />
              </div>

              <div style={{ gridColumn: isMobile ? undefined : "1 / -1" }}>
                <label style={labelStyle}>תיאור בעברית</label>
                <textarea value={form.description_he} onChange={(e) => setForm({ ...form, description_he: e.target.value })} rows={2} placeholder="תיאור קצר..." style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div>
                <label style={labelStyle}>תיאור בערבית</label>
                <textarea value={form.description_ar} onChange={(e) => setForm({ ...form, description_ar: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical", direction: "rtl" }} />
              </div>
              <div>
                <label style={labelStyle}>תיאור באנגלית</label>
                <textarea value={form.description_en} onChange={(e) => setForm({ ...form, description_en: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical", direction: "ltr" }} />
              </div>

              {/* Image upload */}
              <div style={{ gridColumn: isMobile ? undefined : "1 / -1" }}>
                <label style={labelStyle}>תמונה לאירוע (אופציונלי)</label>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
                {form.image_url ? (
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <img src={form.image_url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1.5px solid #e5e0d8" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e5e0d8", background: "#faf8f4", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                        {uploading ? "מעלה..." : "החלף תמונה"}
                      </button>
                      <button type="button" onClick={() => setForm((p) => ({ ...p, image_url: null }))} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", fontSize: 13, cursor: "pointer" }}>
                        הסר תמונה
                      </button>
                    </div>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...inputStyle, background: "#faf8f4", cursor: "pointer", textAlign: "center", color: "#7c6f64", fontWeight: 600, border: "1.5px dashed #c8bfb5" }}>
                    {uploading ? "מעלה תמונה..." : "📷 לחצו להעלאת תמונה"}
                  </button>
                )}
              </div>

              {/* Published toggle */}
              <div style={{ gridColumn: isMobile ? undefined : "1 / -1", display: "flex", alignItems: "center", gap: 10 }}>
                <input type="checkbox" id="is_published" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} style={{ width: 18, height: 18, cursor: "pointer" }} />
                <label htmlFor="is_published" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>פרסם באתר (גלוי למבקרים)</label>
              </div>

              {/* Sold out toggle */}
              <div style={{ gridColumn: isMobile ? undefined : "1 / -1", display: "flex", alignItems: "center", gap: 10, background: form.is_sold_out ? "#fee2e2" : "#faf8f4", borderRadius: 8, padding: "10px 14px", border: `1.5px solid ${form.is_sold_out ? "#fca5a5" : "#e5e0d8"}` }}>
                <input type="checkbox" id="is_sold_out" checked={form.is_sold_out} onChange={(e) => setForm({ ...form, is_sold_out: e.target.checked })} style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#8b1a1a" }} />
                <div>
                  <label htmlFor="is_sold_out" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer", color: form.is_sold_out ? "#7f1d1d" : "#1a1714", fontWeight: 700 }}>
                    🚫 SOLD OUT — אין מקומות פנויים
                  </label>
                  <div style={{ fontSize: 12, color: "#7c6f64", marginTop: 2 }}>כשמסומן, כפתור ההזמנה יוסתר מהמבקרים</div>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", color: "#c0392b", fontSize: 13, marginTop: 16 }}>{error}</div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 20, justifyContent: "flex-end" }}>
              <button onClick={closeModal} style={{ padding: "10px 18px", borderRadius: 8, border: "1.5px solid #e5e0d8", background: "#faf8f4", fontSize: 14, cursor: "pointer" }}>ביטול</button>
              <button onClick={handleSave} disabled={saving} style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: saving ? "#ccc" : "#8b1a1a", color: "#fff", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "שומר..." : editingId ? "עדכן" : "הוסף אירוע"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
