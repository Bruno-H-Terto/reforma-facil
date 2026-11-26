import { expect, test } from "@playwright/test";

test("FAQ ocupa área independente de patrocinadores e rodapé sem cortar respostas", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const faq = page.getByRole("region", { name: "Dúvidas frequentes" });
  for (const [width, height] of [
    [1920, 1080],
    [1440, 900],
    [1366, 768],
    [1280, 720],
    [1024, 768],
    [768, 1024],
    [390, 844],
    [320, 568],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    const geometry = () =>
      faq.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const opening = document
          .querySelector('[data-home-chapter="opening"]')!
          .getBoundingClientRect();
        const sponsors = document
          .getElementById("patrocinadores")!
          .getBoundingClientRect();
        const footer = document
          .querySelector("footer")!
          .getBoundingClientRect();
        return {
          height: r.height,
          top: r.top + scrollY,
          bottom: r.bottom + scrollY,
          opening: opening.bottom + scrollY,
          sponsorsTop: sponsors.top + scrollY,
          sponsorsBottom: sponsors.bottom + scrollY,
          footer: footer.top + scrollY,
          footerHeight: footer.height,
          overflow: el.scrollHeight - el.clientHeight,
        };
      });
    await expect
      .poll(async () => {
        const g = await geometry();
        return g.height + g.footerHeight;
      })
      .toBeGreaterThanOrEqual(height - 1);
    // Wait for the header ResizeObserver and responsive font/layout recalculation.
    await page.evaluate(async () => {
      await document.fonts.ready;
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
      );
    });
    const before = await geometry();
    const buttons = faq.getByRole("button");
    for (const i of [1, 2, 3, 4, 0]) {
      await buttons.nth(i).click();
      await expect(buttons.nth(i)).toHaveAttribute("aria-expanded", "true");
      const g = await geometry();
      expect(g.height + g.footerHeight).toBeGreaterThanOrEqual(height - 1);
      expect(g.overflow).toBeLessThanOrEqual(1);
      expect(
        Math.abs(g.top - before.top),
        width + "x" + height + " / " + i,
      ).toBeLessThanOrEqual(1);
      expect(Math.abs(g.opening - before.opening)).toBeLessThanOrEqual(1);
      expect(g.sponsorsTop).toBeGreaterThanOrEqual(g.bottom - 1);
      expect(g.footer).toBeGreaterThanOrEqual(g.sponsorsBottom - 1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await faq.evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + scrollY),
    );
    await page.screenshot({
      path: "test-results/faq-viewport-" + width + "x" + height + ".png",
    });
  }
});
