import { test, expect } from "@playwright/test";
import { quickDas } from "../src/lib/quickDas";
test("partilhas oficiais por faixa e teto de ISS", () => {
  const r = quickDas("II", 300000, 25000, 2027);
  expect(r).toMatchObject({
    total: 1455,
    cbs: 201.52,
    ibs: 2.18,
    remaining: 1251.3,
  });
  expect(quickDas("II", 300000, 25000, 2026)).toMatchObject({
    total: 1455,
    cbs: 0,
    ibs: 0,
  });
  expect(quickDas("III", 600000, 50000, 2028)).toMatchObject({
    cbsShare: 16.41,
    ibsShare: 0.19,
  });
  expect(quickDas("III", 3600000, 300000, 2027)?.capped).toBe(true);
  expect(quickDas("IV", 3600000, 300000, 2027)?.capped).toBe(true);
  expect(quickDas("V", 3600000.01, 300000, 2027)).toBeNull();
});
test("empresário calcula DAS e vê IBS e CBS sem informar alíquotas", async ({
  page,
}) => {
  await page.goto("/simulador");
  const result = page.getByRole("region", { name: "Resultado rápido" });
  await expect(result.getByText("R$ 1.455,00", { exact: true })).toBeVisible();
  await expect(result.getByText("R$ 201,52", { exact: true })).toBeVisible();
  await expect(result.getByText("R$ 2,18", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "2026", exact: true }).click();
  await expect(
    result.getByText(/Em 2026, IBS e CBS ainda não integram/),
  ).toBeVisible();
  await page.getByRole("button", { name: "2027", exact: true }).click();
  await page.getByLabel("Faturamento do mês").fill("10000");
  await page.getByRole("checkbox", { name: /Não sei o faturamento/ }).check();
  await expect(result.getByText("R$ 450,00", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: /Minha empresa tem menos/ }).check();
  await expect(result.getByRole("status")).toContainText("apuração específica");
  const hybrid = page.getByRole("button", {
    name: "Simples Híbrido: IBS/CBS fora do DAS",
  });
  await hybrid.click();
  await expect(hybrid).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("region", { name: "Resultado estimado" }),
  ).toBeVisible();
});
