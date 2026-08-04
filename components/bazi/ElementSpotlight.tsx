import { FiveElementsBalance } from "@/lib/bazi-types";
import { WoodIcon, FireIcon, EarthIcon, MetalIcon, WaterIcon } from "./ElementIcons";
import { ElementCards } from "./ElementCards";

const ELEMENT_INFO: Record<
  keyof FiveElementsBalance,
  {
    label: string;
    meaning: string;
    blurb: string;
    icon: (p: { className?: string }) => JSX.Element;
    textColor: string;
    bgColor: string;
    ringColor: string;
  }
> = {
  wood: {
    label: "Wood",
    meaning: "Growth & planning",
    blurb:
      "you're in a season built for growth — planning ahead pays off more than reacting in the moment.",
    icon: WoodIcon,
    textColor: "text-sage",
    bgColor: "bg-sage/12",
    ringColor: "border-sage/40",
  },
  fire: {
    label: "Fire",
    meaning: "Passion & visibility",
    blurb:
      "you have real pull toward visibility right now — this is a good season to be seen and heard.",
    icon: FireIcon,
    textColor: "text-burgundy",
    bgColor: "bg-burgundy/10",
    ringColor: "border-burgundy/40",
  },
  earth: {
    label: "Earth",
    meaning: "Stability & trust",
    blurb:
      "groundedness and trust are close at hand — steady relationships and routines serve you especially well now.",
    icon: EarthIcon,
    textColor: "text-mauve",
    bgColor: "bg-mauve/12",
    ringColor: "border-mauve/40",
  },
  metal: {
    label: "Metal",
    meaning: "Self-expression & creativity",
    blurb:
      "there's a strong pull toward self-expression right now — creative or personal work wants your attention.",
    icon: MetalIcon,
    textColor: "text-stone",
    bgColor: "bg-stone/15",
    ringColor: "border-stone/40",
  },
  water: {
    label: "Water",
    meaning: "Resources & money",
    blurb:
      "resources and money matters are highlighted — a good season to think clearly about what you're building toward.",
    icon: WaterIcon,
    textColor: "text-aubergine",
    bgColor: "bg-aubergine/10",
    ringColor: "border-aubergine/40",
  },
};

export function ElementSpotlight({
  fiveElements,
  name,
}: {
  fiveElements: FiveElementsBalance;
  name?: string;
}) {
  const strongestKey = (
    Object.keys(fiveElements) as (keyof FiveElementsBalance)[]
  ).reduce((a, b) => (fiveElements[a] >= fiveElements[b] ? a : b));
  const info = ELEMENT_INFO[strongestKey];
  const Icon = info.icon;
  const displayName = name?.trim() || "Right now";

  return (
    <div className="space-y-6">
      {/* the personal, warm spotlight on the one dominant element */}
      <div
        className={`animate-card-pop rounded-xl2 border-2 ${info.ringColor} ${info.bgColor} p-8 text-center opacity-0`}
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-bg-surface/80">
          <Icon className={`h-10 w-10 ${info.textColor}`} />
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Your dominant element
        </p>
        <p className={`mt-2 font-display text-3xl ${info.textColor}`}>
          {info.label}
        </p>
        <p className="mt-1 text-sm font-medium text-ink">{info.meaning}</p>
        <p className="mx-auto mt-4 max-w-md text-balance text-sm leading-relaxed text-ink-muted">
          {displayName}, {info.blurb}
        </p>
      </div>

      {/* the rest, shown together as context for the full balance */}
      <div>
        <p className="mb-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          Your full balance
        </p>
        <ElementCards
          fiveElements={fiveElements}
          delayBase={150}
          highlightKey={strongestKey}
        />
      </div>
    </div>
  );
}
