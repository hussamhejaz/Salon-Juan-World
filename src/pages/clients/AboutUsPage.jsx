import React from "react";
import { useTranslation } from "react-i18next";
import { usePublicReviews } from "../../hooks/usePublicReviews";

const BRAND = "#E39B34";
const BRAND_SOFT = "rgba(227,155,52,0.12)";

export default function AboutUsPage({ salonId }) {
  const { t } = useTranslation();
  const { features } = usePublicReviews(salonId);

  const averageRating = features?.average
    ? parseFloat(features.average).toFixed(1)
    : "4.9";
  const totalRatings = features?.total
    ? features.total.toLocaleString("en-US")
    : "+1200";

  return (
    <section
      className="pt-28 pb-16 px-4 sm:pt-32 md:pt-36 bg-gradient-to-b to-white"
      style={{ backgroundImage: `linear-gradient(180deg, ${BRAND_SOFT}, transparent)` }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Main card */}
        <div
          className="rounded-3xl bg-white shadow-2xl border p-6 sm:p-8 md:p-10"
          style={{ borderColor: BRAND_SOFT }}
        >
          {/* Header / title */}
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {t("about.title", { defaultValue: "من نحن" })}
            </h1>

            <div
              className="mx-auto mt-3 h-1 w-24 rounded"
              style={{ backgroundColor: BRAND, opacity: 0.4 }}
            />

            <p className="mt-3 text-slate-600 text-sm md:text-base leading-relaxed">
              {t("about.subtitle", {
                defaultValue:
                  "صالون تجميلي نسائي بخبرة عالية ونهتم بأدق التفاصيل من أول استقبالك حتى النتيجة النهائية.",
              })}
            </p>
          </div>

          {/* Story */}
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            {/* Text block */}
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {t("about.storyTitle", { defaultValue: "قصتنا" })}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                {t("about.storyBody", {
                  defaultValue:
                    "بدأنا ببساطة: نوفر تجربة تجميل راقية، مريحة، وآمنة لكل سيدة. فريقنا كله من متخصصات محترفات تم اختيارهم بعناية. نؤمن أن الجمال ليس مجرد خدمة سريعة، بل لحظة تقدير لذاتك.",
                })}
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-700">
                {t("about.storyBody2", {
                  defaultValue:
                    "نهتم بالنظافة، جودة المنتجات، الراحة، السرعة في الحجز، والشفافية في الأسعار. هدفنا: تطلعي للمرآة وتتبسّمي بكل رضا. 💅✨",
                })}
              </p>
            </div>

            {/* Highlights / stats card */}
            <div
              className="rounded-2xl border bg-white p-6 shadow-sm"
              style={{ borderColor: BRAND_SOFT }}
            >
              <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ backgroundColor: BRAND }}
                />
                {t("about.highlightsTitle", { defaultValue: "لماذا نحن؟" })}
              </h3>

              <ul className="space-y-4 text-sm leading-6 text-slate-700">
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span>{t("about.point1", { defaultValue: "حجز سهل وسريع (أونلاين أو واتساب)." })}</span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span>{t("about.point2", { defaultValue: "فريق نسائي محترف فقط." })}</span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span>{t("about.point3", { defaultValue: "منتجات جودة عالية ومعقمة وآمنة." })}</span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span>{t("about.point4", { defaultValue: "قسم خدمات منزلية للراحة التامة." })}</span>
                </li>
                <li className="flex gap-3">
                  <span
                    className="mt-1 inline-block h-1.5 w-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: BRAND }}
                  />
                  <span>{t("about.point5", { defaultValue: "خصوصية واحترام وتجربة ملكية." })}</span>
                </li>
              </ul>

              {/* mini stat row */}
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl p-3 bg-white border shadow-sm"
                     style={{ borderColor: BRAND_SOFT }}>
                <div className="text-xl font-extrabold text-slate-900">
                  {averageRating}
                  <span className="text-sm ml-1">★</span>
                </div>
                <div className="text-[11px] text-slate-500 leading-tight">
                  {t("about.statRating", { defaultValue: "متوسط التقييم" })}
                </div>
                </div>
                <div className="rounded-xl p-3 bg-white border shadow-sm"
                     style={{ borderColor: BRAND_SOFT }}>
                  <div className="text-xl font-extrabold text-slate-900">{totalRatings}</div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    {t("about.statClients", { defaultValue: "عميلة سعيدة" })}
                  </div>
                </div>
                <div className="rounded-xl p-3 bg-white border shadow-sm"
                     style={{ borderColor: BRAND_SOFT }}>
                  <div className="text-xl font-extrabold text-slate-900">7y</div>
                  <div className="text-[11px] text-slate-500 leading-tight">
                    {t("about.statYears", { defaultValue: "خبرة" })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom message */}
          <div className="mt-10 text-center text-slate-700 text-sm leading-6">
            {t("about.closing", {
              defaultValue:
                "هدفنا أنك تخرجين واثقة، مرتاحة، ومبتسمة. شكراً لثقتك. ",
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
