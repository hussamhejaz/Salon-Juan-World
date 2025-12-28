import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

/**
 * Fetch employees for a salon (optionally scoped to a service).
 * If serviceId is provided, calls /services/:serviceId/employees as required by the public API.
 */
export function usePublicEmployees(salonId, serviceId) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchEmployees = useCallback(
    async (signal) => {
      if (!salonId || !serviceId) {
        setEmployees([]);
        return;
      }

      const controller = signal ? null : new AbortController();
      const activeSignal = signal || controller.signal;

      try {
        setLoading(true);
        setError("");

        const baseUrl = `${API_BASE}/api/public/${salonId}`;
        const url = serviceId
          ? `${baseUrl}/services/${serviceId}/employees`
          : `${baseUrl}/employees`;

        const res = await fetch(url, { signal: activeSignal });
        const data = await res.json();

        if (!res.ok || data.ok === false) {
          throw new Error(data.error || "Failed to load employees");
        }

        const list = Array.isArray(data.employees) ? data.employees : [];
        const activeEmployees = list.filter(
          (employee) => employee?.is_active !== false
        );
        setEmployees(activeEmployees);
      } catch (err) {
        if (activeSignal.aborted) return;
        console.error("[usePublicEmployees] fetchEmployees error:", err);
        setError(err.message || "Failed to load employees");
        setEmployees([]);
      } finally {
        if (!activeSignal.aborted) {
          setLoading(false);
        }
      }
    },
    [salonId, serviceId]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchEmployees(controller.signal);
    return () => controller.abort();
  }, [fetchEmployees]);

  return {
    employees,
    loading,
    error,
    refresh: fetchEmployees,
    hasEmployees: employees.length > 0,
  };
}
