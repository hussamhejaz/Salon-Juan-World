import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

const DEFAULT_LIMIT = 50;
const createEmptyDistribution = () => ({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

export function usePublicReviews(salonId) {
  const [reviews, setReviews] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: DEFAULT_LIMIT, total: 0 });
  const [salon, setSalon] = useState(null);
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReviewFeatures = useCallback(async () => {
    if (!salonId) return null;

    try {
      const response = await fetch(`${API_BASE}/api/public/${salonId}/reviews/features`);
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.details || payload.error || response.statusText || "Failed to load review features");
      }

      setFeatures({
        total: typeof payload.total === "number" ? payload.total : 0,
        average: typeof payload.average === "number" ? payload.average : 0,
        distribution: payload.distribution || createEmptyDistribution(),
      });
      return payload;
    } catch (err) {
      console.error("fetchReviewFeatures error:", err);
      setFeatures(null);
      return null;
    }
  }, [salonId]);

  const fetchReviews = useCallback(
    async ({ page = 1, limit = DEFAULT_LIMIT, rating } = {}) => {
      if (!salonId) {
        setError("Salon ID is required to load reviews.");
        return null;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("page", String(Math.max(1, page)));
        const safeLimit = Math.min(Math.max(limit, 1), DEFAULT_LIMIT);
        params.set("limit", String(safeLimit));
        if (rating >= 1 && rating <= 5) {
          params.set("rating", String(rating));
        }

        const response = await fetch(
          `${API_BASE}/api/public/${salonId}/reviews?${params.toString()}`
        );
        const payload = await response.json();

        if (!response.ok || !payload.ok) {
          throw new Error(payload.details || payload.error || response.statusText || "Failed to load reviews");
        }

        const loadedReviews = Array.isArray(payload.reviews) ? payload.reviews : [];
        setReviews(loadedReviews);
        setMeta({
          page: payload.page ?? page,
          limit: payload.limit ?? safeLimit,
          total: typeof payload.total === "number" ? payload.total : loadedReviews.length,
        });
        setSalon(payload.salon || null);
        return payload;
      } catch (err) {
        setError(err?.message || "Failed to load reviews");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [salonId]
  );

  const refresh = useCallback(
    async (opts = {}) => {
      const payload = await fetchReviews({ page: 1, limit: DEFAULT_LIMIT, ...opts });
      await fetchReviewFeatures();
      return payload;
    },
    [fetchReviewFeatures, fetchReviews]
  );

  useEffect(() => {
    if (!salonId) return;
    refresh();
  }, [salonId, refresh]);

  return {
    reviews,
    loading,
    error,
    meta,
    salon,
    features,
    refresh,
  };
}
