// src/pages/OffersPage.jsx
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { usePublicOffers } from "../../hooks/usePublicOffers";
import RiyalIcon from "../../components/RiyalIcon";

// Helper function to format numbers with 2 decimal places
const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(Number(price))) return "0.00";
  return Number(price).toFixed(2);
};

const getOfferDurationMinutes = (offer) => {
  const raw = offer?.duration_minutes ?? offer?.duration ?? offer?.durationMinutes;
  const minutes = Number(raw);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  return Math.max(0, minutes);
};

const formatOfferDurationLabel = (minutes, t) => {
  const duration = Math.max(0, Number(minutes) || 0);
  if (!duration) {
    return t("offers.durationVaries", { defaultValue: "Duration may vary" });
  }

  const hours = Math.floor(duration / 60);
  const remainingMinutes = duration % 60;

  if (hours && remainingMinutes) {
    return t("offers.durationHoursMinutes", {
      hours,
      minutes: remainingMinutes,
      defaultValue: `${hours}h ${remainingMinutes}m`,
    });
  }

  if (hours) {
    return t("offers.durationHours", {
      hours,
      defaultValue: `${hours}h`,
    });
  }

  return t("offers.durationMinutes", {
    minutes: duration,
    defaultValue: `${duration} min`,
  });
};

function OfferCard({
  title,
  description,
  originalPrice,
  finalPrice,
  discountPercentage,
  discountAmount,
  imageUrl,
  terms,
  onBook,
  brandColor,
  isFeatured,
  remainingUses,
  validUntil,
  canBook,
  categoryLabel,
  durationLabel,
  locale,
  t,
}) {
  const hasDiscount = (discountPercentage || 0) > 0 || (discountAmount || 0) > 0;
  const savings = Number(originalPrice || 0) - Number(finalPrice || 0);
  const formattedDate =
    validUntil && !Number.isNaN(new Date(validUntil).getTime())
      ? new Date(validUntil).toLocaleDateString(locale || undefined, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <div className="relative rounded-2xl bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 group">
      {isFeatured && (
        <div className="absolute -top-3 left-6 z-10">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            {t("offers.featured", { defaultValue: "Featured" })}
          </span>
        </div>
      )}

      {remainingUses !== null && remainingUses > 0 && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-lg">
            {t("offers.remaining", {
              count: remainingUses,
              defaultValue: `{{count}} remaining`,
            })}
          </span>
        </div>
      )}

      {imageUrl && (
        <div className="mb-4 rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">{title}</h3>

        {description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">{description}</p>
        )}

        {(categoryLabel || durationLabel) && (
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-4">
            {categoryLabel && (
              <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50">
                {categoryLabel}
              </span>
            )}
            {durationLabel && (
              <span className="px-3 py-1 rounded-full border border-gray-200 bg-gray-50 flex items-center gap-1">
                <span>⏱</span>
                {durationLabel}
              </span>
            )}
          </div>
        )}

        <div className="mb-4">
          {hasDiscount && originalPrice && (
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg text-gray-500 line-through flex items-center gap-1">
                {formatPrice(originalPrice)}
                <RiyalIcon size={16} />
              </div>
              {discountPercentage > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: brandColor }}
                >
                  {t("offers.discount", {
                    percentage: Number(discountPercentage).toFixed(0),
                    defaultValue: "{{percentage}}% off",
                  })}
                </span>
              )}
              {discountAmount > 0 && (
                <span
                  className="px-2 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1"
                  style={{ backgroundColor: brandColor }}
                >
                  {t("offers.discountAmount", {
                    amount: formatPrice(discountAmount),
                    defaultValue: "{{amount}} SAR off",
                  })}
                  <RiyalIcon size={12} />
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 flex items-center gap-1">
              {formatPrice(finalPrice || originalPrice)}
              <RiyalIcon size={20} />
            </div>

            {hasDiscount && savings > 0 && (
              <div className="text-sm text-green-600 font-semibold flex items-center gap-1">
                {t("offers.save", {
                  amount: formatPrice(savings),
                  defaultValue: `Save ${formatPrice(savings)} SAR`,
                })}
                <RiyalIcon size={14} />
              </div>
            )}
          </div>
        </div>

        {formattedDate && (
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
            {t("offers.validUntil", { defaultValue: "Valid until" })} {formattedDate}
          </div>
        )}

        {terms && (
          <details className="mb-4">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-800">
              {t("offers.terms", { defaultValue: "Terms & Conditions" })}
            </summary>
            <p className="text-xs text-gray-500 mt-2">{terms}</p>
          </details>
        )}

        <button
          type="button"
          disabled={!canBook}
          className={`w-full rounded-xl px-4 py-3 font-bold text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md ${
            !canBook ? "opacity-60 cursor-not-allowed hover:scale-100" : ""
          }`}
          style={{ backgroundColor: brandColor }}
          onClick={canBook ? onBook : undefined}
        >
          {canBook
            ? t("offers.book", { defaultValue: "Book Offer" })
            : t("offers.unavailable", { defaultValue: "Not available for online booking" })}
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
  const brandSoft = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(
    brandColor.slice(3, 5),
    16
  )}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.12)`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {t("offers.search") || "بحث العروض"}
        </label>
        <div className="relative">
          <input
            value={searchQuery}
            onChange={onSearchChange}
            placeholder={t("offers.searchPlaceholder") || "ابحث في العروض..."}
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

function StatsBar({ offers, filteredOffers, brandColor }) {
  const { t } = useTranslation();

  const brandSoft = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(
    brandColor.slice(3, 5),
    16
  )}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.08)`;

  const totalDiscount = filteredOffers.reduce((sum, offer) => {
    const discount =
      (offer.original_price || 0) - (offer.final_price || offer.original_price || 0);
    return sum + (discount > 0 ? discount : 0);
  }, 0);

  const averageDiscount =
    filteredOffers.length > 0
      ? Math.round(totalDiscount / filteredOffers.length)
      : 0;

  return (
    <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: brandSoft }}>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <div className="text-2xl font-bold text-gray-900">{offers.length}</div>
          <div className="text-gray-600">{t("offers.stats.available")}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">
            {filteredOffers.length}
          </div>
          <div className="text-gray-600">{t("offers.stats.showing")}</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
            {formatPrice(averageDiscount)}
            <RiyalIcon size={16} className="opacity-60" />
          </div>
          <div className="text-gray-600">{t("offers.stats.average")}</div>
        </div>
      </div>
    </div>
  );
}

function SortFilter({ sortBy, onSortChange, brandColor, options, label }) {
  const borderColor = `rgba(${parseInt(brandColor.slice(1, 3), 16)}, ${parseInt(
    brandColor.slice(3, 5),
    16
  )}, ${parseInt(brandColor.slice(5, 7), 16)}, 0.12)`;

  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <select
        value={sortBy}
        onChange={onSortChange}
        className="rounded-xl border-2 px-4 py-2 outline-none bg-white transition-all duration-300 focus:border-gray-300"
        style={{ borderColor }}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function OffersPage({ salonId }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const { salonData, offers, categories, loading, error, refetch } =
    usePublicOffers(salonId);

  const locale = i18n.language || "en-US";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const categoryLabelMap = useMemo(() => {
    const map = {};
    (categories || []).forEach((cat) => {
      if (cat && cat.value) {
        map[cat.value] = cat.label;
      }
    });
    return map;
  }, [categories]);

  const sortOptions = useMemo(
    () => [
      {
        value: "newest",
        label: t("offers.sort.newest", { defaultValue: "Newest" }),
      },
      {
        value: "discount",
        label: t("offers.sort.discount", { defaultValue: "Highest Discount" }),
      },
      {
        value: "price-low",
        label: t("offers.sort.priceLow", { defaultValue: "Price (Low to High)" }),
      },
      {
        value: "price-high",
        label: t("offers.sort.priceHigh", { defaultValue: "Price (High to Low)" }),
      },
      {
        value: "ending",
        label: t("offers.sort.ending", { defaultValue: "Ending Soon" }),
      },
    ],
    [t]
  );

  const sortLabel = t("offers.sortLabel", { defaultValue: "Sort by" });

  // Map categories to frontend format
  const CATEGORIES = useMemo(() => {
    const defaultCats = [
      { key: "all", label: t("offers.all") || "جميع العروض" },
    ];

    const mappedCats = (categories || []).map((cat) => ({
      key: cat.value,
      label: cat.label,
    }));

    return [...defaultCats, ...mappedCats];
  }, [categories, t]);

  // Helper: هل يمكن حجز هذا العرض؟
  const canBookOffer = (offer) => {
    const hasService = !!(offer.service_id || offer.home_service_id);
    const remaining =
      offer.max_uses != null
        ? (offer.max_uses || 0) - (offer.used_count || 0)
        : null;
    const hasUses = remaining === null || remaining > 0;

    // من الـ backend أنت أصلاً ما ترجع عروض منتهية، لكن نخليها احتياطاً
    const notExpired =
      !offer.end_date || new Date(offer.end_date) >= new Date();

    return hasService && hasUses && notExpired;
  };

  // عند الضغط على "احجز العرض"
  const handleBookOffer = (offer) => {
    const hasSalonService = Boolean(offer.service_id);
    const hasHomeService = Boolean(offer.home_service_id);

    if (!hasSalonService && !hasHomeService) {
      window.alert(
        t("offers.booking.noService", {
          defaultValue: "Offer is not linked to a service",
        })
      );
      return;
    }

    const params = new URLSearchParams();
    if (hasSalonService) {
      params.set("serviceId", offer.service_id);
    }
    if (hasHomeService) {
      params.set("serviceId", offer.home_service_id);
      params.set("homeServiceId", offer.home_service_id);
    }
    params.set("offerId", offer.id);

    const priceValue =
      offer.final_price ?? offer.price ?? offer.total_price ?? offer.discount_price;
    const parsedPrice = Number(priceValue);
    if (Number.isFinite(parsedPrice)) {
      params.set("offerPrice", parsedPrice.toString());
    }

    const durationMinutes = getOfferDurationMinutes(offer);
    if (durationMinutes) {
      params.set("offerDuration", durationMinutes.toString());
    }

    const targetPath = hasHomeService ? "/home-services/booking" : "/booking";
    navigate(`${targetPath}?${params.toString()}`, {
      state: {
        offer: {
          id: offer.id,
          service_id: offer.service_id,
          home_service_id: offer.home_service_id,
          price: Number.isFinite(parsedPrice) ? parsedPrice : undefined,
          duration_minutes: durationMinutes || undefined,
        },
      },
    });
  };

  // Filter and sort offers based on category, search, and sort criteria
  const filteredOffers = useMemo(() => {
    if (!offers) return [];

    let filtered = offers.filter((offer) => {
      const categoryMatch =
        selectedCategory === "all"
          ? true
          : offer.category === selectedCategory;

      const searchMatch =
        searchQuery.trim() === ""
          ? true
          : (offer.title + " " + (offer.description || ""))
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

      return categoryMatch && searchMatch;
    });

    // Sort based on selected criteria
    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        break;
      case "discount":
        filtered.sort((a, b) => {
          const discA =
            (a.original_price || 0) > 0
              ? (a.original_price - (a.final_price || a.original_price)) /
                a.original_price
              : 0;
          const discB =
            (b.original_price || 0) > 0
              ? (b.original_price - (b.final_price || b.original_price)) /
                b.original_price
              : 0;
          return discB - discA;
        });
        break;
      case "price-low":
        filtered.sort(
          (a, b) =>
            (a.final_price || a.original_price || 0) -
            (b.final_price || b.original_price || 0)
        );
        break;
      case "price-high":
        filtered.sort(
          (a, b) =>
            (b.final_price || b.original_price || 0) -
            (a.final_price || a.original_price || 0)
        );
        break;
      case "ending":
        filtered.sort(
          (a, b) => new Date(a.end_date) - new Date(b.end_date)
        );
        break;
      default:
        break;
    }

    return filtered;
  }, [offers, selectedCategory, searchQuery, sortBy]);

  const brandColor = salonData?.brand_color || "#E39B34";

  if (loading) {
    return (
      <section className="min-h-screen pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div
              className="animate-spin rounded-full h-16 w-16 border-4 mx-auto mb-4"
              style={{
                borderTopColor: brandColor,
                borderRightColor: "transparent",
                borderBottomColor: "transparent",
                borderLeftColor: "transparent",
              }}
            />
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {t("offers.loading.title", { defaultValue: "Loading offers" })}
            </h3>
            <p className="text-gray-500">
              {t("offers.loading.description", {
                defaultValue:
                  "Preparing to display the best offers and special discounts.",
              })}
            </p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("offers.error.title", {
                defaultValue: "Sorry, an error occurred",
              })}
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={refetch}
              className="rounded-xl px-6 py-3 font-bold text-white hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto"
              style={{ backgroundColor: brandColor }}
            >
              {t("offers.error.retry", { defaultValue: "Try Again" })}
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
            {salonData?.name
              ? `${salonData.name}`
              : t("offers.title") || "العروض والحسومات"}
          </h1>
          <div
            className="w-24 h-1.5 rounded-full mx-auto mb-6 opacity-60"
            style={{ backgroundColor: brandColor }}
          />
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("offers.subtitle") ||
              "استفد من عروضنا الحصرية واحصل على أفضل الخدمات بأسعار مميزة"}
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
            <div className="flex flex-col gap-4">
              <CategoryFilter
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                brandColor={brandColor}
              />
              <div className="flex justify-end">
                <SortFilter
                  sortBy={sortBy}
                  onSortChange={(e) => setSortBy(e.target.value)}
                  brandColor={brandColor}
                  options={sortOptions}
                  label={sortLabel}
                />
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          {offers.length > 0 && (
            <StatsBar
              offers={offers}
              filteredOffers={filteredOffers}
              brandColor={brandColor}
            />
          )}
        </div>

        {/* Offers Grid */}
        <div className="mb-12">
          {filteredOffers.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {offers.length === 0
                  ? t("offers.noOffers", { defaultValue: "No offers available" })
                  : t("offers.noResults", {
                      defaultValue: "No offers match your search",
                    })}
              </h3>
              <p className="text-gray-500 mb-6">
                {offers.length === 0
                  ? t("offers.noOffersDescription", {
                      defaultValue: "Check back soon – new offers are on the way.",
                    })
                  : t("offers.noResultsDescription", {
                      defaultValue: "Try widening your search or resetting the filters.",
                    })}
              </p>
              {(searchQuery || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-xl px-6 py-3 font-bold text-white hover:shadow-lg transition-all flex items-center gap-2 justify-center mx-auto"
                  style={{ backgroundColor: brandColor }}
                >
                  {t("offers.showAll", { defaultValue: "Show All Offers" })}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {filteredOffers.map((offer, index) => {
                  const remainingUses =
                    offer.max_uses != null
                      ? (offer.max_uses || 0) - (offer.used_count || 0)
                      : null;
                  const durationMinutes = getOfferDurationMinutes(offer);
                  const durationLabel = formatOfferDurationLabel(durationMinutes, t);
                  const categoryLabel =
                    categoryLabelMap[offer.category] || offer.category;

                  return (
                    <OfferCard
                      key={offer.id}
                      title={offer.title}
                      description={offer.description}
                      originalPrice={offer.original_price}
                      finalPrice={offer.final_price}
                      discountPercentage={offer.discount_percentage}
                      discountAmount={offer.discount_amount}
                      imageUrl={offer.image_url}
                      terms={offer.terms_conditions}
                      brandColor={brandColor}
                      isFeatured={index < 3} // First 3 offers are featured
                      remainingUses={remainingUses}
                      validUntil={offer.end_date}
                      canBook={canBookOffer(offer)}
                      onBook={() => handleBookOffer(offer)}
                      durationLabel={durationLabel}
                      categoryLabel={categoryLabel}
                      locale={locale}
                      t={t}
                    />
                  );
                })}
              </div>

              {/* Contact Footer */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t("offers.help.title")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("offers.help.description")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/contact")}
                    className="flex-1 max-w-xs rounded-xl px-6 py-4 font-bold text-white hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2 justify-center"
                    style={{ backgroundColor: brandColor }}
                  >
                    {t("offers.help.consult")}
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
