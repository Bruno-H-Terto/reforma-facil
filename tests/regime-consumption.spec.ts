import { test, expect } from "@playwright/test";

for (const regime of ["Lucro Presumido", "Lucro Real"] as const) {
  test(`${regime} explica IBS/CBS na mesma aba e distingue teste de cobrança`, async ({
    page,
  }) => {
    await page.goto("/simulador");
    await page.getByRole("tab", { name: regime }).click();
    const panel = page.locator("#simulator-tab-panel > div:not([hidden])");
    await expect(
      panel.getByRole("heading", {
        name: "IBS e CBS: demonstração sobre o consumo",
      }),
    ).toBeVisible();
    await expect(panel.getByText(/2026 é um ano de teste/)).toBeVisible();
    await expect(panel.getByText("R$ 500,00")).toBeVisible();

    await panel
      .getByRole("combobox", { name: "Ano da simulação", exact: true })
      .selectOption("2027");
    await expect(
      panel.getByText(/Informe uma alíquota hipotética de CBS/),
    ).toBeVisible();
    await expect(panel.getByText("R$ 500,00")).toHaveCount(0);

    await panel.getByLabel("Alíquota simulada de CBS para 2027 (%)").fill("8");
    await expect(panel.getByText("R$ 4.050,00")).toBeVisible();
    await panel
      .getByRole("textbox", {
        name: "Créditos elegíveis de CBS no mês",
        exact: true,
      })
      .fill("1000");
    await expect(panel.getByText("R$ 3.050,00")).toBeVisible();

    await panel
      .getByRole("combobox", { name: "Ano da simulação", exact: true })
      .selectOption("2026");
    await expect(panel.getByText(/2026 é um ano de teste/)).toBeVisible();
    await expect(panel.getByText("R$ 500,00")).toHaveCount(0);
    await expect(panel.getByText("R$ 50,00", { exact: true })).toBeVisible();
  });
}

test("Alíquotas futuras não são inventadas quando a CBS está vazia", async ({
  page,
}) => {
  await page.goto("/simulador?modo=real");
  const panel = page.locator("#simulator-tab-panel > div:not([hidden])");
  await panel
    .getByRole("combobox", { name: "Ano da simulação", exact: true })
    .selectOption("2028");
  await expect(
    panel.getByText(/Informe uma alíquota hipotética de CBS/),
  ).toBeVisible();
  await expect(
    panel.getByText(/IBS \+ CBS — saldo aritmético ilustrativo/),
  ).toHaveCount(0);
});
