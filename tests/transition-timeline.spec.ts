import { expect, test } from "@playwright/test";

test("cronograma: marcos ordenados, ícones locais e layout responsivo", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  await page.emulateMedia({ reducedMotion: "reduce" });
  const section = page.getByRole("region", { name: "Cronograma de transição" });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/entenda#cronograma");
    await page.evaluate(() => document.fonts.ready);
    const rows = section.getByRole("listitem");
    await expect(rows).toHaveCount(5);
    expect(await rows.locator(":scope > p").allTextContents()).toEqual([
      "2024–2025",
      "2026",
      "2027–2028",
      "2029–2032",
      "2033",
    ]);
    await expect(
      section.getByRole("link", { name: /Fonte: Ministério da Fazenda/ }),
    ).toHaveAttribute("href", /gov.br\/fazenda/);
    const boxes = await rows.evaluateAll((els) =>
      els.map((el) => {
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, w: r.width, h: r.height };
      }),
    );
    if (width >= 1024) {
      for (let i = 1; i < boxes.length; i++) {
        expect(boxes[i].x).toBeGreaterThanOrEqual(
          boxes[i - 1].x + boxes[i - 1].w - 1,
        );
        expect(Math.abs(boxes[i].y - boxes[0].y)).toBeLessThanOrEqual(1);
      }
      const iconY = await rows
        .locator("div[aria-hidden=true]")
        .evaluateAll((els) => els.map((el) => el.getBoundingClientRect().y));
      expect(iconY[1] - iconY[0]).toBeGreaterThan(30);
      expect(Math.abs(iconY[2] - iconY[0])).toBeLessThanOrEqual(1);
    } else {
      for (let i = 1; i < boxes.length; i++)
        expect(boxes[i].y).toBeGreaterThanOrEqual(
          boxes[i - 1].y + boxes[i - 1].h - 1,
        );
    }
    expect(
      await section.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const assets = await rows
      .locator("[style*='mask']")
      .evaluateAll((els) =>
        els.map(
          (el) => getComputedStyle(el).maskImage.match(/url\("?(.*?)"?\)/)?.[1],
        ),
      );
    expect(assets).toHaveLength(5);
    for (const url of assets) {
      expect(url).toContain("/images/timeline/");
      const response = await page.request.get(url!);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain("<svg");
    }
    await section.screenshot({
      path: "test-results/cronograma-" + width + ".png",
    });
  }
});
