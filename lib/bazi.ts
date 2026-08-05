import { Solar } from "lunar-javascript";
import {
  BaziInput,
  BaziPillar,
  BaziResult,
  FiveElementsBalance,
  SolarTimeMoment,
  TransitResult,
} from "./bazi-types";
import {
  computeBaziStars,
  computeVoidBranches,
  StarHit,
  PillarKey,
} from "./bazi-stars";

/**
 * This wraps `lunar-javascript` (MIT licensed, https://github.com/6tail/lunar-javascript),
 * the same engine used by professional BaZi tools — it already handles the
 * tricky part (the Chinese solar year boundary, 立春/Lichun, isn't Jan 1st
 * or Lunar New Year) internally, so we don't have to reimplement any
 * astronomical calendar math ourselves.
 *
 * IMPORTANT: this file was written against the library's documented API
 * but has not been run end-to-end in this environment (no network access
 * to `npm install` and execute it here). Before trusting this for real
 * clients, run `npm install` locally, test a few birth dates you already
 * know the correct BaZi chart for, and compare. If any method name below
 * doesn't match what's installed, check node_modules/lunar-javascript's
 * README for the current EightChar API — the shape of the calculation is
 * right, but exact method names can shift between library versions.
 */

export const STEM_ELEMENT: Record<string, string> = {
  "甲": "Wood", "乙": "Wood",
  "丙": "Fire", "丁": "Fire",
  "戊": "Earth", "己": "Earth",
  "庚": "Metal", "辛": "Metal",
  "壬": "Water", "癸": "Water",
};

const TEN_GOD_EN: Record<string, string> = {
  "比肩": "Friend",
  "劫财": "Rob Wealth",
  "食神": "Eating God",
  "伤官": "Hurting Officer",
  "偏财": "Indirect Wealth",
  "正财": "Direct Wealth",
  "七杀": "Seven Killings",
  "偏官": "Seven Killings",
  "正官": "Direct Officer",
  "偏印": "Indirect Resource",
  "正印": "Direct Resource",
};

function translateTenGod(chinese: string): string {
  return TEN_GOD_EN[chinese] ?? chinese;
}

function elementOfStem(stem: string): string {
  return STEM_ELEMENT[stem] ?? stem;
}

/**
 * Classical hidden stems (藏干) of each branch, main qi first. Needed for
 * the luck-pillar column in transits — its branch is not one of the four
 * the transit EightChar exposes, so the lookup must be ours. Order may
 * differ cosmetically from lunar-javascript's own listing in rare
 * branches; the SET of stems is canonical.
 */
const HIDDEN_STEMS: Record<string, string[]> = {
  "子": ["癸"],
  "丑": ["己", "癸", "辛"],
  "寅": ["甲", "丙", "戊"],
  "卯": ["乙"],
  "辰": ["戊", "乙", "癸"],
  "巳": ["丙", "庚", "戊"],
  "午": ["丁", "己"],
  "未": ["己", "丁", "乙"],
  "申": ["庚", "壬", "戊"],
  "酉": ["辛"],
  "戌": ["戊", "辛", "丁"],
  "亥": ["壬", "甲"],
};

/**
 * The 10-year luck pillar active in a given (civil) year, or null if the
 * year falls before the first cycle starts. Boundary note: real DaYun
 * switches on an exact solar-term-derived date inside the start year; at
 * year granularity we treat the whole start year as the new cycle, which
 * is the common calculator convention.
 */
export function activeLuckPillar<T extends { startYear: number }>(
  luckPillars: T[],
  year: number
): T | null {
  let active: T | null = null;
  for (const p of luckPillars) {
    if (p.startYear <= year && (!active || p.startYear > active.startYear)) {
      active = p;
    }
  }
  return active;
}

const YANG_STEMS = new Set(["甲", "丙", "戊", "庚", "壬"]);

export const BRANCH_ELEMENT: Record<string, string> = {
  "子": "Water", "丑": "Earth", "寅": "Wood", "卯": "Wood",
  "辰": "Earth", "巳": "Fire", "午": "Fire", "未": "Earth",
  "申": "Metal", "酉": "Metal", "戌": "Earth", "亥": "Water",
};

export const BRANCH_ANIMAL: Record<string, string> = {
  "子": "Rat", "丑": "Ox", "寅": "Tiger", "卯": "Rabbit",
  "辰": "Dragon", "巳": "Snake", "午": "Horse", "未": "Goat",
  "申": "Monkey", "酉": "Rooster", "戌": "Dog", "亥": "Pig",
};

/** 长生十二神 — the 12 Qi phases of the Day Master through the branches */
const QI_PHASE_EN: Record<string, string> = {
  "长生": "Birth",
  "沐浴": "Bath",
  "冠带": "Dressing",
  "临官": "Coming of Age",
  "帝旺": "Peak",
  "衰": "Decline",
  "病": "Illness",
  "死": "Death",
  "墓": "Tomb",
  "绝": "Severing",
  "胎": "Conception",
  "养": "Nurturing",
};

const ELEMENT_INDEX: Record<string, number> = {
  Wood: 0, Fire: 1, Earth: 2, Metal: 3, Water: 4,
};

/**
 * Ten God of any stem relative to a given Day Master — pure five-element
 * cycle + polarity, no library dependency, so natal pillars and transit
 * (current year/month/day/hour) pillars are guaranteed to use the exact
 * same logic. Verified against the reference calculator's rendering:
 * for Day Master 辛 it labels 丙 = Direct Officer (Правильная власть),
 * 庚 = Rob Wealth (Уменьшение богатства), 癸 = Eating God (Дух
 * наслаждения) — all reproduced by this function.
 */
export function tenGodOf(dayMaster: string, stem: string): string {
  const dmEl = ELEMENT_INDEX[STEM_ELEMENT[dayMaster] ?? ""];
  const stEl = ELEMENT_INDEX[STEM_ELEMENT[stem] ?? ""];
  if (dmEl === undefined || stEl === undefined) return "";
  const samePolarity = YANG_STEMS.has(dayMaster) === YANG_STEMS.has(stem);
  const rel = (stEl - dmEl + 5) % 5;
  const chinese =
    rel === 0
      ? samePolarity ? "比肩" : "劫财"
      : rel === 1
      ? samePolarity ? "食神" : "伤官"
      : rel === 2
      ? samePolarity ? "偏财" : "正财"
      : rel === 3
      ? samePolarity ? "七杀" : "正官"
      : samePolarity ? "偏印" : "正印";
  return translateTenGod(chinese);
}

const QI_PHASES_CN = [
  "长生", "沐浴", "冠带", "临官", "帝旺", "衰",
  "病", "死", "墓", "绝", "胎", "养",
];
const STEM_ORDER = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCH_ORDER = [
  "子", "丑", "寅", "卯", "辰", "巳",
  "午", "未", "申", "酉", "戌", "亥",
];

/**
 * Ganzhi label of a (Chinese solar) year — pure 60-cycle math anchored at
 * 1984 = 甲子. Used for the year ruler under the luck pillars: the whole
 * civil year is labeled with its Chinese year, same convention as the
 * reference's year table ("2027 丁未"). Strictly, the year flips at 立春
 * (~Feb 4), so January belongs to the previous pillar — noted in the UI.
 */
export function yearGanZhi(year: number): { stem: string; branch: string } {
  const i = (((year - 1984) % 60) + 60) % 60;
  return { stem: STEM_ORDER[i % 10], branch: BRANCH_ORDER[i % 12] };
}
/** 长生 (Birth) anchor branch of each stem; yang stems run forward, yin backward */
const CHANGSHENG_START: Record<string, string> = {
  "甲": "亥", "丙": "寅", "戊": "寅", "庚": "巳", "壬": "申",
  "乙": "午", "丁": "酉", "己": "酉", "辛": "子", "癸": "卯",
};

/**
 * Qi phase (12-stage cycle) of the Day Master at a given branch.
 * Classical rule: yang Day Masters walk the cycle forward from their
 * Birth branch, yin ones walk backward. Verified against the reference:
 * Day Master 辛 → 午 = Illness (Болезнь), 寅 = Conception (Зачатие),
 * both exactly as feng-shui.ua renders them.
 */
export function qiPhaseOf(dayMaster: string, branch: string): string {
  const start = BRANCH_ORDER.indexOf(CHANGSHENG_START[dayMaster] ?? "");
  const target = BRANCH_ORDER.indexOf(branch);
  if (start < 0 || target < 0) return "";
  const forward = YANG_STEMS.has(dayMaster);
  const steps = forward
    ? (target - start + 12) % 12
    : (start - target + 12) % 12;
  return QI_PHASE_EN[QI_PHASES_CN[steps]];
}


/**
 * Converts a birth moment from civil clock time to MEAN LOCAL SOLAR TIME —
 * the time frame classical BaZi (and Julia's reference calculator,
 * feng-shui.ua) computes all four pillars in.
 *
 *   solar = clock − utcOffset + longitude/15h   (i.e. clock + lng×4min − offset)
 *
 * Verified against the reference's own printout for Kyiv, 1989-05-19:
 * clock 20:00 at UTC+4 (Soviet decree time +1 and summer DST +1 over the
 * base UTC+2 — both come out of the IANA tz database automatically via
 * offsetForDate) → UTC 16:00 → +2:02 for longitude 30°31′E → 18:02, which
 * is exactly the "Солнечное время: 18:02" the reference displays. Mean
 * solar only — no equation-of-time term; the reference doesn't apply one
 * either (May 19 EoT ≈ +3.5 min would have made it 18:05).
 *
 * Pure arithmetic on a UTC-ms timeline, so shifts across midnight/month/
 * year boundaries are handled by Date itself and no local timezone of the
 * machine running this ever leaks in (only Date.UTC + getUTC* are used).
 */
export function meanSolarMoment(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  utcOffsetHours: number,
  lng: number
): SolarTimeMoment {
  const shiftMinutes = Math.round(lng * 4 - utcOffsetHours * 60);
  const ms =
    Date.UTC(year, month - 1, day, hour, minute) + shiftMinutes * 60_000;
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    shiftMinutes,
  };
}

export function calculateBazi(input: BaziInput): BaziResult {
  const { year, month, day, hour, minute, gender, utcOffset, lng } = input;

  // All four pillars (hour branch, the 23:00 day boundary, and which side
  // of a solar-term instant the birth falls on) are taken in mean local
  // solar time when we know the longitude — this is what fixed the
  // "1 hour off for USSR-era dates" discrepancy Julia caught: we were
  // feeding raw clock time in, while her reference computes from solar
  // time. Without a longitude (old stored rows predating this field) we
  // keep the legacy raw-clock behavior rather than guessing.
  //
  // Known edge case, accepted for now: lunar-javascript evaluates the
  // solar-term (节气) instants themselves in China Standard Time, so for
  // births within a few hours of a month-boundary term the month pillar
  // can differ from a locally-computed term instant. Same class of
  // tolerance exists in the reference tools; revisit only if a real
  // client chart lands on a boundary.
  const solarMoment: SolarTimeMoment | undefined =
    typeof lng === "number" && Number.isFinite(lng)
      ? meanSolarMoment(year, month, day, hour, minute, utcOffset, lng)
      : undefined;

  const t = solarMoment ?? { year, month, day, hour, minute };
  const solar = Solar.fromYmdHms(t.year, t.month, t.day, t.hour, t.minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  // The Day Master comes first — every Ten God, hidden-stem god, and Qi
  // phase below is computed relative to it with the pure table functions
  // above (not library calls), so the natal pillars and the transit
  // pillars in calculateTransitPillars can never drift apart.
  const dayMasterStem = eightChar.getDayGan();

  function buildPillar(
    label: string,
    stem: string,
    branch: string,
    hiddenStems: string[]
  ): BaziPillar {
    return {
      label,
      stem,
      branch,
      hiddenStems,
      hiddenTenGods: hiddenStems.map((h) => tenGodOf(dayMasterStem, h)),
      tenGodStem:
        label === "Day" ? "Day Master" : tenGodOf(dayMasterStem, stem),
      element: elementOfStem(stem),
      stemYinYang: YANG_STEMS.has(stem) ? "Yang" : "Yin",
      branchElement: BRANCH_ELEMENT[branch] ?? "",
      branchAnimal: BRANCH_ANIMAL[branch] ?? "",
      qiPhase: qiPhaseOf(dayMasterStem, branch) || undefined,
    };
  }

  const yearPillar = buildPillar(
    "Year",
    eightChar.getYearGan(),
    eightChar.getYearZhi(),
    eightChar.getYearHideGan()
  );
  const monthPillar = buildPillar(
    "Month",
    eightChar.getMonthGan(),
    eightChar.getMonthZhi(),
    eightChar.getMonthHideGan()
  );
  const dayPillar = buildPillar(
    "Day",
    eightChar.getDayGan(),
    eightChar.getDayZhi(),
    eightChar.getDayHideGan()
  );
  const hourPillar = buildPillar(
    "Hour",
    eightChar.getTimeGan(),
    eightChar.getTimeZhi(),
    eightChar.getTimeHideGan()
  );

  // Five element balance: count element occurrences across all four stems
  // plus the stems hidden within each branch (a simplified, commonly used
  // weighting — hidden stems in the branch all count once here; more
  // advanced systems weight the "main" hidden stem more heavily).
  const allStems = [
    yearPillar.stem,
    monthPillar.stem,
    dayPillar.stem,
    hourPillar.stem,
    ...yearPillar.hiddenStems,
    ...monthPillar.hiddenStems,
    ...dayPillar.hiddenStems,
    ...hourPillar.hiddenStems,
  ];

  const fiveElements: FiveElementsBalance = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0,
  };
  for (const stem of allStems) {
    const el = elementOfStem(stem).toLowerCase() as keyof FiveElementsBalance;
    if (el in fiveElements) fiveElements[el] += 1;
  }

  // Luck pillars (大运) — the 10-year cycles. lunar-javascript's Yun/DaYun
  // API takes the gender as 1 (male) or 0 (female).
  const yun = eightChar.getYun(gender === "male" ? 1 : 0);
  const daYunList = yun.getDaYun(); // typically returns ~10 pillars including the "before luck starts" one
  const luckPillars = daYunList
    .filter((d: any) => typeof d.getGanZhi === "function" && d.getGanZhi())
    .map((d: any) => {
      const ganZhi = String(d.getGanZhi());
      const chars = Array.from(ganZhi);
      const stem = chars[0] ?? "";
      const branch = chars[1] ?? "";
      return {
        startAge: d.getStartAge(),
        startYear: d.getStartYear(),
        ganZhi,
        stem,
        branch,
        stemElement: elementOfStem(stem),
        branchAnimal: BRANCH_ANIMAL[branch] ?? "",
      };
    });

  // Symbolic stars (deities / spirits & demons) + Void — pure classical
  // table lookups, verified against the reference calculator's rendered
  // side panel (see lib/bazi-stars.ts).
  const stars = computeBaziStars({
    yearStem: yearPillar.stem,
    yearBranch: yearPillar.branch,
    monthBranch: monthPillar.branch,
    dayStem: dayPillar.stem,
    dayBranch: dayPillar.branch,
    hourBranch: hourPillar.branch,
  });
  const voidBranches = computeVoidBranches(dayPillar.stem, dayPillar.branch);

  return {
    pillars: {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar,
    },
    dayMaster: {
      stem: dayMasterStem,
      element: elementOfStem(dayMasterStem),
      yinYang: YANG_STEMS.has(dayMasterStem) ? "Yang" : "Yin",
    },
    fiveElements,
    luckPillars,
    luckStartAge: yun.getStartYear ? yun.getStartYear() : 0,
    stars,
    voidBranches,
    solarTime: solarMoment,
  };
}

/**
 * The pillars of an arbitrary moment — "current energies": the selected
 * year / month / day / hour rendered exactly like the natal pillars, but
 * with every Ten God, hidden-stem god, Qi phase, and star read RELATIVE
 * TO THE NATAL CHART (its Day Master and its star anchors), which is how
 * classical BaZi reads transits and how the reference calculator's
 * year/month columns work. Uses the same mean-solar-time conversion and
 * the same lunar-javascript boundary logic (立春 for the year, 节气 for
 * the month) as the natal calculation.
 */
export function calculateTransitPillars(input: {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** UTC offset of the chart's location at the SELECTED moment (fractional hours) */
  utcOffset: number;
  lng?: number;
  natal: BaziResult;
}): TransitResult {
  const { year, month, day, hour, minute, utcOffset, lng, natal } = input;
  const dm = natal.dayMaster.stem;

  const solarMoment: SolarTimeMoment | undefined =
    typeof lng === "number" && Number.isFinite(lng)
      ? meanSolarMoment(year, month, day, hour, minute, utcOffset, lng)
      : undefined;

  const t = solarMoment ?? { year, month, day, hour, minute };
  const solar = Solar.fromYmdHms(t.year, t.month, t.day, t.hour, t.minute, 0);
  const eightChar = solar.getLunar().getEightChar();

  function buildTransitPillar(
    label: string,
    stem: string,
    branch: string,
    hiddenStems: string[]
  ): BaziPillar {
    return {
      label,
      stem,
      branch,
      hiddenStems,
      hiddenTenGods: hiddenStems.map((h) => tenGodOf(dm, h)),
      // Unlike the natal day pillar, the transit day stem is NOT the
      // person — it gets a real Ten God relative to the natal Day Master.
      tenGodStem: tenGodOf(dm, stem),
      element: elementOfStem(stem),
      stemYinYang: YANG_STEMS.has(stem) ? "Yang" : "Yin",
      branchElement: BRANCH_ELEMENT[branch] ?? "",
      branchAnimal: BRANCH_ANIMAL[branch] ?? "",
      qiPhase: qiPhaseOf(dm, branch) || undefined,
    };
  }

  const pillars = {
    year: buildTransitPillar(
      "Year",
      eightChar.getYearGan(),
      eightChar.getYearZhi(),
      eightChar.getYearHideGan()
    ),
    month: buildTransitPillar(
      "Month",
      eightChar.getMonthGan(),
      eightChar.getMonthZhi(),
      eightChar.getMonthHideGan()
    ),
    day: buildTransitPillar(
      "Day",
      eightChar.getDayGan(),
      eightChar.getDayZhi(),
      eightChar.getDayHideGan()
    ),
    hour: buildTransitPillar(
      "Hour",
      eightChar.getTimeGan(),
      eightChar.getTimeZhi(),
      eightChar.getTimeHideGan()
    ),
  };

  // The 10-year luck pillar (大运) active at the selected moment — the
  // decade context every classical reading pairs with the year/month/day.
  const activeLuck = activeLuckPillar(natal.luckPillars ?? [], year);
  const nextLuck = activeLuck
    ? (natal.luckPillars ?? []).find(
        (p) => p.startYear > activeLuck.startYear
      )
    : null;
  const luck = activeLuck
    ? {
        pillar: buildTransitPillar(
          "Luck",
          activeLuck.stem,
          activeLuck.branch,
          HIDDEN_STEMS[activeLuck.branch] ?? []
        ),
        startAge: activeLuck.startAge,
        startYear: activeLuck.startYear,
        endYear: nextLuck ? nextLuck.startYear - 1 : activeLuck.startYear + 9,
      }
    : null;

  // The natal chart's star targets don't change — a transit pillar simply
  // "arrives" at them: if the current year's branch is one of the natal
  // Nobleman branches, that Nobleman is active this year. This mirrors the
  // reference calculator, which marks e.g. Благородный(д) in the selected
  // year's column using the NATAL (д)/(г) anchors.
  const hits: StarHit[] = [];
  const scan: { key: PillarKey; branch: string }[] = [
    { key: "hour", branch: pillars.hour.branch },
    { key: "day", branch: pillars.day.branch },
    { key: "month", branch: pillars.month.branch },
    { key: "year", branch: pillars.year.branch },
  ];
  if (luck) scan.push({ key: "luck", branch: luck.pillar.branch });
  for (const { key, branch } of scan) {
    for (const s of natal.stars.summary) {
      for (const target of s.targets) {
        if (target.branches.includes(branch)) {
          hits.push({
            pillar: key,
            name: s.name,
            chinese: s.chinese,
            category: s.category,
            anchor: target.anchor,
          });
        }
      }
    }
  }

  return { pillars, hits, luck, solarTime: solarMoment };
}
