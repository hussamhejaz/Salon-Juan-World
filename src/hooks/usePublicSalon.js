import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config/api';

export function usePublicSalon(salonId) {
  const [salonData, setSalonData] = useState(null);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const fetchSalonData = useCallback(async () => {
    if (!salonId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE}/api/public/${salonId}/home-services`);

      if (!response.ok) {
        throw new Error(`Failed to fetch salon data: ${response.status}`);
      }

      const data = await response.json();

      if (data.ok) {
        setSalonData(data.salon);
        setServices(data.services);
        setCategories(data.categories);
      } else {
        throw new Error(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching salon data:', err);
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    fetchSalonData();
  }, [fetchSalonData]);

  return {
    salonData,
    services,
    categories,
    loading,
    error,
    refetch: fetchSalonData,
  };
}
