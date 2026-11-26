import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("IBS, CBS e IS exibem exemplos sem deslocar o layout", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  test.setTimeout(60000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const terms = page.locator("#tributos");
  const cards = terms.getByRole("article");
  const geometry = () =>
    page.evaluate(() => {
      const elements = [
        ...document.querySelectorAll(
          "#tributos, #tributos article, #comparativo, footer",
        ),
      ];
      return elements.map((el) => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y + scrollY, r.width, r.height];
      });
    });
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
    [1920, 1080],
    [844, 390],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto("/entenda");
    await page.evaluate(() => document.fonts.ready);
    await expect(cards).toHaveCount(3);
    const initial = await geometry();
    for (const acronym of ["IBS", "CBS", "IS"]) {
      const trigger = terms.getByRole("button", {
        name: "Ver exemplo de " + acronym,
      });
      await trigger.scrollIntoViewIfNeeded();
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      const panel = page.getByRole("region", { name: "Exemplo de " + acronym });
      await expect(panel).toBeVisible();
      await expect(panel.getByText(/^Exemplo:/)).toBeVisible();
      const popover = page.locator("[popover]:popover-open");
      const box = (await popover.boundingBox())!;
      const cardBox = (await trigger
        .locator("xpath=ancestor::article")
        .boundingBox())!;
      expect(Math.abs(box.width - cardBox.width)).toBeLessThanOrEqual(1);
      expect(Math.abs(box.x - cardBox.x)).toBeLessThanOrEqual(1);
      await expect(panel.getByRole("button")).toHaveCount(0);
      expect(box.x).toBeGreaterThanOrEqual(-1);
      expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
      expect(box.y).toBeGreaterThanOrEqual(-1);
      expect(box.y + box.height).toBeLessThanOrEqual(height + 1);
      expect(await page.locator('[data-testid="underlay"]').count()).toBe(0);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
      const opened = await geometry();
      for (let i = 0; i < initial.length; i++)
        for (let j = 0; j < 4; j++)
          expect(
            Math.abs(initial[i][j] - opened[i][j]),
            width + " " + acronym + " elemento " + i + " dimensão " + j,
          ).toBeLessThanOrEqual(1);
      if (width === 390 && acronym === "IBS") {
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();
        expect(result.violations.map((v) => v.id)).toEqual([]);
      }
      if (acronym === "IBS")
        await page.screenshot({
          path:
            "test-results/tributos-overlay-" + width + "x" + height + ".png",
        });
      if (acronym === "CBS") await trigger.click();
      else await page.keyboard.press("Escape");
      await expect(panel).toBeHidden();
      await expect(trigger).toBeFocused();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      const closed = await geometry();
      for (let i = 0; i < initial.length; i++)
        for (let j = 0; j < 4; j++)
          expect(Math.abs(initial[i][j] - closed[i][j])).toBeLessThanOrEqual(1);
    }
  }
});
