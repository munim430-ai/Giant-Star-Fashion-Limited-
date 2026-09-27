"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  Copy,
  FileUp,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Plane,
  Send,
  X,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import {
  airport,
  bankAccounts,
  company,
  gaugeOptions,
  inquiryTypes,
  leadership,
  locations,
  volumeOptions,
  type InquiryType,
} from "@/data/factoryData";
import { onRfqPrefill, RFQ_LIMITS } from "@/lib/rfq";
import { useRfqSubmit } from "@/lib/useRfqSubmit";
import { cn } from "@/lib/utils";
import { RfqResult } from "./RfqResult";
import { Button } from "./ui/Button";
import { Field, Honeypot, Select, fieldA11y } from "./ui/Field";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

function formatBytes(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/* --------------------------------- RFQ form -------------------------------- */

function RfqForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { status, errors, submit, reset, clearError } = useRfqSubmit();

  const [inquiryType, setInquiryType] = useState<InquiryType>(inquiryTypes[0]);
  const [gauge, setGauge] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [minDate, setMinDate] = useState<string>();
  const [highlight, setHighlight] = useState(false);

  // Dates depend on the visitor's clock, so compute after mount (no hydration drift).
  useEffect(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setMinDate(d.toISOString().slice(0, 10));
  }, []);

  // CTAs across the page pre-fill this form.
  useEffect(
    () =>
      onRfqPrefill((prefill) => {
        if (status.state === "success") reset();
        if (prefill.inquiryType) setInquiryType(prefill.inquiryType);
        if (prefill.gauge) setGauge(prefill.gauge);
        if (prefill.message) setMessage(prefill.message);
        setHighlight(true);
        window.setTimeout(() => setHighlight(false), 1600);
      }),
    [reset, status.state],
  );

  const pickFile = (next: File | null) => {
    setFile(next);
    clearError("techPack");
    if (!next && fileRef.current) fileRef.current.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && fileRef.current) {
      const dt = new DataTransfer();
      dt.items.add(dropped);
      fileRef.current.files = dt.files;
      pickFile(dropped);
    }
  };

  if (status.state === "success") {
    return (
      <RfqResult
        reference={status.reference}
        delivered={status.delivered}
        mailto={status.mailto}
        hasAttachment={!!file}
        onReset={() => {
          reset();
          setFile(null);
          setMessage("");
          setGauge("");
        }}
      />
    );
  }

  const submitting = status.state === "submitting";

  return (
    <form
      ref={formRef}
      noValidate
      aria-labelledby={`${id}-title`}
      className={cn("relative rounded-2xl transition-shadow duration-500", highlight && "ring-4 ring-crimson-700/20")}
      onSubmit={(e) => {
        e.preventDefault();
        void submit(e.currentTarget);
      }}
      onInput={(e) => {
        const name = (e.target as HTMLInputElement).name as keyof typeof errors;
        if (name) clearError(name);
      }}
    >
      <h3 id={`${id}-title`} className="font-display text-2xl font-semibold text-ink-950">
        Request for quotation
      </h3>
      <p className="mt-1.5 text-ink-600">
        Routed to our merchandising team and leadership. Fields marked * are required.
      </p>
      <Honeypot />

      <fieldset className="mt-7">
        <legend className="field-label">What do you need?</legend>
        <div className="flex flex-wrap gap-2">
          {inquiryTypes.map((type) => (
            <label
              key={type}
              className={cn(
                "cursor-pointer rounded-full border px-3.5 py-2 text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-crimson-600 has-[:focus-visible]:ring-offset-2",
                inquiryType === type
                  ? "border-ink-950 bg-ink-950 text-white"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-400",
              )}
            >
              <input
                type="radio"
                name="inquiryType"
                value={type}
                checked={inquiryType === type}
                onChange={() => setInquiryType(type)}
                className="sr-only"
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Field id={`${id}-name`} label="Buyer name" required error={errors.name}>
          <input {...fieldA11y(`${id}-name`, errors.name)} name="name" autoComplete="name" className="field" required />
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
        <Field id={`${id}-phone`} label="Phone / WhatsApp" error={errors.phone}>
          <input
            {...fieldA11y(`${id}-phone`, errors.phone)}
            name="phone"
            type="tel"
            autoComplete="tel"
            className="field"
          />
        </Field>
        <Field id={`${id}-gauge`} label="Target gauge" error={errors.gauge}>
          <Select
            {...fieldA11y(`${id}-gauge`, errors.gauge)}
            name="gauge"
            value={gauge}
            onChange={(e) => setGauge(e.target.value)}
          >
            <option value="">Select gauge</option>
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
        <Field id={`${id}-date`} label="Target delivery date" error={errors.deliveryDate}>
          <input
            {...fieldA11y(`${id}-date`, errors.deliveryDate)}
            name="deliveryDate"
            type="date"
            min={minDate}
            className="field"
          />
        </Field>

        {/* Tech pack upload */}
        <div className="sm:col-span-2">
          <p className="field-label" id={`${id}-file-label`}>
            Tech pack attachment <span className="font-normal text-ink-500">(optional)</span>
          </p>
          <label
            htmlFor={`${id}-file`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-5 transition-colors has-[:focus-visible]:border-ink-950",
              dragging ? "border-crimson-600 bg-crimson-50" : "border-ink-200 bg-paper hover:border-ink-400",
              errors.techPack && "border-crimson-600",
            )}
          >
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-ink-700 shadow-card">
              <FileUp className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 text-sm">
              {file ? (
                <>
                  <span className="block truncate font-semibold text-ink-950">{file.name}</span>
                  <span className="text-ink-500">{formatBytes(file.size)} · ready to send</span>
                </>
              ) : (
                <>
                  <span className="block font-semibold text-ink-950">Drop your tech pack here, or browse</span>
                  <span className="text-ink-500">PDF, ZIP, Excel, Word, AI or images · up to 4 MB</span>
                </>
              )}
            </span>
            <input
              ref={fileRef}
              id={`${id}-file`}
              name="techPack"
              type="file"
              accept={RFQ_LIMITS.acceptedExtensions.join(",")}
              aria-labelledby={`${id}-file-label`}
              aria-invalid={errors.techPack ? true : undefined}
              aria-describedby={errors.techPack ? `${id}-file-error` : undefined}
              className="sr-only"
              onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {file ? (
            <button
              type="button"
              onClick={() => pickFile(null)}
              className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-ink-600 hover:text-crimson-700"
            >
              <X className="size-4" aria-hidden="true" />
              Remove file
            </button>
          ) : null}
          {errors.techPack ? (
            <p id={`${id}-file-error`} className="field-error">
              {errors.techPack}
            </p>
          ) : null}
        </div>

        <Field
          id={`${id}-message`}
          label="Style details & requirements"
          error={errors.message}
          className="sm:col-span-2"
        >
          <textarea
            {...fieldA11y(`${id}-message`, errors.message)}
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={RFQ_LIMITS.maxMessage}
            placeholder="Styles, yarn composition, colourways, target price, certifications required…"
            className="field resize-y"
          />
        </Field>
      </div>

      {status.state === "error" ? (
        <p className="mt-5 rounded-xl bg-crimson-50 px-4 py-3 text-sm text-crimson-800" role="alert">
          {status.message}{" "}
          {status.mailto ? (
            <a href={status.mailto} className="font-semibold underline underline-offset-2">
              Send by email instead
            </a>
          ) : null}
        </p>
      ) : null}

      <div className="mt-7 flex flex-col gap-4 border-t border-ink-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-500 sm:max-w-xs">
          Your details are used only to respond to this inquiry. Prefer email? Write to{" "}
          <a
            href={`mailto:${company.generalEmail}`}
            className="font-medium text-ink-800 underline-offset-2 hover:underline"
          >
            {company.generalEmail}
          </a>
          .
        </p>
        <Button type="submit" size="lg" disabled={submitting} className={cn("shrink-0", submitting && "cursor-wait")}>
          {submitting ? <Loader2 className="animate-spin" /> : <Send />}
          {submitting ? "Submitting…" : "Submit RFQ"}
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------ Banking drawer ------------------------------ */

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable — value stays visible for manual copy */
        }
      }}
      className="inline-flex size-8 items-center justify-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-950"
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      {copied ? <Check className="size-4 text-forest-500" /> : <Copy className="size-4" />}
    </button>
  );
}

function BankingDrawer() {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-paper"
        >
          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white">
            <Landmark className="size-5" aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-lg font-semibold text-ink-950">Banking &amp; LC coordinates</span>
            <span className="block text-sm text-ink-500">Verified credentials for letters of credit and TT</span>
          </span>
          <ChevronDown
            className={cn("size-5 text-ink-500 transition-transform duration-300", open && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={`${id}-panel`}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <ul className="space-y-3 border-t border-ink-100 px-6 py-5">
              {bankAccounts.map((bank) => (
                <li key={bank.swift} className="rounded-2xl bg-paper p-4">
                  <p className="font-semibold text-ink-950">{bank.bank}</p>
                  <p className="text-sm text-ink-600">
                    {bank.branch}, {bank.city}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-white py-1.5 pl-3 pr-1.5">
                    <span className="font-mono text-sm">
                      <span className="text-ink-500">SWIFT </span>
                      <span className="font-semibold tracking-wide text-ink-950">{bank.swift}</span>
                    </span>
                    <CopyButton value={bank.swift} label={`${bank.bank} SWIFT code`} />
                  </div>
                </li>
              ))}
              <li className="px-1 text-xs leading-relaxed text-ink-500">
                Beneficiary: {company.name}. Always confirm account details directly with our finance team by phone
                before remitting.
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/* --------------------------------- Section --------------------------------- */

export function ContactSection() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="section bg-white">
      <div className="container">
        <Reveal>
          <SectionHeading
            id="contact-title"
            eyebrow="RFQ & location hub"
            title="Start a quotation, tech-pack review or factory visit."
            description="Share what you're developing and our merchandising team will come back with costing, sampling and time & action options."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-lift sm:p-8">
              <RfqForm />
            </div>
          </Reveal>

          <div className="space-y-6 lg:col-span-5">
            {/* Two-tier location guide */}
            <Reveal delay={0.08}>
              <div className="overflow-hidden rounded-3xl bg-ink-950 text-white">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-300">Location guide</p>
                  <p className="inline-flex items-center gap-2 text-xs text-ink-300">
                    <Plane className="size-3.5" aria-hidden="true" />
                    {airport.code} → Factory · {airport.minutesFromFactory} min
                  </p>
                </div>
                <ol className="relative px-6 py-5">
                  <span
                    aria-hidden="true"
                    className="absolute bottom-10 left-[2.3rem] top-10 w-px border-l border-dashed border-white/25"
                  />
                  {locations.map((loc, i) => (
                    <li key={loc.id} className={cn("relative flex gap-4", i > 0 && "mt-6")}>
                      <span
                        className={cn(
                          "relative z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-[0.7rem] font-semibold",
                          i === 0 ? "bg-crimson-700 text-white" : "bg-white text-ink-950",
                        )}
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-crimson-300">
                          {loc.label}
                        </p>
                        <p className="mt-0.5 font-display text-lg font-semibold">{loc.title}</p>
                        <address className="mt-1 text-sm not-italic leading-relaxed text-ink-200">
                          {loc.lines.map((l) => (
                            <span key={l} className="block">
                              {l}
                            </span>
                          ))}
                        </address>
                        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-300">
                          <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                          {loc.note}
                        </p>
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.mapQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white underline-offset-4 hover:underline"
                        >
                          <Navigation className="size-4" aria-hidden="true" />
                          Directions<span className="sr-only"> to the {loc.label} (opens Google Maps)</span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>

            {/* Leadership */}
            <Reveal delay={0.12}>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {leadership.map((leader) => (
                  <li key={leader.email} className="rounded-3xl border border-ink-100 bg-paper p-5">
                    <p className="font-display text-lg font-semibold text-ink-950">{leader.name}</p>
                    <p className="text-sm text-crimson-700">{leader.role}</p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {leader.phones.map((p) => (
                        <li key={p.href}>
                          <a
                            href={p.href}
                            className="inline-flex items-center gap-2 text-ink-800 hover:text-crimson-700"
                          >
                            <Phone className="size-4 text-ink-400" aria-hidden="true" />
                            {p.display}
                          </a>
                        </li>
                      ))}
                      <li>
                        <a
                          href={`mailto:${leader.email}`}
                          className="inline-flex items-center gap-2 text-ink-800 [overflow-wrap:anywhere] hover:text-crimson-700"
                        >
                          <Mail className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                          {leader.email}
                        </a>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <BankingDrawer />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
