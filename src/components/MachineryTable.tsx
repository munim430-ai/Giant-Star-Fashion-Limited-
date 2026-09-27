"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { useId, useMemo, useRef, useState } from "react";
import { gaugeProfiles, knittingBrand, knittingTotal, machinery, type MachineItem } from "@/data/factoryData";
import { cn, formatNumber } from "@/lib/utils";
import { Icon } from "./ui/Icon";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

type Row = MachineItem & { categoryId: string; categoryName: string };

const allRows: Row[] = machinery.flatMap((c) =>
  c.items.map((item) => ({ ...item, categoryId: c.id, categoryName: c.name })),
);

const tabs = [
  { id: "all", name: "All equipment", icon: "layers" as const, count: allRows.reduce((s, r) => s + r.qty, 0) },
  ...machinery.map((c) => ({ id: c.id, name: c.name, icon: c.icon, count: c.items.reduce((s, r) => s + r.qty, 0) })),
];

const gaugeColors: Record<string, string> = {
  "14G": "bg-forest-400",
  "12G": "bg-crimson-700",
  "7G": "bg-rust-400",
  "5/7G": "bg-olive-400",
};

function matches(row: Row, q: string) {
  const hay = `${row.name} ${row.spec} ${row.categoryName} ${row.gauge ?? ""}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => hay.includes(term));
}

export function MachineryTable() {
  const [tab, setTab] = useState("knitting");
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const baseId = useId();

  const searching = query.trim().length > 0;
  const rows = useMemo(() => {
    if (searching) return allRows.filter((r) => matches(r, query.trim()));
    return tab === "all" ? allRows : allRows.filter((r) => r.categoryId === tab);
  }, [tab, query, searching]);

  const activeCategory = machinery.find((c) => c.id === tab);
  const showCategoryColumn = searching || tab === "all";
  const panelId = `${baseId}-panel`;

  const onTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const last = tabs.length - 1;
    const next =
      e.key === "ArrowRight"
        ? index === last
          ? 0
          : index + 1
        : e.key === "ArrowLeft"
          ? index === 0
            ? last
            : index - 1
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    setTab(tabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="infrastructure" aria-labelledby="infrastructure-title" className="section bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <Reveal>
            <SectionHeading
              id="infrastructure-title"
              eyebrow="Plant machinery & gauge matrix"
              title="Every machine on the floor, accounted for."
              description="The complete equipment inventory behind our output — filter by department or search for a machine, gauge or specification."
            />
          </Reveal>
          <Reveal delay={0.1} className="w-full lg:max-w-sm">
            <label htmlFor={`${baseId}-search`} className="sr-only">
              Search machinery
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-400"
                aria-hidden="true"
              />
              <input
                id={`${baseId}-search`}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search e.g. “12G”, “linking”, “boiler”"
                className="field h-12 rounded-full pl-11 pr-11"
                aria-controls={panelId}
              />
              {searching ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-ink-500 hover:bg-ink-100 hover:text-ink-950"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              ) : null}
            </div>
          </Reveal>
        </div>

        {/* Department tabs */}
        <div className="mask-fade-x -mx-4 mt-12 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0 sm:[mask-image:none]">
          <div role="tablist" aria-label="Machinery departments" className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
            {tabs.map((t, i) => {
              const selected = !searching && tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`${baseId}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => {
                    setTab(t.id);
                    setQuery("");
                  }}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={cn(
                    "relative inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    selected
                      ? "border-ink-950 text-white"
                      : "border-ink-200 bg-white text-ink-700 hover:border-ink-400 hover:text-ink-950",
                  )}
                >
                  {selected ? (
                    <motion.span
                      layoutId="machinery-tab"
                      className="absolute inset-0 rounded-full bg-ink-950"
                      transition={{ type: "spring", stiffness: 400, damping: 34 }}
                    />
                  ) : null}
                  <span className="relative inline-flex items-center gap-2">
                    <Icon name={t.icon} className="size-4" />
                    {t.name}
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-px font-mono text-[0.7rem] tabular-nums",
                        selected ? "bg-white/15 text-white" : "bg-ink-100 text-ink-600",
                      )}
                    >
                      {t.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Inventory table */}
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={searching ? undefined : `${baseId}-tab-${tab}`}
            aria-label={searching ? `Search results for ${query}` : undefined}
            className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card lg:col-span-8 lg:self-start"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-paper-100 px-5 py-4 sm:px-6">
              <p className="text-sm text-ink-600" aria-live="polite">
                {searching ? (
                  <>
                    <span className="font-semibold text-ink-950">{rows.length}</span> result
                    {rows.length === 1 ? "" : "s"} for “{query.trim()}”
                  </>
                ) : activeCategory ? (
                  activeCategory.summary
                ) : (
                  "Complete plant inventory across seven departments."
                )}
              </p>
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-500">
                Σ {formatNumber(rows.reduce((s, r) => s + r.qty, 0))} units
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:min-w-[34rem]">
                <caption className="sr-only">Machinery inventory</caption>
                <thead>
                  <tr className="border-b border-ink-100 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-ink-500">
                    <th scope="col" className="px-5 py-3 font-medium sm:px-6">
                      Machine
                    </th>
                    <th scope="col" className="hidden px-3 py-3 font-medium sm:table-cell">
                      Specification
                    </th>
                    {showCategoryColumn ? (
                      <th scope="col" className="hidden px-3 py-3 font-medium md:table-cell">
                        Department
                      </th>
                    ) : null}
                    <th scope="col" className="px-5 py-3 text-right font-medium sm:px-6">
                      Qty
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence initial={false}>
                    {rows.map((row) => (
                      <motion.tr
                        key={`${row.categoryId}-${row.name}-${row.spec}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-ink-100 last:border-0 hover:bg-paper"
                      >
                        <th scope="row" className="px-5 py-3.5 font-medium text-ink-950 sm:px-6">
                          <span className="flex items-center gap-2.5">
                            {row.gauge ? (
                              <span
                                className={cn("size-2 shrink-0 rounded-full", gaugeColors[row.gauge])}
                                aria-hidden="true"
                              />
                            ) : (
                              <span className="size-2 shrink-0 rounded-full bg-ink-200" aria-hidden="true" />
                            )}
                            <span>
                              {row.name}
                              <span className="block text-xs font-normal text-ink-500 sm:hidden">{row.spec}</span>
                            </span>
                          </span>
                        </th>
                        <td className="hidden px-3 py-3.5 text-ink-600 sm:table-cell">{row.spec}</td>
                        {showCategoryColumn ? (
                          <td className="hidden px-3 py-3.5 text-ink-500 md:table-cell">{row.categoryName}</td>
                        ) : null}
                        <td className="whitespace-nowrap px-5 py-3.5 text-right sm:px-6">
                          <span className="font-display text-lg font-semibold tabular-nums text-ink-950">
                            {row.qty}
                          </span>{" "}
                          <span className="text-xs text-ink-500">{row.unit}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {rows.length === 0 ? (
                <p className="px-6 py-12 text-center text-ink-500">
                  No equipment matches “{query.trim()}”. Try a gauge such as <span className="font-mono">7G</span> or a
                  department.
                </p>
              ) : null}
            </div>
          </div>

          {/* Knitting fleet by gauge */}
          <Reveal className="lg:col-span-4" delay={0.1}>
            <div className="rounded-3xl bg-ink-950 p-6 text-white shadow-lift sm:p-7 lg:sticky lg:top-24">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-300">Knitting fleet by gauge</p>
              <p className="mt-3 font-display text-5xl font-semibold tabular-nums">
                {knittingTotal}
                <span className="ml-2 text-lg font-medium text-ink-300">sets</span>
              </p>
              <p className="mt-1 text-sm text-ink-300">Automated jacquard · {knittingBrand}</p>

              <ul className="mt-8 space-y-5">
                {gaugeProfiles.map((g) => {
                  const pct = (g.sets / knittingTotal) * 100;
                  return (
                    <li key={g.gauge}>
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex items-baseline gap-2">
                          <span className="font-display text-lg font-semibold">{g.gauge}</span>
                          <span className="text-xs text-ink-300">{g.label}</span>
                        </span>
                        <span className="font-mono text-sm tabular-nums text-ink-200">
                          {g.sets} <span className="text-ink-400">· {pct.toFixed(0)}%</span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className={cn("h-full rounded-full", gaugeColors[g.gauge])}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
                        {g.systems} — {g.bestFor.toLowerCase()}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
