import { randomUUID } from "node:crypto";
import { transaction } from "../connection.js";
import { createSubjectRepository } from "../../repositories/subject.repository.js";
import { createTaskRepository } from "../../repositories/task.repository.js";

export const seedDatabase = (database) => transaction(database, () => {
  if (database.prepare("SELECT name FROM seed_runs WHERE name = ?").get("demo-v1")) return false;
  const subjects = createSubjectRepository(database);
  const tasks = createTaskRepository(database);
  const now = new Date().toISOString();
  const examples = [
    ["Protótipo estrutural em HTML", "Construção de Software", 2, "alta", "pendente"],
    ["Documentar decisões da etapa", "Construção de Software", 3, "media", "pendente"],
    ["Lista de exercícios 4", "Cálculo I", 5, "media", "pendente"],
    ["Leitura do capítulo 6", "Banco de Dados", 7, "baixa", "pendente"],
    ["Revisar normalização", "Banco de Dados", -2, "baixa", "concluida"],
    ["Resumo da aula 3", "Cálculo I", -4, "baixa", "concluida"]
  ];
  for (const [index, [title, name, days, priority, status]] of examples.entries()) {
    let subject = subjects.findByName(name);
    if (!subject) subject = subjects.create({ id: randomUUID(), name, createdAt: now });
    const date = new Date();
    date.setDate(date.getDate() + days);
    const dueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const task = { id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`, title, subjectId: subject.id, dueDate, priority, status, description: "Atividade acadêmica de demonstração.", createdAt: now };
    if (!tasks.get(task.id) && !tasks.findDuplicate(task)) tasks.create(task);
  }
  database.prepare("INSERT INTO seed_runs(name, applied_at) VALUES (?, ?)").run("demo-v1", now);
  return true;
});
