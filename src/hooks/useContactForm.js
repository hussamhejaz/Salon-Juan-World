// src/hooks/useContactForm.js
import { useState, useCallback } from "react";
import { API_BASE } from "../config/api";

const INITIAL_FORM_STATE = {
  name: "",
  phone: "",
  msg: "",
  email: "",
};

export function useContactForm(initialValues = INITIAL_FORM_STATE) {
  const [form, setForm] = useState(() => ({ ...initialValues }));
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const resetForm = useCallback(() => {
    setForm({ ...initialValues });
    setError(null);
    setSent(false);
  }, [initialValues]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const submitForm = useCallback(async () => {
    setSending(true);
    setError(null);
    try {
      const trimmedData = {
        name: form.name?.trim() || "",
        phone: form.phone?.trim() || "",
        msg: form.msg?.trim() || "",
      };

      if (form.email?.trim()) {
        trimmedData.email = form.email.trim();
      }

      const response = await fetch(`${API_BASE}/api/public/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedData),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || !payload?.ok) {
        const message =
          payload?.error ||
          payload?.message ||
          `Request failed with status ${response.status}`;
        throw new Error(message);
      }

      setSent(true);
      return payload;
    } catch (err) {
      console.error("useContactForm submit error:", err);
      setError(err.message || "SERVER_ERROR");
      throw err;
    } finally {
      setSending(false);
    }
  }, [form]);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      if (sending) return;
      try {
        await submitForm();
      } catch {
        // error state already set
      }
    },
    [sending, submitForm]
  );

  return {
    form,
    setForm,
    handleChange,
    handleSubmit,
    sending,
    sent,
    error,
    resetForm,
    submitForm,
  };
}
