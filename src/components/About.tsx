import { Factory, Plane, ShieldCheck } from "lucide-react";
import { airport, company, locations, workforce } from "@/data/factoryData";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const pillars = [
  {
    icon: Factory,
    title: "Vertically integrated",
    body: "Winding, knitting, linking, washing, pressing and packing run under one roof in Ashulia — one accountable partner from yarn to carton.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-ready compliance",
    body: `BSCI, SEDEX (SMETA) and OEKO-TEX Standard 100 credentials, with a ${workforce.total}-strong workforce and a strict zero child labor policy.`,
  },
  {
    icon: Plane,
    title: "Built for buyer access",
    body: `${airport.minutesFromFactory} minutes from ${airport.name}, with the head office in Uttara for merchandising and buyer meetings.`,
  },
];

const profile: { label: string; value: React.ReactNode }[] = [
  { label: "Legal name", value: company.name },
  { label: "Established", value: company.established },
  { label: "Business type", value: company.businessType },
  {
    label: "Business Reg. No.",
    value: <span className="font-mono">{company.registrations.businessRegistration}</span>,
  },
  { label: "BGMEA Membership", value: <span className="font-mono">#{company.registrations.bgmeaMembership}</span> },
  { label: "Export Promotion No.", value: <span className="font-mono">{company.registrations.exportPromotion}</span> },
  { label: "Certifications", value: company.certifications.join(" · ") },
  { label: "Factory", value: locations[0].lines.join(", ") },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section">
      <div className="container grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <Reveal>
            <SectionHeading
              id="about-title"
              eyebrow="About GSFL"
              title="A sweater specialist, engineered for export."
              description={`Since ${company.established}, Giant Star Fashion Limited has manufactured sweaters exclusively for international brands, retailers and buying houses — pairing a modern jacquard knitting fleet with disciplined, audit-ready operations.`}
            />
          </Reveal>

          <ul className="mt-12 space-y-4">
            {pillars.map((pillar, i) => (
              <li key={pillar.title}>
                <Reveal
                  delay={i * 0.08}
                  className="flex gap-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:p-6"
                >
                  <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white">
                    <pillar.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-ink-950">{pillar.title}</h3>
                    <p className="mt-1.5 leading-relaxed text-ink-600">{pillar.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal className="lg:col-span-6" delay={0.1}>
          <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
            <div className="flex items-center justify-between border-b border-ink-100 bg-paper-100 px-6 py-4 sm:px-8">
              <h3 className="font-display text-lg font-semibold text-ink-950">Corporate profile</h3>
              <span className="rounded-full border border-forest-200 bg-forest-50 px-2.5 py-0.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-forest-700">
                Registered
              </span>
            </div>
            <dl className="divide-y divide-ink-100 px-6 sm:px-8">
              {profile.map((row) => (
                <div key={row.label} className="grid gap-1 py-4 sm:grid-cols-5 sm:gap-6">
                  <dt className="text-sm font-medium text-ink-500 sm:col-span-2">{row.label}</dt>
                  <dd className="text-[0.95rem] font-medium text-ink-950 sm:col-span-3">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div aria-hidden="true" className="h-1 bg-brand-rule" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
