"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MENU, menuImageUrl, type Lang, type MenuCategory } from "@/data/menu";
import { detectLang, isRtl } from "@/lib/i18n";

const UI: Record<Lang, { title: string; search: string; currency: string; empty: string }> = {
  en: { title: "Menu", search: "Search…", currency: "₪", empty: "No items found." },
  he: { title: "תפריט", search: "חיפוש…", currency: "₪", empty: "לא נמצאו מנות." },
  ar: { title: "قائمة الطعام", search: "بحث…", currency: "₪", empty: "لم يتم العثور على عناصر." },
};

function langLabel(l: Lang) {
  if (l === "en") return "EN";
  if (l === "he") return "עברית";
  return "العربية";
}

export default function MenuPage() {
  // ✅ Default language should be Hebrew
  const [lang, setLang] = useState<Lang>("he");

  // ✅ Set language ONCE from stored preference / url (detectLang already handles that)
  useEffect(() => {
    const initial = detectLang() as Lang;
    if (initial === "en" || initial === "he" || initial === "ar") setLang(initial);
  }, []);

  const rtl = useMemo(() => isRtl(lang), [lang]);

  const [q, setQ] = useState("");

  // section refs for scroll-to-category
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  function changeLang(next: Lang) {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("kabakeh_lang", next);
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState({}, "", url.toString());
    }
  }

  const filteredMenu: MenuCategory[] = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return MENU;

    return MENU.map((cat) => {
      const items = cat.items.filter((it) => {
        const n = it.name[lang]?.toLowerCase() ?? "";
        const d = (it.description?.[lang] ?? "").toLowerCase();
        return n.includes(query) || d.includes(query);
      });
      return { ...cat, items };
    }).filter((cat) => cat.items.length > 0);
  }, [q, lang]);

  function scrollToCategory(id: string) {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90; // sticky offset
    window.scrollTo({ top: y, behavior: "smooth" });
  }

  return (
    <main className="menuWrap" dir={rtl ? "rtl" : "ltr"}>
      {/* Top bar */}
      <div className="menuTop">
        <div className="menuTopLeft">
          <div className="menuLogoCircle">
            <img src="/logo.jpg" alt="Kabakeh logo" className="menuLogoImg" draggable={false} />
          </div>
          <div>
            <div className="menuBrand">Kabakeh</div>
            <div className="menuTitle">{UI[lang].title}</div>
          </div>
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
      </div>

      <div className="menuHero">
        <img src="/banner2.jpg" alt="Kabakeh atmosphere" className="menuHeroImg" />
      </div>

      {/* Search */}
      <div className="menuSearchRow">
        <input
          className="menuSearch"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={UI[lang].search}
        />
      </div>

      {/* Category tabs */}
      <div className="menuTabs">
        {MENU.map((cat) => (
          <button key={cat.id} type="button" className="menuTab" onClick={() => scrollToCategory(cat.id)}>
            {cat.title[lang]}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="menuContent">
        {filteredMenu.map((cat) => (
          <section
            key={cat.id}
            ref={(el) => {
              sectionRefs.current[cat.id] = el;
            }}
            className="menuSection"
          >
            <h2 className="menuSectionTitle">{cat.title[lang]}</h2>

            <div className="menuGrid">
              {cat.items.map((it) => {
                const img = menuImageUrl(it.image);
                const desc = (it.description?.[lang] ?? "").trim();

                return (
                  <div key={it.id} className="menuCard">
                    {img ? (
                      <img
                        src={img}
                        alt={it.name[lang]}
                        className="menuItemImg"
                        onError={(e) => {
                          // hide broken images
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="menuItemImgPlaceholder" />
                    )}

                    <div className="menuCardBody">
                      <div className="menuRow">
                        <div className="menuItemName">{it.name[lang]}</div>
                        {typeof it.price === "number" && (
                          <div className="menuPrice">
                            {it.price}
                            {UI[lang].currency}
                          </div>
                        )}
                      </div>

                      {desc.length > 0 && <div className="menuDesc">{desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {filteredMenu.length === 0 && <div className="menuEmpty">{UI[lang].empty}</div>}
      </div>
      {/* ===== Footer / Contact Section ===== */}
<div className="menuFooter">
  <div className="menuFooterTitle">
    {lang === "he"
      ? "צרו קשר"
      : lang === "ar"
      ? "تواصل معنا"
      : "Contact us"}
  </div>

  <div className="menuFooterGrid">
    {/* Phone */}
    <div className="menuFooterItem">
      <a href="tel:036888843">
        {lang === "he"
          ? "טלפון"
          : lang === "ar"
          ? "هاتف"
          : "Phone"}
      </a>
      <div className="menuFooterHint">03-688-8843</div>
    </div>

    {/* Instagram */}
    <div className="menuFooterItem">
      <a
        href="https://www.instagram.com/kabakehrest?igsh=emdjbHY3YmswZTB1"
        target="_blank"
        rel="noreferrer"
      >
        Instagram
      </a>
      <div className="menuFooterHint">@kabakehrest</div>
    </div>

    {/* Location */}
    <div className="menuFooterItem">
      <a
        href="https://share.google/W3EPb92inEZdMSJT6"
        target="_blank"
        rel="noreferrer"
      >
        {lang === "he"
          ? "מיקום"
          : lang === "ar"
          ? "الموقع"
          : "Location"}
      </a>
      <div className="menuFooterHint">
        {lang === "he"
          ? "כיכר קדומים 6, תל אביב-יפו"
          : lang === "ar"
          ? "كيكار كدوميم 6، تل أبيب-يافا"
          : "Kikar Kdumim 6, Tel Aviv-Yafo"}
      </div>
    </div>
  </div>
</div>
    </main>
  );
}