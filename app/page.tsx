"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function StarRow({
  value,
  onPick,
  disabled,
}: {
  value: number | null;
  onPick: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="starsRow" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((v) => {
        const active = value !== null && v <= value;
        return (
          <button
            key={v}
            type="button"
            className={`starBtn ${active ? "active" : ""}`}
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
}: {
  title: string;
  value: number | null;
  onPick: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label className="label" style={{ margin: 0 }}>
          {title}
        </label>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{value ? `${value}/5` : ""}</span>
      </div>
      <StarRow value={value} onPick={onPick} disabled={disabled} />
    </div>
  );
}

export default function HomePage() {
  const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";

  // Overall + category ratings
  const [overall, setOverall] = useState<number | null>(null);
  const [food, setFood] = useState<number | null>(null);
  const [service, setService] = useState<number | null>(null);
  const [atmosphere, setAtmosphere] = useState<number | null>(null);

  // Feedback (for low ratings encouraged, for high ratings optional)
  const [comment, setComment] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Modes:
  // - "high": overall >= 4 (auto-submit+redirect once categories are chosen)
  // - "low":  overall <= 3 (apology + submit button, no Google redirect)
  // - "pick": nothing selected yet
  const mode = overall === null ? "pick" : overall >= 4 ? "high" : "low";

  const apologyText = useMemo(
    () =>
      "We’re sorry you had a bad experience. Thank you for telling us — we truly appreciate it and we’ll do our best to make your next visit better. If you can share what happened, it will really help us improve.",
    []
  );

  // Prevent double-submits when redirecting
  const didAutoSubmitRef = useRef(false);

  async function saveFeedback(payload: any) {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to submit");
  }

  // High-rating: auto submit + redirect ONLY when all ratings are selected
  useEffect(() => {
    async function run() {
      if (mode !== "high") return;
      if (loading) return;

      const ready = overall && food && service && atmosphere;
      if (!ready) return;

      if (!googleUrl) {
        setErr("Google review link is not configured yet.");
        return;
      }

      if (didAutoSubmitRef.current) return;
      didAutoSubmitRef.current = true;

      setErr(null);
      setLoading(true);
      try {
        await saveFeedback({
          rating: overall,
          food_rating: food,
          service_rating: service,
          atmosphere_rating: atmosphere,
          comment: comment || null, // optional even for high ratings
        });

        // Redirect to Google after saving
        window.location.href = googleUrl;
      } catch (e: any) {
        didAutoSubmitRef.current = false; // allow retry
        setErr(e.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    run();
  }, [mode, overall, food, service, atmosphere, googleUrl, loading, comment]);

  // Reset auto-submit lock if user changes overall rating
  useEffect(() => {
    didAutoSubmitRef.current = false;
    setErr(null);
  }, [overall]);

  async function submitLow() {
    if (loading) return;
    if (!overall) return;

    setErr(null);
    setLoading(true);
    try {
      await saveFeedback({
        rating: overall,
        food_rating: food,
        service_rating: service,
        atmosphere_rating: atmosphere,
        comment: comment || null,
        contact_phone: contactPhone || null,
        contact_email: contactEmail || null,
      });

      // Simple success feedback
      setComment("");
      setContactPhone("");
      setContactEmail("");
      alert("Thank you 🙏 We received your feedback.");
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const categoriesDisabled = overall === null || loading;

  return (
    <main className="card">
      <div className="headerRow">
        <div>
          <h1 className="h1">Kabakeh</h1>
          <p className="p">How was your experience today?</p>
        </div>
        <span className="badge">Feedback</span>
      </div>

      {/* OVERALL */}
      <div style={{ marginTop: 14 }}>
        <label className="label">Overall rating</label>
        <StarRow value={overall} onPick={setOverall} disabled={loading} />

        {mode === "high" && (
          <p className="small">
            Thanks! Please rate the details below — then we’ll take you to Google.
          </p>
        )}

        {mode === "low" && (
          <p className="small">
            Thank you — please tell us what we can improve. (You won’t be redirected to Google.)
          </p>
        )}

        {mode === "pick" && <p className="small">Tap a star to begin.</p>}
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
        <div style={{ fontWeight: 800, fontSize: 14, color: "#374151" }}>Rate the details</div>
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          This helps us understand what we did well and what to improve
        </div>
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
        <CategoryBlock title="Food" value={food} onPick={setFood} disabled={categoriesDisabled} />
        <CategoryBlock
          title="Service"
          value={service}
          onPick={setService}
          disabled={categoriesDisabled}
        />
        <CategoryBlock
          title="Atmosphere"
          value={atmosphere}
          onPick={setAtmosphere}
          disabled={categoriesDisabled}
        />

        {overall === null && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>
            Select an overall rating first.
          </div>
        )}
      </div>

      {/* LOW RATING APOLOGY */}
      {mode === "low" && <div className="alert">{apologyText}</div>}

      {/* FEEDBACK BOX */}
      <label className="label">Feedback (optional)</label>
      <textarea
        className="textarea"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us what you liked or what we can improve..."
        disabled={loading}
      />

      {/* CONTACT ONLY FOR LOW RATINGS */}
      {mode === "low" && (
        <>
          <label className="label">Phone (optional)</label>
          <input
            className="input"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+972..."
            disabled={loading}
          />

          <label className="label">Email (optional)</label>
          <input
            className="input"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
            disabled={loading}
          />

          <button className="btn" onClick={submitLow} disabled={loading}>
            {loading ? "Sending..." : "Send feedback"}
          </button>
        </>
      )}

      {/* HIGH RATING HELPER */}
      {mode === "high" && (
        <p className="small">
          After you select the category stars, you’ll be redirected automatically to leave a Google review.
        </p>
      )}

      {err && <div className="error">{err}</div>}
    </main>
  );
}
