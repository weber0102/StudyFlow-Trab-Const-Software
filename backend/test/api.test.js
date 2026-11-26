import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../src/app.js";
import { openDatabase } from "../src/database/connection.js";
import { seedDatabase } from "../src/database/seeds/demo.js";
import { createSubjectService } from "../src/services/subject.service.js";
import { createSubjectRepository } from "../src/repositories/subject.repository.js";

const missingId = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const payload = { title: "Preparar apresentação", subject: "Construção de Software", description: "Apresentar o CRUD.", dueDate: "2099-12-10", priority: "alta", status: "pendente" };

const startApi = async (context, options = {}) => {
  const database = options.database || openDatabase({ filename: ":memory:" });
  const subjects = createSubjectService(createSubjectRepository(database));
  if (options.seed) seedDatabase(database);
  else for (const name of ["Construção de Software", "Cálculo I", "Banco de Dados"]) subjects.create({ name });
  const server = createApp({ ...options, database }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(() => { database.close(); resolve(); })); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (method, path, body, headers = {}) => {
    const response = await fetch(base + path, { method, headers: { ...(body !== undefined ? { "Content-Type": "application/json" } : {}), ...headers }, body: body === undefined ? undefined : JSON.stringify(body) });
    const text = await response.text();
    return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null };
  };
  return { request, base };
};

test("CRUD completo por HTTP: lista vazia, POST, GET individual, PATCH, DELETE e 404", async (context) => {
  const { request } = await startApi(context);
  assert.deepEqual((await request("GET", "/api/tarefas")).body, []);
  const created = await request("POST", "/api/tarefas", payload);
  assert.equal(created.status, 201);
  assert.match(created.body.id, /^[0-9a-f-]{36}$/);
  const path = `/api/tarefas/${created.body.id}`;
  assert.equal(created.headers.get("location"), path);
  assert.equal((await request("GET", "/api/tarefas")).body.length, 1);
  assert.equal((await request("GET", path)).body.title, payload.title);
  const patched = await request("PATCH", path, { title: "Apresentação revisada", status: "concluida" });
  assert.equal(patched.status, 200);
  assert.equal(patched.body.subject, payload.subject);
  assert.equal((await request("GET", path)).body.status, "concluida");
  const removed = await request("DELETE", path);
  assert.equal(removed.status, 204);
  assert.equal(removed.body, null);
  for (const method of ["GET", "PATCH", "DELETE"]) {
    const result = await request(method, path, method === "PATCH" ? { status: "pendente" } : undefined);
    assert.equal(result.status, 404);
    assert.equal(result.body.erro, "TAREFA_NAO_ENCONTRADA");
  }
  assert.deepEqual((await request("GET", "/api/tarefas")).body, []);
});

test("POST rejeita campos ausentes, vazios, tipos, limites, enums, datas e campos desconhecidos", async (context) => {
  const { request } = await startApi(context);
  const invalidBodies = [undefined, {}, null, [], "texto", { ...payload, title: undefined }, { ...payload, title: "   " },
    { ...payload, title: 12 }, { ...payload, title: "a".repeat(101) }, { ...payload, subject: " " },
    { ...payload, subject: [] }, { ...payload, subject: "a".repeat(61) }, { ...payload, description: 1 },
    { ...payload, description: "a".repeat(501) }, { ...payload, dueDate: "2099-02-30" },
    { ...payload, dueDate: "2099-13-01" }, { ...payload, dueDate: "2000-01-01" }, { ...payload, dueDate: 123 },
    { ...payload, priority: "urgente" }, { ...payload, status: "finalizada" }, { ...payload, id: "escolhido" }];
  for (const body of invalidBodies) {
    const result = await request("POST", "/api/tarefas", body, { "Content-Type": "application/json" });
    assert.equal(result.status, 400, JSON.stringify(body));
    assert.equal(typeof result.body.mensagem, "string");
  }
  assert.deepEqual((await request("GET", "/api/tarefas")).body, []);
});

test("normalização, defaults e prevenção de duplicidade em POST e PATCH", async (context) => {
  const { request } = await startApi(context);
  const first = await request("POST", "/api/tarefas", { ...payload, title: "  Preparar   apresentação  ", description: undefined, status: undefined });
  assert.equal(first.status, 201);
  assert.equal(first.body.title, payload.title);
  assert.equal(first.body.description, "");
  assert.equal(first.body.status, "pendente");
  assert.equal((await request("POST", "/api/tarefas", { ...payload, title: payload.title.toUpperCase() })).status, 409);
  const second = await request("POST", "/api/tarefas", { ...payload, title: "Outra atividade" });
  const conflict = await request("PATCH", `/api/tarefas/${second.body.id}`, { title: payload.title });
  assert.equal(conflict.status, 409);
  assert.equal(conflict.body.campo, "title");
});

test("GET, PATCH e DELETE validam UUID e tratam ID inexistente", async (context) => {
  const { request } = await startApi(context);
  for (const method of ["GET", "PATCH", "DELETE"]) {
    const body = method === "PATCH" ? { status: "concluida" } : undefined;
    assert.equal((await request(method, "/api/tarefas/abc", body)).status, 400);
    assert.equal((await request(method, `/api/tarefas/${missingId}`, body)).status, 404);
  }
});

test("PATCH inválido não altera o recurso e permite concluir tarefa atrasada", async (context) => {
  const { request } = await startApi(context, { seed: true });
  const task = (await request("GET", "/api/tarefas")).body.at(-1);
  for (const body of [{}, [], null, { status: "x" }, { title: " " }, { dueDate: "errada" }, { id: "x" }, { description: null }]) {
    assert.equal((await request("PATCH", `/api/tarefas/${task.id}`, body)).status, 400);
  }
  assert.equal((await request("PATCH", `/api/tarefas/${task.id}`, { status: "pendente" })).status, 200);
});

test("JSON malformado, corpo muito grande, Content-Type, rota e CORS", async (context) => {
  const { request, base } = await startApi(context, { allowedOrigins: ["http://localhost:5500"] });
  const malformed = await fetch(`${base}/api/tarefas`, { method: "POST", headers: { "Content-Type": "application/json" }, body: '{"title":' });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).erro, "JSON_INVALIDO");
  assert.equal((await request("POST", "/api/tarefas", { ...payload, description: "a".repeat(20000) })).status, 413);
  assert.equal((await request("POST", "/api/tarefas", payload, { "Content-Type": "text/plain" })).status, 415);
  assert.equal((await request("GET", "/api/nao-existe")).status, 404);
  assert.equal((await request("GET", "/api/tarefas/%E0%A4%A")).status, 400);
  const preflight = await request("OPTIONS", "/api/tarefas", undefined, { Origin: "http://localhost:5500" });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("access-control-allow-origin"), "http://localhost:5500");
  assert.equal((await request("GET", "/api/tarefas", undefined, { Origin: "https://outra-origem.example" })).status, 403);
});

test("serviços da Etapa 05 usam a API própria: recomendações e check-ins", async (context) => {
  const { request } = await startApi(context);
  assert.equal((await request("GET", "/api/recomendacoes")).body.recommendations.length, 3);
  assert.deepEqual((await request("GET", "/api/checkins")).body, []);
  const created = await request("POST", "/api/checkins", { subject: "Cálculo I", minutes: 45, note: "Revisão" });
  assert.equal(created.status, 201);
  assert.equal((await request("GET", "/api/checkins")).body[0].id, created.body.id);
  for (const minutes of [0, 601, 1.5, "45", null]) {
    assert.equal((await request("POST", "/api/checkins", { subject: "Cálculo I", minutes })).status, 400);
  }
});

test("erro interno retorna JSON controlado sem stack ou caminho local", async (context) => {
  const tasks = { list() { throw new Error("detalhe-interno-privado"); } };
  const { request } = await startApi(context, { repositories: { tasks } });
  const originalError = console.error;
  console.error = () => {};
  try {
    const result = await request("GET", "/api/tarefas");
    assert.equal(result.status, 500);
    assert.deepEqual(result.body, { erro: "ERRO_INTERNO", mensagem: "Erro interno do servidor." });
  } finally { console.error = originalError; }
});
