import { test, expect } from "@playwright/test";
test("DAS por faixa, fator R e sublimite", async ({ page }) => {
  await page.goto("/calculadoras/simples");
  await expect(page.getByText("R$ 2.020,00", { exact: true })).toBeVisible();
  await page.getByLabel("Anexo ou atividade").selectOption("factor");
  await expect(page.getByText(/28% → Anexo III/)).toBeVisible();
  await page.getByLabel("Folha e encargos elegíveis").fill("60000");
  await expect(page.getByText(/20% → Anexo V/)).toBeVisible();
  await page.getByLabel("Receita dos últimos 12 meses").fill("4000000");
  await expect(page.getByRole("status")).toContainText("Confirme o tratamento");
  await page.getByRole("checkbox").check();
  await expect(page.getByText("DAS estimado do mês")).toBeVisible();
  await page.getByLabel("Receita dos últimos 12 meses").fill("5000000");
  await expect(page.getByRole("status")).toContainText("acima do teto");
});
test("IRPJ e CSLL nos regimes de renda", async ({ page }) => {
  await page.goto("/calculadoras/presumido");
  await expect(page.getByText("R$ 26.640,00", { exact: true })).toBeVisible();
  await page
    .getByRole("combobox", { name: "Tipo de atividade", exact: true })
    .selectOption("commerce");
  await expect(page.getByText("R$ 6.840,00", { exact: true })).toBeVisible();
  await page.goto("/calculadoras/real");
  await expect(page.getByText("R$ 28.000,00", { exact: true })).toBeVisible();
});
