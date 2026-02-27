"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MENU, type Lang, type MenuCategory } from "@/data/menu";
import { detectLang, isRtl } from "@/lib/i18n";

const UI: Record<Lang, { title: string; search: string; currency: string }> = {
  en: { title: "Menu", search: "Search…", currency: "₪" },
  he: { title: "תפריט", search: "חיפוש…", currency: "₪" },
  ar: { title: "قائمة الطعام", search: "بحث…", currency: "₪" },
};

function langLabel(l: Lang) {
  if (l === "en") return "EN";
  if (l === "he") return "עברית";
  return "العربية";
}

export default function MenuPage() {
  // Start with Hebrew by default
const [lang, setLang] = useState<Lang>("he");

// Then attempt to detect stored or user preference
useEffect(() => {
  const initial = detectLang();
  if (initial === "he" || initial === "ar") {
    setLang(initial);
  }
}, []);
  const rtl = useMemo(() => isRtl(lang), [lang]);

  const [q, setQ] = useState("");

  // section refs for scroll-to-category
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setLang(detectLang() as Lang);
  }, []);

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
        const d = it.description?.[lang]?.toLowerCase() ?? "";
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
            <img
              src="/logo.jpg"
              alt="Kabakeh logo"
              className="menuLogoImg"
              draggable={false}
            />
          </div>
          <div>
            <div className="menuBrand">Kabakeh</div>
            <div className="menuTitle">{UI[lang].title}</div>
          </div>
        </div>

        <div className="menuLang">
          {(["en", "he", "ar"] as Lang[]).map((l) => (
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
          <button
            key={cat.id}
            type="button"
            className="menuTab"
            onClick={() => scrollToCategory(cat.id)}
          >
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
              {cat.items.map((it) => (
                <div key={it.id} className="menuCard">
                  {/* Image placeholder (we’ll enable later) */}
                  {it.image ? (
                    <img
                    src={it.image}
                    alt={it.name[lang]}
                    className="menuItemImg"
                    onError={(e) => {
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

                    {it.description?.[lang] && (
                      <div className="menuDesc">{it.description[lang]}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredMenu.length === 0 && (
          <div className="menuEmpty">No items found.</div>
        )}
      </div>
    </main>
  );
}