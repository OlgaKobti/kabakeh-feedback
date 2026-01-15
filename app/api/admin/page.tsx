"use client";

import { useEffect, useMemo, useState } from "react";

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

function Stars({ value }: { value: number | null }) {
  const v = value ?? 0;
  return (
    <span aria-label={value ? `${value} stars` : "No rating"}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ opacity: i <= v ? 1 : 0.2, fontSize: 16 }}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [rows, setRows] = useState<FeedbackRow[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Login failed");
      setLoggedIn(true);
    } catch (e: any) {
      setErr(e.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function loadFeedback() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/feedback");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to load");
      setRows(data.data || []);
    } catch (e: any) {
      setErr(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loggedIn) loadFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const stats = useMemo(() => {
    if (!rows.length) return { total: 0, avg: 0, breakdown: [0, 0, 0, 0, 0] as number[] };
    const breakdown = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of rows) {
      sum += r.rating;
      breakdown[Math.max(1, Math.min(5, r.rating)) - 1] += 1;
    }
    const avg = Math.round((sum / rows.length) * 10) / 10;
    return { total: rows.length, avg, breakdown };
  }, [rows]);

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
        <div>
          <h1 style={{ fontSize: 28, margin: 0 }}>Kabakeh Admin</h1>
          <p style={{ margin: "6px 0 0", opacity: 0.75 }}>
            View all feedback stored in Supabase (latest first).
          </p>
        </div>

        {loggedIn && (
          <button
            onClick={loadFeedback}
            disabled={loading}
            style={{
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        )}
      </div>

      {!loggedIn ? (
        <div style={{ maxWidth: 420, marginTop: 18 }}>
          <p style={{ marginBottom: 8 }}>Enter admin password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: 15,
            }}
          />
          <button
            onClick={login}
            disabled={loading}
            style={{
              marginTop: 10,
              padding: 12,
              width: "100%",
              borderRadius: 12,
              border: 0,
              background: "#111827",
              color: "white",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}
        </div>
      ) : (
        <>
          <div
            style={{
              marginTop: 18,
              padding: 14,
              border: "1px solid #e5e7eb",
              borderRadius: 14,
              background: "white",
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Total</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{stats.total}</div>
            </div>

            <div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>Average</div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{stats.avg}</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = stats.breakdown[stars - 1] || 0;
                return (
                  <div
                    key={stars}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>{stars}★</span> {count}
                  </div>
                );
              })}
            </div>
          </div>

          {err && <p style={{ color: "crimson", marginTop: 12 }}>{err}</p>}

          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {rows.map((r) => (
              <div
                key={r.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 16,
                  padding: 14,
                  background: "white",
                  boxShadow: "0 8px 18px rgba(17,24,39,0.05)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ fontWeight: 900, fontSize: 16 }}>
                      Overall: <Stars value={r.rating} />
                    </div>

                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        fontSize: 13,
                      }}
                    >
                      Food: <Stars value={r.food_rating} />
                    </div>

                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        fontSize: 13,
                      }}
                    >
                      Service: <Stars value={r.service_rating} />
                    </div>

                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: 999,
                        border: "1px solid #e5e7eb",
                        background: "#f9fafb",
                        fontSize: 13,
                      }}
                    >
                      Atmosphere: <Stars value={r.atmosphere_rating} />
                    </div>
                  </div>

                  <span style={{ opacity: 0.7, fontSize: 13 }}>
                    {new Date(r.created_at).toLocaleString()}
                  </span>
                </div>

                {r.comment && (
                  <p style={{ marginTop: 10, marginBottom: 0, fontSize: 15, lineHeight: 1.4 }}>
                    {r.comment}
                  </p>
                )}

                {(r.contact_phone || r.contact_email) && (
                  <p style={{ marginTop: 10, marginBottom: 0, opacity: 0.8, fontSize: 13 }}>
                    Contact: {r.contact_phone || "-"}
                    {r.contact_email ? ` / ${r.contact_email}` : ""}
                  </p>
                )}
              </div>
            ))}

            {!rows.length && !loading && (
              <div style={{ marginTop: 10, opacity: 0.8 }}>No feedback yet.</div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
