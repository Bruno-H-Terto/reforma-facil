import { test, expect } from "@playwright/test";

test("apresenta apenas logos institucionais em carrossel demonstrativo", async ({
  page,
}) => {
  await page.goto("/");
  const section = page.getByRole("region", { name: "Patrocinadores" });
  await expect(section.getByText(/Simulação acadêmica/)).toBeVisible();
  await expect(section.locator("article")).toHaveCount(0);
  await expect(section.locator("img")).toHaveCount(10);
  await expect(
    section.getByRole("img", { name: "Receita Federal" }),
  ).toHaveCount(1);
  await expect(
    section.getByRole("img", { name: "Governo de Minas Gerais" }),
  ).toHaveCount(1);
  await expect(
    section.getByRole("img", {
      name: "Conselho Regional de Contabilidade de Minas Gerais",
    }),
  ).toHaveCount(1);
  await expect(section.getByRole("img", { name: "IBGE" })).toHaveCount(0);
  await expect(
    section.getByRole("img", {
      name: /Conselho Regional de Contabilidade de Minas Gerais/,
    }),
  ).toHaveCount(1);
  await expect(section.getByRole("img", { name: "IBGE" })).toHaveCount(0);
  await expect(section.locator(".sponsors-marquee-track")).toHaveCSS(
    "animation-name",
    "sponsors-marquee-scroll",
  );
  for (const img of await section.locator("img").all()) {
    await expect
      .poll(() =>
        img.evaluate(
          (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("restringe animação quando movimento reduzido está ativado", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".sponsors-marquee-track")).toHaveCSS(
    "animation-name",
    "none",
  );
});
