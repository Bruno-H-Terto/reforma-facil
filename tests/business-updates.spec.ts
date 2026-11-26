import { test, expect } from "@playwright/test";

test("MEI exibe regras e fontes do perdão sem prometer perdão total do DAS", async ({
  page,
}) => {
  await page.goto("/empresas");
  await expect(page.getByRole("tab", { name: "MEI" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(
    page.getByRole("heading", { name: /Perdão de dívidas do MEI/ }),
  ).toBeVisible();
  await expect(page.getByText(/não inclui ICMS ou ISS do DAS/)).toBeVisible();
  await expect(page.getByText(/janeiro a junho de 2027/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /PGFN — perguntas frequentes/ }),
  ).toBeVisible();
});

test("Simples explica reenquadramento em janeiro e seus requisitos", async ({
  page,
}) => {
  await page.goto("/empresas");
  await page.getByRole("tab", { name: "Simples Nacional" }).click();
  await expect(
    page.getByRole("heading", {
      name: /Posso voltar a ser MEI em janeiro de 2027/,
    }),
  ).toBeVisible();
  await expect(page.getByText(/não ocorre automaticamente/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Requisitos e solicitação do SIMEI/ }),
  ).toBeVisible();
});

test("A dica do simulador usa o mesmo Reforminha aprovado e a imagem carrega", async ({
  page,
}) => {
  await page.goto("/simulador");
  const mascot = page.getByRole("img", { name: "Reforminha explicando" });
  await expect(mascot).toBeVisible();
  await expect(mascot).toHaveAttribute(
    "src",
    "/images/mascot/chat-helpful.webp",
  );
  await mascot.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      mascot.evaluate(
        (img: HTMLImageElement) => img.complete && img.naturalWidth > 0,
      ),
    )
    .toBe(true);
});
