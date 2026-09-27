import { metrics, type Metric } from "@/data/factoryData";
import { Counter } from "./ui/Counter";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";

function MetricValue({ metric }: { metric: Metric }) {
  if (typeof metric.value === "number") {
    return (
      <>
        <Counter value={metric.value} format={metric.format} />
        {metric.suffix ? <span className="text-crimson-700">{metric.suffix}</span> : null}
      </>
    );
  }
  const [from, to] = metric.value;
  return (
    <>
      <Counter value={from} format={metric.format} />
      <span className="px-1 text-ink-300">–</span>
      <Counter value={to} format={metric.format} />
    </>
  );
}

export function Metrics() {
  return (
    <section id="metrics" aria-label="Key production metrics" className="relative z-10 -mt-24 lg:-mt-28">
      <div className="container">
        <Reveal>
          {/* gap-px over a tinted background draws hairline dividers in every grid layout */}
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-ink-100 bg-ink-100 shadow-lift sm:grid-cols-2 lg:grid-cols-5">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="group flex flex-col bg-white p-6 transition-colors hover:bg-paper sm:p-7 sm:last:col-span-2 lg:last:col-span-1"
              >
                <dt className="flex items-center gap-2.5 text-sm font-medium text-ink-600 lg:min-h-[2.75rem]">
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-paper-100 text-crimson-700 transition-colors group-hover:bg-crimson-700 group-hover:text-white">
                    <Icon name={metric.icon} className="size-4" />
                  </span>
                  {metric.label}
                </dt>
                <dd className="mt-5">
                  <p className="whitespace-nowrap font-display text-[2.1rem] font-semibold leading-none tracking-tight text-ink-950 lg:text-[1.9rem] xl:text-[2.2rem]">
                    <MetricValue metric={metric} />
                  </p>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-500">{metric.unit}</p>
                  <p className="mt-4 border-t border-dashed border-ink-100 pt-3 text-sm leading-snug text-ink-600">
                    {metric.note}
                  </p>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
