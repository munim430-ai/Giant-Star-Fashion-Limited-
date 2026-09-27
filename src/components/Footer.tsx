import { ArrowUp, Mail, Phone } from "lucide-react";
import { company, leadership, locations, navLinks } from "@/data/factoryData";
import { Logo } from "./ui/Logo";
import { RfqLink } from "./ui/RfqLink";

const emails = [
  { label: "General inquiries", email: company.generalEmail },
  ...leadership.map((l) => ({ label: l.roleShort, email: l.email })),
];

const memberships = [
  `BGMEA #${company.registrations.bgmeaMembership}`,
  `EPB ${company.registrations.exportPromotion}`,
  "BSCI",
  "SEDEX (SMETA)",
  "OEKO-TEX Std. 100",
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ink-950 text-ink-300" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <div aria-hidden="true" className="h-1 bg-brand-rule" />
      <div className="container grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <a
            href="#top"
            className="inline-block rounded-2xl bg-white p-3 shadow-lift"
            aria-label={`${company.name} — back to top`}
          >
            <Logo variant="solid" className="h-20 w-auto" sizes="160px" />
          </a>
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            {company.businessType} in Ashulia, Dhaka — supplying international brands and buying houses since{" "}
            {company.established}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Memberships and certifications">
            {memberships.map((m) => (
              <li
                key={m}
                className="rounded-full border border-white/15 px-3 py-1 font-mono text-[0.7rem] text-ink-200"
              >
                {m}
              </li>
            ))}
          </ul>
        </div>

        <nav className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8" aria-label="Footer">
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-display text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm sm:grid-cols-1">
              {navLinks.map((l) => (
                <li key={l.id}>
                  <a href={`#${l.id}`} className="transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-display text-sm font-semibold text-white">Direct email</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {emails.map((e) => (
                <li key={e.email}>
                  <span className="block text-xs text-ink-400">{e.label}</span>
                  <a
                    href={`mailto:${e.email}`}
                    className="inline-flex items-center gap-1.5 text-ink-100 [overflow-wrap:anywhere] hover:text-white"
                  >
                    <Mail className="size-3.5 shrink-0" aria-hidden="true" />
                    {e.email}
                  </a>
                </li>
              ))}
            </ul>
            <RfqLink
              className="mt-5 inline-flex items-center rounded-full bg-crimson-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-crimson-800"
              prefill={{ inquiryType: "Quotation (RFQ)" }}
            >
              Request a quotation
            </RfqLink>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-display text-sm font-semibold text-white">Locations</h3>
            <ul className="mt-4 space-y-5 text-sm">
              {locations.map((loc) => (
                <li key={loc.id}>
                  <span className="block text-xs text-ink-400">{loc.label}</span>
                  <address className="not-italic leading-relaxed text-ink-100">{loc.lines.join(", ")}</address>
                </li>
              ))}
              <li>
                <a
                  href={leadership[0].phones[0].href}
                  className="inline-flex items-center gap-1.5 text-ink-100 hover:text-white"
                >
                  <Phone className="size-3.5" aria-hidden="true" />
                  {leadership[0].phones[0].display}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-4 py-8 text-xs leading-relaxed text-ink-400 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p>
              © {company.established}–{year} {company.name}. All rights reserved. Business Reg. No.{" "}
              {company.registrations.businessRegistration}.
            </p>
            <p>
              Buyer names are trademarks of their respective owners and are shown to indicate trading relationships
              only. Capacity figures are rated and indicative; actual output varies with style, gauge and order mix.
              Product swatches are illustrative.
            </p>
          </div>
          <a
            href="#top"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/15 px-4 py-2 text-ink-200 transition hover:border-white/40 hover:text-white"
          >
            <ArrowUp className="size-3.5" aria-hidden="true" />
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
