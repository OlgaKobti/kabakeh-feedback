"use client";

import { AdminShell } from "../components/AdminShell";

export default function DashboardClient({
  feedbackCount,
  itemCount,
  eventCount,
  photoCount,
  inquiryCount,
  unreadCount,
  bookingCount,
  pendingBookingCount,
}: {
  feedbackCount: number;
  itemCount: number;
  eventCount: number;
  photoCount: number;
  inquiryCount: number;
  unreadCount: number;
  bookingCount: number;
  pendingBookingCount: number;
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
        {/* Events card */}
        <a href="/admin/events" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: "1px solid #f0f0f0" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 48, height: 48, background: "#fdf4ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>🗓️</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>Events</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Add and publish upcoming events</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ background: "#fdf4ff", color: "#7c3aed", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{eventCount} events</div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>

        {/* Gallery card */}
        <a href="/admin/gallery" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: "1px solid #f0f0f0" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 48, height: 48, background: "#fdf2f8", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>📸</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>Gallery</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Upload and manage restaurant photos</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ background: "#fdf2f8", color: "#9d174d", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>{photoCount} photos</div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>

        {/* Bookings card */}
        <a href="/admin/bookings" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: pendingBookingCount > 0 ? "2px solid #f59e0b" : "1px solid #f0f0f0" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 48, height: 48, background: "#fef3c7", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>🎟️</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>Event Bookings</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Booking requests from event pages</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ background: "#fef3c7", color: "#92400e", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {bookingCount} total{pendingBookingCount > 0 ? ` · ${pendingBookingCount} pending` : ""}
              </div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>

        {/* Inquiries card */}
        <a href="/admin/inquiries" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: unreadCount > 0 ? "2px solid #f6c543" : "1px solid #f0f0f0" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 48, height: 48, background: "#fffbeb", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>📬</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>Private Events</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Catering & private event inquiries</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ background: "#fffbeb", color: "#92400e", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                {inquiryCount} total{unreadCount > 0 ? ` · ${unreadCount} new` : ""}
              </div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>

        {/* Settings card */}
        <a href="/admin/settings" style={{ textDecoration: "none" }}>
          <div
            style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s", border: "1px solid #f0f0f0" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.1), 0 8px 32px rgba(0,0,0,0.08)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06)"; }}
          >
            <div style={{ width: 48, height: 48, background: "#f0f9ff", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>⚙️</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#111", marginBottom: 6 }}>Settings</div>
            <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>Opening hours & about the restaurant</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ background: "#f0f9ff", color: "#075985", padding: "4px 12px", borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Edit</div>
              <span style={{ color: "#9ca3af", fontSize: 20 }}>→</span>
            </div>
          </div>
        </a>
      </div>
    </AdminShell>
  );
}
