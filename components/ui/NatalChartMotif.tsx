export function NatalChartMotif({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  const ringStroke = isDark ? "rgba(242,239,234,0.16)" : "rgba(43,34,48,0.12)";
  const tickStroke = isDark ? "rgba(242,239,234,0.20)" : "rgba(43,34,48,0.14)";
  const lineA = isDark ? "#6BB0B0" : "#5C609F";
  const lineB = isDark ? "#8A9096" : "#3D1B2E";
  const dot = isDark ? "#C9D0D3" : "#3D1B2E";
  const gradA = isDark ? "#6BB0B0" : "#C9BFDD";
  const gradB = isDark ? "#8A9096" : "#5C609F";

  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      <circle cx="180" cy="180" r="150" stroke={ringStroke} strokeWidth="1" fill="none" />
      <circle cx="180" cy="180" r="110" stroke={ringStroke} strokeWidth="1" fill="none" />
      <circle
        cx="180"
        cy="180"
        r="150"
        stroke="url(#nc-gradient)"
        strokeWidth="1"
        fill="none"
        strokeDasharray="2 6"
      />
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        const x1 = 180 + Math.cos(angle) * 110;
        const y1 = 180 + Math.sin(angle) * 110;
        const x2 = 180 + Math.cos(angle) * 150;
        const y2 = 180 + Math.sin(angle) * 150;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={tickStroke} strokeWidth="1" />
        );
      })}
      <line x1="60" y1="205" x2="245" y2="95" stroke={lineA} strokeWidth="1" opacity="0.6" />
      <line x1="95" y1="290" x2="270" y2="130" stroke={lineB} strokeWidth="1" opacity="0.45" />
      <line x1="70" y1="120" x2="290" y2="230" stroke={lineA} strokeWidth="1" opacity="0.3" />
      <circle cx="180" cy="180" r="3" fill={dot} />
      <defs>
        <linearGradient id="nc-gradient" x1="0" y1="0" x2="360" y2="360">
          <stop offset="0%" stopColor={gradA} stopOpacity="0.7" />
          <stop offset="100%" stopColor={gradB} stopOpacity="0.7" />
        </linearGradient>
      </defs>
    </svg>
  );
}
