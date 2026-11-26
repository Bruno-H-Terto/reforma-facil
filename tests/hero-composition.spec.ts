import { expect, test } from "@playwright/test";

test("hero mantém mascote, instituição atrás do mapa e balão sem cortes", async ({
  page,
}) => {
  await page.goto("/");
  const figure = page.locator("figure").first();
  const mascot = figure.locator(
    'img[src="/images/mascot/reforminha-hero.webp"]',
  );
  const institution = figure.locator('img[src="/images/hero-institution.svg"]');
  const brazil = figure.locator('img[src="/images/mascot/brasil.webp"]');
  await expect(mascot).toBeVisible();
  await expect(institution).toBeVisible();
  await expect(brazil).toBeVisible();
  for (const item of [mascot, institution, brazil]) {
    await expect
      .poll(() =>
        item.evaluate(
          (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
        ),
      )
      .toBe(true);
  }
  const [bankBox, mapBox] = await Promise.all([
    institution.boundingBox(),
    brazil.boundingBox(),
  ]);
  expect(
    bankBox &&
      mapBox &&
      bankBox.y < mapBox.y &&
      bankBox.y + bankBox.height > mapBox.y,
  ).toBeTruthy();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
