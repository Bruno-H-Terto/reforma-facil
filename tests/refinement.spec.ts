import { test, expect } from "@playwright/test";

test("carrossel textual: composição fixa, sem fotos nem movimento no mascote", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "matriz de viewports independente",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  for (const width of [320, 390, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const hero = page.getByRole("region", {
      name: "Destaques do Reforma Clara",
    });
    const mascot = hero.getByRole("img", {
      name: "Reforminha, mascote da reforma tributária",
    });
    await expect(mascot).toBeVisible();
    const before = (await mascot.boundingBox())!;
    expect(
      await mascot.evaluate((el) => getComputedStyle(el).animationName),
    ).toBe("none");
    await expect(hero.locator("img")).toHaveCount(3);
    for (const i of [2, 3, 1]) {
      await hero.getByRole("button", { name: "Ver destaque " + i }).click();
      await expect(
        hero.getByRole("button", { name: "Ver destaque " + i }),
      ).toHaveAttribute("aria-current", "true");
      const after = (await mascot.boundingBox())!;
      for (const key of ["x", "y", "width", "height"] as const)
        expect(
          Math.abs(after[key] - before[key]),
          width + " px / " + key,
        ).toBeLessThan(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
    await page.screenshot({
      path: "test-results/refinamento-" + width + ".png",
      fullPage: true,
      animations: "disabled",
    });
  }
});

test("FAQ da home sem bordas, com cor neutra e accordion acessível", async ({
  page,
}) => {
  await page.goto("/");
  const faq = page.getByRole("region", { name: "Dúvidas frequentes" });
  expect(await faq.evaluate((el) => getComputedStyle(el).borderTopWidth)).toBe(
    "0px",
  );
  expect(await faq.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    "rgb(234, 239, 241)",
  );
  expect(await faq.evaluate((el) => getComputedStyle(el).boxShadow)).toBe(
    "none",
  );
  const q = faq.getByRole("button", { name: "O Simples Nacional vai acabar?" });
  expect(await q.evaluate((el) => getComputedStyle(el).fontSize)).toBe("16px");
  await q.focus();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await expect(
    faq.getByText(/Não. O regime permanece/).filter({ visible: true }),
  ).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(q).toHaveAttribute("aria-expanded", "false");
  await expect(q).toBeFocused();
});
