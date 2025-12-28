// src/pages/Compliments.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ReviewsSection from "../../components/reviews/ReviewsSection"; // <-- update path if needed
import { API_BASE } from "../../config/api";
import { usePublicReviews } from "../../hooks/usePublicReviews";

const BRAND = "#E39B34";
const BRAND_DARK = "#CF8A2B";
const BRAND_SOFT = "rgba(227,155,52,0.12)";

const INITIAL_FORM_STATE = {
  name: "",
  phone: "",
  rating: 5,
  message: "",
  consent: true,
};

function Stars({ value, onChange }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-1" aria-label={t("compliment.ratingAria")}>
      {[1,2,3,4,5].map((n) => (
        <button
          key={n}
          type="button"
          className="p-1"
          onClick={() => onChange?.(n)}
          title={`${n} / 5`}
          style={{ lineHeight: 0 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24"
               fill={n <= value ? BRAND : "none"}
               stroke={n <= value ? BRAND : "#cbd5e1"} strokeWidth="1.5">
            <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Compliments({ salonId }) {
  const { t, i18n } = useTranslation();
  const {
    reviews,
    loading: reviewsLoading,
    error: reviewsError,
    meta,
    features,
    refresh: refreshReviews,
  } = usePublicReviews(salonId);


  // keep proper direction in case user toggles language
  useEffect(() => {
    const lang = (i18n.resolvedLanguage || i18n.language || "ar").toLowerCase();
    document.documentElement.dir = lang.startsWith("ar") ? "rtl" : "ltr";
  }, [i18n.language, i18n.resolvedLanguage]);

  const [form, setForm] = useState(() => ({ ...INITIAL_FORM_STATE }));
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") setForm((f) => ({ ...f, [name]: checked }));
    else setForm((f) => ({ ...f, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!salonId) {
      setSubmissionError("Salon ID is missing.");
      return;
    }

    setSending(true);
    setSubmissionError("");

    try {
      const response = await fetch(`${API_BASE}/api/public/${salonId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          rating: form.rating,
          message: form.message.trim(),
          consent: form.consent,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok) {
        throw new Error(payload.details || payload.error || "Failed to send compliment.");
      }

      setSent(true);
      setForm({ ...INITIAL_FORM_STATE });
      await refreshReviews();
    } catch (err) {
      setSubmissionError(err?.message || "Failed to send compliment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      className="pt-28 pb-16 px-4 sm:pt-32 md:pt-36 bg-gradient-to-b to-white"
      style={{ backgroundImage: `linear-gradient(180deg, ${BRAND_SOFT}, transparent)` }}
    >
      <div className="max-w-6xl mx-auto">
        {/* ====== Title (no circular badge) ====== */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            {t("compliment.title", { defaultValue: "إطراء / شكراً لك" })}
          </h1>
          <div className="mx-auto mt-3 h-1 w-24 rounded" style={{ backgroundColor: BRAND, opacity: .4 }} />
          <p className="mt-3 text-slate-600">
            {t("compliment.subtitle", { defaultValue: "يسعدنا سماع تجاربك الجميلة واقتراحاتك لتطوير خدماتنا." })}
          </p>
        </div>

        {/* ====== Form Card ====== */}
        <div
          className="mt-8 mx-auto max-w-3xl rounded-2xl bg-white/95 backdrop-blur p-6 sm:p-8 md:p-10 shadow-2xl border"
          style={{ borderColor: BRAND_SOFT }}
        >
          {sent ? (
            <div className="rounded-2xl p-5 text-center"
                 style={{ backgroundColor: BRAND_SOFT, color: "#4b3a21" }}>
              {t("compliment.sent", { defaultValue: "شكرًا لك! تم استلام رسالتك وسنتواصل عند الحاجة." })}
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Rating */}
              <div>
                <label className="mb-2 block text-slate-700 font-medium">{t("compliment.rating")}</label>
                <Stars value={form.rating} onChange={(n) => setForm((f) => ({ ...f, rating: n }))} />
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-slate-700 font-medium">{t("compliment.name")}</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border bg-white/95 px-4 py-3 outline-none transition"
                  style={{ borderColor: BRAND_SOFT }}
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-slate-700 font-medium">{t("compliment.phone")}</label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+9665XXXXXXX"
                  value={form.phone}
                  onChange={onChange}
                  required
                  className="w-full rounded-xl border bg-white/95 px-4 py-3 outline-none transition"
                  style={{ borderColor: BRAND_SOFT }}
                />
                <div className="mt-1 text-xs text-slate-500">
                  {t("compliment.phoneNote", { defaultValue: "نستخدمه للمتابعة عند الحاجة فقط." })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-2 block text-slate-700 font-medium">{t("compliment.message")}</label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={form.message}
                  onChange={onChange}
                  className="w-full rounded-xl border bg-white/95 px-4 py-3 outline-none transition"
                  style={{ borderColor: BRAND_SOFT }}
                />
              </div>

              {/* Consent */}
              <label className="mt-2 flex items-start gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  name="consent"
                  checked={form.consent}
                  onChange={onChange}
                  className="mt-1"
                />
                <span>{t("compliment.consent", { defaultValue: "أوافق على استخدام تعليقي بشكل مجهول في التقييمات." })}</span>
              </label>

              {submissionError && (
                <div className="text-sm text-rose-500">{submissionError}</div>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full rounded-xl px-5 py-3 font-semibold text-white shadow-sm transition hover:shadow disabled:opacity-60"
                  style={{ backgroundColor: BRAND }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND_DARK)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND)}
                >
                  {sending ? t("compliment.sending", { defaultValue: "جارٍ الإرسال…" }) : t("compliment.submit", { defaultValue: "إرسال الإطراء" })}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ====== Reviews Section (below form) ====== */}
        <div className="mt-10">
          <ReviewsSection
            reviews={reviews}
            loading={reviewsLoading}
            error={reviewsError}
            meta={meta}
            features={features}
            onRefresh={refreshReviews}
          />
        </div>
      </div>
    </section>
  );
}
