import { Solar } from "lunar-javascript";
import { BaziInput, BaziPillar, BaziResult, FiveElementsBalance } from "./bazi-types";

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

const STEM_ELEMENT: Record<string, string> = {
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

export function calculateBazi(input: BaziInput): BaziResult {
  const { year, month, day, hour, minute, gender, utcOffset } = input;

  // lunar-javascript works in local (China-relative) civil time; we adjust
  // for the person's actual birth timezone by converting to UTC first,
  // then to the +8 (China Standard Time) reference the library expects
  // internally is NOT required — lunar-javascript computes stems/branches
  // from local civil clock time directly, per the birth location. So we
  // pass the birth date/time as-is; the UTC offset is kept for display
  // and any future "true solar time" refinement, not fed into the library.
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  function buildPillar(
    label: string,
    stem: string,
    branch: string,
    hiddenStems: string[],
    tenGodStem: string
  ): BaziPillar {
    return {
      label,
      stem,
      branch,
      hiddenStems,
      tenGodStem: translateTenGod(tenGodStem),
      element: elementOfStem(stem),
    };
  }

  const yearPillar = buildPillar(
    "Year",
    eightChar.getYearGan(),
    eightChar.getYearZhi(),
    eightChar.getYearHideGan(),
    eightChar.getYearShiShenGan()
  );
  const monthPillar = buildPillar(
    "Month",
    eightChar.getMonthGan(),
    eightChar.getMonthZhi(),
    eightChar.getMonthHideGan(),
    eightChar.getMonthShiShenGan()
  );
  const dayPillar = buildPillar(
    "Day",
    eightChar.getDayGan(),
    eightChar.getDayZhi(),
    eightChar.getDayHideGan(),
    "Day Master" // the day stem IS the Day Master — no ten-god relationship to itself
  );
  const hourPillar = buildPillar(
    "Hour",
    eightChar.getTimeGan(),
    eightChar.getTimeZhi(),
    eightChar.getTimeHideGan(),
    eightChar.getTimeShiShenGan()
  );

  const dayMasterStem = eightChar.getDayGan();

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
    .map((d: any) => ({
      startAge: d.getStartAge(),
      startYear: d.getStartYear(),
      ganZhi: d.getGanZhi(),
    }));

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
    },
    fiveElements,
    luckPillars,
    luckStartAge: yun.getStartYear ? yun.getStartYear() : 0,
  };
}
