import { expect, test } from "@playwright/test";

test("home: abertura, atalhos e atualizações completam a primeira viewport", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  for (const viewport of [
    { width: 1920, height: 1080 },
    { width: 1440, height: 900 },
    { width: 1366, height: 768 },
    { width: 1280, height: 720 },
    { width: 1024, height: 768 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
    { width: 844, height: 390 },
  ]) {
    await page.setViewportSize(viewport);
    await expect
      .poll(() =>
        page.evaluate(() => {
          const header = document.querySelector("header")!;
          const opening = document.querySelector(
            '[data-home-chapter="opening"]',
          )!;
          return (
            header.getBoundingClientRect().height +
            opening.getBoundingClientRect().height
          );
        }),
      )
      .toBeGreaterThanOrEqual(viewport.height - 1);
    const dimensions = () =>
      page.evaluate(() => {
        const rect = (selector: string) => {
          const el = document.querySelector(selector)!;
          const r = el.getBoundingClientRect();
          return {
            top: r.top,
            bottom: r.bottom,
            height: r.height,
            overflow: el.scrollHeight - el.clientHeight,
          };
        };
        return {
          header: rect("header"),
          opening: rect('[data-home-chapter="opening"]'),
          hero: rect('[aria-roledescription="carrossel"]'),
          access: rect('[aria-labelledby="quick-access-heading"]'),
          news: rect('[aria-labelledby="home-news-heading"]'),
          faq: rect("#duvidas"),
        };
      });
    if (viewport.width >= 1024) {
      await expect
        .poll(async () => {
          const d = await dimensions();
          return Math.abs(d.header.height + d.opening.height - viewport.height);
        })
        .toBeLessThanOrEqual(1);
    }
    const d = await dimensions();
    expect(Math.abs(d.hero.bottom - d.access.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(d.access.bottom - d.news.top)).toBeLessThanOrEqual(1);
    expect(Math.abs(d.news.bottom - d.faq.top)).toBeLessThanOrEqual(1);
    expect(d.opening.overflow).toBeLessThanOrEqual(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
    await page.screenshot({
      path:
        "test-results/abertura-" +
        viewport.width +
        "x" +
        viewport.height +
        ".png",
    });
  }
});
