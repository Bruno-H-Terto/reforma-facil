import { test, expect } from "@playwright/test";

test("Lucro Presumido preserva as regras e oferece tooltips sem sair da tela", async ({
  page,
}) => {
  await page.goto("/simulador?modo=presumido");
  const panel = page.locator("#simulator-tab-panel > div:not([hidden])");
  await expect(
    panel.getByRole("heading", { name: /1\. Atividade e faturamento/ }),
  ).toBeVisible();
  await expect(
    panel.getByRole("heading", { name: /3\. Ajustes legais/ }),
  ).toBeVisible();
  await expect(
    panel.getByText(/Limite geral anual de R\$ 5 milhões/),
  ).toBeVisible();
  await expect(panel.getByText(/IRPJ = 15% da base tributável/)).toBeVisible();

  await panel
    .getByRole("button", { name: "O que significa: Tipo de atividade" })
    .click();
  const tooltip = page.getByRole("tooltip");
  await expect(tooltip).toContainText("percentuais indicados");
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();

  await panel.getByRole("link", { name: "IBS e CBS" }).click();
  await expect(page).toHaveURL(/#simular-presumido-consumo$/);
  await expect(
    panel.getByRole("heading", { name: /4\. Resultado estimado/ }),
  ).toBeVisible();
  await panel
    .getByRole("button", {
      name: "O que significa: Créditos elegíveis de CBS no mês",
    })
    .click();
  await expect(page.getByRole("tooltip")).toContainText("aquisições elegíveis");
});

test("Lucro Real explica as bases e mantém o detalhamento completo", async ({
  page,
}) => {
  await page.goto("/simulador?modo=real");
  const panel = page.locator("#simulator-tab-panel > div:not([hidden])");
  await expect(
    panel.getByRole("heading", { name: /1\. Dados do trimestre/ }),
  ).toBeVisible();
  await expect(panel.getByText(/IRPJ = 15% da base tributável/)).toBeVisible();
  await expect(
    panel.getByText(/Prejuízo fiscal ou base negativa/),
  ).toBeVisible();
  await panel
    .getByRole("button", {
      name: "O que significa: Base fiscal do IRPJ após ajustes",
    })
    .click();
  await expect(page.getByRole("tooltip")).toContainText("Lucro tributável");
  await panel
    .getByRole("textbox", {
      name: "Base fiscal do IRPJ após ajustes",
      exact: true,
    })
    .fill("80000");
  await expect(
    panel.getByText(/Total IRPJ \+ CSLL — estimativa trimestral/),
  ).toBeVisible();
  await panel.getByRole("link", { name: "IBS e CBS" }).click();
  await expect(page).toHaveURL(/#simular-real-consumo$/);
  await expect(
    panel.getByRole("heading", { name: /IBS e CBS: demonstração/ }),
  ).toBeVisible();
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.viewport + 1);
});
