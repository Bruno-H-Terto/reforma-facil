import { expect, test } from "@playwright/test";

test("a consulta estadual integra Minha empresa e não abre outra página", async ({
  page,
}) => {
  await page.goto("/estados");
  await expect(page).toHaveURL(/\/empresas#impacto-regional$/);
  const region = page.getByRole("region", {
    name: "O que muda no seu estado?",
  });
  await expect(region).toBeVisible();
  await region.getByLabel("Estado da operação").selectOption("SP");
  await expect(
    region.getByText(/Comércio eletrônico em Campinas/),
  ).toBeVisible();

  await page.goto("/empresas");
  await page
    .getByRole("link", { name: "Consultar impacto por estado" })
    .click();
  await expect(page).toHaveURL(/\/empresas#impacto-regional$/);
  await expect(region).toBeVisible();
});

test("URLs antigas redirecionam para a funcionalidade já existente", async ({
  page,
}) => {
  const aliases: Array<[string, RegExp, string]> = [
    [
      "/mei",
      /\/empresas\?regime=mei#calculadora-mei$/,
      "Meu faturamento cabe no MEI?",
    ],
    [
      "/empresas/regimes/lucro-real",
      /\/empresas\?regime=lucro-real$/,
      "Lucro Real",
    ],
    [
      "/empresas/anexos/anexo-iv",
      /\/empresas\?regime=simples-nacional&anexo=anexo-iv#anexos$/,
      "Sua atividade no Simples Nacional",
    ],
    [
      "/empresas/perfis/empresa-junior",
      /\/empresas$/,
      "Entenda o impacto da reforma no seu negócio",
    ],
    [
      "/calculadoras",
      /\/simulador\?modo=das#das-detalhado$/,
      "Calcular DAS mensal",
    ],
    [
      "/calculadoras/simples/ii",
      /\/simulador\?modo=das&anexo=II#das-detalhado$/,
      "Calcular DAS mensal",
    ],
    [
      "/calculadoras/presumido",
      /\/simulador\?modo=presumido$/,
      "Lucro Presumido — IRPJ e CSLL",
    ],
    [
      "/calculadoras/real",
      /\/simulador\?modo=real$/,
      "Lucro Real — IRPJ e CSLL",
    ],
    [
      "/simulador/avancado",
      /\/simulador\?modo=comparar$/,
      "DAS ou IBS/CBS por fora",
    ],
  ];
  for (const [legacyPath, destination, heading] of aliases) {
    await page.goto(legacyPath);
    await expect(page).toHaveURL(destination);
    await expect(
      page.getByRole("heading", { name: heading, exact: false }).first(),
    ).toBeVisible();
  }
});

test("biblioteca e página 404 mantêm funções próprias", async ({ page }) => {
  await page.goto("/noticias");
  await page
    .getByRole("link", { name: /Consultar legislação|Legislação|Biblioteca/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/biblioteca/);

  await page.goto("/nao-existe-no-portal");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Voltar ao início" }),
  ).toBeVisible();
});
