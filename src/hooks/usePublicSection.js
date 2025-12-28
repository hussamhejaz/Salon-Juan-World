import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

export function usePublicSection(salonId, sectionId) {
  const [salonData, setSalonData] = useState(null);
  const [section, setSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!salonId || !sectionId) {
      setLoading(false);
      setError("Salon ID and Section ID are required");
      return;
    }

    const fetchSectionData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching section data for salon: ${salonId}, section: ${sectionId}`);
        const response = await fetch(
          `${API_BASE}/api/public/${salonId}/sections/${sectionId}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Section not found');
          }
          throw new Error(`Failed to fetch section data: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
          setSection(data.section);
          // Note: The salon data might not be included in single section response
          // You might need to fetch it separately or include it in the response
        } else {
          throw new Error(data.error || 'Unknown error from server');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching section data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSectionData();
  }, [salonId, sectionId]);

  // If salon data is not included in section response, you might want to fetch it separately
  useEffect(() => {
    if (salonId && !salonData) {
      const fetchSalonData = async () => {
        try {
          const response = await fetch(
            `${API_BASE}/api/public/${salonId}/sections`
          );
          if (response.ok) {
            const data = await response.json();
            if (data.ok) {
              setSalonData(data.salon);
            }
          }
        } catch (err) {
          console.error('Error fetching salon data:', err);
        }
      };
      fetchSalonData();
    }
  }, [salonId, salonData]);

  const refetch = () => {
    if (salonId && sectionId) {
      setLoading(true);
      setSection(null);
    }
  };

  return {
    salonData,
    section,
    loading,
    error,
    refetch
  };
}