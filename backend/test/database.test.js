import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { openDatabase } from "../src/database/connection.js";
import { seedDatabase } from "../src/database/seeds/demo.js";
import { createApp } from "../src/app.js";
import { createSubjectRepository } from "../src/repositories/subject.repository.js";
import { createSubjectService } from "../src/services/subject.service.js";

const missing = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const start = async (context) => {
  const database = openDatabase({ filename: ":memory:" });
  const server = createApp({ database }).listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(() => { server.closeAllConnections(); return new Promise((resolve) => server.close(() => { database.close(); resolve(); })); });
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = async (method, path, body) => {
    const response = await fetch(base + path, { method, headers: body === undefined ? {} : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    return { status: response.status, body: response.status === 204 ? null : await response.json() };
  };
  return { database, request };
};

test("CRUD de matérias, referências, renomeação e bloqueio de exclusão", async (context) => {
  const { request } = await start(context);
  assert.deepEqual((await request("GET", "/api/materias")).body, []);
  const subject = await request("POST", "/api/materias", { name: "  Cálculo   I " });
  assert.equal(subject.status, 201);
  const id = subject.body.id;
  assert.equal((await request("GET", `/api/materias/${id}`)).body.name, "Cálculo I");
  assert.equal((await request("POST", "/api/materias", { name: "CÁLCULO I" })).status, 409);
  const fields = { title: "Estudar derivadas", subjectId: id, dueDate: "2099-12-10", priority: "alta" };
  const task = await request("POST", "/api/tarefas", fields);
  assert.equal(task.status, 201);
  assert.equal(task.body.subjectId, id);
  assert.equal(task.body.subject, "Cálculo I");
  assert.equal((await request("POST", "/api/tarefas", { ...fields, subjectId: missing })).status, 400);
  assert.equal((await request("POST", "/api/tarefas", { ...fields, subject: "Outro nome" })).status, 400);
  assert.equal((await request("PATCH", `/api/tarefas/${task.body.id}`, { subjectId: missing })).status, 400);
  assert.equal((await request("DELETE", `/api/materias/${id}`)).status, 409);
  assert.equal((await request("PATCH", `/api/materias/${id}`, { name: "Cálculo Diferencial" })).status, 200);
  assert.equal((await request("GET", `/api/tarefas/${task.body.id}`)).body.subject, "Cálculo Diferencial");
  await request("DELETE", `/api/tarefas/${task.body.id}`);
  assert.equal((await request("DELETE", `/api/materias/${id}`)).status, 204);
  assert.equal((await request("GET", `/api/materias/${id}`)).status, 404);
});

test("check-in usa FK e impede exclusão da matéria vinculada", async (context) => {
  const { request } = await start(context);
  const subject = (await request("POST", "/api/materias", { name: "Banco de Dados" })).body;
  const result = await request("POST", "/api/checkins", { subjectId: subject.id, minutes: 60 });
  assert.equal(result.status, 201);
  assert.equal(result.body.subjectId, subject.id);
  assert.equal((await request("DELETE", `/api/materias/${subject.id}`)).status, 409);
  assert.equal((await request("POST", "/api/checkins", { subjectId: missing, minutes: 30 })).status, 400);
});

test("validação e IDs de matérias rejeitam dados inválidos", async (context) => {
  const { request } = await start(context);
  for (const body of [{}, null, [], { name: " " }, { name: 12 }, { name: "a".repeat(61) }, { name: "Válida", extra: true }]) {
    assert.equal((await request("POST", "/api/materias", body)).status, 400);
  }
  for (const method of ["GET", "PATCH", "DELETE"]) {
    const body = method === "PATCH" ? { name: "Novo nome" } : undefined;
    assert.equal((await request(method, "/api/materias/abc", body)).status, 400);
    assert.equal((await request(method, `/api/materias/${missing}`, body)).status, 404);
  }
});

test("SQL protege PK, FK, UNIQUE, CHECK, NOT NULL e tipos mesmo sem service", (context) => {
  const database = openDatabase({ filename: ":memory:" });
  context.after(() => database.close());
  assert.equal(database.prepare("PRAGMA foreign_keys").get().foreign_keys, 1);
  const subjects = createSubjectService(createSubjectRepository(database));
  const subject = subjects.create({ name: "Algoritmos" });
  const insert = database.prepare("INSERT INTO checkins(id, subject_id, minutes, note, created_at) VALUES (?, ?, ?, ?, ?)");
  assert.throws(() => insert.run(randomUUID(), missing, 20, "", "agora"), /FOREIGN KEY/);
  assert.throws(() => insert.run(randomUUID(), subject.id, 0, "", "agora"), /CHECK/);
  assert.throws(() => insert.run(randomUUID(), subject.id, 1.5, "", "agora"), /INTEGER/);
  assert.throws(() => insert.run(randomUUID(), subject.id, 20, null, "agora"), /NOT NULL/);
  const id = randomUUID();
  insert.run(id, subject.id, 20, "", "agora");
  assert.throws(() => insert.run(id, subject.id, 20, "", "agora"), /UNIQUE/);
  assert.throws(() => database.prepare("DELETE FROM subjects WHERE id = ?").run(subject.id), /FOREIGN KEY/);
  assert.throws(() => database.prepare("INSERT INTO subjects(id, name, name_key, created_at) VALUES (?, ?, ?, ?)").run(randomUUID(), "Algoritmos", "algoritmos", "agora"), /UNIQUE/);
});

test("seed é transacional, idempotente e não ressuscita tarefa excluída", (context) => {
  const database = openDatabase({ filename: ":memory:" });
  context.after(() => database.close());
  assert.equal(seedDatabase(database), true);
  assert.equal(seedDatabase(database), false);
  assert.equal(database.prepare("SELECT COUNT(*) AS total FROM tasks").get().total, 6);
  database.prepare("DELETE FROM tasks WHERE id = ?").run("00000000-0000-4000-8000-000000000001");
  assert.equal(seedDatabase(database), false);
  assert.equal(database.prepare("SELECT COUNT(*) AS total FROM tasks").get().total, 5);
  assert.deepEqual(database.prepare("PRAGMA foreign_key_check").all(), []);
});

test("falhas reais de leitura e gravação retornam erros controlados", async (context) => {
  const { database, request } = await start(context);
  database.exec("PRAGMA query_only = ON");
  const original = console.error;
  console.error = () => {};
  try {
    const readonly = await request("POST", "/api/materias", { name: "Teste" });
    assert.equal(readonly.status, 503);
    assert.equal(readonly.body.erro, "PERSISTENCIA_INDISPONIVEL");
    assert(!JSON.stringify(readonly.body).includes("SQLITE"));
    database.exec("PRAGMA query_only = OFF; DROP TABLE tasks;");
    const queryFailure = await request("GET", "/api/tarefas");
    assert.equal(queryFailure.status, 500);
    assert.equal(queryFailure.body.erro, "ERRO_PERSISTENCIA");
    assert(!JSON.stringify(queryFailure.body).includes("SELECT"));
  } finally { console.error = original; }
});

test("SQL Injection é tratado como texto e não altera a estrutura", async (context) => {
  const { request, database } = await start(context);
  const name = "X'; DROP TABLE tasks; --";
  assert.equal((await request("POST", "/api/materias", { name })).status, 201);
  assert.equal((await request("GET", "/api/materias")).body[0].name, name);
  assert.equal(database.prepare("SELECT COUNT(*) AS total FROM tasks").get().total, 0);
});
