"use client";

import { motion } from "framer-motion";
import { ArrowRight, Loader2, Send, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { gaugeOptions, volumeOptions, type Product } from "@/data/factoryData";
import { useRfqSubmit } from "@/lib/useRfqSubmit";
import { cn } from "@/lib/utils";
import { RfqResult } from "./RfqResult";
import { Button } from "./ui/Button";
import { Field, Honeypot, Select, fieldA11y } from "./ui/Field";
import { KnitSwatch } from "./ui/KnitSwatch";
import { RfqLink } from "./ui/RfqLink";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function InquiryModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const id = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const { status, errors, submit, reset, clearError } = useRfqSubmit();
  const defaultMessage = `We're interested in the ${product.name} (${product.gauge}, ${product.yarn}). Please share pricing, MOQ and lead time.`;

  // Focus management: move focus in, trap Tab, close on Escape, restore on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>("input:not([type='hidden']):not([tabindex='-1'])")?.focus();
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbar}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      previous?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const submitting = status.state === "submitting";

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        initial={{ y: 40, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 24, opacity: 0, scale: 0.98, transition: { duration: 0.18 } }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex size-10 items-center justify-center rounded-full bg-white/90 text-ink-700 shadow-card backdrop-blur hover:bg-white hover:text-ink-950"
          aria-label="Close inquiry"
        >
          <X className="size-5" />
        </button>

        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-5">
          {/* Style summary */}
          <aside className="border-b border-ink-100 bg-paper md:col-span-2 md:border-b-0 md:border-r">
            <div className="relative aspect-[16/9] overflow-hidden md:aspect-[4/3]">
              <KnitSwatch
                id={`modal-${product.id}`}
                kind={product.swatch.kind}
                colors={product.swatch.colors}
                gauge={product.gauge}
              />
            </div>
            <div className="p-5 sm:p-6">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-crimson-700">Style inquiry</p>
              <h2 id={`${id}-title`} className="mt-1 font-display text-2xl font-semibold text-ink-950">
                {product.name}
              </h2>
              <p className="text-sm text-ink-500">{product.style}</p>
              <dl className="mt-5 space-y-2.5 text-sm">
                {[
                  ["Gauge", product.gauge],
                  ["Yarn", product.yarn],
                  ["Texture", product.texture],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-4 border-b border-dashed border-ink-200 pb-2.5 last:border-0"
                  >
                    <dt className="text-ink-500">{k}</dt>
                    <dd className="text-right font-medium text-ink-950">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </aside>

          {/* Quick inquiry form */}
          <div className="p-5 sm:p-7 md:col-span-3">
            {status.state === "success" ? (
              <RfqResult
                compact
                reference={status.reference}
                delivered={status.delivered}
                mailto={status.mailto}
                onReset={reset}
              />
            ) : (
              <form
                noValidate
                className="relative grid gap-4 sm:grid-cols-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit(e.currentTarget);
                }}
                onInput={(e) => {
                  const name = (e.target as HTMLInputElement).name as keyof typeof errors;
                  if (name) clearError(name);
                }}
              >
                <input type="hidden" name="inquiryType" value="Quotation (RFQ)" />
                <input type="hidden" name="styleRef" value={`${product.name} [${product.id}]`} />
                <Honeypot />

                <Field id={`${id}-name`} label="Your name" required error={errors.name}>
                  <input
                    {...fieldA11y(`${id}-name`, errors.name)}
                    name="name"
                    autoComplete="name"
                    className="field"
                    required
                  />
                </Field>
                <Field id={`${id}-email`} label="Business email" required error={errors.email}>
                  <input
                    {...fieldA11y(`${id}-email`, errors.email)}
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="field"
                    required
                  />
                </Field>
                <Field id={`${id}-company`} label="Brand / Company" required error={errors.company}>
                  <input
                    {...fieldA11y(`${id}-company`, errors.company)}
                    name="company"
                    autoComplete="organization"
                    className="field"
                    required
                  />
                </Field>
                <Field id={`${id}-country`} label="Country" required error={errors.country}>
                  <input
                    {...fieldA11y(`${id}-country`, errors.country)}
                    name="country"
                    autoComplete="country-name"
                    className="field"
                    required
                  />
                </Field>
                <Field id={`${id}-gauge`} label="Target gauge" error={errors.gauge}>
                  <Select {...fieldA11y(`${id}-gauge`, errors.gauge)} name="gauge" defaultValue={product.gauge}>
                    {gaugeOptions.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </Select>
                </Field>
                <Field id={`${id}-volume`} label="Order volume" error={errors.volume}>
                  <Select {...fieldA11y(`${id}-volume`, errors.volume)} name="volume" defaultValue="">
                    <option value="">Select range</option>
                    {volumeOptions.map((v) => (
                      <option key={v}>{v}</option>
                    ))}
                  </Select>
                </Field>
                <Field id={`${id}-message`} label="Details" error={errors.message} className="sm:col-span-2">
                  <textarea
                    {...fieldA11y(`${id}-message`, errors.message)}
                    name="message"
                    rows={3}
                    defaultValue={defaultMessage}
                    className="field resize-y"
                  />
                </Field>

                {status.state === "error" ? (
                  <p className="text-sm text-crimson-700 sm:col-span-2" role="alert">
                    {status.message}{" "}
                    {status.mailto ? (
                      <a href={status.mailto} className="font-semibold underline underline-offset-2">
                        Send by email instead
                      </a>
                    ) : null}
                  </p>
                ) : null}

                <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <RfqLink
                    prefill={{ inquiryType: "Tech Pack Review", gauge: product.gauge, message: defaultMessage }}
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 underline-offset-4 hover:text-ink-950 hover:underline"
                  >
                    Attach a tech pack in the full RFQ
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </RfqLink>
                  <Button type="submit" disabled={submitting} className={cn(submitting && "cursor-wait")}>
                    {submitting ? <Loader2 className="animate-spin" /> : <Send />}
                    {submitting ? "Sending…" : "Send inquiry"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
