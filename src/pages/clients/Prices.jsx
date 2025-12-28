// src/pages/Prices.jsx
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePublicServices } from "../../hooks/usePublicServices";
import RiyalIcon from "../../components/RiyalIcon";

const BRAND = "#E39B34";
const BRAND_DARK = "#CF8A2B";
const BRAND_SOFT = "rgba(227,155,52,0.08)";
const BRAND_LIGHT = "rgba(227,155,52,0.04)";

function AccordionItem({ title, children, isOpen, onToggle }) {
  return (
    <div className="group mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="
          w-full flex items-center justify-between rounded-2xl px-6 py-5
          text-right transition-all duration-300 ease-out
          border-2 hover:shadow-lg
        "
        style={{
          borderColor: isOpen ? BRAND : 'transparent',
          backgroundColor: isOpen ? 'white' : BRAND_LIGHT,
          boxShadow: isOpen ? `0 8px 32px ${BRAND_SOFT}` : 'none',
        }}
      >
        <div className="flex-1 text-right">
          <span className="text-lg font-semibold text-slate-800 group-hover:text-slate-900">
            {title}
          </span>
        </div>
        
        {/* Animated arrow */}
        <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg 
            className="w-6 h-6" 
            style={{ color: BRAND }}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          className="mt-2 rounded-2xl bg-white p-6 text-slate-700 animate-fadeIn"
          style={{ 
            border: `2px solid ${BRAND_SOFT}`,
            boxShadow: `0 4px 24px ${BRAND_SOFT}`
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Update component to accept salonId as prop
export default function PricesPage({ salonId }) {
  const { t, ready } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSection, setOpenSection] = useState(null);
  
  // Use the public services hook with the salonId prop
  const {
    salon,
    loading,
    error,
    getServicesGroupedBySection,
    refresh
  } = usePublicServices(salonId);

  // Get grouped services for display
  const groupedServices = getServicesGroupedBySection();

  // Filter sections based on search term
  const filteredSections = groupedServices.filter(({ section }) =>
    section?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    groupedServices
      .find(g => g.sectionId === section?.id)
      ?.services?.some(service => 
        service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Handle accordion toggle
  const handleToggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  if (!ready) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E39B34]"></div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E39B34] mx-auto mb-4"></div>
          <p className="text-slate-600">{t("prices.loading", "جاري تحميل الخدمات...")}</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            {t("prices.error.title", "حدث خطأ")}
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-[#E39B34] text-white rounded-lg hover:bg-[#CF8A2B] transition-colors"
          >
            {t("prices.error.retry", "إعادة المحاولة")}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-amber-200/50 shadow-sm mb-6">
            <div className="w-2 h-2 rounded-full animate-pulse bg-amber-500"></div>
            <span className="text-sm font-medium text-slate-600">
              {t("prices.badge", { defaultValue: "أسعار الخدمات" })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t("prices.title", "الخدمات والأسعار")}
          </h1>

          {/* FIXED: Removed nested <p> tags */}
          {salon?.name && (
            <div className="text-lg text-slate-600 mb-2">
              {salon.name}
            </div>
          )}

          <div className="w-24 h-1.5 rounded-full mx-auto mb-6 bg-gradient-to-r from-amber-400 to-amber-700" />
          
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            {t("prices.note", "اكتشف مجموعة خدماتنا المميزة والأسعار التنافسية")}
          </p>

          {/* Enhanced Search */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder={t("prices.searchPlaceholder", "ابحث عن الخدمات...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full rounded-2xl border-2 px-6 py-4 text-sm outline-none
                transition-all duration-300 bg-white/80 backdrop-blur-sm
                focus:border-amber-400 focus:bg-white focus:shadow-lg
              "
              style={{ borderColor: BRAND_SOFT }}
            />
            <span
              className="absolute inset-y-0 ltr:right-4 rtl:left-4 grid place-items-center"
              style={{ color: BRAND_DARK }}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-3.5-3.5" />
              </svg>
            </span>
          </div>
        </div>

        {/* Services Accordion */}
        <div className="space-y-4">
          {filteredSections.map(({ section, services }) => (
            <AccordionItem
              key={section.id}
              title={section.name}
              isOpen={openSection === section.id}
              onToggle={() => handleToggleSection(section.id)}
            >
              <div className="space-y-4">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:bg-amber-50/50 border border-slate-100"
                    >
                      <div className="flex-1">
                        <h4 className="text-slate-800 font-semibold mb-1">
                          {service.name}
                        </h4>
                        {service.description && (
                          <p className="text-slate-600 text-sm mb-2">
                            {service.description}
                          </p>
                        )}
                        {service.features && service.features.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {service.features.map((feature, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                  feature.is_checked 
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full ${
                                  feature.is_checked ? "bg-emerald-500" : "bg-slate-400"
                                }`} />
                                {feature.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <div className="flex items-center gap-1 text-xl font-bold text-[#E39B34]">
                          {parseFloat(service.price).toFixed(2)}
                          <RiyalIcon size={18} className="text-[#E39B34]" />
                        </div>
                        {service.duration_minutes && (
                          <div className="text-sm text-slate-500 mt-1">
                            {service.duration_minutes} {t("prices.minutes", "دقيقة")}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    {t("prices.noServicesInSection", "لا توجد خدمات في هذا القسم")}
                  </div>
                )}
              </div>
            </AccordionItem>
          ))}
        </div>

        {/* No Results Message */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {t("prices.noResults.title", "لا توجد نتائج")}
            </h3>
            <p className="text-slate-600">
              {t("prices.noResults.message", {
                defaultValue: "لم نتمكن من العثور على خدمات تطابق بحثك.",
              })}
            </p>
          </div>
        )}

        {/* No Services Message */}
        {groupedServices.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {t("prices.noServices.title", "لا توجد خدمات متاحة")}
            </h3>
            <p className="text-slate-600">
              {t("prices.noServices.message", "لم يتم إضافة أي خدمات بعد.")}
            </p>
          </div>
        )}

        {/* Footer Note */}
        <div className="text-center mt-12 pt-8 border-t" style={{ borderColor: BRAND_SOFT }}>
          <p className="text-sm text-slate-500">
            {t("prices.footerNote", {
              defaultValue: "الأسعار قابلة للتغيير. يرجى الاتصال بنا للاستفسار عن العروض والتخفيضات.",
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
