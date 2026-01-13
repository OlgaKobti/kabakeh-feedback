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

  async function login() {
    setErr(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setErr(data?.error || "Login failed");
      return;
    }
    setLoggedIn(true);
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
          <button onClick={login} style={{ marginTop: 10, padding: 10 }}>
            Login
          </button>
          {err && <p style={{ color: "crimson" }}>{err}</p>}
        </div>
      ) : (
        <>
          <button onClick={loadFeedback} style={{ padding: 10 }}>Refresh</button>
          {err && <p style={{ color: "crimson" }}>{err}</p>}

          <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
            {rows.map((r) => (
              <div key={r.id} style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                  <strong>{r.rating} ★</strong>
                  <span style={{ opacity: 0.7 }}>{new Date(r.created_at).toLocaleString()}</span>
                </div>
                {r.comment && <p style={{ marginTop: 8 }}>{r.comment}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
