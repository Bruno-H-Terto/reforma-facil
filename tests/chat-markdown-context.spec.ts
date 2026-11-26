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

test("formatação ocorre no próprio editor ao digitar atalhos Markdown", async ({
  page,
}) => {
  const { dialog, textbox } = await openChat(page);
  await expect(textbox).toHaveAttribute("contenteditable", "true");

  await textbox.pressSequentially("**Importante**", { delay: 8 });
  await expect(textbox.locator("strong")).toHaveText("Importante");
  await expect(
    dialog.getByRole("region", { name: "Prévia Markdown" }),
  ).toHaveCount(0);

  await textbox.fill("");
  await textbox.pressSequentially("- Primeiro item", { delay: 8 });
  await expect(textbox.locator("li")).toHaveText("Primeiro item");

  await textbox.fill("");
  await textbox.pressSequentially("## Orientação", { delay: 8 });
  await expect(textbox.locator("h2")).toHaveText("Orientação");
});

test("botões de formatação atuam dentro do campo e o envio usa Markdown", async ({
  page,
}) => {
  let received = "";
  await page.route("**/api/chat", (route) => {
    received = route.request().postDataJSON().messages[0].content;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer: "Recebido." }),
    });
  });

  const { dialog, textbox } = await openChat(page);
  await textbox.fill("Mensagem importante");
  await textbox.selectText();
  await dialog.getByRole("button", { name: "Negrito" }).click();
  await expect(textbox.locator("strong")).toHaveText("Mensagem importante");

  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByText("Recebido.")).toBeVisible();
  expect(received).toBe("**Mensagem importante**");
});

test("Enter sempre quebra linha e envio acontece somente pelo botão", async ({
  page,
}) => {
  let received = "";
  let requests = 0;
  await page.route("**/api/chat", (route) => {
    requests += 1;
    received = route.request().postDataJSON().messages[0].content;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer: "Recebido." }),
    });
  });
  const { dialog, textbox } = await openChat(page);
  await textbox.fill("Primeira linha");
  await textbox.press("Enter");
  await textbox.pressSequentially("Segunda linha");
  await expect(textbox.locator("p")).toHaveCount(2);
  await expect(textbox).toContainText("Segunda linha");
  expect(requests).toBe(0);

  // Também funciona com Shift+Enter, mas nenhum Enter deve enviar.
  await textbox.press("Shift+Enter");
  await textbox.pressSequentially("Terceira linha");
  await expect(textbox).toContainText("Terceira linha");
  expect(requests).toBe(0);

  await dialog.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(dialog.getByText("Recebido.")).toBeVisible();
  expect(requests).toBe(1);
  expect(received).toMatch(
    /Primeira linha[\s\S]*Segunda linha[\s\S]*Terceira linha/,
  );
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

test("rascunho formatado permanece ao recolher e reabrir o chat", async ({
  page,
}) => {
  let received = "";
  await page.route("**/api/chat", (route) => {
    received = route.request().postDataJSON().messages[0].content;
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ answer: "Recebido." }),
    });
  });

  const { dialog, textbox } = await openChat(page);
  await textbox.pressSequentially("**Rascunho**", { delay: 8 });
  await expect(textbox.locator("strong")).toHaveText("Rascunho");

  await dialog.getByRole("button", { name: "Fechar conversa" }).click();
  await expect(dialog).toBeHidden();
  await page
    .getByRole("button", { name: "Conversar com o Reforminha" })
    .click();

  const reopened = page.getByRole("dialog", {
    name: "Conversa com o Reforminha",
  });
  const editor = reopened.getByRole("textbox", {
    name: "Mensagem para o Reforminha",
  });
  await expect(editor.locator("strong")).toHaveText("Rascunho");
  await reopened.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(reopened.getByText("Recebido.")).toBeVisible();
  expect(received).toBe("**Rascunho**");
});

test("botão Negrito ativa e desativa imediatamente, antes de digitar", async ({
  page,
}) => {
  const { dialog, textbox } = await openChat(page);
  const bold = dialog.getByRole("button", { name: "Negrito" });

  await expect(bold).toHaveAttribute("aria-pressed", "false");
  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await expect(bold).toHaveClass(/ring-1/);

  // A formatação deve ser aplicada sem precisar digitar para ativar o botão.
  await textbox.pressSequentially("Tributo", { delay: 10 });
  await expect(textbox.locator("strong")).toHaveText("Tributo");
  await expect(bold).toHaveAttribute("aria-pressed", "true");

  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed", "false");
  await expect(bold).not.toHaveClass(/ring-1/);

  // Desativado, o texto seguinte não deve receber negrito.
  await textbox.pressSequentially(" normal");
  await expect(textbox.locator("strong")).toHaveText("Tributo");
  await expect(textbox).toContainText("Tributo normal");
  await expect(bold).toHaveAttribute("aria-pressed", "false");
});

test("todos os controles refletem imediatamente o estado ao clicar novamente", async ({
  page,
}) => {
  const { dialog, textbox } = await openChat(page);
  const names = [
    "Itálico",
    "Título",
    "Lista com marcadores",
    "Lista numerada",
    "Código",
  ];
  for (const name of names) {
    const button = dialog.getByRole("button", { name, exact: true });
    await textbox.fill("");
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(button).toHaveClass(/ring-1/);
    await button.click();
    await expect(button).toHaveAttribute("aria-pressed", "false");
    await expect(button).not.toHaveClass(/ring-1/);
  }
});

test("barra atualiza ao mover a seleção entre texto formatado e simples", async ({
  page,
}) => {
  const { dialog, textbox } = await openChat(page);
  const bold = dialog.getByRole("button", { name: "Negrito" });

  await textbox.fill("");
  await textbox.pressSequentially("**bold** comum", { delay: 10 });
  await expect(textbox.locator("strong")).toHaveText("bold");

  // Mover a seleção deve atualizar o indicador mesmo sem alterar o texto.
  await textbox.locator("strong").click();
  await expect(bold).toHaveAttribute("aria-pressed", "true");

  await textbox.press("End");
  await expect(bold).toHaveAttribute("aria-pressed", "false");
});
