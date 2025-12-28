import { useState, useEffect } from 'react';
import { API_BASE } from '../config/api';

export function usePublicWorkingHours(salonId) {
  const [salonData, setSalonData] = useState(null);
  const [workingHours, setWorkingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!salonId) {
      setLoading(false);
      setError("Salon ID is required");
      return;
    }

    const fetchWorkingHours = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching working hours for salon: ${salonId}`);
        const response = await fetch(
          `${API_BASE}/api/public/${salonId}/working-hours`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Salon not found');
          }
          throw new Error(`Failed to fetch working hours: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
          setSalonData(data.salon);
          setWorkingHours(data.workingHours || []);
        } else {
          throw new Error(data.error || 'Unknown error from server');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching working hours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, [salonId]);

  const refetch = () => {
    if (salonId) {
      setLoading(true);
      setSalonData(null);
      setWorkingHours([]);
    }
  };

  return {
    salonData,
    workingHours,
    loading,
    error,
    refetch
  };
}