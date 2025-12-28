// src/hooks/usePublicOffers.js
import { useState, useEffect } from "react";
import { API_BASE } from "../config/api";

export function usePublicOffers(salonId) {
  const [salonData, setSalonData] = useState(null);
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!salonId) return;

    const fetchOffersData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE}/api/public/${salonId}/offers`);

        if (!response.ok) {
          throw new Error(`Failed to fetch offers: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
          setSalonData(data.salon);
          setOffers(data.offers || []);
          setCategories(data.categories || []);
        } else {
          throw new Error(data.error || "Unknown error");
        }
      } catch (err) {
        console.error("Error fetching offers data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffersData();
  }, [salonId, reloadKey]);

  return {
    salonData,
    offers,
    categories,
    loading,
    error,
    refetch: () => setReloadKey((k) => k + 1),
  };
}
