import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";

const LINKS = [
  { key: "nav.home",        to: "/" },
  { key: "nav.sections",    to: "/sections" },
  { key: "nav.prices",      to: "/prices" },
  { key: "nav.book",        to: "/booking" },
  { key: "nav.about",       to: "/about" },
  { key: "nav.contact",     to: "/contact" }
];

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLang = () => {
    const next = (i18n.resolvedLanguage || i18n.language || "en").startsWith("ar") ? "en" : "ar";
    i18n.changeLanguage(next);
  };

  return (
    <header
      className={[
        "sticky top-0 z-50 backdrop-blur-xl border-b transition-all",
        scrolled ? "bg-white/90 border-slate-200/60 shadow-sm" : "bg-transparent border-transparent"
      ].join(" ")}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt={t("brand.name")}
              className="h-10 w-10 rounded-full bg-white/80 p-1 shadow-sm ring-1 ring-amber-100 object-contain"
              loading="lazy"
            />
            <span className="text-lg font-semibold tracking-tight text-slate-900">
              {t("brand.name")}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((item) => (
              item.to ? (
                <Link
                  key={item.key}
                  to={item.to}
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-full hover:bg-amber-50 transition"
                >
                  {t(item.key)}
                  <span className="pointer-events-none absolute left-3 right-3 -bottom-1 h-[2px] scale-x-0 group-hover:scale-x-100 origin-center bg-amber-500 transition-transform"></span>
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  className="group relative px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 rounded-full hover:bg-amber-50 transition"
                >
                  {t(item.key)}
                  <span className="pointer-events-none absolute left-3 right-3 -bottom-1 h-[2px] scale-x-0 group-hover:scale-x-100 origin-center bg-amber-500 transition-transform"></span>
                </a>
              )
            ))}
          </div>

          {/* CTA + Language + Mobile toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="hidden md:inline-flex rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700 hover:bg-amber-50 transition"
              title={(i18n.resolvedLanguage || "en").startsWith("ar") ? "Switch to English" : "التبديل إلى العربية"}
            >
              {(i18n.resolvedLanguage || "en").startsWith("ar") ? "EN" : "AR"}
            </button>

            <Link
              to="/booking"
              className="hidden md:inline-flex items-center gap-2 rounded-full bg-amber-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 transition"
            >
              {t("cta.bookNow")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              aria-controls="mobile-menu"
              aria-expanded={open}
              className="md:hidden rounded-lg p-2 text-slate-700 hover:bg-amber-50 transition"
              aria-label="Open menu"
            >
              {open ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ${
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur p-2 shadow-sm">
            <button
              onClick={() => { toggleLang(); setOpen(false); }}
              className="block w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-amber-50 transition text-left"
            >
              {(i18n.resolvedLanguage || "en").startsWith("ar") ? "EN" : "AR"}
            </button>

            {LINKS.map((item) => (
              item.to ? (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-amber-50 transition"
                >
                  {t(item.key)}
                </Link>
              ) : (
                <a
                  key={item.key}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-slate-800 hover:bg-amber-50 transition"
                >
                  {t(item.key)}
                </a>
              )
            ))}
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="mt-2 block text-center rounded-xl bg-amber-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:shadow transition"
            >
              {t("cta.bookNow")}
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
