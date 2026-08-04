/**
 * Matrix of Destiny — a numerology system built from simple digit-sum
 * reduction of the birth date. The underlying arithmetic here is the
 * commonly-circulated public method (reduce any number above 22 by
 * summing its digits, repeat until ≤22). This is OUR OWN implementation
 * and labeling, not a copy of any specific author's branded diagram —
 * several popularizers of this system have their own trademarked visual
 * templates and slightly different point layouts, so treat the specific
 * arrangement and labels here as our own reasonable rendering of the
 * public method, not a specific practitioner's proprietary version.
 */

import { MatrixResult } from "./matrix-types";

function reduce(n: number): number {
  let value = Math.abs(n);
  while (value > 22) {
    value = String(value)
      .split("")
      .reduce((sum, d) => sum + Number(d), 0);
  }
  return value || 22; // 0 is treated as the completion number, 22
}

function sumDigits(n: number): number {
  return String(n)
    .split("")
    .reduce((sum, d) => sum + Number(d), 0);
}

export const ARCHETYPES: Record<number, { name: string; meaning: string }> = {
  1: { name: "The Magician", meaning: "Initiative, willpower, starting things." },
  2: { name: "The High Priestess", meaning: "Intuition, inner knowing, patience." },
  3: { name: "The Empress", meaning: "Creativity, nurturing, abundance." },
  4: { name: "The Emperor", meaning: "Structure, discipline, authority." },
  5: { name: "The Hierophant", meaning: "Tradition, teaching, shared belief." },
  6: { name: "The Lovers", meaning: "Choice, connection, values in relationship." },
  7: { name: "The Chariot", meaning: "Drive, direction, disciplined will." },
  8: { name: "Strength", meaning: "Quiet resilience, self-mastery, patience under pressure." },
  9: { name: "The Hermit", meaning: "Reflection, independence, inner guidance." },
  10: { name: "Wheel of Fortune", meaning: "Cycles, timing, change outside your control." },
  11: { name: "Justice", meaning: "Balance, accountability, cause and effect." },
  12: { name: "The Hanged One", meaning: "Surrender, new perspective, pause before action." },
  13: { name: "Transformation", meaning: "Endings that clear space for something else." },
  14: { name: "Temperance", meaning: "Moderation, blending, patience over force." },
  15: { name: "The Threshold", meaning: "Temptation, attachment, facing what binds you." },
  16: { name: "The Tower", meaning: "Sudden change, breaking what wasn't stable anyway." },
  17: { name: "The Star", meaning: "Hope, renewal, quiet faith after difficulty." },
  18: { name: "The Moon", meaning: "Uncertainty, the unconscious, trusting without full clarity." },
  19: { name: "The Sun", meaning: "Vitality, clarity, being seen plainly." },
  20: { name: "Awakening", meaning: "A call to reassess and respond differently." },
  21: { name: "The World", meaning: "Completion, integration, arriving somewhere whole." },
  22: { name: "The Source", meaning: "Potential before form — the number the whole chart returns to." },
};

export function calculateMatrix(
  day: number,
  month: number,
  year: number
): MatrixResult {
  const a = reduce(day);
  const b = reduce(month);
  const c = reduce(sumDigits(year));
  const d = reduce(a + b + c);
  const e = reduce(sumDigits(a));
  const f = reduce(sumDigits(b));
  const g = reduce(sumDigits(c));
  const h = reduce(sumDigits(d));

  return {
    points: [
      { key: "day", label: "Day", value: a },
      { key: "month", label: "Month", value: b },
      { key: "year", label: "Year", value: c },
      { key: "purpose", label: "Life Purpose", value: d },
      { key: "dayEcho", label: "Day (reduced)", value: e },
      { key: "monthEcho", label: "Month (reduced)", value: f },
      { key: "yearEcho", label: "Year (reduced)", value: g },
      { key: "purposeEcho", label: "Purpose (reduced)", value: h },
    ],
    centerValue: d,
  };
}
