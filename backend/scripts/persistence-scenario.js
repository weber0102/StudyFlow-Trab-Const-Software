import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { openDatabase } from "../src/database/connection.js";

const boot = (filename) => new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [fileURLToPath(new URL("../src/server.js", import.meta.url))], {
    env: { ...process.env, PORT: "0", HOST: "127.0.0.1", DATABASE_PATH: filename },
    stdio: ["ignore", "pipe", "pipe"]
  });
  let output = "";
  let errors = "";
  const timer = setTimeout(() => { child.kill(); reject(new Error(`Servidor não iniciou. ${errors}`)); }, 8000);
  child.stderr.on("data", (chunk) => { errors += chunk; });
  child.once("error", (error) => { clearTimeout(timer); reject(error); });
  child.once("exit", (code) => { clearTimeout(timer); if (!output.includes("StudyFlow disponível")) reject(new Error(`Servidor encerrou com código ${code}. ${errors}`)); });
  child.stdout.on("data", (chunk) => {
    output += chunk;
    const match = output.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) { clearTimeout(timer); resolve({ child, baseUrl: match[0] }); }
  });
});

const stop = async (child) => {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, "exit");
  child.kill("SIGTERM");
  await exited;
};

export const runPersistenceScenario = async () => {
  const directory = await mkdtemp(join(tmpdir(), "studyflow-etapa07-"));
  const filename = join(directory, "persistent.sqlite");
  const report = { executedAt: new Date().toISOString(), database: "SQLite em arquivo isolado", processes: [], records: [] };
  let running;
  const request = async (phase, method, path, body) => {
    const response = await fetch(running.baseUrl + path, { method, headers: body === undefined ? {} : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
    const result = response.status === 204 ? null : await response.json();
    report.records.push({ phase, method, path, requestBody: body ?? null, status: response.status, responseBody: result });
    return { status: response.status, body: result };
  };
  try {
    running = await boot(filename);
    report.processes.push({ phase: "antes do reinício", pid: running.child.pid });
    const subject = await request("antes", "POST", "/api/materias", { name: "Matéria persistente" });
    assert.equal(subject.status, 201);
    const fields = { title: "Tarefa que deve permanecer", subjectId: subject.body.id, dueDate: "2099-12-10", priority: "alta" };
    const created = await request("antes", "POST", "/api/tarefas", fields);
    assert.equal(created.status, 201);
    const path = `/api/tarefas/${created.body.id}`;
    await request("antes", "PATCH", path, { status: "concluida" });
    const before = await request("antes", "GET", path);
    assert.equal(before.body.status, "concluida");
    await request("antes", "POST", "/api/checkins", { subjectId: subject.body.id, minutes: 45, note: "Persistência real" });
    await stop(running.child);

    running = await boot(filename);
    report.processes.push({ phase: "após primeiro reinício", pid: running.child.pid });
    assert.notEqual(report.processes[0].pid, running.child.pid);
    const after = await request("depois", "GET", path);
    assert.equal(after.status, 200);
    assert.deepEqual(after.body, before.body);
    const history = await request("depois", "GET", "/api/checkins");
    assert.equal(history.body[0].minutes, 45);
    assert.equal((await request("depois", "GET", `/api/materias/${subject.body.id}`)).status, 200);
    assert.equal((await request("depois", "DELETE", `/api/materias/${subject.body.id}`)).status, 409);
    assert.equal((await request("depois", "DELETE", path)).status, 204);
    await stop(running.child);

    running = await boot(filename);
    report.processes.push({ phase: "após segundo reinício", pid: running.child.pid });
    assert.equal((await request("terceiro processo", "GET", path)).status, 404);
    await stop(running.child);
    const database = openDatabase({ filename });
    try {
      report.schema = database.prepare("SELECT name, sql FROM sqlite_schema WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all();
      report.foreignKeys = database.prepare("PRAGMA foreign_key_list(tasks)").all();
      report.integrity = database.prepare("PRAGMA integrity_check").get();
      report.foreignKeyViolations = database.prepare("PRAGMA foreign_key_check").all();
      assert.equal(report.integrity.integrity_check, "ok");
      assert.deepEqual(report.foreignKeyViolations, []);
    } finally { database.close(); }
    report.result = "APROVADO: criação, alteração, matéria e check-in persistiram entre processos; exclusão permaneceu após novo reinício.";
    return report;
  } finally {
    await stop(running?.child);
    if (basename(directory).startsWith("studyflow-etapa07-")) await rm(directory, { recursive: true, force: true });
  }
};
