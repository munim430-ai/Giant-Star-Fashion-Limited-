"use client";

import { CheckCircle2, Mail, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { company } from "@/data/factoryData";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/Button";

type Props = {
  reference: string;
  delivered: boolean;
  mailto: string;
  hasAttachment?: boolean;
  onReset: () => void;
  compact?: boolean;
};

export function RfqResult({ reference, delivered, mailto, hasAttachment, onReset, compact }: Props) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The form it replaces is taller — bring the confirmation into view and give it focus.
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div className={cn("flex flex-col items-start", compact ? "gap-4" : "gap-5")} role="status">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-forest-50 text-forest-500">
        <CheckCircle2 className="size-6" aria-hidden="true" />
      </span>
      <div>
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-2xl font-semibold text-ink-950 focus:outline-none"
        >
          {delivered ? "Request received." : "Almost there — send it by email."}
        </h3>
        <p className="mt-2 leading-relaxed text-ink-600">
          {delivered ? (
            <>Our merchandising team has your request and will reply from {company.domain} with next steps.</>
          ) : (
            <>
              Your request is validated and ready. Open the pre-filled email to send it straight to{" "}
              <span className="font-medium text-ink-950">{company.generalEmail}</span>
              {hasAttachment ? " — remember to attach your tech pack." : "."}
            </>
          )}
        </p>
      </div>
      <p className="rounded-xl border border-dashed border-ink-200 bg-paper px-4 py-2.5 font-mono text-sm text-ink-700">
        Reference <span className="font-semibold text-ink-950">{reference}</span>
      </p>
      <div className="flex flex-wrap gap-3">
        {delivered ? null : (
          <a href={mailto} className={buttonVariants({ variant: "primary" })}>
            <Mail />
            Open pre-filled email
          </a>
        )}
        <button type="button" onClick={onReset} className={buttonVariants({ variant: "outline" })}>
          <RotateCcw />
          New request
        </button>
      </div>
    </div>
  );
}
