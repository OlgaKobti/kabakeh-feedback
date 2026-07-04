"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { menuImageUrl, type Lang, type MenuCategory } from "@/data/menu";
import { detectLang, isRtl } from "@/lib/i18n";

function ItemImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      className="menuItemImg"
      onError={() => setFailed(true)}
    />
  );
}

const UI: Record<Lang, { title: string; search: string; currency: string; empty: string; tagline: string }> = {
  en: { title: "Menu", search: "Search…", currency: "₪", empty: "No items found.", tagline: "Authentic Arab cuisine" },
  he: { title: "תפריט", search: "חיפוש…", currency: "₪", empty: "לא נמצאו מנות.", tagline: "מסעדה ערבית אותנטית" },
  ar: { title: "قائمة الطعام", search: "بحث…", currency: "₪", empty: "لم يتم العثور على عناصر.", tagline: "مطعم عربي أصيل" },
};

function langLabel(l: Lang) {
  if (l === "en") return "EN";
  if (l === "he") return "עברית";
  return "العربية";
}

export default function MenuClient({ menu }: { menu: MenuCategory[] }) {
  const [lang, setLang] = useState<Lang>("he");

  useEffect(() => {
    const initial = detectLang() as Lang;
    if (initial === "en" || initial === "he" || initial === "ar") setLang(initial);
  }, []);

  const rtl = useMemo(() => isRtl(lang), [lang]);

  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // track which section is in view for active tab highlight
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(sectionRefs.current).forEach(([id, el]) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveCategory(id); },
        { rootMargin: "-30% 0px -60% 0px" }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menu]);

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
    if (!query) return menu;

    return menu
      .map((cat) => {
        const items = cat.items.filter((it) => {
          const n = it.name[lang]?.toLowerCase() ?? "";
          const d = (it.description?.[lang] ?? "").toLowerCase();
          return n.includes(query) || d.includes(query);
        });
        return { ...cat, items };
      })
      .filter((cat) => cat.items.length > 0);
  }, [q, lang, menu]);

  function scrollToCategory(id: string) {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 130;
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
        <img src="/atmos.jpg" alt="Kabakeh atmosphere" className="menuHeroImg" />
        <div className="menuHeroOverlay">
          <div className="menuHeroName">Kabakeh</div>
          <div className="menuHeroTagline">{UI[lang].tagline}</div>
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
        {menu.map((cat) => (
          <button key={cat.id} type="button"
            className={`menuTab${activeCategory === cat.id ? " active" : ""}`}
            onClick={() => scrollToCategory(cat.id)}>
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
                  <div key={it.id} className={`menuCard${img ? "" : " menuCard--noImage"}`}>
                    {img && <ItemImage src={img} alt={it.name[lang]} />}

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

      {/* Footer */}
      <div className="menuFooter">
        <div className="menuFooterTitle">
          {lang === "he" ? "צרו קשר" : lang === "ar" ? "تواصل معنا" : "Contact us"}
        </div>

        <div className="menuFooterGrid">
          <div className="menuFooterItem">
            <a href="tel:036888843">
              {lang === "he" ? "טלפון" : lang === "ar" ? "هاتف" : "Phone"}
            </a>
            <div className="menuFooterHint">03-688-8843</div>
          </div>

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

          <div className="menuFooterItem">
            <a href="https://share.google/W3EPb92inEZdMSJT6" target="_blank" rel="noreferrer">
              {lang === "he" ? "מיקום" : lang === "ar" ? "الموقع" : "Location"}
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
