import { MatrixResult } from "@/lib/matrix-types";
import { ARCHETYPES } from "@/lib/matrix-of-destiny";
import { Card } from "@/components/ui/Card";

export function MatrixDisplay({ result }: { result: MatrixResult }) {
  const centerArchetype = ARCHETYPES[result.centerValue];
  const angleStep = 360 / result.points.length;

  return (
    <div className="space-y-6">
      <Card className="p-8">
        <h2 className="text-center font-display text-lg text-aubergine">
          Your Matrix
        </h2>

        <div className="relative mx-auto mt-6 h-72 w-72">
          {/* octagon frame */}
          <svg viewBox="0 0 300 300" className="absolute inset-0">
            <polygon
              points={result.points
                .map((_, i) => {
                  const angle = (i * angleStep - 90) * (Math.PI / 180);
                  const x = 150 + 110 * Math.cos(angle);
                  const y = 150 + 110 * Math.sin(angle);
                  return `${x},${y}`;
                })
                .join(" ")}
              fill="none"
              stroke="rgba(43,34,48,0.14)"
              strokeWidth="1"
            />
            <circle cx="150" cy="150" r="45" fill="rgba(107,30,46,0.10)" stroke="rgba(107,30,46,0.5)" strokeWidth="1.5" />
          </svg>

          {/* center value */}
          <div className="absolute left-1/2 top-1/2 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center text-center">
            <p className="font-display text-3xl text-burgundy">
              {result.centerValue}
            </p>
            <p className="text-[10px] text-ink-faint">Life Purpose</p>
          </div>

          {/* outer points */}
          {result.points.map((p, i) => {
            const angle = (i * angleStep - 90) * (Math.PI / 180);
            const x = 50 + 36.5 * Math.cos(angle);
            const y = 50 + 36.5 * Math.sin(angle);
            return (
              <div
                key={p.key}
                className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-2 border-burgundy/25 bg-white text-center shadow-sm"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <p className="font-display text-lg font-medium text-burgundy">
                  {p.value}
                </p>
              </div>
            );
          })}
        </div>

        {centerArchetype && (
          <div className="mx-auto mt-6 max-w-sm text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-faint">
              Center — Life Purpose
            </p>
            <p className="mt-1 font-display text-xl text-burgundy">
              {result.centerValue} · {centerArchetype.name}
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              {centerArchetype.meaning}
            </p>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="font-display text-lg text-aubergine">
          Your Points
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {result.points.map((p) => {
            const arch = ARCHETYPES[p.value];
            return (
              <div
                key={p.key}
                className="rounded-xl2 border border-line bg-bg-surface/60 p-3 text-center"
              >
                <p className="font-display text-xl text-burgundy">
                  {p.value}
                </p>
                <p className="mt-1 text-[11px] font-medium text-ink">
                  {p.label}
                </p>
                {arch && (
                  <p className="mt-1 text-[10px] text-ink-faint">
                    {arch.name}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
