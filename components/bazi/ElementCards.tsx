import { FiveElementsBalance } from "@/lib/bazi-types";
import { WoodIcon, FireIcon, EarthIcon, MetalIcon, WaterIcon } from "./ElementIcons";

const ELEMENTS: {
  key: keyof FiveElementsBalance;
  label: string;
  meaning: string;
  icon: (p: { className?: string }) => JSX.Element;
  textColor: string;
  bgColor: string;
  barColor: string;
}[] = [
  {
    key: "wood",
    label: "Wood",
    meaning: "Growth & planning",
    icon: WoodIcon,
    textColor: "text-sage",
    bgColor: "bg-sage/12",
    barColor: "bg-sage",
  },
  {
    key: "fire",
    label: "Fire",
    meaning: "Passion & visibility",
    icon: FireIcon,
    textColor: "text-burgundy",
    bgColor: "bg-burgundy/10",
    barColor: "bg-burgundy",
  },
  {
    key: "earth",
    label: "Earth",
    meaning: "Stability & trust",
    icon: EarthIcon,
    textColor: "text-mauve",
    bgColor: "bg-mauve/12",
    barColor: "bg-mauve",
  },
  {
    key: "metal",
    label: "Metal",
    meaning: "Self-expression & creativity",
    icon: MetalIcon,
    textColor: "text-stone",
    bgColor: "bg-stone/15",
    barColor: "bg-stone",
  },
  {
    key: "water",
    label: "Water",
    meaning: "Resources & money",
    icon: WaterIcon,
    textColor: "text-aubergine",
    bgColor: "bg-aubergine/10",
    barColor: "bg-aubergine",
  },
];

export function ElementCards({
  fiveElements,
  grown = true,
  delayBase = 0,
}: {
  fiveElements: FiveElementsBalance;
  grown?: boolean;
  delayBase?: number;
}) {
  const total =
    fiveElements.wood +
    fiveElements.fire +
    fiveElements.earth +
    fiveElements.metal +
    fiveElements.water || 1;
  const max = Math.max(
    fiveElements.wood,
    fiveElements.fire,
    fiveElements.earth,
    fiveElements.metal,
    fiveElements.water,
    1
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ELEMENTS.map((el, i) => {
        const Icon = el.icon;
        const count = fiveElements[el.key];
        const isStrongest = count === max && count > 0;
        return (
          <div
            key={el.key}
            className={`animate-card-pop rounded-xl2 border p-4 text-center opacity-0 ${
              isStrongest ? "border-line bg-bg-surface/80" : "border-line bg-bg-surface/50"
            }`}
            style={{ animationDelay: `${delayBase + i * 90}ms` }}
          >
            <div
              className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${el.bgColor}`}
            >
              <Icon className={`h-5 w-5 ${el.textColor}`} />
            </div>
            <p className="mt-3 font-display text-lg text-aubergine">
              {el.label}
            </p>
            <p className="mt-1 text-[11px] leading-snug text-ink-muted">
              {el.meaning}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${el.barColor}`}
                style={{ width: grown ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink-faint">{count}</p>
            {isStrongest && (
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-burgundy">
                Strongest
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
