import { annexTables, ceilings, type Annex } from "../data/taxTables";
const round = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
export function das(annex: Annex, rbt12: number, monthly: number) {
  if (
    !Number.isFinite(rbt12) ||
    !Number.isFinite(monthly) ||
    rbt12 <= 0 ||
    monthly < 0 ||
    rbt12 > ceilings[5]
  )
    return null;
  const index = ceilings.findIndex((c) => rbt12 <= c);
  const [nominal, deduction] = annexTables[annex].rows[index];
  const effective = (((rbt12 * nominal) / 100 - deduction) / rbt12) * 100;
  return {
    index,
    nominal,
    deduction,
    effective,
    total: round((monthly * effective) / 100),
  };
}
export function incomeTax(irBase: number, csBase: number, months = 3) {
  const ir = Math.max(0, irBase),
    cs = Math.max(0, csBase);
  const basic = round(ir * 0.15),
    additional = round(Math.max(0, ir - 20000 * months) * 0.1),
    csll = round(cs * 0.09);
  return {
    ir,
    cs,
    basic,
    additional,
    irpj: round(basic + additional),
    csll,
    total: round(basic + additional + csll),
  };
}
export function presumed(
  revenue: number,
  irRate: number,
  csRate: number,
  irExtra: number,
  csExtra: number,
  irOther: number,
  csOther: number,
) {
  if (
    [revenue, irRate, csRate, irExtra, csExtra, irOther, csOther].some(
      (v) => !Number.isFinite(v) || v < 0,
    ) ||
    irExtra > revenue ||
    csExtra > revenue
  )
    return null;
  const irBase = round(((revenue + irExtra * 0.1) * irRate) / 100 + irOther);
  const csBase = round(((revenue + csExtra * 0.1) * csRate) / 100 + csOther);
  return incomeTax(irBase, csBase);
}
