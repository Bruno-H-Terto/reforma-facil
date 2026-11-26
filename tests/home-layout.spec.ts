import { test, expect } from "@playwright/test";

test("home: atualizações discretas e FAQ independente sem sobreposição", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "matriz independente de viewports",
  );
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.getByRole("region", {
      name: "Destaques do Reforma Clara",
    });
    const cards = page.getByRole("region", {
      name: "O que você precisa hoje?",
    });
    expect(
      (await cards.getByRole("link").first().boundingBox())!.y -
        ((await hero.boundingBox())!.y + (await hero.boundingBox())!.height),
    ).toBeGreaterThanOrEqual(16);
    const faq = page.getByRole("region", { name: "Dúvidas frequentes" });
    const news = page.getByRole("region", {
      name: "Atualizações e legislação",
    });
    const n = (await news.boundingBox())!;
    const f = (await faq.boundingBox())!;
    expect(f.y).toBeGreaterThanOrEqual(n.y + n.height - 1);
    expect(f.width).toBeGreaterThanOrEqual(width - 1);
    expect(n.height).toBeLessThan(220);
    const newsGeometry = () =>
      news.evaluate((el) => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y + scrollY, r.width, r.height];
      });
    const before = await newsGeometry();
    const buttons = faq.getByRole("button");
    for (const i of [1, 2, 3, 4, 0]) {
      const button = buttons.nth(i);
      await button.click();
      await expect(button).toHaveAttribute("aria-expanded", "true");
      await expect(faq.locator('button[aria-expanded="true"]')).toHaveCount(1);
      const controlled = await button.getAttribute("aria-controls");
      const answer = page.locator("[id=" + JSON.stringify(controlled) + "]");
      await expect(answer).toBeVisible();
      const a = (await answer.boundingBox())!;
      const b = (await button.boundingBox())!;
      expect(a.y).toBeGreaterThanOrEqual(b.y + b.height - 1);
      expect(a.x + a.width).toBeLessThanOrEqual(width + 1);
      const next =
        i < 4
          ? await buttons.nth(i + 1).boundingBox()
          : await faq.getByRole("link").boundingBox();
      expect(next!.y).toBeGreaterThanOrEqual(a.y + a.height - 1);
      const after = await newsGeometry();
      for (let j = 0; j < before.length; j++)
        expect(
          Math.abs(before[j] - after[j]),
          width + " / " + i + " / " + j,
        ).toBeLessThan(1);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    const openHeight = (await faq.boundingBox())!.height;
    await buttons.first().click();
    await expect(faq.locator('button[aria-expanded="true"]')).toHaveCount(0);
    expect((await faq.boundingBox())!.height).toBeLessThanOrEqual(
      openHeight + 1,
    );
    expect(
      (await faq.boundingBox())!.height +
        (await page.getByRole("contentinfo").boundingBox())!.height,
    ).toBeGreaterThanOrEqual(899);
    await buttons.first().click();
    await expect(
      news.getByRole("link", { name: /Ler publicação original/ }),
    ).toHaveCount(1);
    await expect(
      news.getByRole("link", { name: "Ver todas as publicações" }),
    ).toHaveAttribute("href", "/noticias");
    await page.screenshot({
      path: "test-results/home-sections-" + width + ".png",
      fullPage: true,
    });
  }
});
