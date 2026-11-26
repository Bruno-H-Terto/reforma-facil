import { test, expect } from "@playwright/test";

test("Simular reúne três regimes e detalha Simples Híbrido sem navegação paralela", async ({
  page,
}) => {
  await page.goto("/simulador");
  const simples = page.getByRole("tab", { name: "Simples Nacional" });
  const presumido = page.getByRole("tab", { name: "Lucro Presumido" });
  const real = page.getByRole("tab", { name: "Lucro Real" });
  await expect(page.getByRole("tab")).toHaveCount(3);
  await expect(simples).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: /Simples Nacional: DAS tradicional/ }),
  ).toBeVisible();
  await page.getByLabel("Faturamento do mês").fill("35000");
  await page
    .getByRole("button", { name: /Simples Híbrido: IBS\/CBS fora do DAS/ })
    .click();
  await expect(
    page.getByRole("heading", { name: /DAS ou IBS\/CBS por fora/ }),
  ).toBeVisible();
  await presumido.click();
  await expect(presumido).toHaveAttribute("aria-selected", "true");
  await expect(
    page.getByRole("heading", { name: /Lucro Presumido — IRPJ e CSLL/ }),
  ).toBeVisible();
  await real.click();
  await expect(
    page.getByRole("heading", { name: /Lucro Real — IRPJ e CSLL/ }),
  ).toBeVisible();
  await simples.click();
  await page.getByRole("button", { name: "Dentro do DAS" }).click();
  await expect(page.getByLabel("Faturamento do mês")).toHaveValue(
    "R$ 35.000,00",
  );
  await expect(
    page.getByText(/sem abrir outra área de explicações/),
  ).toHaveCount(0);
});

test("link legado mantém a comparação dentro da aba Simples", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  await expect(page).toHaveURL(/\/simulador\?modo=comparar$/);
  await expect(
    page.getByRole("heading", { name: /DAS ou IBS\/CBS por fora/ }),
  ).toBeVisible();
});

test("Minha empresa mantém link para comparação integrado ao Simples", async ({
  page,
}) => {
  await page.goto("/empresas/regimes/simples-nacional");
  await page
    .getByRole("link", { name: "Comparar formas de recolhimento" })
    .click();
  await expect(page).toHaveURL(/\/simulador\?modo=comparar$/);
  await expect(
    page.getByRole("heading", { name: /DAS ou IBS\/CBS por fora/ }),
  ).toBeVisible();
});

test("aviso regional é visível nos três regimes e não atribui alíquotas por estado", async ({
  page,
}) => {
  await page.goto("/simulador");
  const notice = page.getByRole("complementary", {
    name: "Limitação regional da simulação",
  });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText("2027 e 2028");
  await expect(notice).toContainText("2029");
  await expect(notice).toContainText("ICMS/ISS");
  await expect(notice.getByRole("link")).toHaveCount(0);

  for (const regime of ["Lucro Presumido", "Lucro Real", "Simples Nacional"]) {
    await page.getByRole("tab", { name: regime }).click();
    await expect(notice).toBeVisible();
  }
});
