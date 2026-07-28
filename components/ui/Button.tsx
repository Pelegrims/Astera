import { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "ghostOnDark";

const variantClasses: Record<Variant, string> = {
  primary:
    "relative overflow-hidden bg-burgundy bg-[linear-gradient(to_bottom,rgba(255,255,255,0.35)_0%,rgba(255,255,255,0)_60%)] text-white hover:bg-burgundy-soft active:bg-burgundy-soft shadow-[0_0_0_1px_rgba(107,30,46,0.4)]",
  secondary:
    "bg-bg-raised text-ink border border-line hover:border-burgundy/40",
  ghost: "bg-transparent text-ink-muted hover:text-ink",
  onDark:
    "relative overflow-hidden bg-petal bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0)_60%)] text-aubergine hover:bg-white active:bg-white",
  ghostOnDark:
    "bg-transparent text-white/70 border border-white/25 hover:text-white hover:border-white/50",
};

// A slow metallic sweep across the primary CTA — the "metal" accent from
// the astrologer's system (self-expression, creativity), encoded as a
// moving reflection rather than a literal color. Tone flips so the sheen
// stays visible on both the dark burgundy button and the light petal one.
const MetalSheen = ({ tone = "light" }: { tone?: "light" | "dark" }) => (
  <span
    aria-hidden="true"
    className={
      tone === "light"
        ? "pointer-events-none absolute inset-0 animate-shimmer bg-[length:250%_100%] bg-[linear-gradient(100deg,transparent_35%,rgba(255,255,255,0.55)_50%,transparent_65%)]"
        : "pointer-events-none absolute inset-0 animate-shimmer bg-[length:250%_100%] bg-[linear-gradient(100deg,transparent_35%,rgba(61,27,46,0.3)_50%,transparent_65%)]"
    }
  />
);

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium tracking-wide transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none disabled:hover:scale-100 motion-reduce:hover:scale-100";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {variant === "primary" && <MetalSheen tone="light" />}
      {variant === "onDark" && <MetalSheen tone="dark" />}
      <span className="relative">{children}</span>
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {variant === "primary" && <MetalSheen tone="light" />}
      {variant === "onDark" && <MetalSheen tone="dark" />}
      <span className="relative">{children}</span>
    </Link>
  );
}
