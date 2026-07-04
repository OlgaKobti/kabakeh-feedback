"use client";

import { useEffect, useState } from "react";
import { detectLang, isRtl } from "@/lib/i18n";

type Lang = "he" | "ar" | "en";
type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";
type DayHours = { open: string; close: string; closed: boolean };

type Event = {
  id: string;
  title_he: string; title_ar: string; title_en: string;
  description_he: string | null; description_ar: string | null; description_en: string | null;
  event_date: string; event_time: string | null;
  image_url: string | null;
};

type Photo = {
  id: string; url: string;
  caption_he: string | null; caption_ar: string | null; caption_en: string | null;
};

const DAY_NAMES: Record<Lang, Record<DayKey, string>> = {
  he: { sun: "ראשון", mon: "שני", tue: "שלישי", wed: "רביעי", thu: "חמישי", fri: "שישי", sat: "שבת" },
  ar: { sun: "الأحد", mon: "الاثنين", tue: "الثلاثاء", wed: "الأربعاء", thu: "الخميس", fri: "الجمعة", sat: "السبت" },
  en: { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" },
};
const DAY_ORDER: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const COPY: Record<Lang, {
  tagline: string; menuBtn: string; menuSub: string; feedbackBtn: string; feedbackSub: string;
  events: string; about: string; hours: string; todayLabel: string; closed: string;
  gallery: string; privateEvents: string; privateEventsDesc: string;
  nameLabel: string; contactLabel: string; contactHint: string;
  eventTypeLabel: string; guestsLabel: string; dateLabel: string; messageLabel: string;
  sendBtn: string; sentMsg: string;
  contact: string; phone: string; location: string; locationHint: string;
}> = {
  he: {
    tagline: "מסעדה ערבית אותנטית",
    menuBtn: "לתפריט", menuSub: "צפו במנות ומשקאות",
    feedbackBtn: "השאירו פידבק", feedbackSub: "ספרו לנו איך היה",
    events: "אירועים קרובים", about: "אודותינו",
    hours: "שעות פתיחה", todayLabel: "היום", closed: "סגור",
    gallery: "גלריה",
    privateEvents: "אירועים פרטיים וקייטרינג",
    privateEventsDesc: "מתכננים אירוע פרטי? חתונה, בר מצווה, ימי הולדת או אירוע עסקי — אנחנו כאן בשבילכם.",
    nameLabel: "שם מלא", contactLabel: "טלפון / אימייל",
    contactHint: "נשתמש בפרטים אלה ליצירת קשר",
    eventTypeLabel: "סוג האירוע", guestsLabel: "מספר אורחים (בערך)",
    dateLabel: "תאריך מועדף", messageLabel: "פרטים נוספים",
    sendBtn: "שליחת פנייה", sentMsg: "תודה! קיבלנו את פנייתכם ונחזור אליכם בהקדם.",
    contact: "צרו קשר", phone: "טלפון", location: "מיקום", locationHint: "כיכר קדומים 6, תל אביב-יפו",
  },
  ar: {
    tagline: "مطعم عربي أصيل",
    menuBtn: "قائمة الطعام", menuSub: "تصفح الأطباق والمشروبات",
    feedbackBtn: "اترك تقييم", feedbackSub: "أخبرنا كيف كانت تجربتك",
    events: "الفعاليات القادمة", about: "من نحن",
    hours: "ساعات العمل", todayLabel: "اليوم", closed: "مغلق",
    gallery: "معرض الصور",
    privateEvents: "المناسبات الخاصة والتموين",
    privateEventsDesc: "تخطط لحفلة خاصة؟ أعراس أو مناسبات العمل — نحن هنا لخدمتك.",
    nameLabel: "الاسم الكامل", contactLabel: "هاتف / بريد إلكتروني",
    contactHint: "سنستخدم هذه المعلومات للتواصل معك",
    eventTypeLabel: "نوع المناسبة", guestsLabel: "عدد الضيوف (تقريبي)",
    dateLabel: "التاريخ المفضل", messageLabel: "تفاصيل إضافية",
    sendBtn: "إرسال الطلب", sentMsg: "شكراً! استلمنا طلبك وسنتواصل معك قريباً.",
    contact: "تواصل معنا", phone: "هاتف", location: "الموقع", locationHint: "كيكار كدوميم 6، تل أبيب-يافا",
  },
  en: {
    tagline: "Authentic Arab cuisine",
    menuBtn: "View menu", menuSub: "Browse dishes and drinks",
    feedbackBtn: "Leave feedback", feedbackSub: "Tell us how it was",
    events: "Upcoming events", about: "About us",
    hours: "Opening hours", todayLabel: "Today", closed: "Closed",
    gallery: "Gallery",
    privateEvents: "Private events & catering",
    privateEventsDesc: "Planning a private event? Weddings, birthdays, corporate events — we'd love to host you.",
    nameLabel: "Full name", contactLabel: "Phone / Email",
    contactHint: "We'll use this to get back to you",
    eventTypeLabel: "Event type", guestsLabel: "Approx. guests",
    dateLabel: "Preferred date", messageLabel: "Additional details",
    sendBtn: "Send inquiry", sentMsg: "Thank you! We received your inquiry and will be in touch soon.",
    contact: "Contact us", phone: "Phone", location: "Location", locationHint: "Kikar Kdumim 6, Tel Aviv-Yafo",
  },
};

const EVENT_TYPES: Record<Lang, { value: string; label: string }[]> = {
  he: [{ value: "birthday", label: "יום הולדת" }, { value: "corporate", label: "אירוע חברתי" }, { value: "wedding", label: "חתונה / אירוסים" }, { value: "other", label: "אחר" }],
  ar: [{ value: "birthday", label: "عيد ميلاد" }, { value: "corporate", label: "حفل شركة" }, { value: "wedding", label: "حفل زفاف" }, { value: "other", label: "أخرى" }],
  en: [{ value: "birthday", label: "Birthday" }, { value: "corporate", label: "Corporate event" }, { value: "wedding", label: "Wedding / engagement" }, { value: "other", label: "Other" }],
};

function langLabel(l: Lang) {
  if (l === "en") return "EN";
  if (l === "he") return "עברית";
  return "العربية";
}

function todayDayKey(): DayKey {
  return DAY_ORDER[new Date().getDay()];
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("he");
  const [events, setEvents] = useState<Event[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [hours, setHours] = useState<Partial<Record<DayKey, DayHours>>>({});
  const [aboutText, setAboutText] = useState<Record<Lang, string>>({ he: "", ar: "", en: "" });

  // Inquiry form state
  const [form, setForm] = useState({ name: "", contact: "", event_type: "", guests_count: "", preferred_date: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const initial = detectLang() as Lang;
    if (initial === "en" || initial === "he" || initial === "ar") setLang(initial);
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/api/events").then((r) => r.json()),
      fetch("/api/gallery").then((r) => r.json()),
      fetch("/api/settings").then((r) => r.json()),
    ]).then(([evData, galData, setData]) => {
      setEvents(evData.events ?? []);
      setPhotos(galData.photos ?? []);
      const s = setData.settings ?? {};
      if (s.opening_hours) setHours(s.opening_hours);
      setAboutText({ he: s.about_he ?? "", ar: s.about_ar ?? "", en: s.about_en ?? "" });
    }).catch(() => {});
  }, []);

  const rtl = isRtl(lang);
  const t = COPY[lang];

  function changeLang(next: Lang) {
    setLang(next);
    if (typeof window !== "undefined") window.localStorage.setItem("kabakeh_lang", next);
  }

  async function submitInquiry(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    setSending(true); setSendError("");
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setSent(true); setForm({ name: "", contact: "", event_type: "", guests_count: "", preferred_date: "", message: "" }); }
    else { const d = await res.json(); setSendError(d.error ?? "שגיאה"); }
    setSending(false);
  }

  const today = todayDayKey();
  const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--ka-border)", fontSize: 15, fontFamily: "inherit", background: "#fff", color: "var(--ka-text)", boxSizing: "border-box" };

  return (
    <>
      {/* Fixed animated full-page background — must be OUTSIDE main to avoid stacking context issues */}
      <div className="pageBgWrap" aria-hidden="true">
        <img src="/atmos.jpg" alt="" className="pageBgImg" />
        <div className="pageBgOverlay" />
      </div>

      <main className="homeWrap" dir={rtl ? "rtl" : "ltr"}>

      {/* Top bar */}
      <header className="homeTop">
        <div className="homeTopLeft">
          <div className="menuLogoCircle">
            <img src="/logo.jpg" alt="Kabakeh logo" className="menuLogoImg" draggable={false} />
          </div>
          <span className="menuBrand">Kabakeh</span>
        </div>
        <div className="menuLang">
          {(["he", "ar", "en"] as Lang[]).map((l) => (
            <button key={l} type="button" className="langBtn" aria-pressed={lang === l} onClick={() => changeLang(l)}>
              {langLabel(l)}
            </button>
          ))}
        </div>
      </header>

      {/* Hero — full-screen text over the animated background */}
      <div className="homeHero">
        <div className="homeHeroOverlay">
          <h1 className="homeHeroName">Kabakeh</h1>
          <p className="homeHeroTagline">{t.tagline}</p>
        </div>
      </div>

      {/* CTAs */}
      <div className="homeCtaRow">
        <a href="https://menu.kabakeh.com" className="homeCta homeCta--primary">
          <span className="homeCtaEmoji">🍽️</span>
          <span className="homeCtaLabel">{t.menuBtn}</span>
          <span className="homeCtaSub">{t.menuSub}</span>
        </a>
        <a href="https://feedback.kabakeh.com" className="homeCta homeCta--secondary">
          <span className="homeCtaEmoji">⭐</span>
          <span className="homeCtaLabel">{t.feedbackBtn}</span>
          <span className="homeCtaSub">{t.feedbackSub}</span>
        </a>
      </div>

      {/* About */}
      {aboutText[lang] && (
        <section className="homeSection">
          <h2 className="homeSectionTitle">{t.about}</h2>
          <p className="homeAboutText">{aboutText[lang]}</p>
        </section>
      )}

      {/* Opening hours */}
      {Object.keys(hours).length > 0 && (
        <section className="homeSection">
          <h2 className="homeSectionTitle">{t.hours}</h2>
          <div className="homeHoursGrid">
            {DAY_ORDER.map((day) => {
              const d = hours[day];
              const isToday = day === today;
              return (
                <div key={day} className={`homeHoursRow${isToday ? " homeHoursRow--today" : ""}`}>
                  <span className="homeHoursDay">
                    {isToday && <span className="homeHoursTodayDot" />}
                    {DAY_NAMES[lang][day]}
                  </span>
                  <span className="homeHoursTime">
                    {d?.closed ? t.closed : d ? `${d.open} – ${d.close}` : ""}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="homeEvents">
          <h2 className="homeEventsTitle">{t.events}</h2>
          <div className="homeEventsList">
            {events.map((ev) => {
              const title = (ev[`title_${lang}` as keyof Event] as string) || ev.title_he;
              const desc = ev[`description_${lang}` as keyof Event] as string | null;
              return (
                <div key={ev.id} className="homeEventCard">
                  {ev.image_url && (
                    <div className="homeEventImg">
                      <img src={ev.image_url} alt={title} loading="lazy" />
                    </div>
                  )}
                  <div className="homeEventCardInner">
                    <div className="homeEventDate">
                      <span className="homeEventDateDay">{new Date(ev.event_date + "T12:00:00").getDate()}</span>
                      <span className="homeEventDateMonth">
                        {new Date(ev.event_date + "T12:00:00").toLocaleDateString(lang === "he" ? "he-IL" : lang === "ar" ? "ar-SA" : "en-GB", { month: "short" })}
                      </span>
                    </div>
                    <div className="homeEventBody">
                      <div className="homeEventTitle">{title}</div>
                      {ev.event_time && <div className="homeEventTime">🕐 {ev.event_time}</div>}
                      {desc && <div className="homeEventDesc">{desc}</div>}
                    </div>
                  </div>
                </div>              );
            })}
          </div>
        </section>
      )}

      {/* Gallery */}
      {photos.length > 0 && (
        <section className="homeSection">
          <h2 className="homeSectionTitle">{t.gallery}</h2>
          <div className="homeGalleryGrid">
            {photos.map((p) => (
              <div key={p.id} className="homeGalleryItem">
                <img src={p.url} alt={(p[`caption_${lang}` as keyof Photo] as string) ?? ""} loading="lazy" />
                {(p[`caption_${lang}` as keyof Photo] as string) && (
                  <div className="homeGalleryCaption">{p[`caption_${lang}` as keyof Photo] as string}</div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Private events / inquiry form */}
      <section className="homeSection homeInquiry">
        <h2 className="homeSectionTitle">{t.privateEvents}</h2>
        <p className="homeAboutText" style={{ marginBottom: 20 }}>{t.privateEventsDesc}</p>

        {sent ? (
          <div className="homeInquirySent">{t.sentMsg}</div>
        ) : (
          <form onSubmit={submitInquiry} className="homeInquiryForm">
            <div className="homeInquiryGrid">
              <div>
                <label className="homeInquiryLabel">{t.nameLabel} *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label className="homeInquiryLabel">{t.contactLabel} *</label>
                <input required value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="054-0000000" style={inputStyle} />
                <div className="homeInquiryHint">{t.contactHint}</div>
              </div>
              <div>
                <label className="homeInquiryLabel">{t.eventTypeLabel}</label>
                <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="">—</option>
                  {EVENT_TYPES[lang].map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="homeInquiryLabel">{t.guestsLabel}</label>
                <input value={form.guests_count} onChange={(e) => setForm({ ...form, guests_count: e.target.value })} placeholder="50" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="homeInquiryLabel">{t.dateLabel}</label>
                <input value={form.preferred_date} onChange={(e) => setForm({ ...form, preferred_date: e.target.value })} placeholder="יולי 2026" style={inputStyle} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label className="homeInquiryLabel">{t.messageLabel}</label>
                <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
              </div>
            </div>
            {sendError && <div className="homeInquiryError">{sendError}</div>}
            <button type="submit" disabled={sending} className="homeInquiryBtn">
              {sending ? "..." : t.sendBtn}
            </button>
          </form>
        )}
      </section>

      {/* Contact */}
      <footer className="homeFooter">
        <div className="homeFooterTitle">{t.contact}</div>
        <div className="homeFooterGrid">
          <div className="homeFooterItem">
            <a href="tel:036888843">{t.phone}</a>
            <div className="homeFooterHint">03-688-8843</div>
          </div>
          <div className="homeFooterItem">
            <a href="https://share.google/W3EPb92inEZdMSJT6" target="_blank" rel="noreferrer">{t.location}</a>
            <div className="homeFooterHint">{t.locationHint}</div>
          </div>
          <div className="homeFooterItem">
            <a href="https://www.instagram.com/kabakehrest" target="_blank" rel="noreferrer">Instagram</a>
            <div className="homeFooterHint">@kabakehrest</div>
          </div>
        </div>
      </footer>
    </main>
    </>
  );
}
