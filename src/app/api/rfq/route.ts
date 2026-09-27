import { NextResponse } from "next/server";
import { company, leadership } from "@/data/factoryData";
import { rfqSummaryLines, validateRfq, validateTechPack, type RfqData } from "@/lib/rfq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reference() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `GSFL-${date}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

async function deliverViaResend(data: RfqData, ref: string, file: File | null) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RFQ_FROM_EMAIL;
  if (!apiKey || !from) return false;

  const to = (process.env.RFQ_TO_EMAIL || company.generalEmail)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const lines = rfqSummaryLines(data, ref);
  const html = `<h2 style="font-family:sans-serif">New ${escapeHtml(data.inquiryType)} — ${escapeHtml(data.company)}</h2>
<pre style="font:14px/1.5 ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(lines.join("\n"))}</pre>`;

  const attachments = file
    ? [{ filename: file.name, content: Buffer.from(await file.arrayBuffer()).toString("base64") }]
    : undefined;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to,
      cc: leadership.map((l) => l.email),
      reply_to: data.email,
      subject: `[${ref}] ${data.inquiryType} — ${data.company} (${data.country})`,
      text: lines.join("\n"),
      html,
      attachments,
    }),
  });
  if (!res.ok) {
    console.error("RFQ delivery failed", res.status, await res.text().catch(() => ""));
    return false;
  }
  return true;
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid form submission." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Accept silently, send nothing.
  if (typeof form.get("website") === "string" && (form.get("website") as string).length > 0) {
    return NextResponse.json({ ok: true, reference: reference(), delivered: false });
  }

  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) if (typeof value === "string") values[key] = value;

  const { data, errors } = validateRfq(values);
  const rawFile = form.get("techPack");
  const file = rawFile instanceof File && rawFile.size > 0 ? rawFile : null;
  const fileError = validateTechPack(file);
  if (fileError) errors.techPack = fileError;

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, message: "Please review the highlighted fields.", errors }, { status: 422 });
  }

  const ref = reference();
  let delivered = false;
  try {
    delivered = await deliverViaResend(data, ref, file);
  } catch (error) {
    console.error("RFQ delivery error", error);
  }

  return NextResponse.json({ ok: true, reference: ref, delivered });
}
