import { test, expect } from "@playwright/test";

test("Navbar não exibe pesquisa, inclusive no menu móvel", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const mobile = testInfo.project.name === "mobile";
  if (mobile) await page.getByRole("button", { name: "Abrir menu" }).click();
  const nav = page.getByRole("navigation", {
    name: mobile ? "Navegação móvel" : "Navegação principal",
  });
  await expect(nav.getByRole("link")).toHaveCount(5);
  await expect(
    page.getByRole("search", { name: "Buscar legislação no portal" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("searchbox", { name: "Buscar legislação" }),
  ).toHaveCount(0);
});

test("A notícia do Lucro Presumido aparece no acervo e a aba explica as regras", async ({
  page,
}) => {
  await page.goto("/noticias");
  await page.getByLabel("Tema").selectOption("Lucro Presumido");
  await expect(
    page.getByRole("heading", {
      name: /Receita e órgãos parceiros orientam sobre IBS e CBS/,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: /Receita esclarece alteração dos percentuais de presunção/,
    }),
  ).toBeVisible();
  await page.goto("/empresas?regime=lucro-presumido");
  await expect(
    page.getByRole("heading", {
      name: "Notícias e mudanças recentes do Lucro Presumido",
    }),
  ).toBeVisible();
  await expect(page.getByText(/R\$ 5 milhões no ano-calendário/)).toBeVisible();
});

test("Acervo inclui novidades sobre perdão do MEI e opção pelo SIMEI", async ({
  page,
}) => {
  await page.goto("/noticias");
  await page.getByLabel("Buscar notícias").fill("SIMEI");
  await expect(
    page.getByRole("heading", {
      name: /opção pelo SIMEI permanece em janeiro/,
    }),
  ).toBeVisible();
  await page.getByLabel("Buscar notícias").fill("PGFN esclarece");
  await expect(
    page.getByRole("heading", { name: /PGFN esclarece quais débitos/ }),
  ).toBeVisible();
});
