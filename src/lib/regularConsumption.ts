export type TransitionYear = 2026 | 2027 | 2028;

export interface RegularConsumptionInput {
  year: TransitionYear;
  base: number;
  cbsRate: number;
  ibsCredit: number;
  cbsCredit: number;
}

export interface RegularConsumptionResult {
  ibsRate: number;
  ibsDebit: number;
  cbsDebit: number;
  ibsDue: number;
  cbsDue: number;
  totalPositive: number;
}

/**
 * Apuração estritamente aritmética para operações com alíquotas gerais.
 * Os valores de teste de 2026 não indicam efetivo recolhimento.
 * Não substitui as regras de apuração, crédito e extinção da LC 214/2025.
 */
export function calculateRegularConsumption(
  input: RegularConsumptionInput,
): RegularConsumptionResult | null {
  const { year, base, cbsRate, ibsCredit, cbsCredit } = input;
  if (
    ![2026, 2027, 2028].includes(year) ||
    [base, cbsRate, ibsCredit, cbsCredit].some(
      (value) => !Number.isFinite(value) || value < 0,
    ) ||
    cbsRate > 100
  )
    return null;
  const ibsRate = 0.1;
  const ibsDebit = (base * ibsRate) / 100;
  const cbsDebit = (base * cbsRate) / 100;
  const ibsDue = Math.max(0, ibsDebit - ibsCredit);
  const cbsDue = Math.max(0, cbsDebit - cbsCredit);
  return {
    ibsRate,
    ibsDebit,
    cbsDebit,
    ibsDue,
    cbsDue,
    totalPositive: ibsDue + cbsDue,
  };
}
