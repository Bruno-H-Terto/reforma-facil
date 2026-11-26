import { expect, test } from "@playwright/test";
test("Entenda: quatro pares conectados, avatar independente e responsividade", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/entenda");
  const comparison = page.getByRole("region", {
    name: "Antes e depois da reforma",
  });
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => document.fonts.ready);
    await expect(
      page.getByRole("navigation", { name: "Seções desta área" }),
    ).toHaveCount(0);
    await expect(
      comparison.getByRole("heading", { name: "Antes", exact: true }),
    ).toBeVisible();
    await expect(
      comparison.getByRole("heading", { name: "Depois", exact: true }),
    ).toBeVisible();
    await expect(comparison.getByRole("listitem")).toHaveCount(4);
    for (const [before, after] of [
      ["PIS e Cofins", "CBS"],
      ["ICMS e ISS", "IBS"],
      ["IPI", "IPI com alíquota zero"],
      ["Sem Imposto Seletivo", "Imposto Seletivo (IS)"],
    ]) {
      const row = comparison.getByRole("listitem").filter({
        has: page
          .locator("span.font-semibold")
          .filter({ hasText: new RegExp("^" + before + "$") }),
      });
      await expect(
        row.locator("span.font-semibold").filter({
          hasText: new RegExp("^" + after.replace(/[()]/g, "\\$&") + "$"),
        }),
      ).toBeVisible();
    }
    await expect(
      comparison.getByText("A partir de 2027, salvo exceções legais.", {
        exact: true,
      }),
    ).toBeVisible();
    const mascot = comparison.getByRole("img", { name: "Reforminha" });
    await expect(mascot).toHaveAttribute(
      "src",
      "/images/mascot/chat-avatar.webp",
    );
    await expect
      .poll(() =>
        mascot.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(
      await comparison.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
    ).toBe(true);
    await comparison.screenshot({
      path: "test-results/entenda-diagrama-" + width + ".png",
    });
  }
});
