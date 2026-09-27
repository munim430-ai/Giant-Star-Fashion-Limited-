import { company, gaugeOptions, inquiryTypes, leadership, volumeOptions, type InquiryType } from "@/data/factoryData";

/* ------------------------------ page prefill ------------------------------ */

export type RfqPrefill = {
  inquiryType?: InquiryType;
  gauge?: string;
  message?: string;
};

const EVENT = "gsfl:rfq-prefill";

/** Pre-fills the RFQ form; pair with an `href="#contact"` link so scrolling works without JS. */
export function prefillRfq(prefill: RfqPrefill = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<RfqPrefill>(EVENT, { detail: prefill }));
}

export function onRfqPrefill(handler: (prefill: RfqPrefill) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<RfqPrefill>).detail ?? {});
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}

/* ------------------------------- validation ------------------------------- */

/** Shared limits so client-side hints and server-side validation agree. */
export const RFQ_LIMITS = {
  maxFileBytes: 4 * 1024 * 1024,
  acceptedExtensions: [".pdf", ".zip", ".xlsx", ".xls", ".doc", ".docx", ".ai", ".png", ".jpg", ".jpeg"],
  maxMessage: 2000,
} as const;

export type RfqData = {
  inquiryType: InquiryType;
  name: string;
  email: string;
  company: string;
  country: string;
  phone: string;
  gauge: string;
  volume: string;
  deliveryDate: string;
  message: string;
  styleRef: string;
};

export type RfqField = keyof RfqData | "techPack";
export type RfqErrors = Partial<Record<RfqField, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const clean = (v: unknown) => (typeof v === "string" ? v.trim() : "");
/** Single-line fields: collapse whitespace so values are safe in email subjects. */
const line = (v: unknown) => clean(v).replace(/\s+/g, " ");

export function validateRfq(input: Record<string, unknown>, today = new Date()): { data: RfqData; errors: RfqErrors } {
  const errors: RfqErrors = {};
  const inquiryType = line(input.inquiryType);
  const data: RfqData = {
    inquiryType: (inquiryTypes as readonly string[]).includes(inquiryType)
      ? (inquiryType as InquiryType)
      : inquiryTypes[0],
    name: line(input.name),
    email: line(input.email),
    company: line(input.company),
    country: line(input.country),
    phone: line(input.phone),
    gauge: line(input.gauge),
    volume: line(input.volume),
    deliveryDate: line(input.deliveryDate),
    message: clean(input.message),
    styleRef: line(input.styleRef),
  };

  if (data.name.length < 2) errors.name = "Please enter your full name.";
  else if (data.name.length > 100) errors.name = "Name is too long.";

  if (!EMAIL_RE.test(data.email) || data.email.length > 160) errors.email = "Please enter a valid business email.";

  if (data.company.length < 2) errors.company = "Please enter your brand or company.";
  else if (data.company.length > 120) errors.company = "Company name is too long.";

  if (data.country.length < 2) errors.country = "Please enter your country.";
  else if (data.country.length > 80) errors.country = "Country is too long.";

  if (data.phone.length > 40) errors.phone = "Phone number is too long.";

  if (data.gauge && !(gaugeOptions as readonly string[]).includes(data.gauge))
    errors.gauge = "Choose a gauge from the list.";
  if (data.volume && !(volumeOptions as readonly string[]).includes(data.volume))
    errors.volume = "Choose a volume from the list.";

  if (data.deliveryDate) {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(data.deliveryDate) ? new Date(`${data.deliveryDate}T00:00:00Z`) : null;
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    if (!date || Number.isNaN(date.getTime())) errors.deliveryDate = "Please enter a valid date.";
    else if (date < yesterday) errors.deliveryDate = "Delivery date should be in the future.";
  }

  if (data.message.length > RFQ_LIMITS.maxMessage)
    errors.message = `Please keep details under ${RFQ_LIMITS.maxMessage} characters.`;
  if (data.styleRef.length > 160) data.styleRef = data.styleRef.slice(0, 160);

  return { data, errors };
}

export function validateTechPack(file: { name: string; size: number } | null): string | undefined {
  if (!file || file.size === 0) return undefined;
  const ext = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  if (!(RFQ_LIMITS.acceptedExtensions as readonly string[]).includes(ext)) {
    return `Unsupported file type. Use ${RFQ_LIMITS.acceptedExtensions.join(", ")}.`;
  }
  if (file.size > RFQ_LIMITS.maxFileBytes) return "File is larger than 4 MB — please email larger tech packs directly.";
  return undefined;
}

/* ------------------------------ email fallback ---------------------------- */

export function rfqSummaryLines(data: RfqData, reference?: string) {
  return [
    reference ? `Reference: ${reference}` : null,
    `Inquiry: ${data.inquiryType}`,
    data.styleRef ? `Style: ${data.styleRef}` : null,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Company / Brand: ${data.company}`,
    `Country: ${data.country}`,
    data.phone ? `Phone: ${data.phone}` : null,
    data.gauge ? `Target gauge: ${data.gauge}` : null,
    data.volume ? `Order volume: ${data.volume}` : null,
    data.deliveryDate ? `Target delivery: ${data.deliveryDate}` : null,
    data.message ? `\nDetails:\n${data.message}` : null,
  ].filter((line): line is string => line !== null);
}

/** Pre-filled email to the merchandising inbox — used when server delivery isn't configured. */
export function rfqMailto(data: RfqData, reference?: string, hasAttachment = false) {
  const subject = `${data.inquiryType} — ${data.company}${reference ? ` [${reference}]` : ""}`;
  const lines = rfqSummaryLines(data, reference);
  if (hasAttachment) lines.push("\n(Tech pack attached.)");
  const body = lines.join("\n").slice(0, 1800);
  const cc = leadership.map((l) => l.email).join(",");
  return `mailto:${company.generalEmail}?cc=${encodeURIComponent(cc)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
