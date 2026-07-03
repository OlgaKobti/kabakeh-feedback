"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../components/AdminShell";

type FeedbackRow = {
  id: string;
  rating: number;
  food_rating: number | null;
  service_rating: number | null;
  atmosphere_rating: number | null;
  comment: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
};

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} style={{ color: i < value ? "#f59e0b" : "#e5e7eb", fontSize: 14 }}>
          ★
        </span>
      ))}
    </span>
  );
}

function RatingPill({ label, value }: { label: string; value: number | null }) {
  if (value == null) return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        padding: "4px 10px",
        fontSize: 12,
      }}
    >
      <span style={{ color: "#6b7280", fontWeight: 500 }}>{label}</span>
      <Stars value={value} />
    </div>
  );
}

export default function FeedbackClient() {
  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/admin/feedback");
    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed to load feedback");
      setLoading(false);
      return;
    }
    setRows(data.data || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const avgRating =
    rows.length > 0
      ? (rows.reduce((s, r) => s + r.rating, 0) / rows.length).toFixed(1)
      : null;

  return (
    <AdminShell active="feedback">
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>
            Customer Feedback
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, margin: 0 }}>
            {rows.length} responses
            {avgRating && (
              <span style={{ marginInlineStart: 10, color: "#f59e0b", fontWeight: 600 }}>
                ★ {avgRating} avg
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            padding: "8px 16px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            color: "#374151",
          }}
        >
          {loading ? "Loading…" : "↺ Refresh"}
        </button>
      </div>

      {err && (
        <div
          style={{
            background: "#fef2f2",
            color: "#b91c1c",
            padding: "10px 16px",
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 13,
          }}
        >
          {err}
        </div>
      )}

      {loading && !rows.length ? (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: 48 }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: 48 }}>
          No feedback yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {rows.map((r) => (
            <div
              key={r.id}
              style={{
                background: "#fff",
                border: "1px solid #f0f0f0",
                borderRadius: 12,
                padding: "16px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                {/* Overall rating */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      background:
                        r.rating >= 5
                          ? "#f0fdf4"
                          : r.rating >= 3
                          ? "#fefce8"
                          : "#fef2f2",
                      color:
                        r.rating >= 5
                          ? "#166534"
                          : r.rating >= 3
                          ? "#854d0e"
                          : "#991b1b",
                      fontWeight: 700,
                      fontSize: 16,
                      padding: "4px 12px",
                      borderRadius: 20,
                      minWidth: 44,
                      textAlign: "center",
                    }}
                  >
                    {r.rating} ★
                  </div>
                  <Stars value={r.rating} />
                </div>
                <span style={{ color: "#9ca3af", fontSize: 12 }}>
                  {new Date(r.created_at).toLocaleString("en-IL", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* Sub-ratings */}
              {(r.food_rating || r.service_rating || r.atmosphere_rating) && (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                  <RatingPill label="Food" value={r.food_rating} />
                  <RatingPill label="Service" value={r.service_rating} />
                  <RatingPill label="Atmosphere" value={r.atmosphere_rating} />
                </div>
              )}

              {/* Comment */}
              {r.comment && (
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#374151",
                    fontSize: 14,
                    lineHeight: 1.6,
                    background: "#f9fafb",
                    padding: "10px 14px",
                    borderRadius: 8,
                    borderInlineStart: "3px solid #e5e7eb",
                  }}
                >
                  "{r.comment}"
                </p>
              )}

              {/* Contact */}
              {(r.contact_phone || r.contact_email) && (
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 12,
                    color: "#6b7280",
                    display: "flex",
                    gap: 16,
                  }}
                >
                  {r.contact_phone && <span>📞 {r.contact_phone}</span>}
                  {r.contact_email && <span>✉️ {r.contact_email}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
