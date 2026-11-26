import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("glossário contextual: definições, toque, teclado e geometria estável", async ({
  page,
}, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/entenda");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("#glossario")).toHaveCount(0);
  for (const term of [
    "IBS",
    "CBS",
    "IS",
    "ICMS",
    "ISS",
    "PIS e Cofins",
    "IPI",
    "IVA dual",
    "DAS",
    "créditos tributários",
  ]) {
    await expect(
      page.getByRole("button", { name: "Significado de " + term, exact: true }),
    ).toHaveCount(1);
  }
  await expect(
    page.getByRole("button", { name: /^Significado de / }),
  ).toHaveCount(10);
  await expect(
    page.getByRole("button", {
      name: "Significado de Imposto Seletivo",
      exact: true,
    }),
  ).toHaveCount(0);
  const first = page.getByRole("button", {
    name: "Significado de IBS",
    exact: true,
  });
  await expect(first).toHaveText("IBS");
  await expect(first.locator("svg")).toHaveCount(0);
  await expect(first.locator("xpath=ancestor::sup")).toHaveCount(0);
  expect(
    await first.evaluate((el) => getComputedStyle(el).textDecorationStyle),
  ).toBe("dotted");
  const help = page.getByRole("complementary", {
    name: "Como consultar os termos",
  });
  await expect(help).toContainText("Passe o mouse ou toque");
  const mascot = help.getByRole("img", { name: "Reforminha pensativo" });
  await expect
    .poll(() =>
      mascot.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(
    page
      .locator("#cronograma")
      .getByRole("button", { name: /^Significado de / }),
  ).toHaveCount(0);
  const widths =
    info.project.name === "mobile" ? [390] : [320, 768, 1024, 1440, 1920];
  const geometry = () =>
    page.evaluate(() =>
      [
        ...document.querySelectorAll(
          "#tributos,#comparativo,#cronograma,footer",
        ),
      ].map((el) => {
        const r = el.getBoundingClientRect();
        return [r.x, r.y + scrollY, r.width, r.height];
      }),
    );
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.mouse.move(0, 0);
    const trigger = page
      .getByRole("button", { name: "Significado de IBS", exact: true })
      .first();
    await trigger.scrollIntoViewIfNeeded();
    const before = await geometry();
    const tooltip = page.getByRole("tooltip");
    if (info.project.name === "mobile") await trigger.tap();
    else await trigger.hover();
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText("Imposto sobre Bens e Serviços");
    const box = (await tooltip.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
    const after = await geometry();
    if (width === 1440 || width === 390)
      await page.screenshot({
        path: "test-results/glossario-palavra-" + width + ".png",
      });
    for (let i = 0; i < before.length; i++)
      for (let j = 0; j < 4; j++)
        expect(Math.abs(before[i][j] - after[i][j])).toBeLessThanOrEqual(1);
    if (width === 390 || width === 1440) {
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(result.violations.map((v) => v.id)).toEqual([]);
    }
    if (info.project.name === "mobile") {
      await trigger.tap();
      await expect(tooltip).toHaveCount(0);
    } else {
      await page.mouse.move(0, 0);
      await expect(tooltip).toHaveCount(0);
      await trigger.focus();
      await expect(tooltip).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(tooltip).toHaveCount(0);
      await trigger.blur();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
  }
  await page.goto("/entenda#glossario");
  await expect(page).toHaveURL(/entenda#tributos$/);
});
