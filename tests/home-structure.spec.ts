import { test, expect } from "@playwright/test";
test("home: simulador acessível pelo atalho, sem formulário duplicado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("region", { name: "Prévia estimada do DAS" }),
  ).toHaveCount(0);
  await expect(page.locator("main input, main select")).toHaveCount(0);
  await page.getByRole("link", { name: /Simule seus tributos/ }).click();
  await expect(page).toHaveURL(/\/simulador$/);
  await expect(
    page.getByRole("region", { name: "Resultado rápido" }),
  ).toBeVisible();
});
test("home: perguntas e fontes disponíveis sem painéis duplicados", async ({
  page,
}) => {
  await page.goto("/");
  const faq = page.getByRole("region", { name: "Dúvidas frequentes" });
  await expect(faq.getByRole("button")).toHaveCount(5);
  await faq
    .getByRole("button", { name: "O Simples Nacional vai acabar?" })
    .click();
  await expect(
    faq.getByText(/Não. O regime permanece/).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    faq.getByRole("button", { name: "O Simples Nacional vai acabar?" }),
  ).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page
      .getByRole("region", { name: "Atualizações e legislação" })
      .getByRole("link", { name: /Ler publicação original/ }),
  ).toHaveCount(1);
  await page.goto("/entenda");
  await expect(
    page.getByRole("button", { name: "O Simples Nacional vai acabar?" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("Glossário de termos", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .getByRole("button", { name: "Significado de IBS", exact: true })
      .first(),
  ).toBeVisible();
  for (const path of ["/duvidas", "/entenda#duvidas"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/#duvidas$/);
    await expect(faq).toBeVisible();
  }
});
test("home: botões não vazam nos recortes compactos", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "desktop", "matriz independente");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const viewport of [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 844, height: 390 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
    const bad = await page
      .locator("main button:visible, main input:visible, main select:visible")
      .evaluateAll((els) =>
        els
          .filter((el) => !el.closest("[inert]"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.left < -1 || r.right > innerWidth + 1;
          })
          .map((el) => el.textContent),
      );
    expect(bad).toEqual([]);
    await page.screenshot({
      path:
        "test-results/stage1-" +
        viewport.width +
        "x" +
        viewport.height +
        ".png",
      fullPage: true,
    });
  }
});
