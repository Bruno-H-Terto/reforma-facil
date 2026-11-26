import { test, expect } from "@playwright/test";
test("notícias: busca, estado, ano, ordem e link original", async ({
  page,
}) => {
  await page.goto("/noticias");
  await expect(page.getByRole("status")).toHaveText("26 notícias encontradas");
  await page.getByLabel("Estado ou abrangência").selectOption("MG");
  await expect(page.getByRole("status")).toHaveText("1 notícia encontrada");
  await expect(
    page.getByRole("link", { name: /Ler publicação original/ }),
  ).toHaveAttribute("href", /fazenda.mg.gov.br/);
  await page.getByLabel("Período").selectOption("2026");
  await expect(page.getByRole("status")).toHaveText("0 notícias encontradas");
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await page.getByLabel("Ordenar").selectOption("old");
  await expect(page.locator("article").first()).toContainText("16/01/2025");
  await page.getByLabel("Buscar notícias").fill("PGDAS-D");
  await expect(page.getByRole("status")).toHaveText("1 notícia encontrada");
});
test("serviços: referência e redução condicional com valores editáveis", async ({
  page,
}) => {
  await page.goto("/empresas/regimes/simples-nacional");
  await expect(page).toHaveURL(/\/empresas\?regime=simples-nacional$/);
  await page
    .getByRole("button", { name: "Ver exemplos de serviços e créditos" })
    .click();
  await expect(
    page.getByRole("heading", {
      name: "Prestação de serviços: casos práticos",
    }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: /Escritório de contabilidade/ })
    .click();
  await expect(page.getByLabel("Alíquota hipotética de CBS (%)")).toHaveValue(
    "7.91",
  );
  await expect(page.getByText(/11,3% × 70% = 7,91%/)).toBeVisible();
  await page.getByRole("button", { name: /Clínica de fisioterapia/ }).click();
  await expect(page.getByLabel("Alíquota hipotética de CBS (%)")).toHaveValue(
    "4.52",
  );
  await page.goto("/simulador/avancado");
  await expect(page.getByText("11,2% — projeção técnica")).toBeVisible();
  await expect(page.getByLabel("Alíquota CBS (%)")).toHaveCount(0);
});
