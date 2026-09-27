import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-crimson-700 text-white shadow-[0_8px_24px_-10px_rgb(169_4_37/0.7)] hover:bg-crimson-800 focus-visible:ring-crimson-600",
        dark: "bg-ink-950 text-white hover:bg-ink-800 focus-visible:ring-ink-700",
        outline:
          "border border-ink-200 bg-white text-ink-950 hover:border-ink-950 hover:bg-ink-50 focus-visible:ring-ink-700",
        light:
          "border border-white/25 bg-white/5 text-white backdrop-blur hover:border-white/60 hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-ink-950",
        ghost: "text-ink-700 hover:bg-ink-100 hover:text-ink-950 focus-visible:ring-ink-700",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-[0.95rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />;
});
