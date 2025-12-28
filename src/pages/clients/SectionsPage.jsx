import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { usePublicSections } from "../../hooks/usePublicSections";

const hexToRgb = (hexColor) => {
  if (!hexColor) {
    return null;
  }
  const normalized = hexColor.replace("#", "");
  if (![3, 6].includes(normalized.length)) {
    return null;
  }

  const parseChunk = (chunk) => parseInt(chunk, 16);
  if (normalized.length === 3) {
    const [r, g, b] = normalized.split("");
    return {
      r: parseChunk(r + r),
      g: parseChunk(g + g),
      b: parseChunk(b + b),
    };
  }

  return {
    r: parseChunk(normalized.slice(0, 2)),
    g: parseChunk(normalized.slice(2, 4)),
    b: parseChunk(normalized.slice(4, 6)),
  };
};

function SectionCard({ section, brandColor,  onViewDetails }) {
  const accentRgb = hexToRgb(brandColor || "#E39B34");
  const accentGlow = accentRgb
    ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.12)`
    : "rgba(227,154,52,0.12)";
  const accentStripe = accentRgb
    ? `rgba(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}, 0.6)`
    : "rgba(227,154,52,0.6)";

  const handleHover = (event, entering) => {
    const element = event.currentTarget;
    if (!element) return;
    if (entering) {
      element.style.backgroundColor = "white";
      element.style.color = brandColor;
    } else {
      element.style.backgroundColor = brandColor;
      element.style.color = "white";
    }
  };

 

  return (
    <article className="group relative flex min-h-full flex-col overflow-hidden rounded-[32px] border border-slate-100 bg-white/95 shadow-[0_25px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:border-slate-200 hover:shadow-2xl">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${accentGlow}, transparent 55%)`,
        }}
      />
      <div className="relative flex h-full flex-col gap-6 p-8">
        <div className="flex items-center justify-between gap-3">
          <span className="text-[11px] font-semibold uppercase tracking-[0.5em] text-slate-500">
            {section.subtitle || "القسم"}
          </span>
          <span className="h-1.5 w-16 rounded-full" style={{ backgroundColor: accentStripe }} />
        </div>

        <div className="flex-1">
          <p className="text-2xl font-bold text-slate-900 leading-tight">{section.name}</p>
          {section.subtitle && (
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{section.subtitle}</p>
          )}
        </div>

        <div className="mt-4 flex items-end justify-end">
          <button
            type="button"
            onClick={() => onViewDetails(section.id)}
            className="group/btn relative inline-flex items-center justify-center rounded-2xl border-2 px-6 py-3 text-sm font-semibold transition duration-300"
            style={{
              borderColor: brandColor,
              backgroundColor: brandColor,
              color: "white",
            }}
            onMouseEnter={(event) => handleHover(event, true)}
            onMouseLeave={(event) => handleHover(event, false)}
          >
            <span className="relative z-10">عرض التفاصيل</span>
            <span className="relative ml-2 text-lg transition-transform duration-300 group-hover/btn:translate-x-1">
              &rarr;
            </span>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 transition duration-300 group-hover/btn:opacity-100" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function SectionsPage({ salonId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { salonData, sections, loading, error } = usePublicSections(salonId);

  const brandColor = salonData?.brand_color || "#E39B34";
  const cardFallbackDescription = t("sectionsPage.cardDescription", {
    defaultValue: "اكتشفي ما يميز هذا القسم واختر ما يناسبك من خبراتنا المتميزة.",
  });

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center py-20">
          <div
            className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4"
            style={{
              borderTopColor: brandColor,
              borderRightColor: "transparent",
              borderBottomColor: "transparent",
              borderLeftColor: "transparent",
            }}
          />
          <h3 className="text-xl font-bold text-gray-700 mb-2">جاري تحميل الأقسام</h3>
          <p className="text-gray-500">نستعد لعرض أفضل الأقسام والخدمات</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">عذراً، حدث خطأ</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-xl px-6 py-3 font-bold text-white hover:shadow-lg transition-all"
              style={{ backgroundColor: brandColor }}
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border shadow-sm mb-6">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: brandColor }}
            />
            <span className="text-sm font-medium text-slate-600">
              {t("sectionsPage.badge", { defaultValue: "خدمات متخصصة" })}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {salonData?.name || t("sectionsPage.title", { defaultValue: "خدماتنا" })}
            <span className="block text-2xl md:text-3xl font-semibold mt-2 text-slate-600">
              {t("sectionsPage.subtitle", { defaultValue: "Our Services" })}
            </span>
          </h1>
          <div
            className="w-24 h-1.5 rounded-full mx-auto mb-6"
            style={{ backgroundColor: brandColor, opacity: 0.6 }}
          />
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t("sectionsPage.description", {
              defaultValue:
                "اكتشفي مجموعة خدماتنا الشاملة والمتخصصة، مصممة خصيصًا لتلبية جميع احتياجات جمالك وأناقتك.",
            })}
          </p>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد أقسام</h3>
            <p className="text-gray-500 mb-6">لا توجد أقسام متاحة حالياً</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                brandColor={brandColor}
                fallbackDescription={cardFallbackDescription}
                onViewDetails={(sectionId) => navigate(`/sections/${sectionId}`)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              {t("sectionsPage.cta.title", { defaultValue: "هل تحتاجين إلى مساعدة في الاختيار؟" })}
            </h3>
            <p className="text-slate-600 mb-6">
              {t("sectionsPage.cta.description", {
                defaultValue:
                  "فريقنا من الخبراء جاهز لمساعدتك في اختيار الخدمة المناسبة لاحتياجاتك.",
              })}
            </p>
            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center justify-center rounded-xl font-semibold text-sm px-8 py-3 transition-all duration-300 border-2 hover:shadow-lg"
              style={{
                borderColor: brandColor,
                backgroundColor: "white",
                color: brandColor,
              }}
              onMouseEnter={(event) => {
                const btn = event.currentTarget;
                btn.style.backgroundColor = brandColor;
                btn.style.color = "white";
              }}
              onMouseLeave={(event) => {
                const btn = event.currentTarget;
                btn.style.backgroundColor = "white";
                btn.style.color = brandColor;
              }}
            >
              {t("sectionsPage.cta.button", { defaultValue: "تواصلي معنا" })}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
