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
  await expect(page.getByText("R$ 4.000,00", { exact: true })).toBeVisible();
  await expect(page.getByText("R$ 6.000,00", { exact: true })).toBeVisible();
  await page.getByLabel("Base mensal hipotética").fill("10000");
  await page.getByLabel("Créditos aproveitáveis estimados").fill("0");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  await expect(page.getByText("R$ 800,00", { exact: true })).toBeVisible();
  await expect(page.getByText("R$ 2.000,00", { exact: true })).toBeVisible();
  await page.getByLabel("Base mensal hipotética").fill("-1");
  await page.getByRole("button", { name: "Calcular cenários" }).click();
  expect(
    await page
      .getByLabel("Base mensal hipotética")
      .evaluate((el: HTMLInputElement) => el.validity.valid),
  ).toBe(false);
  await expect(page.getByText("R$ 800,00", { exact: true })).toBeVisible();
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
