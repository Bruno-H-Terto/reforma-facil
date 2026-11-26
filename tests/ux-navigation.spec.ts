import { test, expect } from "@playwright/test";

test("navegação principal reduzida, áreas agrupadas e glossário preservado", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mobile = info.project.name === "mobile";
  if (mobile) await page.getByRole("button", { name: "Abrir menu" }).click();
  const nav = page.getByRole("navigation", {
    name: mobile ? "Navegação móvel" : "Navegação principal",
  });
  await expect(nav.getByRole("link")).toHaveCount(5);
  await nav.getByRole("link", { name: "Entenda", exact: true }).click();
  await expect(page).toHaveURL(/entenda$/);
  await expect(
    page.getByRole("navigation", { name: "Seções desta área" }),
  ).toHaveCount(0);
  await page.goto("/entenda#glossario");
  await expect(
    page.getByText("Glossário de termos", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("button", { name: "Significado de IBS", exact: true })
      .first(),
  ).toBeVisible();
  await page.goto("/simulador");
  await expect(
    page.getByRole("navigation", { name: "Seções desta área" }),
  ).toHaveCount(0);
  await page.goto("/simulador/avancado");
  await expect(
    page.locator("details").filter({
      has: page.locator("summary").filter({ hasText: /^Memória de cálculo$/ }),
    }),
  ).not.toHaveAttribute("open", "");
  await expect(
    page.getByRole("heading", { name: "Memória de cálculo" }),
  ).not.toBeVisible();
  await page
    .locator("summary")
    .filter({ hasText: "Memória de cálculo" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Memória de cálculo" }),
  ).toBeVisible();
});

test("carrossel autodeslizante pausa com interação e respeita movimento reduzido", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Destaques do Reforma Clara" });
  await expect(
    hero.getByRole("button", { name: "Ver destaque 1" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(
    hero.getByRole("button", { name: "Ver destaque 2" }),
  ).toHaveAttribute("aria-current", "true", { timeout: 12000 });
  await expect(
    hero.getByRole("link", { name: "Fazer uma simulação" }),
  ).toBeVisible();
  await hero
    .getByRole("button", { name: "Pausar reprodução automática" })
    .click();
  await expect(
    hero.getByRole("button", { name: "Iniciar reprodução automática" }),
  ).toBeVisible();
  await hero.getByRole("button", { name: "Ver destaque 3" }).click();
  await expect(
    hero.getByRole("button", { name: "Ver destaque 3" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(
    hero.getByRole("link", { name: "Ver atualizações" }),
  ).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await expect(
    hero.getByRole("button", { name: "Iniciar reprodução automática" }),
  ).toBeDisabled();
});

test("hero cabe sem sobreposição em telas baixas", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente de viewport");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 768, height: 1024 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const hero = page.getByRole("region", {
      name: "Destaques do Reforma Clara",
    });
    const action = hero.getByRole("link", { name: "Entender a reforma" });
    const actionBox = await action.boundingBox();
    const controls = await hero
      .getByRole("button", { name: "Destaque anterior" })
      .boundingBox();
    expect(actionBox).not.toBeNull();
    expect(controls).not.toBeNull();
    expect(actionBox!.y + actionBox!.height).toBeLessThan(controls!.y);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
    await page.screenshot({
      path:
        "test-results/ux-hero-" +
        viewport.width +
        "x" +
        viewport.height +
        ".png",
    });
  }
});
