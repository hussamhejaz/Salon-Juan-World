import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom"; // ⬅️ add this

const socials = [
  { name: "Instagram", href: "https://www.instagram.com/joowan_world/?igsh=MWpxam5pYmFsNTVzZg%3D%3D&utm_source=qr", key: "ig" },
  { name: "TikTok", href: "https://www.tiktok.com/@joowan_world?_t=ZS-8xhb65tvT2P&_r=1", key: "tiktok" },
  { name: "Email", href: "mailto:Jowannworldd@gmail.com", key: "email" },
  { name: "Call", href: "tel:+966557840759", key: "phone" },
];

function SocialIcon({ id }) {
  const common = "h-5 w-5";
  switch (id) {
    case "ig":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 4.5A5.5 5.5 0 1 1 6.5 14 5.5 5.5 0 0 1 12 8.5zm0 2A3.5 3.5 0 1 0 15.5 14 3.5 3.5 0 0 0 12 10.5zM18 6.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1z"/>
        </svg>
      );
    case "tiktok":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M15 3c.3 1.4 1.4 3.5 3.6 3.8v2.6c-1.4-.1-2.6-.7-3.6-1.5v5.7a5.5 5.5 0 1 1-4.8-5.5v2.8c-.5-.4-1.2-.6-1.9-.4a2.1 2.1 0 0 0-1.3 2.6 2.1 2.1 0 0 0 2.7 1.3c.7-.2 1.2-.9 1.2-1.7V3h3.1Z" />
        </svg>
      );
    case "email":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm0 2v.2l8 4.8 8-4.8V6H4Zm16 2.7-7.5 4.5a1 1 0 0 1-1 0L4 8.7V18h16V8.7Z" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor" aria-hidden="true">
          <path d="M6.6 2h2.3c.6 0 1 .4 1 1v3.1c0 .5-.4.9-.9 1l-.7.1a.5.5 0 0 0-.4.6 8.3 8.3 0 0 0 4.7 4.7.5.5 0 0 0 .6-.4l.1-.7c.1-.5.5-.9 1-.9H17c.6 0 1 .4 1 1v2.3c0 .9-.7 1.6-1.6 1.6h-.3c-6 0-10.8-4.8-10.8-10.8v-.3C5 2.7 5.7 2 6.6 2Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-12 bg-slate-950 text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* brand */}
        <div className="text-center">
          <div className="text-xl font-extrabold tracking-tight">
            {t("brand.name")}
          </div>

          <div className="mx-auto mt-2 h-px w-16 bg-gradient-to-r from-amber-500/80 to-rose-500/80 rounded" />

          <p className="mt-3 text-xs text-slate-400">
            &copy; {year} {t("brand.name")} — {t("footer.rights") || "All rights reserved."}
          </p>
        </div>

        {/* socials */}
        <ul className="mt-8 flex items-center justify-center gap-3">
          {socials.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="group inline-flex items-center justify-center rounded-full p-2.5
                           bg-slate-900/60 ring-1 ring-white/5
                           hover:bg-white hover:text-slate-900
                           transition-all duration-200
                           shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <SocialIcon id={s.key} />
                <span className="sr-only">{s.name}</span>
              </a>
            </li>
          ))}
        </ul>

        {/* quick internal links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <Link
            to="/about"
            className="hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            {t("nav.about")}
          </Link>

          <span className="opacity-30">•</span>

          <Link
            to="/contact"
            className="hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            {t("nav.contact")}
          </Link>

          <span className="opacity-30">•</span>

          <Link
            to="/booking"
            className="hover:text-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            {t("nav.book")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
