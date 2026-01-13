"use client";

import { useMemo, useState } from "react";

function StarPicker({
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

export default function HomePage() {
  const googleUrl = process.env.NEXT_PUBLIC_GOOGLE_REVIEW_URL || "";
  const [rating, setRating] = useState<number | null>(null);

  // Low-rating extra details
  const [comment, setComment] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState<"pick" | "low_details" | "done_low">("pick");

  const apologyText = useMemo(
    () =>
      "We’re sorry you had a bad experience. Thank you for telling us — we truly appreciate it and we’ll do our best to make your next visit better. If you can share what happened, it will really help us improve.",
    []
  );

  async function saveFeedback(payload: any) {
    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || "Failed to submit");
  }

  async function onPickRating(v: number) {
    if (loading) return;
    setErr(null);
    setRating(v);

    // If 4-5: save immediately and redirect to Google
    if (v >= 4) {
      if (!googleUrl) {
        setErr("Google review link is not configured yet.");
        return;
      }

      setLoading(true);
      try {
        await saveFeedback({ rating: v });
        // direct redirect (user click triggered)
        window.location.href = googleUrl;
      } catch (e: any) {
        setErr(e.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
      return;
    }

    // If 1-3: show apology + details form (no Google)
    setMode("low_details");
  }

  async function submitLowDetails() {
    if (loading || rating === null) return;
    setErr(null);
    setLoading(true);
    try {
      await saveFeedback({
        rating,
        comment,
        contact_phone: contactPhone,
        contact_email: contactEmail,
      });
      setMode("done_low");
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="card">
      <div className="headerRow">
        <div>
          <h1 className="h1">Kabakeh</h1>
          <p className="p">How was your experience today?</p>
        </div>
        <span className="badge">Feedback</span>
      </div>

      {mode === "pick" && (
        <>
          <label className="label">Tap a star</label>
          <StarPicker value={rating} onPick={onPickRating} disabled={loading} />
          <p className="small">Your feedback goes directly to the restaurant.</p>
        </>
      )}

      {mode === "low_details" && (
        <>
          <div className="alert">{apologyText}</div>

          <label className="label">What happened? (optional)</label>
          <textarea
            className="textarea"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us what we can improve..."
          />

          <label className="label">Phone (optional)</label>
          <input
            className="input"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            placeholder="+972..."
          />

          <label className="label">Email (optional)</label>
          <input
            className="input"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="name@example.com"
          />

          {err && <div className="error">{err}</div>}

          <button className="btn" onClick={submitLowDetails} disabled={loading}>
            {loading ? "Sending..." : "Send feedback"}
          </button>

          <p className="small">
            Thank you — we’ll use this to improve. (You will not be redirected to Google.)
          </p>
        </>
      )}

      {mode === "done_low" && (
        <>
          <h2 style={{ marginTop: 18, marginBottom: 6 }}>Thank you 🙏</h2>
          <p className="p">We appreciate the feedback and will review it carefully.</p>
        </>
      )}

      {err && mode !== "low_details" && <div className="error">{err}</div>}
    </main>
  );
}
