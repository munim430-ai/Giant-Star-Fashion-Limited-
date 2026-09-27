import { ArrowRight, Check } from "lucide-react";
import { credentials, policies, workforce } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { RfqLink } from "./ui/RfqLink";
import { SectionHeading } from "./ui/SectionHeading";

const accent: Record<string, string> = {
  safety: "bg-crimson-700",
  inclusion: "bg-rust-500",
  "child-labor": "bg-ink-950",
  environment: "bg-forest-500",
};

function WorkforceSplit() {
  const malePct = (workforce.male / workforce.total) * 100;
  return (
    <div className="mt-5 rounded-2xl bg-paper-100 p-4">
      <div
        className="flex h-3 overflow-hidden rounded-full"
        role="img"
        aria-label={`${workforce.male} male and ${workforce.female} female employees`}
      >
        <span className="bg-ink-800" style={{ width: `${malePct}%` }} />
        <span className="bg-rust-400" style={{ width: `${100 - malePct}%` }} />
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span className="inline-flex items-center gap-2 text-ink-700">
          <span className="size-2.5 rounded-full bg-ink-800" aria-hidden="true" />
          <span className="font-semibold tabular-nums text-ink-950">{workforce.male}</span> Male
        </span>
        <span className="inline-flex items-center gap-2 text-ink-700">
          <span className="size-2.5 rounded-full bg-rust-400" aria-hidden="true" />
          <span className="font-semibold tabular-nums text-ink-950">{workforce.female}</span> Female
        </span>
      </div>
    </div>
  );
}

export function Compliance() {
  return (
    <section id="compliance" aria-labelledby="compliance-title" className="section bg-paper">
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <SectionHeading
              id="compliance-title"
              eyebrow="Social compliance, ESG & corporate policy"
              title="Ethics you can put in front of your auditors."
              description="Our commitments are backed by BSCI and SEDEX (SMETA) social audits and OEKO-TEX Standard 100 product certification — so your sourcing decisions stand up to scrutiny."
            />
          </Reveal>
          <Reveal className="lg:col-span-4 lg:text-right" delay={0.1}>
            <RfqLink
              prefill={{ inquiryType: "Compliance / Audit Reports" }}
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Request audit reports
              <ArrowRight />
            </RfqLink>
          </Reveal>
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {policies.map((policy, i) => (
            <li key={policy.id}>
              <Reveal
                delay={i * 0.07}
                className="flex h-full flex-col rounded-3xl border border-ink-100 bg-white p-6 shadow-card"
              >
                <span
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-xl text-white",
                    accent[policy.id],
                  )}
                >
                  <Icon name={policy.icon} className="size-5" />
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink-950">{policy.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-600">{policy.body}</p>
                {policy.id === "inclusion" ? <WorkforceSplit /> : null}
                <ul className="mt-auto space-y-2 pt-6">
                  {policy.points.map((point) => (
                    <li key={point} className="flex items-center gap-2.5 text-sm font-medium text-ink-800">
                      <Check className="size-4 shrink-0 text-forest-500" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-8">
          <div className="overflow-hidden rounded-3xl bg-ink-950 text-white">
            <div className="flex flex-col gap-2 border-b border-white/10 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <h3 className="font-display text-lg font-semibold">Compliance credentials</h3>
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-300">
                Registrations · Memberships · Audits
              </p>
            </div>
            <dl className="grid gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              {credentials.map((c) => (
                <div
                  key={c.label}
                  className="grid grid-cols-[auto_1fr] items-center gap-x-4 bg-ink-950 px-6 py-5 sm:px-8"
                >
                  <dt className="contents">
                    <span className="row-span-2 inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-crimson-200">
                      <Icon name={c.icon} className="size-5" />
                    </span>
                    <span className="text-sm text-ink-300">{c.label}</span>
                  </dt>
                  <dd className="col-start-2 font-display text-lg font-semibold">{c.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
