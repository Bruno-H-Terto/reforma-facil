import { test, expect } from "@playwright/test";
test("conceitos centralizados no guia e link contextual no simulador", async ({
  page,
}) => {
  await page.goto("/entenda");
  await expect(
    page.getByRole("heading", { name: "Conheça os novos tributos" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Imposto sobre Bens e Serviços",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Contribuição sobre Bens e Serviços",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page
      .locator("#tributos article p")
      .filter({ hasText: "Substitui PIS e Cofins a partir de 2027." }),
  ).toBeVisible();
  await page.goto("/simulador/avancado");
  await expect(
    page.getByRole("complementary", { name: "Significado dos tributos" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Entenda os tributos", exact: true })
    .click();
  await expect(page).toHaveURL(/entenda#tributos/);
  await expect(
    page.getByRole("heading", { name: "Imposto Seletivo", exact: true }),
  ).toBeVisible();
});
