import en from "@/locales/en.json";
import he from "@/locales/he.json";
import ar from "@/locales/ar.json";

export type Lang = "en" | "he" | "ar";

const DICTS: Record<Lang, Record<string, string>> = {
  en,
  he,
  ar,
};

export function isRtl(lang: Lang) {
  return lang === "he" || lang === "ar";
}

// Choose language by:
// 1) query param ?lang=he/ar/en
// 2) localStorage (if user chose before)
// 3) browser language
export function detectLang(): Lang {
  if (typeof window === "undefined") return "en";

  const url = new URL(window.location.href);
  const fromQuery = url.searchParams.get("lang");
  if (fromQuery === "en" || fromQuery === "he" || fromQuery === "ar") return fromQuery;

  const saved = window.localStorage.getItem("kabakeh_lang");
  if (saved === "en" || saved === "he" || saved === "ar") return saved;

  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("he") || nav.includes("iw")) return "he";
  if (nav.startsWith("ar")) return "ar";

  return "en";
}

export function t(lang: Lang, key: string): string {
  return DICTS[lang]?.[key] ?? DICTS.en?.[key] ?? key;
}
