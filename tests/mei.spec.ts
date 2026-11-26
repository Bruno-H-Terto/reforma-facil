import { test, expect } from "@playwright/test";
test("MEI: limite, proporcionalidade, DAS e notícias", async ({ page }) => {
  await page.goto("/mei");
  await expect(page.getByText(/Acima do limite de receita em/)).toContainText(
    "R$ 9.000,00",
  );
  await page.getByLabel("Ano-calendário").selectOption("2027");
  await expect(page.getByText(/Dentro do limite de receita/)).toContainText(
    "R$ 20.000,00",
  );
  await page.getByLabel("Mês inicial da atividade").selectOption("7");
  await expect(page.getByText(/Limite aplicável/)).toContainText(
    "R$ 55.000,02",
  );
  await page.getByLabel("Atividade", { exact: true }).selectOption("mixed");
  await expect(page.getByText("R$ 87,05", { exact: true })).toBeVisible();
  await page
    .getByLabel("INSS elegível, incluindo encargos (exemplo)")
    .fill("1500");
  await expect(page.getByText(/poderão ser cancelados/)).toContainText(
    "R$ 1.500,00",
  );
  await page.getByRole("link", { name: "Notícias sobre MEI" }).click();
  await expect(page.getByRole("status")).toHaveText("5 notícias encontradas");
});
