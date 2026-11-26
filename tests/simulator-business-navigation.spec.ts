import { test, expect } from "@playwright/test";

test("Simular concentra os links de regimes em Minha empresa", async ({
  page,
}) => {
  await page.goto("/simulador");
  await expect(
    page.getByRole("link", { name: /Conhecer os regimes em Minha empresa/ }),
  ).toBeVisible();
  await expect(page.locator('a[href="/mei"]')).toHaveCount(0);
  await expect(page.locator('a[href="/calculadoras/presumido"]')).toHaveCount(
    0,
  );
  await expect(page.locator('a[href="/calculadoras/real"]')).toHaveCount(0);
  await page
    .getByRole("link", { name: /Conhecer os regimes em Minha empresa/ })
    .click();
  await expect(page).toHaveURL(/\/empresas$/);
  await expect(
    page.getByRole("tab", { name: "MEI", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: "Limite de faturamento e DAS do MEI" }),
  ).toBeVisible();
  await expect(page.getByText("R$ 81.000,00")).toBeVisible();
  await page.getByRole("tab", { name: "Lucro Presumido" }).click();
  await expect(
    page.getByRole("heading", {
      name: "Notícias e mudanças recentes do Lucro Presumido",
    }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Lucro Real" }).click();
  await expect(page.getByRole("heading", { name: "Lucro Real" })).toBeVisible();
});

test("link de fator R abre Simples Nacional e mostra a explicação", async ({
  page,
}) => {
  await page.goto("/simulador");
  await page
    .getByRole("link", { name: "Entenda o fator R em Minha empresa." })
    .click();
  await expect(page).toHaveURL(/\/empresas\?regime=simples-nacional#fator-r$/);
  await expect(
    page.getByRole("tab", { name: "Simples Nacional" }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: /Fator R: como saber se o serviço/ }),
  ).toBeVisible();
  await expect(page.getByText(/pelo menos 28%/)).toBeVisible();
});

test("simulação avançada encaminha MEI à aba correta sem rota paralela", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  await expect(page).toHaveURL(/\/simulador\?modo=comparar$/);
  await page.getByRole("link", { name: "Entender as regras do MEI" }).click();
  await expect(page).toHaveURL(/\/empresas\?regime=mei$/);
  await expect(
    page.getByRole("heading", { name: "Limite de faturamento e DAS do MEI" }),
  ).toBeVisible();
});
