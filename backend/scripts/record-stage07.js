import { mkdir, writeFile } from "node:fs/promises";
import { runPersistenceScenario } from "./persistence-scenario.js";
import { openDatabase } from "../src/database/connection.js";
import { createApp } from "../src/app.js";

const report = await runPersistenceScenario();
const database = openDatabase({ filename: ":memory:" });
const server = createApp({ database }).listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
report.errors = [];
try {
  const base = `http://127.0.0.1:${server.address().port}`;
  const body = { title: "Referência inválida", subjectId: "ffffffff-ffff-4fff-8fff-ffffffffffff", dueDate: "2099-12-10", priority: "alta" };
  const invalid = await fetch(`${base}/api/tarefas`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  report.errors.push({ method: "POST", path: "/api/tarefas", requestBody: body, status: invalid.status, responseBody: await invalid.json() });
  database.exec("PRAGMA query_only = ON");
  const readonly = await fetch(`${base}/api/materias`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "Gravação indisponível" }) });
  report.errors.push({ method: "POST", path: "/api/materias", requestBody: { name: "Gravação indisponível" }, status: readonly.status, responseBody: await readonly.json() });
  if (invalid.status !== 400 || readonly.status !== 503) throw new Error("Os erros de validação/persistência não tiveram o resultado esperado.");
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  database.close();
}
const directory = new URL("../../docs/evidencias/etapa-07/", import.meta.url);
await mkdir(directory, { recursive: true });
await writeFile(new URL("persistencia-http.json", directory), JSON.stringify(report, null, 2) + "\n");
console.info(report.result);
console.info("Evidência: docs/evidencias/etapa-07/persistencia-http.json");
