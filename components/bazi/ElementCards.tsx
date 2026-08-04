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
    textColor: "text-elementWood",
    bgColor: "bg-elementWood/12",
    barColor: "bg-elementWood",
  },
  {
    key: "fire",
    label: "Fire",
    meaning: "Passion & visibility",
    icon: FireIcon,
    textColor: "text-elementFire",
    bgColor: "bg-elementFire/10",
    barColor: "bg-elementFire",
  },
  {
    key: "earth",
    label: "Earth",
    meaning: "Stability & trust",
    icon: EarthIcon,
    textColor: "text-elementEarth",
    bgColor: "bg-elementEarth/12",
    barColor: "bg-elementEarth",
  },
  {
    key: "metal",
    label: "Metal",
    meaning: "Self-expression & creativity",
    icon: MetalIcon,
    textColor: "text-elementMetal",
    bgColor: "bg-elementMetal/15",
    barColor: "bg-elementMetal",
  },
  {
    key: "water",
    label: "Water",
    meaning: "Resources & money",
    icon: WaterIcon,
    textColor: "text-elementWater",
    bgColor: "bg-elementWater/10",
    barColor: "bg-elementWater",
  },
];

export function ElementCards({
  fiveElements,
  grown = true,
  delayBase = 0,
  highlightKey,
}: {
  fiveElements: FiveElementsBalance;
  grown?: boolean;
  delayBase?: number;
  /** If set, only this element gets the "Strongest" tag — even when
   * there's a numeric tie with another element — so it always matches
   * whichever one is shown as the dominant element elsewhere on the page. */
  highlightKey?: keyof FiveElementsBalance;
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
        const isStrongest = highlightKey
          ? el.key === highlightKey
          : count === max && count > 0;
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
