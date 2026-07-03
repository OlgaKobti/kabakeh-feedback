"use client";

import { useEffect, useRef, useState } from "react";

type DbCategory = {
  id: string;
  title_he: string;
  title_ar: string;
  title_en: string;
  sort_order: number;
};

type DbItem = {
  id: string;
  category_id: string;
  name_he: string;
  name_ar: string;
  name_en: string;
  description_he: string | null;
  description_ar: string | null;
  description_en: string | null;
  price: number | null;
  image: string | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
};

type FormItem = Omit<DbItem, "sort_order">;

const EMPTY_FORM = (categoryId = ""): FormItem => ({
  id: "",
  category_id: categoryId,
  name_he: "",
  name_ar: "",
  name_en: "",
  description_he: "",
  description_ar: "",
  description_en: "",
  price: null,
  image: null,
  available: true,
  featured: false,
});

const IMG_BASE = (process.env.NEXT_PUBLIC_MENU_IMAGE_BASE_URL || "").replace(/\/$/, "");

function itemImageUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  if (filename.startsWith("http")) return filename;
  if (!IMG_BASE) return null;
  return `${IMG_BASE}/${encodeURIComponent(filename)}`;
}

const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  color: "#6b7280",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

const sectionHead: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 8,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  paddingBottom: 6,
  borderBottom: "1px solid #e5e7eb",
};

export default function MenuAdminClient() {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [items, setItems] = useState<DbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [modal, setModal] = useState<{ item: FormItem; isNew: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/menu");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to load menu data");
      setLoading(false);
      return;
    }
    setCategories(data.categories || []);
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew(defaultCategoryId = "") {
    setModal({
      item: { ...EMPTY_FORM(defaultCategoryId), id: `item_${Date.now()}` },
      isNew: true,
    });
  }

  function openEdit(item: DbItem) {
    setModal({ item: { ...item }, isNew: false });
  }

  function closeModal() {
    setModal(null);
    setError(null);
  }

  function setField<K extends keyof FormItem>(key: K, value: FormItem[K]) {
    setModal((m) => (m ? { ...m, item: { ...m.item, [key]: value } } : m));
  }

  async function handleSave() {
    if (!modal) return;
    setSaving(true);
    setError(null);

    const { item, isNew } = modal;
    const payload = {
      ...item,
      price: item.price === null || String(item.price) === "" ? null : Number(item.price),
      description_he: item.description_he || null,
      description_ar: item.description_ar || null,
      description_en: item.description_en || null,
      image: item.image || null,
    };

    const url = isNew ? "/api/admin/menu/items" : `/api/admin/menu/items/${item.id}`;
    const method = isNew ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    setSuccess(isNew ? "Dish added!" : "Changes saved!");
    setTimeout(() => setSuccess(null), 3000);
    closeModal();
    load();
  }

  async function handleDelete(id: string) {
    setError(null);
    const res = await fetch(`/api/admin/menu/items/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Delete failed");
      return;
    }
    setDeleteConfirm(null);
    setSuccess("Dish deleted.");
    setTimeout(() => setSuccess(null), 3000);
    load();
  }

  async function handleToggleAvailable(item: DbItem) {
    const res = await fetch(`/api/admin/menu/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, available: !item.available }),
    });
    if (res.ok) load();
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/menu/upload", { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setField("image", data.filename);
  }

  if (loading) {
    return (
      <main style={{ padding: 32, fontFamily: "system-ui", textAlign: "center", color: "#666" }}>
        Loading menu…
      </main>
    );
  }

  const formItem = modal?.item;
  const previewUrl = formItem ? itemImageUrl(formItem.image) : null;

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "24px 16px", fontFamily: "system-ui" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <a
            href="/admin"
            style={{ color: "#6b7280", fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            ← Back to Admin
          </a>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: "6px 0 0", color: "#111" }}>
            Menu Management
          </h1>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "4px 0 0" }}>
            {items.length} dishes across {categories.length} categories
          </p>
        </div>
        <button
          onClick={() => openNew()}
          style={{
            background: "#1a1a2e",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          + Add Dish
        </button>
      </div>

      {/* Alerts */}
      {error && !modal && (
        <div
          style={{
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {error}
          <button
            onClick={() => setError(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#b91c1c" }}
          >
            ×
          </button>
        </div>
      )}
      {success && (
        <div
          style={{
            background: "#f0fdf4",
            color: "#166534",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          ✓ {success}
        </div>
      )}

      {/* Category sections */}
      {categories.map((cat) => {
        const catItems = items.filter((it) => it.category_id === cat.id);
        return (
          <div key={cat.id} style={{ marginBottom: 36 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
                paddingBottom: 8,
                borderBottom: "2px solid #e5e7eb",
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: 17 }}>{cat.title_he}</span>
                <span style={{ color: "#9ca3af", fontSize: 13, marginInlineStart: 8 }}>
                  {cat.title_en} · {catItems.length} items
                </span>
              </div>
              <button
                onClick={() => openNew(cat.id)}
                style={{
                  background: "none",
                  border: "1px solid #d1d5db",
                  padding: "5px 12px",
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12,
                  color: "#374151",
                  fontWeight: 500,
                }}
              >
                + Add to {cat.title_en}
              </button>
            </div>

            {catItems.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: 13, paddingInlineStart: 4 }}>No items yet.</p>
            ) : (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                {catItems.map((it, idx) => (
                  <div
                    key={it.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 16px",
                      borderBottom: idx < catItems.length - 1 ? "1px solid #f3f4f6" : "none",
                      background: it.available ? "#fff" : "#fafafa",
                    }}
                  >
                    {/* Thumbnail */}
                    {itemImageUrl(it.image) ? (
                      <img
                        src={itemImageUrl(it.image)!}
                        alt={it.name_he}
                        style={{
                          width: 46,
                          height: 46,
                          objectFit: "cover",
                          borderRadius: 8,
                          flexShrink: 0,
                          border: "1px solid #f0f0f0",
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          background: "#f3f4f6",
                          borderRadius: 8,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          color: "#d1d5db",
                        }}
                      >
                        🍽
                      </div>
                    )}

                    {/* Name */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: 15,
                          direction: "rtl",
                          textAlign: "right",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {it.name_he}
                      </div>
                      <div style={{ color: "#6b7280", fontSize: 12, textAlign: "right", direction: "rtl" }}>
                        {it.name_en}
                      </div>
                    </div>

                    {/* Price */}
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 14,
                        color: "#1d4ed8",
                        minWidth: 48,
                        textAlign: "center",
                      }}
                    >
                      {it.price != null ? `${it.price}₪` : "—"}
                    </div>

                    {/* Available toggle */}
                    <button
                      onClick={() => handleToggleAvailable(it)}
                      title={it.available ? "Click to hide from menu" : "Click to show on menu"}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 20,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 11,
                        fontWeight: 700,
                        background: it.available ? "#d1fae5" : "#fee2e2",
                        color: it.available ? "#065f46" : "#991b1b",
                        flexShrink: 0,
                      }}
                    >
                      {it.available ? "Visible" : "Hidden"}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEdit(it)}
                      style={{
                        background: "#f9fafb",
                        border: "1px solid #e5e7eb",
                        padding: "6px 14px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    {deleteConfirm === it.id ? (
                      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                        <button
                          onClick={() => handleDelete(it.id)}
                          style={{
                            background: "#dc2626",
                            color: "#fff",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={{
                            background: "#f3f4f6",
                            border: "none",
                            padding: "6px 10px",
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: 12,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(it.id)}
                        style={{
                          background: "none",
                          border: "1px solid #fca5a5",
                          color: "#dc2626",
                          padding: "5px 10px",
                          borderRadius: 6,
                          cursor: "pointer",
                          fontSize: 12,
                          flexShrink: 0,
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Edit / Add Modal */}
      {modal && formItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: "24px 16px 48px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "28px 28px 24px",
              width: "100%",
              maxWidth: 620,
              boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
            }}
          >
            {/* Modal header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>
                {modal.isNew ? "Add New Dish" : "Edit Dish"}
              </h2>
              <button
                onClick={closeModal}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#9ca3af",
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              {/* Category */}
              <div>
                <div style={sectionHead}>Category</div>
                <select
                  value={formItem.category_id}
                  onChange={(e) => setField("category_id", e.target.value)}
                  style={input}
                >
                  <option value="">Select category…</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title_he} ({c.title_en})
                    </option>
                  ))}
                </select>
              </div>

              {/* Names */}
              <div>
                <div style={sectionHead}>Dish Name</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {(["he", "ar", "en"] as const).map((lng) => (
                    <div key={lng}>
                      <div style={label}>
                        {lng === "he" ? "עברית" : lng === "ar" ? "عربية" : "English"}
                      </div>
                      <input
                        type="text"
                        value={(formItem[`name_${lng}` as keyof FormItem] as string) || ""}
                        onChange={(e) => setField(`name_${lng}`, e.target.value)}
                        style={{ ...input, direction: lng === "en" ? "ltr" : "rtl" }}
                        placeholder={lng === "he" ? "שם המנה" : lng === "ar" ? "اسم الطبق" : "Dish name"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <div style={sectionHead}>Description (optional)</div>
                <div style={{ display: "grid", gap: 10 }}>
                  {(["he", "ar", "en"] as const).map((lng) => (
                    <div key={lng}>
                      <div style={label}>
                        {lng === "he" ? "עברית" : lng === "ar" ? "عربية" : "English"}
                      </div>
                      <textarea
                        value={(formItem[`description_${lng}` as keyof FormItem] as string) || ""}
                        onChange={(e) => setField(`description_${lng}`, e.target.value)}
                        rows={2}
                        style={{
                          ...input,
                          resize: "vertical",
                          direction: lng === "en" ? "ltr" : "rtl",
                          fontFamily: "system-ui",
                        }}
                        placeholder={lng === "he" ? "תיאור קצר…" : lng === "ar" ? "وصف قصير…" : "Short description…"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div style={sectionHead}>Price</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={formItem.price ?? ""}
                    onChange={(e) =>
                      setField("price", e.target.value === "" ? null : Number(e.target.value))
                    }
                    style={{ ...input, maxWidth: 140 }}
                    placeholder="e.g. 54"
                  />
                  <span style={{ color: "#6b7280", fontSize: 16 }}>₪</span>
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>
                    Leave empty if price varies
                  </span>
                </div>
              </div>

              {/* Image */}
              <div>
                <div style={sectionHead}>Image</div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="preview"
                      style={{
                        width: 72,
                        height: 72,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={label}>Filename</div>
                    <input
                      type="text"
                      value={formItem.image || ""}
                      onChange={(e) => setField("image", e.target.value || null)}
                      style={input}
                      placeholder="photo.jpg (or upload below)"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      style={{
                        marginTop: 8,
                        background: "#f3f4f6",
                        border: "1px solid #d1d5db",
                        padding: "7px 16px",
                        borderRadius: 6,
                        cursor: uploading ? "wait" : "pointer",
                        fontSize: 13,
                        fontWeight: 500,
                        color: "#374151",
                      }}
                    >
                      {uploading ? "Uploading…" : "📤 Upload Image from Computer"}
                    </button>
                    {formItem.image && (
                      <button
                        type="button"
                        onClick={() => setField("image", null)}
                        style={{
                          marginTop: 4,
                          marginInlineStart: 8,
                          background: "none",
                          border: "none",
                          color: "#ef4444",
                          fontSize: 12,
                          cursor: "pointer",
                        }}
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>

              {/* Toggles */}
              <div>
                <div style={sectionHead}>Settings</div>
                <div style={{ display: "flex", gap: 28 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formItem.available}
                      onChange={(e) => setField("available", e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>Visible on menu</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formItem.featured}
                      onChange={(e) => setField("featured", e.target.checked)}
                      style={{ width: 16, height: 16, cursor: "pointer" }}
                    />
                    <span style={{ fontSize: 14 }}>Featured</span>
                  </label>
                </div>
              </div>

              {/* Error inside modal */}
              {error && (
                <div
                  style={{
                    background: "#fef2f2",
                    color: "#b91c1c",
                    padding: "8px 12px",
                    borderRadius: 6,
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "flex-end",
                  paddingTop: 8,
                  borderTop: "1px solid #f3f4f6",
                }}
              >
                <button
                  onClick={closeModal}
                  style={{
                    background: "none",
                    border: "1px solid #d1d5db",
                    padding: "10px 20px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    color: "#374151",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || uploading}
                  style={{
                    background: saving ? "#6b7280" : "#1a1a2e",
                    color: "#fff",
                    border: "none",
                    padding: "10px 28px",
                    borderRadius: 8,
                    cursor: saving ? "wait" : "pointer",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  {saving ? "Saving…" : modal.isNew ? "Add Dish" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
