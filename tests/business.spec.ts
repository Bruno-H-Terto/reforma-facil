import { test, expect } from "@playwright/test";
test("navegação por regime, anexo e perfil", async ({ page }) => {
  await page.goto("/empresas/regimes/simples-nacional");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Simples Nacional",
  );
  await page.getByRole("link", { name: /Anexo IV/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Anexo IV",
  );
  await page.getByRole("button", { name: "Visão técnica" }).click();
  await expect(
    page.getByRole("button", { name: "Visão técnica" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("heading", { name: "Impacto fiscal e operacional" }),
  ).toBeVisible();
  await page.goto("/empresas/regimes/lucro-presumido");
  await page.getByRole("link", { name: /Empresa júnior/ }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Empresa júnior",
  );
});
test("estados e simulação regional não compensam créditos entre tributos", async ({
  page,
}) => {
  await page.goto("/estados");
  await page.getByRole("button", { name: /3º · MG/ }).click();
  await expect(page.getByRole("button", { name: /3º · MG/ })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(
    page.getByText(/Fábrica de móveis em Juiz de Fora/),
  ).toBeVisible();
  await page.getByLabel("Créditos elegíveis de IBS").first().fill("2000");
  await page.getByLabel("Créditos elegíveis de CBS").first().fill("0");
  await expect(page.getByText("R$ 1.130,00", { exact: true })).toBeVisible();
  await page.getByLabel("Selecione qualquer UF").selectOption("AC");
  await expect(
    page.getByRole("heading", { name: "Acre", exact: true }),
  ).toBeVisible();
});

test("Minha empresa funciona como single page por abas e sem collapses", async ({
  page,
}) => {
  await page.goto("/empresas");
  await expect(
    page.getByRole("navigation", { name: "Seções desta área" }),
  ).toHaveCount(0);
  await expect(page.getByRole("tab")).toHaveCount(4);
  await expect(
    page.getByRole("tab", { name: "MEI", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("img", {
      name: /Reforminha explicando/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Como funciona o DAS?" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Simples Nacional" }).click();
  await expect(
    page.getByRole("heading", { name: "O que muda com a reforma?" }),
  ).toBeVisible();
  await expect(page.locator("details")).toHaveCount(0);
  await page.getByLabel("Anexo da atividade").selectOption("anexo-ii");
  await expect(page.getByText("Uma pequena fábrica de móveis")).toBeVisible();
  await page.getByRole("tab", { name: "Lucro Real" }).click();
  await expect(page).toHaveURL(/regime=lucro-real/);
  await expect(page.getByRole("heading", { name: "Lucro Real" })).toBeVisible();
  await expect(page.getByLabel("Anexo da atividade")).toHaveCount(0);
  await page.getByRole("tab", { name: "MEI", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "MEI", exact: true }),
  ).toBeVisible();
  await expect
    .poll(async () =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
});
