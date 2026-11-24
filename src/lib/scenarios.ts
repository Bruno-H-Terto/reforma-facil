export type Scenario = {
  revenue: number;
  dasInside: number;
  dasOutside: number;
  regularRate: number;
  credit: number;
};
export function compare(s: Scenario) {
  const inside = (s.revenue * s.dasInside) / 100;
  const regularGross = (s.revenue * s.regularRate) / 100;
  const regularNet = Math.max(0, regularGross - s.credit);
  const outside = (s.revenue * s.dasOutside) / 100 + regularNet;
  return {
    inside,
    outside,
    regularGross,
    regularNet,
    difference: outside - inside,
  };
}
