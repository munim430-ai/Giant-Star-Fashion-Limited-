import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "left", tone = "light", id, className }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p
        className={cn(
          "mb-4 inline-flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-[0.18em]",
          dark ? "text-crimson-300" : "text-crimson-700",
        )}
      >
        <span aria-hidden="true" className="flex gap-1">
          <span className="size-1.5 rounded-full bg-olive-500" />
          <span className="size-1.5 rounded-full bg-rust-500" />
          <span className="size-1.5 rounded-full bg-crimson-700" />
        </span>
        {eyebrow}
      </p>
      <h2
        id={id}
        className={cn("text-balance font-display text-display-lg font-semibold", dark ? "text-white" : "text-ink-950")}
      >
        {title}
      </h2>
      {description ? (
        <p className={cn("mt-5 text-pretty text-lg leading-relaxed", dark ? "text-ink-300" : "text-ink-600")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
