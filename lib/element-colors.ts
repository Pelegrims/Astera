export interface ElementColorSet {
  text: string;
  bg: string;
  border: string;
  bar: string;
}

/** Keys are lowercase element names ("wood", "fire", "earth", "metal", "water"). */
export const ELEMENT_COLORS: Record<string, ElementColorSet> = {
  wood: {
    text: "text-elementWood",
    bg: "bg-elementWood/12",
    border: "border-elementWood/40",
    bar: "bg-elementWood",
  },
  fire: {
    text: "text-elementFire",
    bg: "bg-elementFire/10",
    border: "border-elementFire/40",
    bar: "bg-elementFire",
  },
  earth: {
    text: "text-elementEarth",
    bg: "bg-elementEarth/12",
    border: "border-elementEarth/40",
    bar: "bg-elementEarth",
  },
  metal: {
    text: "text-elementMetal",
    bg: "bg-elementMetal/15",
    border: "border-elementMetal/40",
    bar: "bg-elementMetal",
  },
  water: {
    text: "text-elementWater",
    bg: "bg-elementWater/10",
    border: "border-elementWater/40",
    bar: "bg-elementWater",
  },
};

export function elementColor(element: string): ElementColorSet {
  return ELEMENT_COLORS[element.toLowerCase()] ?? ELEMENT_COLORS.earth;
}
