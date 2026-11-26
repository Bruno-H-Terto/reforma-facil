import { shares2728 } from "../data/simplesTransition";
import type { Annex } from "../data/taxTables";
import { das } from "./taxes";
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function quickDas(
  annex: Annex,
  rbt: number,
  monthly: number,
  year: 2026 | 2027 | 2028,
) {
  if (rbt > 3600000) return null;
  const d = das(annex, rbt, monthly);
  if (!d || d.index > 4) return null;
  const [cbsShare, ibsShare] = shares2728[annex][d.index];
  let cbsRate = (d.effective * cbsShare) / 100;
  let ibsRate = (d.effective * ibsShare) / 100;
  let capped = false;
  if (d.index === 4 && annex === "III" && d.effective > 14.92537) {
    cbsRate = (d.effective - 5) * 0.232;
    ibsRate = (d.effective - 5) * 0.0026;
    capped = true;
  }
  if (d.index === 4 && annex === "IV" && d.effective > 12.5) {
    cbsRate = (d.effective - 5) * 0.3627;
    ibsRate = (d.effective - 5) * 0.004;
    capped = true;
  }
  if (year === 2026) {
    cbsRate = 0;
    ibsRate = 0;
    capped = false;
  }
  const cbs = round((monthly * cbsRate) / 100),
    ibs = round((monthly * ibsRate) / 100);
  return {
    ...d,
    cbs,
    ibs,
    remaining: round(d.total - cbs - ibs),
    cbsRate,
    ibsRate,
    capped,
    cbsShare,
    ibsShare,
  };
}
