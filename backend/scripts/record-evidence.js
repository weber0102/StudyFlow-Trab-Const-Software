import { mkdir, writeFile } from "node:fs/promises";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/database/connection.js";
import { seedDatabase } from "../src/database/seeds/demo.js";

// Instância isolada: o relatório não altera os dados da aplicação em execução.
const database = openDatabase({ filename: ":memory:" });
seedDatabase(database);
const server = createApp({ database }).listen(0, "127.0.0.1");
await new Promise((resolve) => server.once("listening", resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;
const records = [];
const request = async (method, path, body) => {
  const response = await fetch(baseUrl + path, {
    method, headers: body === undefined ? {} : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  const text = await response.text();
  const result = text ? JSON.parse(text) : null;
  records.push({ method, url: baseUrl + path, requestBody: body ?? null, status: response.status, responseBody: result });
  return result;
};

try {
  await request("GET", "/api/tarefas");
  const task = await request("POST", "/api/tarefas", { title: "Apresentar o CRUD", subject: "Construção de Software", dueDate: "2099-12-10", priority: "alta", status: "pendente", description: "Etapa 06" });
  await request("GET", `/api/tarefas/${task.id}`);
  await request("POST", "/api/tarefas", { title: "   " });
  await request("PATCH", `/api/tarefas/${task.id}`, { status: "concluida" });
  await request("GET", `/api/tarefas/${task.id}`);
  await request("DELETE", `/api/tarefas/${task.id}`);
  await request("GET", `/api/tarefas/${task.id}`);
  await request("GET", "/api/tarefas/abc");
  const directory = new URL("../../docs/evidencias/etapa-06/", import.meta.url);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL("crud-http.json", directory), JSON.stringify({ generatedAt: new Date().toISOString(), tool: "Node.js Fetch - requisições HTTP reais em instância isolada", records }, null, 2) + "\n");
  console.info("Registro HTTP gerado em docs/evidencias/etapa-06/crud-http.json");
} finally {
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
  database.close();
}
