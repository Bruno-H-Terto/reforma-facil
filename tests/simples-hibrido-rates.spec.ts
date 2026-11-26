import { test, expect } from "@playwright/test";

test("IBS e CBS não podem ser editados no Simples Híbrido e seguem transição", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  const simulator = page.locator("#simulator-tab-panel > div:not([hidden])");
  await expect(
    simulator.getByRole("heading", {
      name: "Alíquotas de IBS e CBS na transição",
    }),
  ).toBeVisible();
  await expect(simulator.getByText("0,1%", { exact: true })).toBeVisible();
  await expect(simulator.getByText("11,2% — projeção técnica")).toBeVisible();
  await expect(
    simulator.getByText(/não são aplicáveis às operações do Simples Nacional/),
  ).toBeVisible();

  await expect(
    simulator.getByRole("spinbutton", { name: /Alíquota IBS/i }),
  ).toHaveCount(0);
  await expect(
    simulator.getByRole("spinbutton", { name: /Alíquota CBS/i }),
  ).toHaveCount(0);
  await expect(
    simulator
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 5.100,00", { exact: true }),
  ).toBeVisible();

  await simulator.getByLabel("Créditos de CBS").fill("1000");
  await simulator.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(
    simulator
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 7.100,00", { exact: true }),
  ).toBeVisible();
});

test("2028 não calcula total de CBS sem alíquota definida", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  const simulator = page.locator("#simulator-tab-panel > div:not([hidden])");
  await simulator
    .getByRole("combobox", { name: "Ano da simulação", exact: true })
    .selectOption("2028");
  await expect(
    simulator.getByText("Aguardando definição oficial"),
  ).toBeVisible();
  await expect(
    simulator.getByRole("button", { name: "Calcular cenários" }),
  ).toBeDisabled();
  await expect(
    simulator.getByText(/Resultado indisponível para 2028/),
  ).toBeVisible();
  await expect(simulator.getByText(/Diferença \(regular − DAS\)/)).toHaveCount(
    0,
  );
  await simulator
    .getByRole("combobox", { name: "Ano da simulação", exact: true })
    .selectOption("2027");
  await expect(
    simulator.getByRole("button", { name: "Calcular cenários" }),
  ).toBeEnabled();
});

test("memória de cálculo mostra as mesmas alíquotas usadas no resultado", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  await page
    .locator("summary")
    .filter({ hasText: "Memória de cálculo" })
    .click();
  const memory = page.locator("details").filter({
    has: page.getByRole("heading", { name: "Memória de cálculo" }),
  });
  await expect(
    memory.getByText("R$ 50.000,00 × 0,1%", { exact: true }),
  ).toBeVisible();
  await expect(
    memory.getByText("R$ 50.000,00 × 11,2%", { exact: true }),
  ).toBeVisible();
});
