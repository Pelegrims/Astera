/**
 * The page's signature element: a single thin arc, like the edge of an
 * orbit or a horizon caught mid-curve. It stands in for "astrology" without
 * a single star, moon, or sparkle — used sparingly between sections.
 */
export function OrbitDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center py-2 ${className}`} aria-hidden="true">
      <svg width="120" height="16" viewBox="0 0 120 16" fill="none">
        <path
          d="M2 14C20 2 100 2 118 14"
          stroke="url(#orbit-gradient)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="orbit-gradient" x1="0" y1="0" x2="120" y2="0">
            <stop offset="0%" stopColor="#C9BFDD" stopOpacity="0" />
            <stop offset="50%" stopColor="#5C609F" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#C9BFDD" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
