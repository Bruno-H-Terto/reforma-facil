import { test, expect } from "@playwright/test";
test("recortes adicionais: 320, 600, 768, 1024, 1440", async ({
  page,
}, info) => {
  test.skip(
    info.project.name !== "desktop",
    "A matriz é independente da emulação móvel",
  );
  test.setTimeout(90000);
  for (const width of [320, 600, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/entenda",
      "/simulador",
      "/simulador/avancado",
      "/biblioteca",
      "/duvidas",
      "/empresas",
      "/empresas/regimes/lucro-presumido",
      "/estados",
      "/noticias",
      "/mei",
      "/calculadoras/simples",
      "/calculadoras/presumido",
      "/calculadoras/real",
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        width + " " + route,
      ).toBe(true);
      if (route === "/" || route === "/simulador") {
        await page.screenshot({
          path:
            "test-results/" + width + "-" + (route.slice(1) || "home") + ".png",
          fullPage: true,
        });
      }
    }
  }
});
