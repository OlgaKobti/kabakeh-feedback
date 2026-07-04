"use client";

import { useEffect, useState } from "react";

type Section = "dashboard" | "feedback" | "menu" | "events";

const navLinks: { id: Section; label: string; href: string; emoji: string }[] = [
  { id: "feedback", label: "Feedback", href: "/admin/feedback", emoji: "💬" },
  { id: "menu", label: "Menu", href: "/admin/menu", emoji: "🍽" },
  { id: "events", label: "Events", href: "/admin/events", emoji: "🗓️" },
];

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export function AdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: Section;
}) {
  const isMobile = useIsMobile();

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
          padding: isMobile ? "0 12px" : "0 24px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            msOverflowStyle: "none",
            scrollbarWidth: "none" as React.CSSProperties["scrollbarWidth"],
          }}
        >
          <a
            href="/admin/dashboard"
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: isMobile ? 14 : 15,
              textDecoration: "none",
              marginInlineEnd: isMobile ? 8 : 16,
              letterSpacing: "-0.01em",
              flexShrink: 0,
            }}
          >
            {isMobile ? "Admin" : "Kabakeh Admin"}
          </a>
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              style={{
                color: active === link.id ? "#fff" : "rgba(255,255,255,0.55)",
                fontSize: isMobile ? 13 : 14,
                fontWeight: active === link.id ? 600 : 400,
                textDecoration: "none",
                padding: isMobile ? "5px 10px" : "6px 12px",
                borderRadius: 6,
                background:
                  active === link.id ? "rgba(255,255,255,0.12)" : "transparent",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              {link.emoji} {link.label}
            </a>
          ))}
        </div>
      </nav>

      {/* Page content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 20px" }}>
        {children}
      </div>
    </div>
  );
}
