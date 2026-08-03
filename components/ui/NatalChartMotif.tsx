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
  const dot = isDark ? "#C9D0D3" : "#3D1B2E";
  // Same metallic palette used on the wordmark/headline text, for
  // consistency between the two — dark chrome, teal, white highlight, grey.
  const metalStops = isDark
    ? [
        { o: "0%", c: "#2a2f35" },
        { o: "18%", c: "#6bb0b0" },
        { o: "36%", c: "#5a6469" },
        { o: "50%", c: "#c9d0d3" },
        { o: "64%", c: "#6bb0b0" },
        { o: "82%", c: "#5a6469" },
        { o: "100%", c: "#2a2f35" },
      ]
    : [
        { o: "0%", c: "#C9BFDD" },
        { o: "100%", c: "#5C609F" },
      ];
  const glowColor = isDark ? "#C9D0D3" : "#F2E2E0";
  const starColor = isDark ? "#F5F5F5" : "#3D1B2E";

  const stars = [
    { x: 70, y: 60, r: 1.4, o: 0.6 },
    { x: 300, y: 90, r: 1.1, o: 0.5 },
    { x: 60, y: 290, r: 1.2, o: 0.45 },
    { x: 310, y: 270, r: 1.5, o: 0.55 },
    { x: 330, y: 180, r: 1, o: 0.4 },
  ];

  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden="true">
      <circle cx="180" cy="180" r="95" fill="url(#nc-glow)" />

      <circle cx="180" cy="180" r="110" stroke={ringStroke} strokeWidth="1" fill="none" />

      {/* the rotating layer — outer degree ring + wheel divisions, in metallic tones */}
      <g
        className="origin-center animate-spin-slow"
        style={{ transformOrigin: "180px 180px" }}
      >
        <circle cx="180" cy="180" r="150" stroke="url(#nc-gradient)" strokeWidth="1" fill="none" />
        <circle cx="180" cy="180" r="130" stroke="url(#nc-gradient)" strokeWidth="0.5" fill="none" strokeDasharray="1 5" />
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const outer = 168;
          const inner = isMajor ? 160 : 164;
          const x1 = 180 + Math.cos(angle) * inner;
          const y1 = 180 + Math.sin(angle) * inner;
          const x2 = 180 + Math.cos(angle) * outer;
          const y2 = 180 + Math.sin(angle) * outer;
          return (
            <line
              key={`tick-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#nc-gradient)"
              strokeWidth={isMajor ? 1 : 0.5}
              opacity={isMajor ? 0.8 : 0.5}
            />
          );
        })}
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
      </g>

      <line x1="60" y1="205" x2="245" y2="95" stroke="url(#nc-gradient)" strokeWidth="1" opacity="0.7" />
      <line x1="95" y1="290" x2="270" y2="130" stroke="url(#nc-gradient)" strokeWidth="1" opacity="0.5" />
      <line x1="70" y1="120" x2="290" y2="230" stroke="url(#nc-gradient)" strokeWidth="1" opacity="0.35" />
      <circle cx="180" cy="180" r="3" fill={dot} />

      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={starColor} opacity={s.o} />
      ))}

      <defs>
        <linearGradient id="nc-gradient" x1="0" y1="0" x2="360" y2="0">
          {metalStops.map((s, i) => (
            <stop key={i} offset={s.o} stopColor={s.c} />
          ))}
        </linearGradient>
        <radialGradient id="nc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={glowColor} stopOpacity={isDark ? "0.45" : "0.6"} />
          <stop offset="55%" stopColor={glowColor} stopOpacity={isDark ? "0.16" : "0.25"} />
          <stop offset="100%" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
