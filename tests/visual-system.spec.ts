import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("sistema visual: FAQ aberto, controles e contraste em telas compactas", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "matriz independente de dispositivos",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const hero = page.getByRole("region", { name: "Destaques do Reforma Clara" });
  for (const index of [1, 2, 3]) {
    await hero.getByRole("button", { name: "Ver destaque " + index }).click();
    await expect(
      hero.getByRole("button", { name: "Ver destaque " + index }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
  }
  const faq = page.getByRole("region", { name: "Dúvidas frequentes" });
  for (const button of (await faq.getByRole("button").all()).slice(1)) {
    await button.click();
    await expect(faq.locator('button[aria-expanded="true"]')).toHaveCount(1);
  }
  await faq.getByRole("button").first().click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  const audit = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    audit.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  await page.goto("/simulador/avancado");
  await page
    .locator("summary")
    .filter({ hasText: /^Memória de cálculo$/ })
    .click();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await expect(
    page.getByRole("heading", { name: "Memória de cálculo" }),
  ).toBeVisible();
});
