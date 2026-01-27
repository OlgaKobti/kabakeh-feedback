"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { detectLang, isRtl, t } from "@/lib/i18n";

/* ---------- Star UI ---------- */
function StarRow({
  value,
  onPick,
  disabled,
  color,
}: {
  value: number | null;
  onPick: (v: number) => void;
  disabled?: boolean;
  color: "green" | "red";
}) {
  return (
    <div className="starsRow" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((v) => {
        const active = value !== null && v <= value;
        return (
          <button
            key={v}
            type="button"
            className={`starBtn ${color} ${active ? "active" : ""}`}
            onClick={() => onPick(v)}
            disabled={disabled}
            aria-label={`${v} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function CategoryBlock({
  title,
  value,
  onPick,
  disabled,
  color,
}: {
  title: string;
  value: number | null;
  onPick: (v: number) => void;
  disabled?: boolean;
  color: "green" | "red";
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label className="label" style={{ margin: 0 }}>
          {title}
        </label>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{value ? `${value}/5` : ""}</span>
      </div>
      <StarRow value={value} onPick={onPick} disabled={disabled} color={color} />
    </div>
  );
}

/* ---------- Main Page ---------- */
export default function HomePage() {
  const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

  // Language
  const [lang, setLang] = useState<Lang>("en");
  const rtl = useMemo(() => isRtl(lang), [lang]);

  // Overall + category ratings
  const [overall, setOverall] = useState<number | null>(null);
  const [food, setFood] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [atmosphere, setAtmosphere] = useState<number | null>(null);

  // Feedback
  const [comment, setComment] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Star color: low (<=3) -> red, otherwise green
  const starColor: "green" | "red" = overall !== null && overall <= 3 ? "red" : "green";

  // Prevent multiple immediate redirects
  const didRedirectRef = useRef(false);

  useEffect(() => {
    const initial = detectLang();
    setLang(initial);
  }, []);

  function changeLang(next: Lang) {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kabakeh_lang", next);
      // optional: reflect in URL (nice for sharing)
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    }
  }

  async function saveFeedback(payload: any) {
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error("Background save failed", e);
    }
  }

  // If user picks 5 -> immediate redirect, no message about Google
  function handlePickOverall(v: number) {
    setOverall(v);
    setErr(null);

    if (v === 5) {
      if (didRedirectRef.current) return;
      didRedirectRef.current = true;

      const payload = {
        rating: 5,
        food_rating: null,
        service_rating: null,
        atmosphere_rating: null,
        comment: null,
      };

      const sent =
        typeof navigator !== "undefined" &&
        "sendBeacon" in navigator &&
        (() => {
          try {
            const url = "/api/feedback";
            const body = JSON.stringify(payload);
            const blob = new Blob([body], { type: "application/json" });
            return (navigator as any).sendBeacon(url, blob);
          } catch {
            return false;
          }
        })();

      if (!sent) {
        saveFeedback(payload);
      }

      if (googleUrl) {
        window.location.href = googleUrl;
      } else {
        setErr(t(lang, "generic_error"));
        didRedirectRef.current = false;
      }
    }
  }

  async function submitLow() {
    if (loading) return;
    if (!overall) return;

    setErr(null);
    setLoading(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: overall,
          food_rating: food ?? null,
          service_rating: service ?? null,
          atmosphere_rating: atmosphere ?? null,
          comment: comment || null,
          contact_phone: contactPhone || null,
          contact_email: contactEmail || null,
        }),
      });

      setComment("");
      setContactPhone("");
      setContactEmail("");
      alert(t(lang, "thank_you"));
    } catch (e: any) {
      setErr(e?.message ?? "Failed to send feedback.");
    } finally {
      setLoading(false);
    }
  }

  const categoriesDisabled = overall === null || loading || overall === 5;

  return (
    <main className="card" dir={rtl ? "rtl" : "ltr"}>
      {/* Language switch */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => changeLang("en")}
          className="langBtn"
          aria-pressed={lang === "en"}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => changeLang("he")}
          className="langBtn"
          aria-pressed={lang === "he"}
        >
          עברית
        </button>
        <button
          type="button"
          onClick={() => changeLang("ar")}
          className="langBtn"
          aria-pressed={lang === "ar"}
        >
          العربية
        </button>
      </div>

      <div className="headerRow">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#fff",
              border: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <img
              src="/logo.jpg"
              alt="Kabakeh logo"
              style={{
                height: 52,
                width: "auto",
                transform: "translateX(2px) translateY(1px) scale(1.05)",
              }}
            />
          </div>

          <div>
            <h1 className="h1" style={{ marginBottom: 2 }}>
              Kabakeh
            </h1>
            <p className="p">{t(lang, "title")}</p>
          </div>
        </div>

        <span className="badge">Feedback</span>
      </div>

      {/* OVERALL */}
      <div style={{ marginTop: 14 }}>
        <label className="label">{t(lang, "overall_rating")}</label>
        <StarRow value={overall} onPick={handlePickOverall} disabled={loading} color={starColor} />
        {overall === null && (
        <p className="small">{t(lang, "start_prompt")}</p>
        )}
      </div>

      {/* DIVIDER */}
      <div
        style={{
          margin: "22px 0 14px",
          height: 1,
          background: "#e5e7eb",
          borderRadius: 999,
        }}
      />

      {/* CATEGORY TITLE */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: "#374151" }}>
          {t(lang, "rate_the_details")}
        </div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>{t(lang, "details_hint")}</div>
      </div>

      {/* CATEGORY BOX */}
      <div
        style={{
          padding: 14,
          borderRadius: 14,
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
        }}
      >
        <CategoryBlock
          title={t(lang, "food")}
          value={food}
          onPick={setFood}
          disabled={categoriesDisabled}
          color={starColor}
        />
        <CategoryBlock
          title={t(lang, "service")}
          value={service}
          onPick={setService}
          disabled={categoriesDisabled}
          color={starColor}
        />
        <CategoryBlock
          title={t(lang, "atmosphere")}
          value={atmosphere}
          onPick={setAtmosphere}
          disabled={categoriesDisabled}
          color={starColor}
        />

        {overall === null && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            {t(lang, "start_prompt")}
          </div>
        )}
      </div>

      {/* FEEDBACK BOX */}
      <label className="label">{t(lang, "feedback_optional")}</label>
      <textarea
        className="textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t(lang, "feedback_optional")}
        disabled={loading}
      />

      {/* CONTACT + SUBMIT only for 1-4 */}
      {overall !== 5 && (
        <>
          <label className="label">{t(lang, "phone_optional")}</label>
          <input
            className="input"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+972..."
            disabled={loading}
          />

          <label className="label">{t(lang, "email_optional")}</label>
          <input
            className="input"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={loading}
          />

          <button className="btn" onClick={submitLow} disabled={loading}>
            {loading ? "..." : t(lang, "send_feedback")}
          </button>
        </>
      )}

      {err && <div className="error">{err}</div>}
    </main>
  );
}
