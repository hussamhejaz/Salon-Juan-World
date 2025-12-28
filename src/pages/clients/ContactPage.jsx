import React from "react";
import { useTranslation } from "react-i18next";
import { useContactForm } from "../../hooks/useContactForm";

const BRAND = "#E39B34";
const BRAND_DARK = "#CF8A2B";
const BRAND_SOFT = "rgba(227,155,52,0.08)";
const BRAND_LIGHT = "rgba(227,155,52,0.04)";
const MAP_COORDINATES = "24.8493918,46.7895642";
const MAP_PLACE_URL =
  "https://www.google.com/maps/place/%D8%B5%D8%A7%D9%84%D9%88%D9%86%20%D8%AC%D9%88%D8%A7%D9%86%20%D9%88%D9%88%D8%B1%D9%84%D8%AF/@24.8493918,46.7895642,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2eff25d1a9c1e7:0x6c15372fe8e4bdc4!8m2!3d24.8493918!4d46.7895642!16s%2Fg%2F11ydxby5j8?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D";
const MAP_LINK_URL = MAP_PLACE_URL;
const MAP_EMBED_URL = `https://www.google.com/maps?output=embed&q=${encodeURIComponent(
  `صالون جوان وورلد ${MAP_COORDINATES}`
)}`;
const PHONE_NUMBER = "+966 55 784 0759";
const PHONE_LINK = "tel:+966557840759";
const WHATSAPP_LINK =
  "https://api.whatsapp.com/send/?phone=9660557840759&text&type=phone_number&app_absent=0";

const SOCIAL_LINKS = [
  {
    key: "ig",
    label: "Instagram",
    href: "https://www.instagram.com/joowan_world/?igsh=MWpxam5pYmFsNTVzZg%3D%3D&utm_source=qr",
  },
  {
    key: "tiktok",
    label: "TikTok",
    href: "https://www.tiktok.com/@joowan_world?_t=ZS-8xhb65tvT2P&_r=1",
  },
  {
    key: "email",
    label: "Email",
    href: "mailto:Jowannworldd@gmail.com",
  },
];

function SocialIcon({ id }) {
  const common = "h-4 w-4";
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
    default:
      return null;
  }
}

export default function ContactPage() {
  const { t } = useTranslation();
  const {
    form,
    handleChange,
    handleSubmit,
    resetForm,
    sending,
    sent,
    error,
  } = useContactForm();

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full animate-pulse bg-amber-500"></div>
            <span className="text-sm font-medium text-slate-600">
              {t("contact.badge", { defaultValue: "تواصل معنا" })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("contact.title", { defaultValue: "تواصل معنا" })}
          </h1>

          <div className="w-24 h-1.5 rounded-full mx-auto mb-6 bg-gradient-to-r from-amber-400 to-amber-700" />
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {t("contact.subtitle", {
              defaultValue: "اسألي عن المواعيد، الأسعار، العروض أو أي استفسار. فريقنا موجود لمساعدتك ",
            })}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Contact Information Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: BRAND }}></div>
              {t("contact.infoTitle", { defaultValue: "معلومات التواصل" })}
            </h2>

            <div className="space-y-6">
              {/* Location */}
              <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 transition-all duration-300 hover:bg-slate-50 group">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("contact.locationLabel", { defaultValue: "الموقع" })}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t("contact.locationValue", {
                    defaultValue:
                      "صالون جوان وورلد، الرياض، السعودية / Salon Juan World, Riyadh, Saudi Arabia",
                  })}
                </p>
              </div>

              {/* Phone / WhatsApp */}
              <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 transition-all duration-300 hover:bg-slate-50 group">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("contact.phoneLabel", { defaultValue: "الهاتف / واتساب" })}
                </h3>
                <p className="text-slate-600 mb-3">
                  <a
                    href={PHONE_LINK}
                    className="font-semibold text-slate-900 transition hover:text-slate-700"
                  >
                    {t("contact.phoneValue", { defaultValue: PHONE_NUMBER })}
                  </a>
                </p>
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:shadow-lg"
                  style={{ backgroundColor: "#25D366" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <path d="M5.5 20.5 6 17a7.5 7.5 0 1 1 3 3l-3.5.5Z" />
                    <path d="M8.5 13.5c.2.4.6 1 1.3 1.6s1.2 1 1.6 1.2" />
                    <path d="M8.5 13.5c-.4-.9-.1-1.7.5-2 .3-.2.6-.3.8 0l.5.8a1 1 0 0 0 .5.4l.7-.4c.4-.2.8 0 1 .4l.7 1.1c.2.4 0 .9-.3 1.1l-.4.3c-.5.2-1 .1-1.5-.1" />
                  </svg>
                  {t("contact.whatsappCTA", { defaultValue: "راسلنا على واتساب" })}
                </a>
              </div>

              {/* Social */}
              <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 transition-all duration-300 hover:bg-slate-50 group">
                <h3 className="font-semibold text-slate-900 mb-2">
                  {t("contact.socialLabel", { defaultValue: "وسائل التواصل" })}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  {t("contact.socialHint", { defaultValue: "تابعي أحدث الأخبار والعروض على حساباتنا:" })}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="
                        group inline-flex items-center gap-2
                        rounded-full border border-slate-200/80
                        bg-gradient-to-r from-slate-50 to-slate-100
                        px-4 py-2 text-xs font-semibold text-slate-800
                        shadow-sm hover:-translate-y-0.5 hover:shadow-md
                        transition-transform transition-shadow duration-200
                      "
                    >
                      <span
                        className="
                          flex items-center justify-center
                          h-7 w-7 rounded-full
                          bg-white text-slate-700
                          border border-slate-200
                          shadow-[0_4px_12px_rgba(0,0,0,0.06)]
                          group-hover:border-amber-300 group-hover:text-amber-600
                          transition-colors duration-200
                        "
                        aria-hidden="true"
                      >
                        <SocialIcon id={item.key} />
                      </span>
                      <span className="pr-1">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div className="rounded-2xl border border-slate-100 bg-white/90 p-4 transition-all duration-300 hover:bg-slate-50 group">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {t("contact.hoursLabel", { defaultValue: "ساعات العمل" })}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {t("contact.hoursValue", {
                    defaultValue: "يومياً 10 صباحًا - 11 مساءً",
                  })}
                </p>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900">
                {t("contact.mapLabel", { defaultValue: "الموقع على الخريطة" })}
              </h3>
              <div className="rounded-2xl border-2 border-slate-200 overflow-hidden aspect-video">
                <iframe
                  title={t("contact.mapLabel", { defaultValue: "موقعنا على الخريطة" })}
                  src={MAP_EMBED_URL}
                  loading="lazy"
                  className="w-full h-full block"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <p className="text-slate-500 text-sm">
                {t("contact.mapDescription", {
                  defaultValue: "Live view of our Riyadh location. Tap the link below to open it in Google Maps.",
                })}
              </p>
              <a
                href={MAP_LINK_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-amber-600 transition hover:text-amber-500"
              >
                {t("contact.mapLinkCTA", { defaultValue: "Open in Google Maps" })}
              </a>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: BRAND }}></div>
              {t("contact.formTitle", { defaultValue: "أرسلي رسالة" })}
            </h2>
            
            <p className="text-slate-600 mb-8 leading-relaxed">
              {t("contact.formSubtitle", {
                defaultValue: "اسألي عن أي خدمة وسنرد عليك بأقرب وقت.",
              })}
            </p>

            {sent ? (
              <div className="text-center py-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {t("contact.sentTitle", { defaultValue: "تم إرسال رسالتك بنجاح!" })}
                </h3>
                <p className="text-slate-600 mb-6">
                  {t("contact.sentMessage", {
                    defaultValue: "شكرًا لتواصلك معنا. سنرد عليك في أقرب وقت ممكن.",
                  })}
                </p>
                <button
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-2xl font-semibold px-6 py-3 transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundColor: BRAND,
                    color: 'white',
                  }}
                >
                  {t("contact.sendAnother", { defaultValue: "إرسال رسالة أخرى" })}
                </button>
              </div>
            ) : (
              <>
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <p className="font-semibold">
                      {t("contact.errorMessage", {
                        defaultValue: "تعذر إرسال الرسالة. يرجى المحاولة لاحقًا.",
                      })}
                    </p>
                    <p className="text-xs text-red-700/80">{error}</p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("contact.name", { defaultValue: "الاسم الكامل" })}
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                    placeholder={t("contact.namePlaceholder", { defaultValue: "أدخل اسمك الكامل" })}
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("contact.phone", { defaultValue: "رقم الجوال" })}
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+9665XXXXXXXX"
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t("contact.msg", { defaultValue: "رسالتك / سؤالك" })}
                  </label>
                  <textarea
                    name="msg"
                    rows={6}
                    value={form.msg}
                    onChange={handleChange}
                    required
                    className="w-full rounded-2xl border-2 border-slate-200 px-4 py-3 transition-all duration-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none resize-none"
                    placeholder={t("contact.msgPlaceholder", { defaultValue: "اكتبي رسالتك أو استفسارك هنا..." })}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={sending}
                    className="
                      w-full rounded-2xl px-6 py-4 font-bold text-lg
                      transition-all duration-300 hover:shadow-lg
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center justify-center gap-3
                    "
                    style={{
                      backgroundColor: sending ? '#cbd5e1' : BRAND,
                      color: 'white',
                    }}
                    onMouseEnter={(e) => !sending && (e.target.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => !sending && (e.target.style.transform = 'translateY(0)')}
                  >
                    {sending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {t("contact.sending", { defaultValue: "جاري الإرسال..." })}
                      </>
                    ) : (
                      t("contact.submit", { defaultValue: "إرسال الرسالة" })
                    )}
                  </button>
                </div>

                {/* Privacy Note */}
                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    {t("contact.privacyNote", {
                      defaultValue: "بياناتك محمية وسيتم استخدامها للرد على استفسارك فقط.",
                    })}
                  </p>
                </div>
              </form>
            </>
          )}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/30 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">{t("contact.support.title", { defaultValue: "دعم سريع" })}</h3>
                <p className="text-sm text-slate-600">{t("contact.support.desc", { defaultValue: "رد خلال 24 ساعة" })}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">{t("contact.availability.title", { defaultValue: "متاحين دائمًا" })}</h3>
                <p className="text-sm text-slate-600">{t("contact.availability.desc", { defaultValue: "طوال أيام الأسبوع" })}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">{t("contact.expertise.title", { defaultValue: "خبراء متخصصون" })}</h3>
                <p className="text-sm text-slate-600">{t("contact.expertise.desc", { defaultValue: "استشارات مجانية" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
