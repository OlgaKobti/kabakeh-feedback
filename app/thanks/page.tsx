export default function ThanksPage() {
    const googleUrl = process.env.GOOGLE_REVIEW_URL || "#";
  
    return (
      <main style={{ maxWidth: 520, margin: "40px auto", padding: 16, fontFamily: "system-ui" }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Thank you 🙏</h1>
        <p style={{ opacity: 0.85 }}>We read every message and use it to improve.</p>
  
        <div style={{ display: "flex", gap: 10, marginTop: 18, flexWrap: "wrap" }}>
          <a href={googleUrl} target="_blank" rel="noreferrer" style={{ padding: 12, border: "1px solid #ccc" }}>
            Leave a Google review
          </a>
        </div>
  
        {googleUrl === "#" && (
          <p style={{ marginTop: 16, color: "crimson" }}>
            GOOGLE_REVIEW_URL is not set yet. Add it in .env.local.
          </p>
        )}
      </main>
    );
  }
  