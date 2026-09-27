"use client";

import { useCallback, useState } from "react";
import { rfqMailto, validateRfq, validateTechPack, type RfqErrors } from "./rfq";

export type RfqStatus =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; delivered: boolean; mailto: string }
  | { state: "error"; message: string; mailto?: string };

type ApiResponse =
  { ok: true; reference: string; delivered: boolean } | { ok: false; message?: string; errors?: RfqErrors };

/**
 * Validates an RFQ form client-side, posts it to /api/rfq and exposes status.
 * When the server has no mail transport configured (or the network fails) the
 * buyer gets a pre-filled email to the merchandising inbox instead.
 */
export function useRfqSubmit() {
  const [status, setStatus] = useState<RfqStatus>({ state: "idle" });
  const [errors, setErrors] = useState<RfqErrors>({});

  const submit = useCallback(async (form: HTMLFormElement) => {
    const formData = new FormData(form);
    const values = Object.fromEntries([...formData.entries()].filter(([, v]) => typeof v === "string"));
    const { data, errors: fieldErrors } = validateRfq(values);
    const file = formData.get("techPack");
    const fileObj = file instanceof File && file.size > 0 ? file : null;
    const fileError = validateTechPack(fileObj);
    if (fileError) fieldErrors.techPack = fileError;

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setStatus({ state: "error", message: "Please review the highlighted fields." });
      const first = form.querySelector<HTMLElement>(`[name="${Object.keys(fieldErrors)[0]}"]`);
      first?.focus();
      return false;
    }

    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/rfq", { method: "POST", body: formData });
      const json = (await res.json().catch(() => ({ ok: false }))) as ApiResponse;
      if (!json.ok) {
        setErrors(json.errors ?? {});
        setStatus({
          state: "error",
          message: json.message ?? "We couldn't submit your request. Please try again.",
          mailto: rfqMailto(data, undefined, !!fileObj),
        });
        return false;
      }
      setStatus({
        state: "success",
        reference: json.reference,
        delivered: json.delivered,
        mailto: rfqMailto(data, json.reference, !!fileObj),
      });
      return true;
    } catch {
      setStatus({
        state: "error",
        message: "Network error — you can send the same request by email instead.",
        mailto: rfqMailto(data, undefined, !!fileObj),
      });
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus({ state: "idle" });
    setErrors({});
  }, []);

  const clearError = useCallback((field: keyof RfqErrors) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { status, errors, submit, reset, clearError };
}
