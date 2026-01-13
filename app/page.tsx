"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function submit() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment,
          contact_phone: contactPhone,
          contact_email: contactEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      router.push("/thanks");
    } catch (e: any) {
      setErr(e.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Kabakeh</h1>
      <p style={{ marginTop: 0, opacity: 0.8 }}>How was your experience today?</p>

      <label style={{ display: "block", marginTop: 18, marginBottom: 6 }}>Rating</label>
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))} style={{ width: "100%", padding: 10 }}>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} ★
          </option>
        ))}
      </select>

      <label style={{ display: "block", marginTop: 18, marginBottom: 6 }}>Feedback (optional)</label>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} style={{ width: "100%", padding: 10 }} />

      <label style={{ display: "block", marginTop: 18, marginBottom: 6 }}>Phone (optional)</label>
      <input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} style={{ width: "100%", padding: 10 }} />

      <label style={{ display: "block", marginTop: 18, marginBottom: 6 }}>Email (optional)</label>
      <input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} style={{ width: "100%", padding: 10 }} />

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      <button onClick={submit} disabled={loading} style={{ width: "100%", marginTop: 18, padding: 12, fontSize: 16 }}>
        {loading ? "Sending..." : "Submit"}
      </button>

      <p style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
        This feedback goes directly to the restaurant. Public reviews are optional.
      </p>
    </main>
  );
}
