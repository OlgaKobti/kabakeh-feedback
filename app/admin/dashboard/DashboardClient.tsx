"use client";

import { AdminShell } from "../components/AdminShell";

export default function DashboardClient({
  feedbackCount,
  itemCount,
}: {
  feedbackCount: number;
  itemCount: number;
}) {
  return (
    <AdminShell active="dashboard">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, margin: "0 0 6px", color: "#111" }}>
          Welcome back 👋
        </h1>
        <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
          What would you like to manage today?
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {/* Feedback card */}
        <a
          href="/admin/feedback"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              border: "1px solid #f0f0f0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)";
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#eff6ff",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 16,
              }}
            >
              💬
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>
              Customer Feedback
            </div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
              View ratings and comments from guests
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  background: "#eff6ff",
                  color: "#1d4ed8",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {feedbackCount} responses
              </div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>

        {/* Menu card */}
        <a
          href="/admin/menu"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: 28,
              boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)",
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              border: "1px solid #f0f0f0",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)";
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                background: "#f0fdf4",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                marginBottom: 16,
              }}
            >
              🍽
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>
              Menu Management
            </div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
              Add, edit, hide and delete dishes
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div
                style={{
                  background: "#f0fdf4",
                  color: "#166534",
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {itemCount} dishes
              </div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>
      </div>
    </AdminShell>
  );
}
