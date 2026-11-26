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
  await page
    .getByRole("button", {
      name: "Simples Híbrido: IBS/CBS fora do DAS",
    })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 4.000,00", { exact: true }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 5.100,00", { exact: true }),
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
      .getByText("R$ 1.630,00", { exact: true }),
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
  await page
    .getByRole("link", { name: "Consulte fontes", exact: false })
    .click();
  await page
    .getByRole("link", { name: "Legislação e guias", exact: true })
    .click();
  await page.getByLabel("Categoria").selectOption("Legislação");
  await expect(page.getByRole("status")).toHaveText("2 resultados");
  await page.getByLabel("Buscar assunto").fill("227");
  await expect(
    page.getByRole("heading", { name: "Lei Complementar 227/2026" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("article")
      .filter({
        has: page.getByRole("heading", { name: "Lei Complementar 227/2026" }),
      })
      .getByRole("link", { name: /Consultar fonte oficial/ }),
  ).toHaveAttribute("href", /planalto.*lcp227/);
  await page.getByLabel("Buscar assunto").fill("xyz inexistente");
  await expect(page.getByText("Nenhum conteúdo encontrado")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("status")).toHaveText("6 resultados");
});
test("FAQ por teclado e rota inexistente", async ({ page }) => {
  await page.goto("/duvidas");
  const question = page.getByRole("button", {
    name: "O Simples Nacional vai acabar?",
  });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page
      .getByText("Não. O regime permanece.", { exact: false })
      .filter({ visible: true }),
  ).toBeVisible();
  await page.goto("/nao-existe");
  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page).toHaveURL(/\/$/);
});
for (const route of [
  "/",
  "/entenda",
  "/simulador",
  "/simulador/avancado",
  "/biblioteca",
  "/duvidas",
  "/empresas",
  "/empresas/regimes/lucro-presumido",
  "/empresas/regimes/lucro-real",
  "/empresas/anexos/anexo-i",
  "/empresas/perfis/empresa-junior",
  "/estados",
  "/noticias",
  "/mei",
  "/calculadoras/simples",
  "/calculadoras/presumido",
  "/calculadoras/real",
]) {
  test("acessibilidade e layout " + route, async ({ page }) => {
    // Audit the settled UI, not an intermediate opacity frame during navigation.
    await page.emulateMedia({ reducedMotion: "reduce" });
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
        (route.slice(1).replaceAll("/", "-") || "home") +
        ".png",
      fullPage: true,
    });
  });
}
test("carrossel, ilustrações e navegação reduzida", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const img = page.locator('img[src^="/images/"]').first();
  await expect
    .poll(() =>
      img.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  const carousel = page.getByRole("region", {
    name: "Destaques do Reforma Clara",
  });
  const next = carousel.getByRole("button", { name: "Próximo destaque" });
  await expect(next).toBeEnabled();
  await next.click();
  await expect(
    carousel.getByRole("button", { name: "Ver destaque 2" }),
  ).toHaveAttribute("aria-current", "true");
  await carousel.getByRole("button", { name: "Destaque anterior" }).click();
  await expect(
    carousel.getByRole("button", { name: "Ver destaque 1" }),
  ).toHaveAttribute("aria-current", "true");
});
test("créditos não são compensados entre IBS e CBS; memória e alíquota auxiliar", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  await page.getByLabel("Créditos de IBS").fill("10000");
  await page.getByLabel("Créditos de CBS").fill("0");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  const result = page.getByRole("region", { name: "Resultado estimado" });
  await expect(
    result.getByText("R$ 8.100,00", { exact: true }).first(),
  ).toBeVisible();
  await expect(result.getByText("R$ 5.600,00", { exact: true })).toBeVisible();
  await expect(
    result.getByText("R$ 8.100,00", { exact: true }).last(),
  ).toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "Memória de cálculo" })
    .click();
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
  await page.getByLabel("Créditos de IBS").fill("1000");
  await page.getByLabel("Créditos de CBS").fill("3000");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(result.getByText("R$ 5.100,00", { exact: true })).toBeVisible();
});

test("formatação monetária brasileira preserva centavos e cálculos", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
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
    page.locator('img[src="/images/mascot/reforminha-hero.webp"]'),
  ).toHaveCount(1);
});
test("simulação do Simples Híbrido aceita créditos diretamente, sem botões de exemplos", async ({
  page,
}) => {
  await page.goto("/simulador/avancado");
  await expect(
    page.getByRole("button", { name: "Exemplo inicial" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Poucos créditos" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Mais créditos" })).toHaveCount(
    0,
  );
  await page.getByLabel("Créditos de IBS").fill("500");
  await page.getByLabel("Créditos de CBS").fill("2500");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(
    page
      .getByRole("region", { name: "Resultado estimado" })
      .getByText("R$ 5.600,00", { exact: true }),
  ).toBeVisible();
});
