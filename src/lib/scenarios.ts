export type Scenario = {
  revenue: number;
  operationBase: number;
  dasInside: number;
  dasOutside: number;
  ibsRate: number;
  cbsRate: number;
  ibsCredit: number;
  cbsCredit: number;
};
export const defaults: Scenario = {
  revenue: 50000,
  operationBase: 50000,
  dasInside: 8,
  dasOutside: 5,
  ibsRate: 5,
  cbsRate: 10,
  ibsCredit: 1000,
  cbsCredit: 3000,
};
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
function tax(base: number, rate: number, credit: number) {
  const debit = round((base * rate) / 100);
  return {
    debit,
    credit,
    due: round(Math.max(0, debit - credit)),
    excess: round(Math.max(0, credit - debit)),
  };
}
export function compare(s: Scenario) {
  const inside = round((s.revenue * s.dasInside) / 100);
  const remainingDas = round((s.revenue * s.dasOutside) / 100);
  const ibs = tax(s.operationBase, s.ibsRate, s.ibsCredit);
  const cbs = tax(s.operationBase, s.cbsRate, s.cbsCredit);
  const outside = round(remainingDas + ibs.due + cbs.due);
  return {
    inside,
    remainingDas,
    ibs,
    cbs,
    outside,
    difference: round(outside - inside),
  };
}
export function effectiveRate(
  rbt12: number,
  nominal: number,
  deduction: number,
) {
  if (
    !Number.isFinite(rbt12) ||
    rbt12 <= 0 ||
    deduction > (rbt12 * nominal) / 100
  )
    return null;
  return (((rbt12 * nominal) / 100 - deduction) / rbt12) * 100;
}
