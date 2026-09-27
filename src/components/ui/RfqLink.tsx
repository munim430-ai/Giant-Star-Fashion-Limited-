"use client";

import { prefillRfq, type RfqPrefill } from "@/lib/rfq";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { prefill?: RfqPrefill };

/** Anchor to the RFQ form that also pre-selects the inquiry details. */
export function RfqLink({ prefill, onClick, ...props }: Props) {
  return (
    <a
      href="#contact"
      onClick={(event) => {
        prefillRfq(prefill);
        onClick?.(event);
      }}
      {...props}
    />
  );
}
