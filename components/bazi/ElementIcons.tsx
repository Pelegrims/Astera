type IconProps = { className?: string };

export function WoodIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <line x1="12" y1="21" x2="12" y2="5" />
      <path d="M12 9 L7 5" />
      <path d="M12 13 L17 8" />
      <path d="M12 17 L8 13" />
    </svg>
  );
}

export function FireIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.5-2-1-2.5.8 1 1 2 1 3a4 4 0 1 1-8 0c0-4 3-5 4-7.5Z" />
    </svg>
  );
}

export function EarthIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="5" width="14" height="14" rx="1" />
      <line x1="5" y1="12" x2="19" y2="12" />
      <line x1="12" y1="5" x2="12" y2="19" />
    </svg>
  );
}

export function MetalIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L20 12 L12 21 L4 12 Z" />
    </svg>
  );
}

export function WaterIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
      <path d="M4 9c1.5 1.2 2.5 1.2 4 0s2.5-1.2 4 0 2.5 1.2 4 0 2.5-1.2 4 0" />
      <path d="M4 15c1.5 1.2 2.5 1.2 4 0s2.5-1.2 4 0 2.5 1.2 4 0 2.5-1.2 4 0" />
    </svg>
  );
}
