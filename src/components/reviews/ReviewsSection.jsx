import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Stars from "./Stars";
import RatingBreakdown from "./RatingBreakdown";

const BRAND = "#E39B34";
const TINT = "rgba(227,155,52,0.12)";

function avg(vals) {
  if (!vals.length) return 0;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}
function counts(vals) {
  return vals.reduce((acc, r) => {
    const rating = Number(r.rating);
    if (Number.isFinite(rating) && rating >= 1 && rating <= 5) {
      acc[rating] = (acc[rating] || 0) + 1;
    }
    return acc;
  }, {});
}

export default function ReviewsSection({
  reviews = [],
  loading = false,
  error,
  meta,
  features,
  onRefresh,
}) {
  const [q, setQ] = useState("");
  const [starFilter, setStarFilter] = useState(0);
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const { t } = useTranslation();

  useEffect(() => {
    setPage(1);
  }, [q, starFilter, sort, reviews.length]);

  const filtered = useMemo(() => {
    const base = [...reviews];
    let L = base;

    if (starFilter) {
      L = L.filter((r) => r.rating === starFilter);
    }

    if (q.trim()) {
      const needle = q.toLowerCase();
      L = L.filter((r) => `${r.name || ""} ${r.text || ""}`.toLowerCase().includes(needle));
    }

    if (sort === "newest") {
      L.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    } else if (sort === "highest") {
      L.sort((a, b) => {
        const delta = (b.rating || 0) - (a.rating || 0);
        if (delta !== 0) return delta;
        return (b.date || "").localeCompare(a.date || "");
      });
    } else if (sort === "helpful") {
      L.sort((a, b) => {
        const delta = (b.helpful || 0) - (a.helpful || 0);
        if (delta !== 0) return delta;
        return (b.date || "").localeCompare(a.date || "");
      });
    }

    return L;
  }, [reviews, q, starFilter, sort]);

  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const derivedStats = useMemo(() => {
    const ratings = reviews.map((r) => r.rating || 0);
    return {
      avgRating: avg(ratings),
      dist: counts(reviews),
    };
  }, [reviews]);

  const stats = useMemo(() => {
    if (features && typeof features.total === "number") {
      return {
        avgRating: features.average,
        dist: features.distribution,
      };
    }
    return derivedStats;
  }, [derivedStats, features]);

  const featuredRating = useMemo(() => {
    const distribution = features?.distribution ?? stats.dist;
    const entries = Object.entries(distribution || {});
    if (!entries.length) return null;
    return entries.reduce((top, [rating, count]) => {
      const parsed = Number(rating);
      if (!Number.isFinite(parsed)) return top;
      if (count > top.count) {
        return { rating: parsed, count };
      }
      return top;
    }, { rating: null, count: -1 }).rating;
  }, [features, stats.dist]);

  const featuredLabel = t("reviewCard.featured", { defaultValue: "Featured" });

  const renderedReviews = useMemo(() => {
    let assigned = false;
    return paged.map((r) => {
      const isFeatured = !assigned && Number.isFinite(featuredRating) && r.rating === featuredRating;
      if (isFeatured) assigned = true;
      return (
        <ReviewItem
          key={r.id ?? `${r.name}-${r.date}`}
          review={r}
          isFeatured={isFeatured}
          featuredLabel={featuredLabel}
        />
      );
    });
  }, [paged, featuredRating]);

  const total = features?.total ?? meta?.total ?? reviews.length;

  return (
    <section
      className="pt-8 sm:pt-10"
      style={{ backgroundImage: `linear-gradient(180deg, ${TINT}, transparent)` }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* header card */}
        <div className="rounded-2xl bg-white shadow-2xl p-6 md:p-10 border" style={{ borderColor: TINT }}>
          {/* Top summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center text-center p-4 rounded-xl"
                 style={{ backgroundColor: TINT }}>
              <div className="text-4xl font-extrabold text-slate-900">{stats.avgRating}</div>
              <Stars value={stats.avgRating} size={20} className="mt-1" />
              <div className="text-sm text-slate-600 mt-1">{total} reviews</div>
            </div>

            <div className="md:col-span-2">
              <RatingBreakdown counts={stats.dist} />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative md:col-span-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ابحث في التعليقات… / Search reviews…"
                className="w-full rounded-xl border px-4 py-2.5 outline-none"
                style={{ borderColor: TINT }}
              />
              <span className="pointer-events-none absolute inset-y-0 ltr:right-3 rtl:left-3 grid place-items-center text-slate-400">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" /><path d="M21 21l-3.5-3.5" />
                </svg>
              </span>
            </div>

            {/* Filter by stars */}
            <div className="flex items-center gap-2 justify-end">
              <label className="text-sm text-slate-700">Filter</label>
              <select
                value={starFilter}
                onChange={(e) => setStarFilter(Number(e.target.value))}
                className="rounded-xl border px-3 py-2 outline-none bg-white"
                style={{ borderColor: TINT }}
              >
                <option value={0}>All</option>
                <option value={5}>5★</option>
                <option value={4}>4★</option>
                <option value={3}>3★</option>
                <option value={2}>2★</option>
                <option value={1}>1★</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border px-3 py-2 outline-none bg-white"
                style={{ borderColor: TINT }}
              >
                <option value="newest">Newest</option>
                <option value="highest">Highest</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>

          {/* List */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {error && (
              <div className="col-span-full text-center text-sm text-rose-500 space-y-2">
                <p>{error}</p>
                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    className="text-amber-600 hover:text-amber-700 transition text-xs"
                  >
                    Retry
                  </button>
                )}
              </div>
            )}

            {loading && filtered.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-16 animate-pulse">Loading reviews...</div>
            ) : paged.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-16">No reviews yet.</div>
            ) : (
              renderedReviews
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                className="rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: TINT }}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>
              <div className="text-sm text-slate-600">
                {page} / {totalPages}
              </div>
              <button
                className="rounded-full border px-3 py-1.5 text-sm"
                style={{ borderColor: TINT }}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* Inline item uses ReviewCard and local helpful state */
function ReviewItem({ review, isFeatured, featuredLabel }) {
  return (
    <div className="contents">
      <div className="col-span-1">
        <div className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
             style={{ borderColor: "rgba(227,155,52,0.12)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="font-semibold text-slate-900">{review.name}</div>
              <div className="text-xs text-slate-500 mt-0.5">{review.date}</div>
            </div>
            <Stars value={review.rating} />
          </div>
          {isFeatured && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-amber-700">
                {featuredLabel}
              </span>
            </div>
          )}
          {review.text && <p className="mt-3 text-sm leading-6 text-slate-700">{review.text}</p>}
          {review.photos?.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {review.photos.map((src, i) => (
                <img key={i} src={src} alt="" className="h-24 w-full object-cover rounded-lg border"
                     style={{ borderColor: "rgba(227,155,52,0.12)" }}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
