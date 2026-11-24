import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("empresário encontra o cronograma e compara cenários", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Prepare sua empresa",
  );
  await page.getByRole("link", { name: "Ver cronograma completo" }).click();
  await expect(page).toHaveURL(/entenda#cronograma/);
  await expect(page.getByText("2033", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Explorar cenários" }).click();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 4.000,00", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 6.000,00", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Receita mensal para o DAS").fill("10000");
  await page.getByLabel("Base de operações IBS/CBS").fill("10000");
  await page.getByLabel("Créditos de IBS").fill("0");
  await page.getByLabel("Créditos de CBS").fill("0");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 800,00", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 2.000,00", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("Receita mensal para o DAS").fill("");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  expect(
    await page
      .getByLabel("Receita mensal para o DAS")
      .evaluate((el: HTMLInputElement) => el.validity.valid),
  ).toBe(false);
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 800,00", { exact: true }),
  ).toBeVisible();
});
test("contador pesquisa legislação e recupera busca sem resultados", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Biblioteca", exact: true }).click();
  await page.getByLabel("Categoria").selectOption("Legislação");
  await expect(page.getByRole("status")).toHaveText("2 resultados");
  await page.getByLabel("Buscar assunto").fill("227");
  await expect(
    page.getByRole("heading", { name: "Lei Complementar 227/2026" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Consultar fonte oficial/ }),
  ).toHaveAttribute("href", /planalto/);
  await page.getByLabel("Buscar assunto").fill("xyz inexistente");
  await expect(page.getByText("Nenhum conteúdo encontrado")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("status")).toHaveText("7 resultados");
});
test("FAQ por teclado e rota inexistente", async ({ page }) => {
  await page.goto("/duvidas");
  const question = page.getByRole("button", {
    name: "O Simples Nacional vai acabar?",
  });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Não. O regime permanece.", { exact: false }),
  ).toBeVisible();
  await page.goto("/nao-existe");
  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page).toHaveURL(/\/$/);
});
for (const route of [
  "/",
  "/entenda",
  "/simulador",
  "/biblioteca",
  "/duvidas",
]) {
  test("acessibilidade e layout " + route, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      results.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({
      path:
        "test-results/" +
        test.info().project.name +
        "-" +
        (route.slice(1) || "home") +
        ".png",
      fullPage: true,
    });
  });
}
test("carrossel, ilustrações e navegação reduzida", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const img of await page.locator('img[src^="/images/"]').all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  const carousel = page.getByRole("region", {
    name: "Publicações em destaque",
  });
  const next = carousel.getByRole("button", { name: "Próxima publicação" });
  await expect(next).toBeEnabled();
  await next.click();
  await expect(
    carousel.getByRole("button", { name: "Ir à posição 2" }),
  ).toHaveAttribute("aria-current", "true");
  await carousel.getByRole("button", { name: "Publicação anterior" }).click();
  await expect(
    carousel.getByRole("button", { name: "Ir à posição 1" }),
  ).toHaveAttribute("aria-current", "true");
});
test("créditos não são compensados entre IBS e CBS; memória e alíquota auxiliar", async ({
  page,
}) => {
  await page.goto("/simulador");
  await page.getByLabel("Créditos de IBS").fill("10000");
  await page.getByLabel("Créditos de CBS").fill("0");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  const result = page.getByRole("region", { name: "Resultado estimado" });
  await expect(
    result.getByText("R$ 7.500,00", { exact: true }).first(),
  ).toBeVisible();
  await expect(result.getByText("R$ 5.000,00", { exact: true })).toBeVisible();
  await expect(
    result.getByText("R$ 7.500,00", { exact: true }).last(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Memória de cálculo" }),
  ).toBeVisible();
  await page
    .getByText("Calculadora auxiliar: alíquota efetiva do DAS", { exact: true })
    .click();
  await expect(
    page.getByText("Alíquota efetiva: 8%", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("RBT12 (R$)").fill("0");
  await expect(page.getByText(/Revise os parâmetros/)).toBeVisible();
  await page.getByRole("button", { name: "Exemplo inicial" }).click();
  await expect(result.getByText("R$ 6.000,00", { exact: true })).toBeVisible();
});

test("formatação monetária brasileira preserva centavos e cálculos", async ({
  page,
}) => {
  await page.goto("/simulador");
  const revenue = page.getByLabel("Receita mensal para o DAS");
  await expect(revenue).toHaveValue("R$ 50.000,00");
  await expect(page.getByLabel("Créditos de IBS")).toHaveValue("R$ 1.000,00");
  await revenue.fill("12345,67");
  await revenue.blur();
  await expect(revenue).toHaveValue("R$ 12.345,67");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 987,65", { exact: true }),
  ).toBeVisible();
  await page
    .getByText("Calculadora auxiliar: alíquota efetiva do DAS", { exact: true })
    .click();
  await expect(page.getByLabel("RBT12 (R$)")).toHaveValue("R$ 600.000,00");
  await expect(page.getByLabel("Parcela a deduzir (R$)")).toHaveValue(
    "R$ 12.000,00",
  );
  await page.goto("/");
  await expect(page.locator("main figure a")).toHaveCount(0);
  await expect(
    page
      .getByRole("contentinfo")
      .getByRole("link", { name: "Storyset / Freepik" }),
  ).toBeVisible();
});
test("estado selecionado dos cenários permanece visível e acompanha os valores", async ({
  page,
}) => {
  await page.goto("/simulador");
  const initial = page.getByRole("button", { name: "Exemplo inicial" });
  const few = page.getByRole("button", { name: "Poucos créditos" });
  const more = page.getByRole("button", { name: "Mais créditos" });
  await expect(initial).toHaveAttribute("aria-pressed", "true");
  await expect(few).toHaveAttribute("aria-pressed", "false");
  const inactiveBackground = await few.evaluate(
    (el) => getComputedStyle(el).backgroundColor,
  );
  await few.click();
  await expect(few).toHaveAttribute("aria-pressed", "true");
  await expect(initial).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("heading", { level: 1 }).hover();
  await expect
    .poll(() => few.evaluate((el) => getComputedStyle(el).backgroundColor))
    .not.toBe(inactiveBackground);
  await more.focus();
  await page.keyboard.press("Enter");
  await expect(more).toHaveAttribute("aria-pressed", "true");
  await expect(few).toHaveAttribute("aria-pressed", "false");
  await page.getByLabel("Créditos de IBS").fill("500");
  await expect(more).toHaveAttribute("aria-pressed", "false");
  await initial.click();
  await expect(initial).toHaveAttribute("aria-pressed", "true");
});
