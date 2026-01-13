"use client";

import { useEffect, useState } from "react";

type FeedbackRow = {
  id: string;
  rating: number;
  comment: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  created_at: string;
};

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
      const data = await res.json();
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
    const res = await fetch("/api/admin/feedback");
    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Failed to load");
      return;
    }
    setRows(data.data || []);
  }

  useEffect(() => {
    if (loggedIn) loadFeedback();
  }, [loggedIn]);

  const avg =
    rows.length === 0 ? 0 : Math.round((rows.reduce((s, r) => s + r.rating, 0) / rows.length) * 10) / 10;

  return (
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Kabakeh Admin</h1>

      {!loggedIn ? (
        <div style={{ maxWidth: 420 }}>
          <p>Enter admin password:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 10 }}
          />
          <button onClick={login} disabled={loading} style={{ marginTop: 10, padding: 10 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
          {err && <p style={{ color: "crimson" }}>{err}</p>}
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 10 }}>
            <button onClick={loadFeedback} style={{ padding: 10 }}>Refresh</button>
            <div style={{ opacity: 0.8 }}>
              Total: <b>{rows.length}</b> · Avg: <b>{avg}</b>
            </div>
          </div>

          {err && <p style={{ color: "crimson" }}>{err}</p>}

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            {rows.map((r) => (
              <div key={r.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <strong>{r.rating} ★</strong>
                  <span style={{ opacity: 0.7 }}>{new Date(r.created_at).toLocaleString()}</span>
                </div>

                {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}

                {(r.contact_phone || r.contact_email) && (
                  <p style={{ marginTop: 8, opacity: 0.8 }}>
                    Contact: {r.contact_phone || "-"}
                    {r.contact_email ? ` / ${r.contact_email}` : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
