import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// URL helpers
const BUTTON_KEYS = [
  "book",
  "prices",
  "offers",
  "homeServices",
  "workingHours",
  "reviews",
  "sections",
];

const KEY_TO_LABEL = {
  book: "nav.book",
  prices: "nav.prices",
  offers: "nav.offers",
  homeServices: "nav.homeServices",
  workingHours: "nav.hours",
  reviews: "nav.reviews",
  sections: "nav.sections",
};

// child paths relative to "/"
const ROUTES = {
  book: "booking",
  prices: "prices",
  offers: "offers",
  homeServices: "home-services",
  workingHours: "hours",
  reviews: "reviews",
  sections: "sections",
};

const GOOGLE_MAPS_SEARCH_BASE = "https://www.google.com/maps/search/?api=1&query=";
const DEFAULT_LOCATION =
  "صالون جوان وورلد، الرياض، السعودية / Salon Juan World, Riyadh, Saudi Arabia";

const BRAND = "#E39B34";
const BRAND_DARK = "#CF8A2B";
const BRAND_SOFT = "rgba(227,155,52,0.12)";
const BRAND_LIGHT = "rgba(227,155,52,0.06)";

export default function MainSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const locationText = t("home.location", { defaultValue: DEFAULT_LOCATION });
  const locationUrl = t("home.locationUrl", {
    defaultValue:
      "https://www.google.com/maps/place/%D8%B5%D8%A7%D9%84%D9%88%D9%86%20%D8%AC%D9%88%D8%A7%D9%86%20%D9%88%D9%88%D8%B1%D9%84%D8%AF/@24.8493918,46.7895642,17z/data=!3m1!4b1!4m6!3m5!1s0x3e2eff25d1a9c1e7:0x6c15372fe8e4bdc4!8m2!3d24.8493918!4d46.7895642!16s%2Fg%2F11ydxby5j8?entry=ttu&g_ep=EgoyMDI1MTIwOS4wIKXMDSoASAFQAw%3D%3D",
  });
  const locationLabel = t("contact.mapLabel", { defaultValue: "Map location" });

  function handleClick(key) {
    const path = ROUTES[key];
    if (path) {
      navigate(path);
    }
  }

  function handleLocationClick() {
    if (typeof window === "undefined") {
      return;
    }

    const url =
      locationUrl ||
      (locationText && `${GOOGLE_MAPS_SEARCH_BASE}${encodeURIComponent(locationText)}`);

    if (!url) {
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section
      id="home"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-100/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Main Content */}
        <div className="text-center relative z-10">
          {/* Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-sm mb-8">
            <div className="w-2 h-2 rounded-full animate-pulse bg-amber-500"></div>
            <span className="text-sm font-medium text-slate-600">
              {t("home.welcome", { defaultValue: "مرحباً بكم في صالوننا" })}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6">
            {t("brand.name", { defaultValue: "صالون الجمال" })}
            <span className="block text-xl md:text-2xl lg:text-3xl font-light text-slate-600 mt-4">
              {t("brand.tagline", { defaultValue: "جمالك هو أولويتنا" })}
            </span>
          </h1>

          {/* Location with enhanced styling */}
          <div className="flex flex-col items-center gap-3 mb-12">
            <button
              type="button"
              onClick={handleLocationClick}
              className="
                flex w-full max-w-3xl items-center justify-between gap-6
                rounded-3xl border border-slate-200 bg-white/90 px-6 py-5 shadow-lg shadow-slate-200
                hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
                transition hover:-translate-y-0.5 duration-300
              "
              title={locationLabel}
              aria-label={locationLabel}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white shadow-lg shadow-amber-200/50">
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 6 11 7 12 1-1 7-6.75 7-12 0-3.86-3.14-7-7-7z" />
                    <circle cx="12" cy="9" r="2.25" />
                  </svg>
                </span>
                <div className="text-left">
                  <p className="text-xs uppercase tracking-wide text-slate-400">{locationLabel}</p>
                  <h2 className="text-lg font-semibold text-slate-900 leading-tight">
                    {locationText}
                  </h2>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <svg
                  className="h-4 w-4 text-amber-500 mt-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            {/* Decorative divider */}
            <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-700 shadow-sm"></div>
          </div>

          {/* Services Description */}
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            {t("home.description", {
              defaultValue: "اكتشفي عالمًا من الجمال والأناقة مع خدماتنا المتكاملة. من تصفيف الشعر إلى العناية بالبشرة، نحن هنا لجعلكِ تبدين بأفضل صورة.",
            })}
          </p>
        </div>

        {/* Action Buttons Grid - Enhanced */}
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {BUTTON_KEYS.map((key, ) => (
              <button
                key={key}
                type="button"
                onClick={() => handleClick(key)}
                className="
                  group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                  transition-all duration-300 overflow-hidden border border-slate-100
                  hover:border-amber-300 hover:-translate-y-1 p-6 text-left
                  flex flex-col items-start
                "
                aria-label={t(KEY_TO_LABEL[key])}
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10 w-full">
                  {/* Icon placeholder - you can add specific icons for each service */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 bg-white rounded-md"></div>
                  </div>
                  
                  {/* Button text */}
                  <span className="
                    text-base font-semibold text-slate-800 
                    group-hover:text-slate-900 transition-colors duration-300
                  ">
                    {t(KEY_TO_LABEL[key])}
                  </span>
                  
                  {/* Hover arrow */}
                  <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="relative z-10 max-w-4xl mx-auto mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-amber-200/30 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">{t("home.features.hours", { defaultValue: "أوقات العمل" })}</h3>
                <p className="text-sm text-slate-600">{t("home.features.hoursDetail", { defaultValue: "مفتوح طوال الأسبوع" })}</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-1" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">{t("home.features.support", { defaultValue: "دعم فوري" })}</h3>
                <p className="text-sm text-slate-600">{t("home.features.supportDetail", { defaultValue: "استشارات مجانية" })}</p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-800">{t("home.features.quality", { defaultValue: "جودة مضمونة" })}</h3>
                <p className="text-sm text-slate-600">{t("home.features.qualityDetail", { defaultValue: "أفضل المنتجات" })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
