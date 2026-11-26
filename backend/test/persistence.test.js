import test from "node:test";
import assert from "node:assert/strict";
import { runPersistenceScenario } from "../scripts/persistence-scenario.js";

test("Teste de persistência após reinicialização: três processos reais e o mesmo arquivo", { timeout: 20000 }, async () => {
  const report = await runPersistenceScenario();
  assert.equal(report.processes.length, 3);
  assert.match(report.result, /^APROVADO/);
});
