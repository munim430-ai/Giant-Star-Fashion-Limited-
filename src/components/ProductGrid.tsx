"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareText } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { productCategories, products, type Product, type ProductCategory } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { InquiryModal } from "./InquiryModal";
import { KnitSwatch } from "./ui/KnitSwatch";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const categoryLabel: Record<ProductCategory, string> = { men: "Men", ladies: "Ladies", kids: "Kids" };

function ProductCard({ product, onInquire }: { product: Product; onInquire: (p: Product) => void }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-100">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <KnitSwatch
              id={product.id}
              kind={product.swatch.kind}
              colors={product.swatch.colors}
              gauge={product.gauge}
            />
          )}
        </div>
        <div className="absolute inset-x-3 top-3 flex items-start justify-between">
          <span className="rounded-full bg-ink-950/85 px-2.5 py-1 font-mono text-xs font-medium text-white backdrop-blur">
            {product.gauge}
          </span>
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-ink-800 backdrop-blur">
            {categoryLabel[product.category]}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink-950">{product.name}</h3>
        <p className="text-sm text-ink-500">{product.style}</p>

        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-500">Yarn</dt>
            <dd className="text-ink-800">{product.yarn}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-16 shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-ink-500">Texture</dt>
            <dd className="text-ink-800">{product.texture}</dd>
          </div>
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Features">
          {product.features.map((f) => (
            <li key={f} className="rounded-full bg-paper-100 px-2.5 py-0.5 text-xs text-ink-600">
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-5">
          <button
            type="button"
            onClick={() => onInquire(product)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-950 transition-colors hover:border-crimson-700 hover:bg-crimson-700 hover:text-white"
            aria-haspopup="dialog"
          >
            <MessageSquareText className="size-4" aria-hidden="true" />
            Inquire About This Style
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid() {
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const closeModal = useCallback(() => setSelected(null), []);

  const visible = useMemo(
    () => (category === "all" ? products : products.filter((p) => p.category === category)),
    [category],
  );

  return (
    <section id="products" aria-labelledby="products-title" className="section bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-8 xl:flex-row xl:items-end">
          <Reveal>
            <SectionHeading
              id="products-title"
              eyebrow="Product showcase"
              title="Knitwear capability across every gauge."
              description="Representative development styles for men, ladies and kids — each knitted to your tech pack, yarn and colour standards."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div
              className="inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-ink-100 bg-paper p-1 xl:flex-nowrap"
              role="group"
              aria-label="Filter by collection"
            >
              {productCategories.map((c) => {
                const count = c.id === "all" ? products.length : products.filter((p) => p.category === c.id).length;
                const isActive = category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "relative whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                      isActive ? "text-white" : "text-ink-600 hover:text-ink-950",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="product-filter"
                        className="absolute inset-0 rounded-xl bg-ink-950"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative">
                      {c.label}{" "}
                      <span className={cn("font-mono text-xs", isActive ? "text-ink-300" : "text-ink-500")}>
                        {count}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} styles
        </p>
        <motion.ul layout className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product) => (
              <motion.li
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProductCard product={product} onInquire={setSelected} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>

        <p className="mt-10 text-center text-sm text-ink-500">
          Swatches illustrate stitch structure and gauge. Custom yarns, colourways, trims and packaging are developed to
          each buyer&apos;s specification.
        </p>
      </div>

      <AnimatePresence>
        {selected ? <InquiryModal key={selected.id} product={selected} onClose={closeModal} /> : null}
      </AnimatePresence>
    </section>
  );
}
