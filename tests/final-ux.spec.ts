import { test, expect } from "@playwright/test";

test("orientação contextual do Reforminha e estimativa sem duplicação", async ({
  page,
}) => {
  await page.goto("/simulador");
  const result = page.getByRole("region", { name: "Resultado rápido" });
  await expect(
    result.getByText("Dica do Reforminha", { exact: true }),
  ).toBeVisible();
  await expect(
    result.getByText("Você não precisa somar IBS e CBS novamente."),
  ).toBeVisible();
  const image = result.locator('img[src="/images/mascot/chat-helpful.webp"]');
  await image.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      image.evaluate(
        (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await expect(image).toHaveAttribute("alt", "Reforminha explicando");
  await result.screenshot({
    path: "test-results/reforminha-dica-" + test.info().project.name + ".png",
  });
  await page.getByRole("button", { name: "2026", exact: true }).click();
  await expect(result.getByText("Dica do Reforminha")).toHaveCount(0);
  await expect(
    result.getByText(/Em 2026, IBS e CBS ainda não integram/),
  ).toBeVisible();
  await page.getByRole("button", { name: "2027", exact: true }).click();
  await page.getByRole("checkbox", { name: /Minha empresa tem menos/ }).check();
  await expect(result.getByText("Dica do Reforminha")).toHaveCount(0);
  await expect(result.getByRole("status")).toContainText("apuração específica");
});

test("menu móvel fecha por Escape e mantém foco", async ({ page }, info) => {
  test.skip(
    info.project.name !== "mobile",
    "comportamento específico de navegação móvel",
  );
  await page.goto("/");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  const nav = page.getByRole("navigation", { name: "Navegação móvel" });
  await nav.getByRole("link", { name: "Simular", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(nav).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
});
