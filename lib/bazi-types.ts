export interface BaziPillar {
  label: string; // "Hour" | "Day" | "Month" | "Year"
  stem: string; // Heavenly Stem, e.g. "庚"
  branch: string; // Earthly Branch, e.g. "午"
  hiddenStems: string[]; // stems hidden within the branch
  tenGodStem: string; // Ten God relationship of the stem to the Day Master
  element: string; // element of the stem, e.g. "Metal"
}

export interface FiveElementsBalance {
  wood: number;
  fire: number;
  earth: number;
  metal: number;
  water: number;
}

export interface LuckPillar {
  startAge: number;
  startYear: number;
  ganZhi: string; // e.g. "壬申"
}

export interface BaziResult {
  pillars: {
    year: BaziPillar;
    month: BaziPillar;
    day: BaziPillar;
    hour: BaziPillar;
  };
  dayMaster: {
    stem: string;
    element: string;
  };
  fiveElements: FiveElementsBalance;
  luckPillars: LuckPillar[];
  luckStartAge: number;
}

export interface BaziInput {
  name: string;
  gender: "male" | "female";
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  utcOffset: number; // e.g. -5 for US Eastern, in hours
}
