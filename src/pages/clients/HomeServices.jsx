// src/pages/public/HomeServicesPage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicSalon } from "../../hooks/usePublicSalon";
import { useNavigate } from "react-router-dom";

function ServiceCard({ title, desc, duration, price, travelFeeLabel, onBook, brandColor, isPopular }) {
  return (
    <div className="relative rounded-3xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 left-6 z-10">
          <span 
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            الأكثر طلباً
          </span>
        </div>
      )}

      {/* Service Info */}
      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>
        {desc && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{desc}</p>
        )}

        {/* Duration and Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
            </svg>
            {duration} دقيقة
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {price} <span className="text-sm font-normal text-gray-500"></span>
            </div>
            {travelFeeLabel && (
              <div className="text-xs text-gray-500 mt-1">{travelFeeLabel}</div>
            )}
          </div>
        </div>

        {/* Book Button */}
        <button
          type="button"
          className="w-full rounded-xl px-4 py-3 font-bold text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
          style={{ backgroundColor: brandColor }}
          onClick={onBook}
        >
          احجز للمنزل
        </button>
      </div>
    </div>
  );
}

function CategoryFilter({ categories, selectedCategory, onCategoryChange, brandColor }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map(({ key, label }) => (
        <button
          key={key}
          className={`rounded-full px-4 py-3 font-medium border-2 transition-all duration-300 transform hover:scale-105 ${
            selectedCategory === key 
              ? "text-white shadow-lg scale-105" 
              : "text-gray-700 hover:text-gray-900 bg-white hover:shadow-md"
          }`}
          style={{ 
            backgroundColor: selectedCategory === key ? brandColor : "transparent", 
            borderColor: selectedCategory === key ? brandColor : "#e5e7eb",
          }}
          onClick={() => onCategoryChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function SearchHeader({ searchQuery, onSearchChange, brandColor, t }) {
  const brandSoft = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(brandColor.slice(3, 5), 16)}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.12)`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {t("hs.search")}
        </label>
        <div className="relative">
          <input
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t("hs.searchPlaceholder")}
            className="w-full rounded-xl border-2 px-4 py-3 pr-12 outline-none transition-all duration-300 focus:border-gray-300"
            style={{ borderColor: brandSoft }}
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-3.5-3.5" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function StatsBar({ services, filteredServices, brandColor }) {
  const brandSoft = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(brandColor.slice(3, 5), 16)}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.08)`;

  return (
    <div 
      className="rounded-2xl p-4 text-center"
      style={{ backgroundColor: brandSoft }}
    >
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-2xl font-bold text-gray-900">{services.length}</div>
          <div className="text-gray-600">الخدمات المتاحة</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{filteredServices.length}</div>
          <div className="text-gray-600">النتائج المعروضة</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {services.length > 0 ? Math.min(...services.map(s => s.duration_minutes)) : 0}
          </div>
          <div className="text-gray-600">أقل مدة</div>
        </div>
      </div>
    </div>
  );
}

export default function HomeServicesPage({ salonId }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { salonData, services, categories, loading, error } = usePublicSalon(salonId);

  // Normalize API category values/labels to translation keys
  const CATEGORY_KEY_MAP = {
    scissors: "hair",
    hair: "hair",
    hairservices: "hair",
    nails: "nails",
    nailcare: "nails",
    makeup: "makeup",
    spa: "spa",
    spatreatments: "spa",
    massage: "massage",
    waxing: "waxing",
    facial: "facial",
    facialcare: "facial",
    body: "body",
    bodycare: "body",
    kids: "kids",
    dyecare: "dyeCare",
    consultation: "consultation",
    premium: "premium",
    star: "premium",
    premiumservices: "premium",
  };

  // Fallback mapping by label text (normalized)
  const CATEGORY_LABEL_MAP = {
    hairservices: "hair",
    hairservicesarabic: "hair",
    nailcare: "nails",
    nailcarearabic: "nails",
    makeup: "makeup",
    spatreatments: "spa",
    premiumservices: "premium",
    facialcare: "facial",
    massage: "massage",
    waxing: "waxing",
  };

  // Hard fallback labels per language if i18n lookup misses
  const CATEGORY_LABEL_FALLBACKS = {
    hair: { ar: "خدمات الشعر", en: "Hair Services" },
    nails: { ar: "عناية الأظافر", en: "Nail Care" },
    makeup: { ar: "مكياج", en: "Makeup" },
    spa: { ar: "جلسات السبا", en: "Spa Treatments" },
    premium: { ar: "خدمات مميزة", en: "Premium Services" },
    facial: { ar: "عناية الوجه", en: "Facial Care" },
    massage: { ar: "مساج", en: "Massage" },
    waxing: { ar: "إزالة الشعر", en: "Waxing" },
  };

  const normalizeKey = (str) =>
    (str || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");

  const getCategoryLabel = (cat) => {
    if (!cat) return "";

    // If backend provides a full translation key path, honor it first
    if (cat.translation_key && typeof cat.translation_key === "string") {
      const directKey = cat.translation_key.trim();
      const direct = t(directKey, { defaultValue: directKey });
      if (direct !== directKey) return direct;
    }

    const candidates = [cat.value, cat.label, cat.translation_key]
      .map(normalizeKey)
      .filter(Boolean);

    for (const key of candidates) {
      const canonical =
        CATEGORY_KEY_MAP[key] ||
        CATEGORY_LABEL_MAP[key] ||
        key;
      const translationKey = `hs.categories.${canonical}`;
      const translated = t(translationKey, {
        defaultValue:
          CATEGORY_LABEL_FALLBACKS[canonical]?.[i18n.language] ||
          cat.label ||
          cat.value ||
          canonical ||
          "",
      });
      if (
        translated !== cat.label &&
        translated !== cat.value &&
        translated !== translationKey
      ) {
        return translated;
      }
    }

    // Fallback
    const canonical = CATEGORY_KEY_MAP[candidates[0]] || candidates[0] || "";
    return (
      CATEGORY_LABEL_FALLBACKS[canonical]?.[i18n.language] ||
      cat.label ||
      cat.value ||
      canonical ||
      ""
    );
  };

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Map categories to frontend format
  const CATEGORIES = useMemo(() => {
    const defaultCats = [
      { key: "all", label: t("hs.all") || "الكل" }
    ];
    
    const mappedCats = (categories || []).map(cat => ({
      key: cat.value,
      label: getCategoryLabel(cat)
    }));

    return [...defaultCats, ...mappedCats];
  }, [categories, i18n.language]);

  // Filter services based on category and search
  const filteredServices = useMemo(() => {
    if (!services) return [];

    let filtered = services.filter(service => {
      const categoryMatch = selectedCategory === "all" ? true : service.category === selectedCategory;
      const searchMatch = searchQuery.trim() === "" ? true : 
        (service.name + " " + (service.description || "")).toLowerCase().includes(searchQuery.toLowerCase());
      
      return categoryMatch && searchMatch;
    });

    // Sort by price
    return filtered.sort((a, b) => a.price - b.price);
  }, [services, selectedCategory, searchQuery]);

  const brandColor = salonData?.brand_color || "#E39B34";

  if (loading) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4" 
              style={{ borderTopColor: brandColor, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} 
            />
            <h3 className="text-xl font-bold text-gray-700 mb-2">جاري تحميل الخدمات</h3>
            <p className="text-gray-500">نستعد لعرض أفضل الخدمات المنزلية لك</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-2xl mx-auto text-center">
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
    <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Hero Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {salonData?.name || t("hs.title") || "الخدمات المنزلية"}
          </h1>
          <div
            className="w-24 h-1.5 rounded-full mx-auto mb-6 opacity-60" 
            style={{ backgroundColor: brandColor }} 
          />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("hs.subtitle") || "استمتع بأفضل خدمات التجميل في منزلك مع فريق محترف وجاهز للوصول إليك"}
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="space-y-6 mb-8">
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            brandColor={brandColor}
            t={t}
          />

          {/* Category Filters */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <CategoryFilter
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              brandColor={brandColor}
            />
          </div>

          {/* Stats Bar */}
          {services.length > 0 && (
            <StatsBar
              services={services}
              filteredServices={filteredServices}
              brandColor={brandColor}
            />
          )}
        </div>

        {/* Services Grid */}
        <div className="mb-12">
          {filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">لا توجد خدمات</h3>
              <p className="text-gray-500 mb-6">
                {services.length === 0 
                  ? "لا توجد خدمات متاحة حالياً" 
                  : "لم نعثر على خدمات تطابق بحثك"}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-xl px-6 py-3 font-bold text-white hover:shadow-lg transition-all"
                  style={{ backgroundColor: brandColor }}
                >
                  عرض جميع الخدمات
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    title={service.name}
                    desc={service.description}
                    duration={service.duration_minutes}
                    price={service.price}
                    travelFeeLabel={
                      service.travel_fee
                        ? `${t("hs.travelFee", { defaultValue: "رسوم التنقل" })}: ${Math.round(
                            Number(service.travel_fee) || 0
                          ).toLocaleString()} ر.س`
                        : ""
                    }
                    brandColor={brandColor}
                    isPopular={index < 2}
                    onBook={() =>
                      navigate(`/home-services/booking?serviceId=${service.id}`)
                    }
                  />
                ))}
              </div>

              {/* Contact Footer */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">هل تحتاج مساعدة في الاختيار؟</h3>
                <p className="text-gray-600 mb-6">فريقنا مستعد لمساعدتك في اختيار أفضل خدمة تناسب احتياجاتك</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="flex-1 max-w-xs rounded-xl px-6 py-4 font-bold text-white hover:shadow-lg transition-all transform hover:scale-105"
                    style={{ backgroundColor: brandColor }}
                  >
                    اتصل بنا للاستشارة
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
