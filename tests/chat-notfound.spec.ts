import { expect, test } from "@playwright/test";

test("chat flutuante abre, responde e muda a expressão do Reforminha", async ({
  page,
  isMobile,
}) => {
  await page.route("**/api/chat", async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const request = route.request().postDataJSON();
    expect(request.messages.at(-1).content).toBe("O que muda para o Simples?");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer:
          "Consulte o guia e a aba Simples Nacional para entender a reforma.",
      }),
    });
  });

  await page.goto("/");
  const launcher = page.getByRole("button", {
    name: "Conversar com o Reforminha",
  });
  await expect(launcher).toBeVisible();
  await launcher.click();
  const dialog = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/Olá! Sou o Reforminha/)).toBeVisible();
  const textbox = dialog.getByRole("textbox", {
    name: "Mensagem para o Reforminha",
  });
  await expect(textbox).toBeFocused();
  await textbox.fill("O que muda para o Simples?");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();

  await expect(dialog.getByText("Reforminha está pensando...")).toBeVisible();
  const openLauncher = page.getByRole("button", {
    name: "Recolher chat do Reforminha",
  });
  if (!isMobile) {
    await expect(
      openLauncher.locator('img[src="/images/mascot/chat-thinking.webp"]'),
    ).toBeVisible();
  }
  await expect(
    dialog.getByText(/Consulte o guia e a aba Simples Nacional/),
  ).toBeVisible();
  if (!isMobile) {
    await expect(
      openLauncher.locator('img[src="/images/mascot/chat-speaking.webp"]'),
    ).toBeVisible();
  }

  await dialog.getByRole("button", { name: "Nova conversa" }).click();
  await expect(dialog.getByText(/Olá! Sou o Reforminha/)).toBeVisible();
  await expect(
    dialog.getByText(/Consulte o guia e a aba Simples Nacional/),
  ).toHaveCount(0);

  await textbox.focus();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Conversar com o Reforminha" }),
  ).toBeFocused();
});

test("o chatbot informa erro sem inventar uma resposta", async ({ page }) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Configure DEEPSEEK_API_KEY no servidor.",
      }),
    }),
  );
  await page.goto("/entenda");
  await page
    .getByRole("button", { name: "Conversar com o Reforminha" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  await dialog
    .getByRole("textbox", { name: "Mensagem para o Reforminha" })
    .fill("Qual alíquota?");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByRole("alert")).toContainText(
    "Configure DEEPSEEK_API_KEY no servidor.",
  );
  await expect(dialog.getByRole("alert")).toContainText(
    "Nenhuma resposta de IA foi gerada",
  );
  await expect(dialog.getByText("Qual alíquota?")).toBeVisible();
});

test("página pública 404 mostra a ilustração e permite voltar", async ({
  page,
}) => {
  await page.goto("/rota-inexistente-do-portal");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
  const image = page.getByRole("img", {
    name: "Reforminha confuso, olhando uma placa de sinalização em uma bifurcação",
  });
  await expect(image).toBeVisible();
  await expect
    .poll(() =>
      image.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
  await page.getByRole("link", { name: "Voltar ao início" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/404");
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
});

test("mascote mantém a mesma identidade visual no guia e na página principal", async ({
  page,
}) => {
  await page.goto("/");
  const hero = page.locator('img[src="/images/mascot/reforminha-hero.webp"]');
  await expect(hero).toBeVisible();
  await expect
    .poll(() =>
      hero.evaluate((element: HTMLImageElement) => element.naturalWidth > 0),
    )
    .toBe(true);
  await page.goto("/entenda");
  const thinking = page.locator('img[src="/images/mascot/chat-thinking.webp"]');
  await expect(thinking).toBeVisible();
  await expect
    .poll(() =>
      thinking.evaluate(
        (element: HTMLImageElement) => element.naturalWidth > 0,
      ),
    )
    .toBe(true);
});

test("exemplo de Function Calling oferece link clicável para o simulador", async ({
  page,
}) => {
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: "Encontrei a aba: [Abrir Lucro Real](/simulador?modo=real).",
      }),
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Conversar com o Reforminha" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  await dialog
    .getByRole("textbox", { name: "Mensagem para o Reforminha" })
    .fill("Onde simulo o Lucro Real?");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  const link = dialog.getByRole("link", { name: "Abrir Lucro Real" });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/simulador?modo=real");
  await link.click();
  await expect(page).toHaveURL(/\/simulador\?modo=real$/);
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("tab", { name: "Lucro Real" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("chat ocupa a viewport no celular e mantém dimensão flutuante no desktop", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Conversar com o Reforminha" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  const viewport = page.viewportSize();
  expect(bounds).not.toBeNull();
  expect(viewport).not.toBeNull();
  if (isMobile) {
    expect(bounds!.x).toBeCloseTo(0, 0);
    expect(bounds!.y).toBeCloseTo(0, 0);
    expect(bounds!.width).toBeCloseTo(viewport!.width, 0);
    expect(bounds!.height).toBeCloseTo(viewport!.height, 0);
    await expect(
      page.getByRole("button", { name: "Recolher chat do Reforminha" }),
    ).toBeHidden();
  } else {
    expect(bounds!.width).toBeLessThan(viewport!.width);
    expect(bounds!.height).toBeLessThan(viewport!.height);
    await expect(
      page.getByRole("button", { name: "Recolher chat do Reforminha" }),
    ).toBeVisible();
  }
  await dialog.getByRole("button", { name: "Fechar conversa" }).click();
  await expect(dialog).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Conversar com o Reforminha" }),
  ).toBeVisible();
});
