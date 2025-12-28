import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

export function usePublicSections(salonId) {
  const [salonData, setSalonData] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!salonId) {
      setLoading(false);
      setError("Salon ID is required");
      return;
    }

    const fetchSectionsData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching sections for salon: ${salonId}`);
        const response = await fetch(
          `${API_BASE}/api/public/${salonId}/sections`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Salon not found');
          }
          throw new Error(`Failed to fetch sections data: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
          setSalonData(data.salon);
          setSections(data.sections || []);
        } else {
          throw new Error(data.error || 'Unknown error from server');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching sections data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionsData();
  }, [salonId]);

  const refetch = () => {
    if (salonId) {
      setLoading(true);
      setSalonData(null);
      setSections([]);
    }
  };

  return {
    salonData,
    sections,
    loading,
    error,
    refetch
  };
}