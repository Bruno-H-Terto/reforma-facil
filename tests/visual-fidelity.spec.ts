import { test, expect } from "@playwright/test";
test("biblioteca permite pesquisar e preserva termo na URL", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Consulte fontes" }).click();
  await expect(page).toHaveURL(/\/noticias$/);
  await page.goto("/biblioteca");
  await page.getByLabel("Buscar assunto").fill("227");
  await expect(page).toHaveURL(/\/biblioteca\?q=227/);
  await expect(
    page.getByRole("heading", { name: "Lei Complementar 227/2026" }),
  ).toBeVisible();
});
test("abertura fiel à composição: atalhos visíveis, arte separada e botões depois da imagem móvel", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1280, height: 720 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const hero = page.getByRole("region", {
      name: "Destaques do Reforma Clara",
    });
    const img = hero.getByRole("img", {
      name: "Reforminha, mascote da reforma tributária",
    });
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const map = hero.locator('img[src="/images/mascot/brasil.webp"]');
    await expect
      .poll(() =>
        map.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    const quick = page.getByRole("region", {
      name: "O que você precisa hoje?",
    });
    if (viewport.width >= 1024)
      expect((await quick.boundingBox())!.y).toBeLessThan(viewport.height);
    if (viewport.width < 768)
      expect(
        (await img.boundingBox())!.y + (await img.boundingBox())!.height,
      ).toBeLessThanOrEqual(
        (await hero
          .getByRole("link", { name: "Entender a reforma" })
          .boundingBox())!.y,
      );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
    await page.screenshot({
      path:
        "test-results/fidelidade-" +
        viewport.width +
        "x" +
        viewport.height +
        ".png",
      fullPage: true,
    });
  }
});
