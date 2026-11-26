/**
 * Regressão de compatibilidade ESM para a Function Node.js da Vercel.
 * Vite e tsx resolvem imports que o Node.js nativo não encontra.
 */
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const directory = "node_modules/.tmp/reforma-compiled-esm";
execFileSync(
  process.platform === "win32" ? "npx.cmd" : "npx",
  [
    "tsc",
    "--project",
    "tsconfig.api.json",
    "--noEmit",
    "false",
    "--outDir",
    directory,
    "--rewriteRelativeImportExtensions",
    "true",
  ],
  { stdio: "inherit" },
);

const importCompiled = (filename) =>
  import(pathToFileURL(resolve(directory, filename)).href);

const { agentTools } = await importCompiled("server/agent/agent.js");
assert.equal(agentTools.length, 7);

const { quickDas } = await importCompiled("src/lib/quickDas.js");
assert.equal(quickDas("I", 300000, 25000, 2026)?.total, 1330);

const { default: handler } = await importCompiled("api/chat.js");
const response = await handler.fetch(
  new Request("http://localhost:3000/api/chat"),
);
assert.equal(response.status, 405);
assert.deepEqual(await response.json(), { error: "Método não permitido." });

console.log(
  "OK: Function, agente e módulos tributários carregaram em Node.js ESM.",
);
