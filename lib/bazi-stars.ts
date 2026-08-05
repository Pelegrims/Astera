/**
 * Symbolic stars (神煞, shen sha) — the "deities" and "spirits & demons"
 * layer of a classical BaZi chart, plus the Void (空亡) branches.
 *
 * Everything here is pure table lookups from the classical method — no
 * library dependency — computed from the standard anchors:
 *   - Day stem  (d)  — the Day Master's own perspective
 *   - Year stem/branch (y) — the family/ancestry perspective
 *   - Month branch (m) — used only by Heavenly Doctor
 * Reference calculators (feng-shui.ua) compute from the same anchors and
 * mark the source with (д)/(г); we mirror that with (d)/(y)/(m).
 *
 * Verified against feng-shui.ua's rendered side panel for the chart
 * 丙午 / 乙未 / 辛亥 / 癸巳 (Kyiv, 2026-08-05, solar 10:20):
 *   Благородный  = 午,寅(d) + 亥,酉(y)   → matches NOBLEMAN tables
 *   Пустота      = 寅,卯                → matches computeVoidBranches
 *   Цветок персика = 子(d) + 卯(y)      → matches PEACH_BLOSSOM
 *   Почтовая лошадь = 巳(d) + 申(y)     → matches SKY_HORSE
 */

export type StarCategory = "deity" | "spirit";
export type StarAnchor = "day" | "year" | "month";
export type PillarKey = "hour" | "day" | "month" | "year" | "luck";

export interface StarHit {
  pillar: PillarKey;
  name: string;
  chinese: string;
  category: StarCategory;
  anchor: StarAnchor;
}

export interface StarSummaryEntry {
  name: string;
  chinese: string;
  category: StarCategory;
  /** target branches per anchor, e.g. [{anchor:"day", branches:["午","寅"]}] */
  targets: { anchor: StarAnchor; branches: string[] }[];
}

export interface BaziStars {
  hits: StarHit[];
  summary: StarSummaryEntry[];
}

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

/** 三合 group index of a branch: 0=申子辰, 1=寅午戌, 2=巳酉丑, 3=亥卯未 */
const TRINE_GROUP: Record<string, number> = {
  "申": 0, "子": 0, "辰": 0,
  "寅": 1, "午": 1, "戌": 1,
  "巳": 2, "酉": 2, "丑": 2,
  "亥": 3, "卯": 3, "未": 3,
};

// group-indexed tables (by TRINE_GROUP of the anchor branch)
const PEACH_BLOSSOM = ["酉", "卯", "午", "子"]; // 桃花
const SKY_HORSE = ["寅", "申", "亥", "巳"]; // 驿马
const ARTS_CANOPY = ["辰", "戌", "丑", "未"]; // 华盖
const GENERAL_STAR = ["子", "午", "酉", "卯"]; // 将星
const ROBBERY_SHA = ["巳", "亥", "寅", "申"]; // 劫煞

// stem-indexed tables (by the anchor stem)
const NOBLEMAN: Record<string, string[]> = { // 天乙贵人
  "甲": ["丑", "未"], "戊": ["丑", "未"], "庚": ["丑", "未"],
  "乙": ["子", "申"], "己": ["子", "申"],
  "丙": ["亥", "酉"], "丁": ["亥", "酉"],
  "壬": ["卯", "巳"], "癸": ["卯", "巳"],
  "辛": ["午", "寅"],
};
const GOLDEN_CARRIAGE: Record<string, string> = { // 金舆
  "甲": "辰", "乙": "巳", "丙": "未", "丁": "申", "戊": "未",
  "己": "申", "庚": "戌", "辛": "亥", "壬": "丑", "癸": "寅",
};
const ACADEMIC_STAR: Record<string, string> = { // 文昌
  "甲": "巳", "乙": "午", "丙": "申", "丁": "酉", "戊": "申",
  "己": "酉", "庚": "亥", "辛": "子", "壬": "寅", "癸": "卯",
};

/**
 * Void (空亡) branches of the day pillar's 10-day cycle (旬): the two
 * branches the cycle never reaches. Derived arithmetically — the sexagenary
 * index n of the day pillar satisfies n ≡ stem (mod 10) and n ≡ branch
 * (mod 12); the void pair is branches (base+10) and (base+11) of the
 * cycle's base index. E.g. day 辛亥 → 甲辰 cycle → void 寅,卯.
 */
export function computeVoidBranches(dayStem: string, dayBranch: string): string[] {
  const s = STEMS.indexOf(dayStem);
  const b = BRANCHES.indexOf(dayBranch);
  if (s < 0 || b < 0) return [];
  let idx = -1;
  for (let n = 0; n < 60; n++) {
    if (n % 10 === s && n % 12 === b) {
      idx = n;
      break;
    }
  }
  if (idx < 0) return [];
  const base = idx - (idx % 10);
  return [BRANCHES[(base + 10) % 12], BRANCHES[(base + 11) % 12]];
}

export interface BaziStarsInput {
  yearStem: string;
  yearBranch: string;
  monthBranch: string;
  dayStem: string;
  dayBranch: string;
  hourBranch: string;
}

interface StarDef {
  name: string;
  chinese: string;
  category: StarCategory;
  /** target branches per anchor for this chart */
  targets: { anchor: StarAnchor; branches: string[] }[];
}

function fromGroup(table: string[], branch: string): string[] {
  const g = TRINE_GROUP[branch];
  return g === undefined ? [] : [table[g]];
}

export function computeBaziStars(input: BaziStarsInput): BaziStars {
  const { yearStem, yearBranch, monthBranch, dayStem, dayBranch, hourBranch } = input;

  const doctorTarget = (() => {
    const m = BRANCHES.indexOf(monthBranch);
    return m < 0 ? [] : [BRANCHES[(m + 11) % 12]]; // branch preceding the month branch
  })();

  const voidBranches = computeVoidBranches(dayStem, dayBranch);

  const defs: StarDef[] = [
    {
      name: "Nobleman", chinese: "天乙贵人", category: "deity",
      targets: [
        { anchor: "day", branches: NOBLEMAN[dayStem] ?? [] },
        { anchor: "year", branches: NOBLEMAN[yearStem] ?? [] },
      ],
    },
    {
      name: "Golden Carriage", chinese: "金舆", category: "deity",
      targets: [{ anchor: "day", branches: GOLDEN_CARRIAGE[dayStem] ? [GOLDEN_CARRIAGE[dayStem]] : [] }],
    },
    {
      name: "Academic Star", chinese: "文昌", category: "deity",
      targets: [{ anchor: "day", branches: ACADEMIC_STAR[dayStem] ? [ACADEMIC_STAR[dayStem]] : [] }],
    },
    {
      name: "Heavenly Doctor", chinese: "天医", category: "deity",
      targets: [{ anchor: "month", branches: doctorTarget }],
    },
    {
      name: "General Star", chinese: "将星", category: "deity",
      targets: [
        { anchor: "day", branches: fromGroup(GENERAL_STAR, dayBranch) },
        { anchor: "year", branches: fromGroup(GENERAL_STAR, yearBranch) },
      ],
    },
    {
      name: "Peach Blossom", chinese: "桃花", category: "spirit",
      targets: [
        { anchor: "day", branches: fromGroup(PEACH_BLOSSOM, dayBranch) },
        { anchor: "year", branches: fromGroup(PEACH_BLOSSOM, yearBranch) },
      ],
    },
    {
      name: "Sky Horse", chinese: "驿马", category: "spirit",
      targets: [
        { anchor: "day", branches: fromGroup(SKY_HORSE, dayBranch) },
        { anchor: "year", branches: fromGroup(SKY_HORSE, yearBranch) },
      ],
    },
    {
      name: "Arts Star", chinese: "华盖", category: "spirit",
      targets: [
        { anchor: "day", branches: fromGroup(ARTS_CANOPY, dayBranch) },
        { anchor: "year", branches: fromGroup(ARTS_CANOPY, yearBranch) },
      ],
    },
    {
      name: "Robbery Demon", chinese: "劫煞", category: "spirit",
      targets: [
        { anchor: "day", branches: fromGroup(ROBBERY_SHA, dayBranch) },
        { anchor: "year", branches: fromGroup(ROBBERY_SHA, yearBranch) },
      ],
    },
    {
      name: "Void", chinese: "空亡", category: "spirit",
      targets: [{ anchor: "day", branches: voidBranches }],
    },
  ];

  // De-duplicate identical target lists across anchors (e.g. day and year
  // stem are the same character, so Nobleman(d) and Nobleman(y) coincide).
  for (const def of defs) {
    const seen = new Set<string>();
    def.targets = def.targets.filter((t) => {
      if (t.branches.length === 0) return false;
      const key = t.branches.slice().sort().join("");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  const pillarBranches: { pillar: PillarKey; branch: string }[] = [
    { pillar: "hour", branch: hourBranch },
    { pillar: "day", branch: dayBranch },
    { pillar: "month", branch: monthBranch },
    { pillar: "year", branch: yearBranch },
  ];

  const hits: StarHit[] = [];
  for (const def of defs) {
    for (const t of def.targets) {
      for (const { pillar, branch } of pillarBranches) {
        if (t.branches.includes(branch)) {
          hits.push({
            pillar,
            name: def.name,
            chinese: def.chinese,
            category: def.category,
            anchor: t.anchor,
          });
        }
      }
    }
  }

  const summary: StarSummaryEntry[] = defs
    .filter((d) => d.targets.length > 0)
    .map(({ name, chinese, category, targets }) => ({ name, chinese, category, targets }));

  return { hits, summary };
}
