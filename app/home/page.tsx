"use client";

import { useEffect, useState } from "react";
import { detectLang, isRtl } from "@/lib/i18n";

type Lang = "he" | "ar" | "en";

type Event = {
  id: string;
  title_he: string;
  title_ar: string;
  title_en: string;
  description_he: string | null;
  description_ar: string | null;
  description_en: string | null;
  event_date: string;
  event_time: string | null;
};

const COPY: Record<
  Lang,
  {
    tagline: string;
    menuBtn: string;
    menuSub: string;
    feedbackBtn: string;
    feedbackSub: string;
    events: string;
    contact: string;
    phone: string;
    location: string;
    locationHint: string;
  }
> = {
  he: {
    tagline: "מסעדה ערבית אותנטית",
    menuBtn: "לתפריט",
    menuSub: "צפו במנות ומשקאות",
    feedbackBtn: "השאירו פידבק",
    feedbackSub: "ספרו לנו איך היה",
    events: "אירועים קרובים",
    contact: "צרו קשר",
    phone: "טלפון",
    location: "מיקום",
    locationHint: "כיכר קדומים 6, תל אביב-יפו",
  },
  ar: {
    tagline: "مطعم عربي أصيل",
    menuBtn: "قائمة الطعام",
    menuSub: "تصفح الأطباق والمشروبات",
    feedbackBtn: "اترك تقييم",
    feedbackSub: "أخبرنا كيف كانت تجربتك",
    events: "الفعاليات القادمة",
    contact: "تواصل معنا",
    phone: "هاتف",
    location: "الموقع",
    locationHint: "كيكار كدوميم 6، تل أبيب-يافا",
  },
  en: {
    tagline: "Authentic Arab cuisine",
    menuBtn: "View menu",
    menuSub: "Browse dishes and drinks",
    feedbackBtn: "Leave feedback",
    feedbackSub: "Tell us how it was",
    events: "Upcoming events",
    contact: "Contact us",
    phone: "Phone",
    location: "Location",
    locationHint: "Kikar Kdumim 6, Tel Aviv-Yafo",
  },
};

function langLabel(l: Lang) {
  if (l === "en") return "EN";
  if (l === "he") return "עברית";
  return "العربية";
}

function formatDate(dateStr: string, lang: Lang) {
  const date = new Date(dateStr + "T12:00:00");
  const locale = lang === "he" ? "he-IL" : lang === "ar" ? "ar-SA" : "en-GB";
  return date.toLocaleDateString(locale, { weekday: "long", day: "numeric", month: "long" });
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("he");
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const initial = detectLang() as Lang;
    if (initial === "en" || initial === "he" || initial === "ar") setLang(initial);
  }, []);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []))
      .catch(() => {});
  }, []);

  const rtl = isRtl(lang);
  const t = COPY[lang];

  function changeLang(next: Lang) {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kabakeh_lang", next);
    }
  }

  return (
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
            <button
              key={l}
              type="button"
              className="langBtn"
              aria-pressed={lang === l}
              onClick={() => changeLang(l)}
            >
              {langLabel(l)}
            </button>
          ))}
        </div>
      </header>

      {/* Hero */}
      <div className="homeHero">
        <img src="/atmos.jpg" alt="Kabakeh restaurant" className="homeHeroImg" />
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

      {/* Events */}
      {events.length > 0 && (
        <section className="homeEvents">
          <h2 className="homeEventsTitle">{t.events}</h2>
          <div className="homeEventsList">
            {events.map((ev) => {
              const title = ev[`title_${lang}`] || ev.title_he;
              const desc = ev[`description_${lang}` as keyof Event] as string | null;
              return (
                <div key={ev.id} className="homeEventCard">
                  <div className="homeEventDate">
                    <span className="homeEventDateDay">
                      {new Date(ev.event_date + "T12:00:00").getDate()}
                    </span>
                    <span className="homeEventDateMonth">
                      {new Date(ev.event_date + "T12:00:00").toLocaleDateString(
                        lang === "he" ? "he-IL" : lang === "ar" ? "ar-SA" : "en-GB",
                        { month: "short" }
                      )}
                    </span>
                  </div>
                  <div className="homeEventBody">
                    <div className="homeEventTitle">{title}</div>
                    {ev.event_time && (
                      <div className="homeEventTime">🕐 {ev.event_time}</div>
                    )}
                    {desc && <div className="homeEventDesc">{desc}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Contact */}
      <footer className="homeFooter">
        <div className="homeFooterTitle">{t.contact}</div>
        <div className="homeFooterGrid">
          <div className="homeFooterItem">
            <a href="tel:036888843">{t.phone}</a>
            <div className="homeFooterHint">03-688-8843</div>
          </div>
          <div className="homeFooterItem">
            <a href="https://share.google/W3EPb92inEZdMSJT6" target="_blank" rel="noreferrer">
              {t.location}
            </a>
            <div className="homeFooterHint">{t.locationHint}</div>
          </div>
          <div className="homeFooterItem">
            <a
              href="https://www.instagram.com/kabakehrest"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <div className="homeFooterHint">@kabakehrest</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
