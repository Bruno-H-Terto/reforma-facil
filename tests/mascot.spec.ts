import { test, expect } from "@playwright/test";
test("Reforminha: arquivo independente, animação limitada e acessibilidade", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const mascot = page.getByRole("img", {
    name: "Reforminha, mascote da reforma tributária",
  });
  await expect(mascot).toBeVisible();
  await expect
    .poll(() =>
      mascot.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  expect(
    await mascot.evaluate((el) => getComputedStyle(el).animationName),
  ).toBe("none");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test-results/mascot-" + test.info().project.name + ".png",
  });
});
