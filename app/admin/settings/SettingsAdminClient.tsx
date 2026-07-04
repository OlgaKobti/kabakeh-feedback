"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../components/AdminShell";

const DAYS = [
  { key: "sun", he: "ראשון", en: "Sunday" },
  { key: "mon", he: "שני",   en: "Monday" },
  { key: "tue", he: "שלישי", en: "Tuesday" },
  { key: "wed", he: "רביעי", en: "Wednesday" },
  { key: "thu", he: "חמישי", en: "Thursday" },
  { key: "fri", he: "שישי",  en: "Friday" },
  { key: "sat", he: "שבת",   en: "Saturday" },
] as const;

type DayKey = typeof DAYS[number]["key"];
type DayHours = { open: string; close: string; closed: boolean };
type OpeningHours = Record<DayKey, DayHours>;

const DEFAULT_HOURS: OpeningHours = {
  sun: { open: "12:00", close: "23:00", closed: false },
  mon: { open: "12:00", close: "23:00", closed: false },
  tue: { open: "12:00", close: "23:00", closed: false },
  wed: { open: "12:00", close: "23:00", closed: false },
  thu: { open: "12:00", close: "23:00", closed: false },
  fri: { open: "12:00", close: "01:00", closed: false },
  sat: { open: "18:00", close: "01:00", closed: false },
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

export default function SettingsAdminClient() {
  const isMobile = useIsMobile();

  const [hours, setHours] = useState<OpeningHours>(DEFAULT_HOURS);
  const [aboutHe, setAboutHe] = useState("");
  const [aboutAr, setAboutAr] = useState("");
  const [aboutEn, setAboutEn] = useState("");
  const [notifEmail, setNotifEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        const s = d.settings ?? {};
        if (s.opening_hours) setHours(s.opening_hours as OpeningHours);
        if (s.about_he) setAboutHe(s.about_he as string);
        if (s.about_ar) setAboutAr(s.about_ar as string);
        if (s.about_en) setAboutEn(s.about_en as string);
        if (s.notification_email) setNotifEmail(s.notification_email as string);
      })
      .finally(() => setLoading(false));
  }, []);

  function updateDay(day: DayKey, field: keyof DayHours, val: string | boolean) {
    setHours((prev) => ({ ...prev, [day]: { ...prev[day], [field]: val } }));
  }

  async function handleSave() {
    setSaving(true); setError(""); setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opening_hours: hours,
        about_he: aboutHe,
        about_ar: aboutAr,
        about_en: aboutEn,
        notification_email: notifEmail || null,
      }),
    });

    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      const d = await res.json();
      setError(d.error ?? "שגיאה בשמירה");
    }
    setSaving(false);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1.5px solid #e5e0d8",
    fontSize: 14,
    fontFamily: "inherit",
    background: "#faf8f4",
    color: "#1a1714",
    boxSizing: "border-box",
  };

  const sectionTitle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 800,
    color: "#1a1714",
    margin: "0 0 14px",
    paddingBottom: 10,
    borderBottom: "1.5px solid #e5e0d8",
  };

  if (loading) return (
    <AdminShell active="settings">
      <p style={{ textAlign: "center", color: "#7c6f64", padding: 60 }}>טוען...</p>
    </AdminShell>
  );

  return (
    <AdminShell active="settings">
      <div style={{ maxWidth: 680, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 10 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1a1714", margin: 0 }}>⚙️ הגדרות אתר</h1>
            <p style={{ color: "#7c6f64", fontSize: 13, margin: "4px 0 0" }}>שעות פתיחה ותיאור המסעדה</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: saving ? "#ccc" : "#2e7d32", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? "שומר..." : "שמור שינויים"}
          </button>
        </div>

        {saved && (
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", color: "#166534", fontSize: 14, marginBottom: 20, fontWeight: 600 }}>
            ✅ השינויים נשמרו בהצלחה
          </div>
        )}
        {error && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#c0392b", fontSize: 14, marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Notification email */}
        <div style={{ background: "#fff", borderRadius: 14, padding: isMobile ? 16 : 22, border: "1px solid #e5e0d8", marginBottom: 20 }}>
          <h2 style={sectionTitle}>📧 אימייל להתראות</h2>
          <p style={{ fontSize: 13, color: "#7c6f64", margin: "0 0 12px" }}>
            לכתובת זו יישלח אימייל כשמישהו שולח בקשה לאירוע פרטי
          </p>
          <input
            type="email"
            value={notifEmail}
            onChange={(e) => setNotifEmail(e.target.value)}
            placeholder="owner@kabakeh.com"
            style={inputStyle}
            dir="ltr"
          />
        </div>

        {/* Opening hours */}
        <div style={{ background: "#fff", borderRadius: 14, padding: isMobile ? 16 : 22, border: "1px solid #e5e0d8", marginBottom: 20 }}>
          <h2 style={sectionTitle}>🕐 שעות פתיחה</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DAYS.map(({ key, he }) => {
              const d = hours[key];
              return (
                <div key={key} style={{ display: "grid", gridTemplateColumns: isMobile ? "80px 1fr" : "90px 1fr 1fr 1fr", gap: 8, alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1714" }}>{he}</div>
                  {isMobile ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#7c6f64" }}>
                        <input type="checkbox" checked={d.closed} onChange={(e) => updateDay(key, "closed", e.target.checked)} />
                        סגור
                      </label>
                      {!d.closed && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <input type="time" value={d.open} onChange={(e) => updateDay(key, "open", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                          <input type="time" value={d.close} onChange={(e) => updateDay(key, "close", e.target.value)} style={{ ...inputStyle, flex: 1 }} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <input type="time" value={d.open} disabled={d.closed} onChange={(e) => updateDay(key, "open", e.target.value)} style={{ ...inputStyle, opacity: d.closed ? 0.4 : 1 }} />
                      <input type="time" value={d.close} disabled={d.closed} onChange={(e) => updateDay(key, "close", e.target.value)} style={{ ...inputStyle, opacity: d.closed ? 0.4 : 1 }} />
                      <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#7c6f64", cursor: "pointer" }}>
                        <input type="checkbox" checked={d.closed} onChange={(e) => updateDay(key, "closed", e.target.checked)} />
                        סגור
                      </label>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* About text */}
        <div style={{ background: "#fff", borderRadius: 14, padding: isMobile ? 16 : 22, border: "1px solid #e5e0d8" }}>
          <h2 style={sectionTitle}>📝 אודות המסעדה</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#7c6f64", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>עברית</label>
              <textarea value={aboutHe} onChange={(e) => setAboutHe(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", direction: "rtl" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#7c6f64", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>ערבית</label>
              <textarea value={aboutAr} onChange={(e) => setAboutAr(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", direction: "rtl" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#7c6f64", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>אנגלית</label>
              <textarea value={aboutEn} onChange={(e) => setAboutEn(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical", direction: "ltr" }} />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
