import { expect, test } from "@playwright/test";

async function openChat(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Conversar com o Reforminha" })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  const textbox = dialog.getByRole("textbox", {
    name: "Mensagem para o Reforminha",
  });
  return { dialog, textbox };
}

test("chat exibe Markdown GFM e só transforma URLs confiáveis em links", async ({
  page,
}) => {
  const fence = String.fromCharCode(96).repeat(3);
  await page.route("**/api/chat", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer: [
          "## Simples Nacional",
          "",
          "Considere **IBS** e *CBS*.",
          "",
          "- Comércio",
          "- Serviços",
          "",
          "| Ano | Tributo |",
          "| --- | --- |",
          "| 2027 | CBS |",
          "",
          "> Valores educativos.",
          "",
          fence + "json",
          '{"status":"ok"}',
          fence,
          "",
          "[Abrir simulador](/simulador)",
          "[Receita Federal](https://www.gov.br/receitafederal/pt-br)",
          "[Link externo](https://example.com/bad)",
          "[Código inseguro](javascript:alert(1))",
          "![Imagem remota](https://example.com/pixel.gif)",
          "<script>alert('inseguro')</script>",
        ].join("\n"),
      }),
    }),
  );

  const { dialog, textbox } = await openChat(page);
  await textbox.fill("Exiba uma explicação formatada.");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();

  await expect(
    dialog.getByRole("heading", { name: "Simples Nacional" }),
  ).toBeVisible();
  await expect(
    dialog.locator("strong").filter({ hasText: "IBS" }),
  ).toBeVisible();
  await expect(dialog.locator("em").filter({ hasText: "CBS" })).toBeVisible();
  await expect(
    dialog.locator("li").filter({ hasText: "Comércio" }),
  ).toBeVisible();
  await expect(dialog.getByRole("table")).toBeVisible();
  await expect(dialog.locator("blockquote")).toContainText("educativos");
  await expect(dialog.locator("pre code")).toContainText('"status":"ok"');

  await expect(
    dialog.getByRole("link", { name: "Abrir simulador" }),
  ).toHaveAttribute("href", "/simulador");
  await expect(
    dialog.getByRole("link", { name: /Receita Federal/ }),
  ).toHaveAttribute("rel", "noopener noreferrer");
  await expect(dialog.getByRole("link", { name: "Link externo" })).toHaveCount(
    0,
  );
  await expect(
    dialog.getByRole("link", { name: "Código inseguro" }),
  ).toHaveCount(0);
  await expect(dialog.locator("script")).toHaveCount(0);
  await expect(
    dialog.locator('img[src="https://example.com/pixel.gif"]'),
  ).toHaveCount(0);
});

test("textarea aceita sintaxe Markdown e mostra prévia formatada", async ({
  page,
}) => {
  const { dialog, textbox } = await openChat(page);
  const tick = String.fromCharCode(96);
  await textbox.fill(
    "**Importante**\n\n- Um\n- Dois\n\n" + tick + "DAS" + tick,
  );
  const button = dialog.getByRole("button", { name: "Prévia Markdown" });
  await expect(button).toHaveAttribute("aria-pressed", "false");
  await button.click();
  await expect(button).toHaveAttribute("aria-pressed", "true");

  const preview = dialog.getByRole("region", { name: "Prévia Markdown" });
  await expect(preview.locator("strong")).toHaveText("Importante");
  await expect(preview.getByRole("listitem")).toHaveCount(2);
  await expect(preview.locator("code")).toHaveText("DAS");

  await button.click();
  await expect(preview).toHaveCount(0);
});

test("continuação envia respostas anteriores como contexto e não altera Markdown", async ({
  page,
}) => {
  const requests: Array<{
    messages: Array<{ role: string; content: string }>;
  }> = [];
  const firstAnswer =
    "Para sua padaria no **Simples Nacional**, siga o calendário da reforma.\n\n" +
    "Consulte as regras da sua atividade. ".repeat(80);

  await page.route("**/api/chat", (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        answer:
          requests.length === 1
            ? firstAnswer
            : "A partir de 2027, observe as regras de transição.",
      }),
    });
  });

  const { dialog, textbox } = await openChat(page);
  await textbox.fill("Tenho uma padaria no Simples Nacional.");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByText(/Para sua padaria/)).toBeVisible();

  await textbox.fill("E em 2027?");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByText(/A partir de 2027/)).toBeVisible();

  expect(requests).toHaveLength(2);
  expect(requests[1].messages).toEqual([
    { role: "user", content: "Tenho uma padaria no Simples Nacional." },
    { role: "assistant", content: firstAnswer },
    { role: "user", content: "E em 2027?" },
  ]);
});

test("mensagem que falhou não é reenviada nas próximas perguntas", async ({
  page,
}) => {
  const requests: Array<{
    messages: Array<{ role: string; content: string }>;
  }> = [];
  await page.route("**/api/chat", (route) => {
    requests.push(route.request().postDataJSON());
    return route.fulfill({
      status: requests.length === 1 ? 502 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        requests.length === 1
          ? { error: "Falha temporária." }
          : { answer: "Nova pergunta respondida." },
      ),
    });
  });

  const { dialog, textbox } = await openChat(page);
  await textbox.fill("Primeira pergunta com erro");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByRole("alert")).toContainText("Falha temporária.");
  await expect(dialog.getByText("Não enviada ao assistente.")).toBeVisible();

  await textbox.fill("Segunda pergunta");
  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByText("Nova pergunta respondida.")).toBeVisible();
  expect(requests[1].messages).toEqual([
    { role: "user", content: "Segunda pergunta" },
  ]);
});
