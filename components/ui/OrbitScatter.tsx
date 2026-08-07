/**
 * A second decorative motif, distinct from the single circle in the hero —
 * several rings of different sizes scattered asymmetrically, so the site's
 * visual signature feels developed rather than one repeated static icon.
 */
export function OrbitScatter({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute -left-16 top-10 h-40 w-40 rounded-full border border-burgundy/15 motion-safe:animate-drift-a"
      />
      <div
        className="absolute -right-10 top-1/3 h-24 w-24 rounded-full border border-aubergine/15 motion-safe:animate-drift-b"
        style={{ animationDelay: "-7s" }}
      />
      <div
        className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full border border-burgundy/10 motion-safe:animate-drift-c"
        style={{ animationDelay: "-13s" }}
      />
      <div
        className="absolute -right-24 bottom-10 h-72 w-72 rounded-full border border-burgundy/10 motion-safe:animate-drift-b"
        style={{ animationDelay: "-19s" }}
      />
    </div>
  );
}
