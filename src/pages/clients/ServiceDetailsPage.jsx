import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePublicSection } from "../../hooks/usePublicSection";
import { usePublicEmployees } from "../../hooks/usePublicEmployees";

const BRAND = "#E39B34";
const BRAND_SOFT = "rgba(227,155,52,0.08)";
const BRAND_LIGHT = "rgba(227,155,52,0.04)";
const BRAND_DARK = "#CF8A2B";

// Gradient classes for different categories
const gradientClasses = {
  scissors: "from-amber-200 to-amber-50",
  nails: "from-pink-100 to-rose-50",
  makeup: "from-purple-100 to-violet-50",
  spa: "from-cyan-100 to-blue-50",
  facial: "from-amber-100 to-yellow-50",
  massage: "from-emerald-100 to-green-50",
  waxing: "from-red-100 to-amber-50",
  star: "from-yellow-100 to-amber-50",
  default: "from-slate-100 to-gray-50"
};

export default function ServiceDetailsPage({ salonId }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { sectionId } = useParams();
  
  const { section, salonData, loading, error } = usePublicSection(salonId, sectionId);
  const {
    employees: serviceEmployees,
    loading: employeesLoading,
    error: employeesError,
  } = usePublicEmployees(salonId, sectionId);

  const brandColor = salonData?.brand_color || BRAND;
  const gradientClass = section ? gradientClasses[section.icon_key] || gradientClasses.default : gradientClasses.default;

  if (loading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <div className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4" 
                 style={{ borderTopColor: brandColor, borderRightColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }} />
            <h3 className="text-xl font-bold text-gray-700 mb-2">جاري تحميل تفاصيل الخدمة</h3>
            <p className="text-gray-500">نستعد لعرض كافة التفاصيل</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !section) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-slate-100">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c.9 0 1.664-.7 1.697-1.6l.75-12c.036-.9-.675-1.6-1.575-1.6H3.575c-.9 0-1.61.7-1.575 1.6l.75 12c.033.9.797 1.6 1.697 1.6z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {t("sectionsPage.notFoundTitle", { defaultValue: "الخدمة غير موجودة" })}
            </h2>
            <p className="text-slate-600 mb-6">
              {error || t("sectionsPage.notFoundDesc", { defaultValue: "قد تكون الخدمة أزيلت أو لم تعد متوفرة." })}
            </p>
            <button
              onClick={() => navigate("/sections")}
              className="inline-flex items-center justify-center rounded-2xl font-semibold px-6 py-3 text-white transition-all duration-300 hover:shadow-lg w-full"
              style={{ backgroundColor: brandColor }}
            >
              {t("sectionsPage.backToSections", { defaultValue: "رجوع للأقسام" })}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-slate-700 transition-colors"
          >
            {t("sectionsPage.home", { defaultValue: "الرئيسية" })}
          </button>
          <span className="text-slate-300">/</span>
          <button
            onClick={() => navigate("/sections")}
            className="hover:text-slate-700 transition-colors"
          >
            {t("sectionsPage.sections", { defaultValue: "الأقسام" })}
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-amber-600 font-medium">{section.name}</span>
        </nav>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
          {/* Header with Gradient Background */}
          <div className={`bg-gradient-to-br ${gradientClass} p-8 md:p-12 relative overflow-hidden`}>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="space-y-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-1">
                    {section.name}
                  </h1>
                  {section.subtitle && (
                    <p className="text-lg text-slate-700 leading-relaxed max-w-2xl">
                      {section.subtitle}
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <button
                  onClick={() => navigate("/booking")}
                  className="
                    group/btn inline-flex items-center justify-center
                    rounded-2xl font-bold text-lg px-8 py-4
                    transition-all duration-300 hover:shadow-2xl
                    min-w-[200px]
                  "
                  style={{
                    backgroundColor: brandColor,
                    color: 'white',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.backgroundColor = BRAND_DARK;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.backgroundColor = brandColor;
                  }}
                >
                  <span>{t("sectionsPage.bookNow", { defaultValue: "احجزي الآن" })}</span>
                  <svg
                    className="ms-3 h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M5 12h14" strokeLinecap="round" />
                    <path
                      d="M13 6l6 6-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            {/* Long Description */}
            {section.description && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></div>
                  {t("sectionsPage.aboutService", { defaultValue: "عن الخدمة" })}
                </h2>
                <p className="text-lg text-slate-700 leading-relaxed max-w-4xl">
                  {section.description}
                </p>
              </div>
            )}

            {/* Features Section */}
            {section.features && section.features.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></div>
                  {t("sectionsPage.includesTitle", { defaultValue: "ما تشمله الخدمة" })}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColor }}></div>
                      </div>
                      <span className="text-lg text-slate-700 leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Staff available for this service */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-2 h-8 rounded-full" style={{ backgroundColor: brandColor }}></div>
                {t("book.staffAvailableTitle", { defaultValue: "طاقم العمل المتاح لهذه الخدمة" })}
              </h2>
              {employeesLoading ? (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <div className="w-8 h-8 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
                  {t("book.loadingEmployees", { defaultValue: "جارٍ تحميل الفريق..." })}
                </div>
              ) : employeesError ? (
                <div className="text-sm text-rose-600 flex items-center gap-2">
                  <span>⚠️</span>
                  {employeesError}
                </div>
              ) : serviceEmployees && serviceEmployees.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceEmployees.map((employee) => (
                    <div
                      key={employee.id || employee.name}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50"
                    >
                      <div className="font-semibold text-slate-800">
                        {employee.name || employee.full_name || employee.employee_name}
                      </div>
                      {employee.role && (
                        <div className="text-sm text-slate-600 mt-1">{employee.role}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                  <div className="font-semibold text-slate-800 mb-1">
                    {t("book.anyEmployee", { defaultValue: "أي موظف" })}
                  </div>
                  <p className="text-slate-600">
                    {t("book.noEmployeesForService", {
                      defaultValue: "لا يوجد موظفون مرتبطون بهذه الخدمة، سيتم اختيار أي موظف متاح.",
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-8 border-t border-slate-200">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/sections")}
                  className="
                    inline-flex items-center rounded-2xl border-2 px-6 py-3
                    text-sm font-semibold transition-all duration-300
                    hover:shadow-lg
                  "
                  style={{
                    borderColor: brandColor,
                    backgroundColor: 'white',
                    color: brandColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = BRAND_LIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  <svg
                    className="me-2 h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M19 12H5" strokeLinecap="round" />
                    <path
                      d="M11 18 5 12l6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {t("sectionsPage.backToSections", { defaultValue: "رجوع للأقسام" })}
                </button>

                <button
                  onClick={() => navigate("/prices")}
                  className="
                    inline-flex items-center rounded-2xl border-2 px-6 py-3
                    text-sm font-semibold transition-all duration-300
                    hover:shadow-lg
                  "
                  style={{
                    borderColor: brandColor,
                    backgroundColor: 'white',
                    color: brandColor,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = BRAND_LIGHT;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'white';
                  }}
                >
                  <svg className="me-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 1v22M5 12h14" strokeLinecap="round"/>
                    <path d="M8 7l4-4 4 4M16 17l-4 4-4-4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {t("sectionsPage.viewPrices", { defaultValue: "عرض الأسعار" })}
                </button>
              </div>

              <div className="text-sm text-slate-500 text-center sm:text-right">
                <p>{t("sectionsPage.needHelp", { defaultValue: "هل تحتاجين إلى مساعدة؟" })}</p>
                <button
                  onClick={() => navigate("/contact")}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  {t("sectionsPage.contactUs", { defaultValue: "تواصلي معنا" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
