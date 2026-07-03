"use client";

import { useState } from "react";

export default function AdminLoginClient() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function login() {
    if (!password) return;
    setLoading(true);
    setErr(null);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setErr(data?.error || "Wrong password");
      return;
    }

    window.location.href = "/admin/dashboard";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#1a1a2e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "48px 40px",
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            background: "#1a1a2e",
            borderRadius: 14,
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
          }}
        >
          🔑
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", color: "#111" }}>
          Kabakeh Admin
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 28px" }}>
          Enter your password to continue
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          autoFocus
          style={{
            width: "100%",
            padding: "12px 14px",
            border: err ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 15,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: err ? 8 : 16,
            transition: "border 0.15s",
          }}
        />

        {err && (
          <p style={{ color: "#ef4444", fontSize: 13, margin: "0 0 14px", textAlign: "left" }}>
            {err}
          </p>
        )}

        <button
          onClick={login}
          disabled={loading || !password}
          style={{
            width: "100%",
            padding: "12px",
            background: loading || !password ? "#9ca3af" : "#1a1a2e",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 600,
            cursor: loading || !password ? "not-allowed" : "pointer",
            transition: "background 0.15s",
          }}
        >
          {loading ? "Logging in…" : "Log In"}
        </button>
      </div>
    </div>
  );
}
