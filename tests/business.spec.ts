import { test, expect } from "@playwright/test";
test("rotas antigas de regimes e anexos são recuperadas e perfis descontinuados redirecionam", async ({
  page,
}) => {
  await page.goto("/empresas/regimes/simples-nacional");
  await expect(page).toHaveURL(/\/empresas\?regime=simples-nacional$/);
  await expect(
    page.getByRole("tab", { name: "Simples Nacional" }),
  ).toHaveAttribute("aria-selected", "true");

  await page.goto("/empresas/anexos/anexo-iv");
  await expect(page).toHaveURL(
    /regime=simples-nacional&anexo=anexo-iv#anexos$/,
  );
  await expect(page.getByLabel("Anexo da atividade")).toHaveValue("anexo-iv");
  await expect(
    page.getByText(/CPP permanece uma obrigação separada/),
  ).toBeVisible();

  await page.goto("/empresas/perfis/empresa-junior");
  await expect(page).toHaveURL(/\/empresas$/);
  await expect(page.getByText("Orientações por perfil de negócio")).toHaveCount(
    0,
  );
});
test("região foi integrada à Minha empresa e URL antiga não abre página paralela", async ({
  page,
}) => {
  await page.goto("/estados");
  await expect(page).toHaveURL(/\/empresas#impacto-regional$/);

  const section = page.getByRole("region", {
    name: "O que muda no seu estado?",
  });
  await expect(section).toBeVisible();
  const select = section.getByLabel("Estado da operação");
  await expect(select.locator("option")).toHaveCount(28);

  await select.selectOption("MG");
  await expect(
    section.getByText("Minas Gerais", { exact: true }),
  ).toBeVisible();
  await expect(
    section.getByText(/Fábrica de móveis em Juiz de Fora/),
  ).toBeVisible();
  await expect(
    section.getByRole("link", { name: "Notícias do estado" }),
  ).toHaveAttribute("href", "/noticias?uf=MG");

  await select.selectOption("AC");
  await expect(section.getByText("Acre", { exact: true })).toBeVisible();
  await expect(
    section.getByText(/Ainda não há um exemplo revisado/),
  ).toBeVisible();
  await expect(section.getByRole("textbox")).toHaveCount(0);
  await expect(section.getByRole("spinbutton")).toHaveCount(0);
});

test("contexto regional é acessível pelas áreas já existentes", async ({
  page,
}) => {
  await page.goto("/simulador");
  await page
    .getByRole("link", { name: /Consulte os exemplos na seção Minha empresa/ })
    .click();
  await expect(page).toHaveURL(/\/empresas#impacto-regional$/);
  await expect(
    page.getByRole("region", { name: "O que muda no seu estado?" }),
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
