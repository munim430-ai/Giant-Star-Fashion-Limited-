"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { company, navLinks, primaryContact } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { RfqLink } from "./ui/RfqLink";

const tourPrefill = { inquiryType: "Factory Tour / Audit Visit" } as const;

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    elements.forEach((el) => observer.observe(el));

    // Clear the highlight while the hero (above every nav target) is on screen.
    const onScroll = () => {
      const first = elements[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.45) setActive(null);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [ids]);

  return active;
}

const sectionIds = navLinks.map((l) => l.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-950 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      {/* Direct-contact strip */}
      <aside aria-label="Direct contact" className="bg-ink-950 text-ink-200">
        <div className="container flex h-10 items-center justify-between gap-4 text-xs sm:text-[0.8125rem]">
          <p className="hidden items-center gap-2 md:flex">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-forest-300" aria-hidden="true" />
            {company.businessType} · Est. {company.established}
          </p>
          <ul className="flex w-full items-center justify-between gap-x-5 md:w-auto md:justify-end">
            <li>
              <a href={`mailto:${primaryContact.email}`} className="inline-flex items-center gap-1.5 hover:text-white">
                <Mail className="size-3.5" aria-hidden="true" />
                {primaryContact.email}
              </a>
            </li>
            <li>
              <a href={primaryContact.phone.href} className="inline-flex items-center gap-1.5 hover:text-white">
                <Phone className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{primaryContact.phone.display}</span>
                <span className="sm:hidden">Call</span>
              </a>
            </li>
            <li className="hidden items-center gap-1.5 sm:inline-flex">
              <MapPin className="size-3.5" aria-hidden="true" />
              {primaryContact.area}
            </li>
          </ul>
        </div>
      </aside>

      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300",
          scrolled || open
            ? "border-ink-100 bg-white/85 shadow-[0_8px_30px_-18px_rgb(2_17_41/0.35)] backdrop-blur-xl"
            : "border-transparent bg-white/70 backdrop-blur-md",
        )}
      >
        <nav className="container flex h-[4.25rem] items-center justify-between gap-6" aria-label="Primary">
          <a href="#top" className="shrink-0 rounded-md" aria-label={`${company.name} — back to top`}>
            <Logo priority className="h-12 w-auto sm:h-[3.25rem]" sizes="(min-width: 640px) 104px, 96px" />
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id} className="relative">
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "relative block rounded-full px-3 py-2 text-sm font-medium transition-colors xl:px-3.5",
                      isActive ? "text-ink-950" : "text-ink-600 hover:text-ink-950",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-full bg-ink-100"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    ) : null}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <RfqLink prefill={tourPrefill} className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}>
              Request Factory Tour / RFP
              <ArrowUpRight />
            </RfqLink>
            <button
              type="button"
              className="inline-flex size-10 items-center justify-center rounded-full border border-ink-200 text-ink-900 transition hover:bg-ink-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open ? (
            <motion.div
              id="mobile-menu"
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-ink-100 bg-white lg:hidden"
            >
              <div className="container max-h-[calc(100dvh-7rem)] overflow-y-auto py-4">
                <ul className="grid gap-1 sm:grid-cols-2">
                  {navLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={`#${link.id}`}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium",
                          active === link.id ? "bg-ink-100 text-ink-950" : "text-ink-700 hover:bg-ink-50",
                        )}
                      >
                        {link.label}
                        <span className="font-mono text-xs text-ink-500">#{link.id}</span>
                      </a>
                    </li>
                  ))}
                </ul>
                <RfqLink
                  prefill={tourPrefill}
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}
                >
                  Request Factory Tour / RFP
                  <ArrowUpRight />
                </RfqLink>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>
    </>
  );
}
