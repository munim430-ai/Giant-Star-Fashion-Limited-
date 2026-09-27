import Link from "next/link";
import { DotMatrixMark } from "@/components/ui/DotMatrixMark";
import { buttonVariants } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-paper px-6 text-center">
      <DotMatrixMark withWordmark className="w-56" />
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.16em] text-crimson-700">404 — Dropped stitch</p>
        <h1 className="mt-3 font-display text-display-md font-semibold text-ink-950">
          This page isn&apos;t on the knitting plan.
        </h1>
        <p className="mt-3 text-ink-600">The link may be outdated. Head back to the main site to continue.</p>
      </div>
      <Link href="/" className={buttonVariants({ variant: "dark" })}>
        Back to Giant Star Fashion
      </Link>
    </main>
  );
}
