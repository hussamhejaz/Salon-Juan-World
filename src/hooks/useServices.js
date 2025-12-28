import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../config/api';

export const useServices = (salonId) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch services by salon
  const fetchServices = useCallback(async (salonId) => {
    if (!salonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/public/${salonId}/services`);
      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.details || 'Failed to fetch services');
      }
      
      setServices(result.services || []);
      return result.services || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch services by section
  const fetchServicesBySection = useCallback(async (salonId, sectionId) => {
    if (!salonId || !sectionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE}/api/public/${salonId}/sections/${sectionId}/services`
      );
      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.details || 'Failed to fetch section services');
      }
      
      setServices(result.services || []);
      return result.services || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search services
  const searchServices = useCallback(async (salonId, query) => {
    if (!salonId || !query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${API_BASE}/api/public/${salonId}/services/search?q=${encodeURIComponent(query)}`
      );
      const result = await response.json();
      
      if (!result.ok) {
        throw new Error(result.details || 'Failed to search services');
      }
      
      setServices(result.services || []);
      return result.services || [];
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear services
  const clearServices = useCallback(() => {
    setServices([]);
  }, []);

  // Auto-fetch when salonId changes
  useEffect(() => {
    if (salonId) {
      fetchServices(salonId);
    }
  }, [salonId, fetchServices]);

  return {
    // State
    services,
    loading,
    error,
    
    // Actions
    fetchServices,
    fetchServicesBySection,
    searchServices,
    clearError,
    clearServices,
  };
};