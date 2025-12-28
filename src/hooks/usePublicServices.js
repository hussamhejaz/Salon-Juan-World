import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../config/api";

export function usePublicServices(salonId) {
  const [services, setServices] = useState([]);
  const [servicesBySection, setServicesBySection] = useState({});
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all services for a salon
  const fetchServices = useCallback(async () => {
    if (!salonId) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/public/${salonId}/services`);
      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load services");
      }

      setServices(data.allServices || []);
      setServicesBySection(data.servicesBySection || {});
      setSalon(data.salon || null);
    } catch (err) {
      console.error("[usePublicServices] fetchServices error:", err);
      setError(err.message || "Failed to load services");
      setServices([]);
      setServicesBySection({});
      setSalon(null);
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  // Fetch services by specific section
  const fetchServicesBySection = useCallback(async (sectionId) => {
    if (!salonId || !sectionId) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/public/${salonId}/sections/${sectionId}/services`
      );
      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load section services");
      }

      return {
        ok: true,
        section: data.section,
        services: data.services || []
      };
    } catch (err) {
      console.error("[usePublicServices] fetchServicesBySection error:", err);
      return {
        ok: false,
        error: err.message || "Failed to load section services"
      };
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  // Fetch single service by ID
  const fetchServiceById = useCallback(async (serviceId) => {
    if (!salonId || !serviceId) return;

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/public/${salonId}/services/${serviceId}`
      );
      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to load service");
      }

      return {
        ok: true,
        service: data.service
      };
    } catch (err) {
      console.error("[usePublicServices] fetchServiceById error:", err);
      return {
        ok: false,
        error: err.message || "Failed to load service"
      };
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  // Search services
  const searchServices = useCallback(async (searchQuery, sectionFilter = "all") => {
    if (!salonId) return;

    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (searchQuery && searchQuery.trim() !== "") {
        params.append("q", searchQuery.trim());
      }
      if (sectionFilter && sectionFilter !== "all") {
        params.append("section", sectionFilter);
      }

      const url = `${API_BASE}/api/public/${salonId}/services/search?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || data.ok === false) {
        throw new Error(data.error || "Failed to search services");
      }

      return {
        ok: true,
        searchQuery: data.searchQuery,
        sectionFilter: data.sectionFilter,
        services: data.services || []
      };
    } catch (err) {
      console.error("[usePublicServices] searchServices error:", err);
      return {
        ok: false,
        error: err.message || "Failed to search services"
      };
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  // Get services grouped by section for display
  const getServicesGroupedBySection = useCallback(() => {
    return Object.entries(servicesBySection).map(([sectionId, sectionData]) => ({
      sectionId,
      section: sectionData.section,
      services: sectionData.services
    }));
  }, [servicesBySection]);

  // Get all sections that have services
  const getAvailableSections = useCallback(() => {
    return Object.values(servicesBySection)
      .map(sectionData => sectionData.section)
      .filter(Boolean);
  }, [servicesBySection]);

  // Get featured services (you can customize the logic)
  const getFeaturedServices = useCallback((limit = 6) => {
    return services
      .filter(service => service.price > 0) // Example: services with price
      .slice(0, limit);
  }, [services]);

  // Get services by price range
  const getServicesByPriceRange = useCallback((minPrice = 0, maxPrice = Infinity) => {
    return services.filter(service => {
      const price = parseFloat(service.price);
      return price >= minPrice && price <= maxPrice;
    });
  }, [services]);

  // Get services with specific features
  const getServicesWithFeatures = useCallback((featureNames = []) => {
    return services.filter(service => {
      if (!service.features || service.features.length === 0) return false;
      return service.features.some(feature => 
        featureNames.includes(feature.name) && feature.is_checked
      );
    });
  }, [services]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchServices();
  }, [fetchServices]);

  // Auto-fetch when salonId changes
  useEffect(() => {
    if (salonId) {
      fetchServices();
    }
  }, [salonId, fetchServices]);

  return {
    // State
    services,
    servicesBySection,
    salon,
    loading,
    error,

    // Actions
    fetchServices,
    fetchServicesBySection,
    fetchServiceById,
    searchServices,
    refresh,

    // Derived data
    getServicesGroupedBySection,
    getAvailableSections,
    getFeaturedServices,
    getServicesByPriceRange,
    getServicesWithFeatures,

    // Utilities
    hasServices: services.length > 0,
    totalServices: services.length,
    totalSections: Object.keys(servicesBySection).length
  };
}