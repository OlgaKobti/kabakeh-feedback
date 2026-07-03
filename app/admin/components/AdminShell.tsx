"use client";

type Section = "dashboard" | "feedback" | "menu";

const navLinks: { id: Section; label: string; href: string; emoji: string }[] = [
  { id: "feedback", label: "Feedback", href: "/admin/feedback", emoji: "💬" },
  { id: "menu", label: "Menu", href: "/admin/menu", emoji: "🍽" },
];

export function AdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: Section;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f4f6",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Top nav */}
      <nav
        style={{
          background: "#1a1a2e",
          padding: "0 24px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <a
            href="/admin/dashboard"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              textDecoration: "none",
              marginInlineEnd: 16,
              letterSpacing: "-0.01em",
            }}
          >
            Kabakeh Admin
          </a>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              style={{
                color: active === link.id ? "#fff" : "rgba(255,255,255,0.55)",
                fontSize: 14,
                fontWeight: active === link.id ? 600 : 400,
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: 6,
                background:
                  active === link.id ? "rgba(255,255,255,0.12)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              {link.emoji} {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 20px" }}>
        {children}
      </div>
    </div>
  );
}
