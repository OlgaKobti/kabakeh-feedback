"use client";

import { useEffect, useRef, useState } from "react";
import { AdminShell } from "../components/AdminShell";

type Photo = {
  id: string;
  url: string;
  caption_he: string | null;
  caption_ar: string | null;
  caption_en: string | null;
  display_order: number;
  is_published: boolean;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const c = () => setM(window.innerWidth < 640);
    c(); window.addEventListener("resize", c);
    return () => window.removeEventListener("resize", c);
  }, []);
  return m;
}

export default function GalleryAdminClient() {
  const isMobile = useIsMobile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState({ he: "", ar: "", en: "" });

  async function loadPhotos() {
    setLoading(true);
    const res = await fetch("/api/admin/gallery");
    if (res.ok) {
      const d = await res.json();
      setPhotos(d.photos ?? []);
    }
    setLoading(false);
  }

  useEffect(() => { loadPhotos(); }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const form = new FormData();
    form.append("file", file);

    const uploadRes = await fetch("/api/admin/gallery/upload", { method: "POST", body: form });
    if (!uploadRes.ok) {
      const d = await uploadRes.json();
      setUploadError(d.error ?? "שגיאה בהעלאה");
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    const { filename } = await uploadRes.json();
    const url = `${SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`;

    const saveRes = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, display_order: photos.length }),
    });

    if (saveRes.ok) {
      await loadPhotos();
    } else {
      const d = await saveRes.json();
      setUploadError(d.error ?? "שגיאה בשמירה");
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("למחוק תמונה זו?")) return;
    await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    await loadPhotos();
  }

  async function togglePublish(p: Photo) {
    await fetch(`/api/admin/gallery/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !p.is_published }),
    });
    await loadPhotos();
  }

  function openEdit(p: Photo) {
    setEditingId(p.id);
    setEditCaption({ he: p.caption_he ?? "", ar: p.caption_ar ?? "", en: p.caption_en ?? "" });
  }

  async function saveCaption() {
    if (!editingId) return;
    await fetch(`/api/admin/gallery/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ caption_he: editCaption.he || null, caption_ar: editCaption.ar || null, caption_en: editCaption.en || null }),
    });
    setEditingId(null);
    await loadPhotos();
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "8px 10px", borderRadius: 8, border: "1.5px solid #e5e0d8",
    fontSize: 13, fontFamily: "inherit", background: "#faf8f4", color: "#1a1714", boxSizing: "border-box",
  };

  return (
    <AdminShell active="gallery">
      <div style={{ padding: isMobile ? "16px 12px" : "24px 32px", maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: "#1a1714", margin: 0 }}>📸 גלריית תמונות</h1>
            <p style={{ color: "#7c6f64", fontSize: 13, margin: "4px 0 0" }}>תמונות מפורסמות יופיעו בדף הבית</p>
          </div>
          <div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleUpload} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              style={{ background: uploading ? "#ccc" : "#8b1a1a", color: "#fff", border: "none", borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer" }}
            >
              {uploading ? "מעלה..." : "+ העלאת תמונה"}
            </button>
          </div>
        </div>

        {uploadError && (
          <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#c0392b", fontSize: 13, marginBottom: 16 }}>
            {uploadError}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#7c6f64", padding: 40 }}>טוען...</p>
        ) : photos.length === 0 ? (
          <div style={{ textAlign: "center", padding: 60, background: "#fff", borderRadius: 12, border: "1px dashed #e5e0d8" }}>
            <p style={{ fontSize: 32, margin: "0 0 8px" }}>📷</p>
            <p style={{ color: "#7c6f64", margin: 0 }}>אין תמונות עדיין. לחצו על "העלאת תמונה".</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 14 }}>
            {photos.map((p) => (
              <div key={p.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e0d8", overflow: "hidden", opacity: p.is_published ? 1 : 0.5 }}>
                <div style={{ position: "relative", aspectRatio: "1", overflow: "hidden" }}>
                  <img src={p.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  {!p.is_published && (
                    <div style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 10 }}>
                      מוסתר
                    </div>
                  )}
                </div>
                <div style={{ padding: "8px 10px", display: "flex", gap: 6, justifyContent: "flex-end" }}>
                  <button onClick={() => openEdit(p)} title="כיתוב" style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 13 }}>✏️</button>
                  <button onClick={() => togglePublish(p)} title={p.is_published ? "הסתר" : "פרסם"} style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid #e5e0d8", background: "#faf8f4", cursor: "pointer", fontSize: 13 }}>
                    {p.is_published ? "👁️" : "🙈"}
                  </button>
                  <button onClick={() => handleDelete(p.id)} title="מחק" style={{ padding: "4px 8px", borderRadius: 6, border: "1.5px solid #fecaca", background: "#fff5f5", color: "#c0392b", cursor: "pointer", fontSize: 13 }}>🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Caption modal */}
      {editingId && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", padding: isMobile ? 0 : 20 }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditingId(null); }}
        >
          <div style={{ background: "#fff", borderRadius: isMobile ? "16px 16px 0 0" : 16, padding: 24, width: "100%", maxWidth: isMobile ? undefined : 420, direction: "rtl" }}>
            <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", color: "#1a1714" }}>כיתוב לתמונה</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {(["he", "ar", "en"] as const).map((lang) => (
                <div key={lang}>
                  <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#7c6f64", marginBottom: 4, textTransform: "uppercase" }}>
                    {lang === "he" ? "עברית" : lang === "ar" ? "ערבית" : "אנגלית"}
                  </label>
                  <input value={editCaption[lang]} onChange={(e) => setEditCaption((p) => ({ ...p, [lang]: e.target.value }))} style={{ ...inputStyle, direction: lang === "en" ? "ltr" : "rtl" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button onClick={() => setEditingId(null)} style={{ padding: "9px 16px", borderRadius: 8, border: "1.5px solid #e5e0d8", background: "#faf8f4", fontSize: 14, cursor: "pointer" }}>ביטול</button>
              <button onClick={saveCaption} style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: "#8b1a1a", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>שמור</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
