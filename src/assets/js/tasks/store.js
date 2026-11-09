import { getDateOffset, hasOwn } from "../core/helpers.js";

export const TASK_STORAGE_KEY = "studyflow-tasks";
export const priorityLabels = { alta: "Alta", media: "Média", baixa: "Baixa" };
export const priorityOrder = { alta: 0, media: 1, baixa: 2 };
export const statusLabels = { pendente: "Pendente", concluida: "Concluída" };

let memoryTasks = null;

const createSeedTasks = () => [
  { id: "seed-1", title: "Protótipo estrutural em HTML", subject: "Construção de Software", description: "Organizar a estrutura semântica das telas.", dueDate: getDateOffset(2), priority: "alta", status: "pendente", createdAt: new Date().toISOString() },
  { id: "seed-2", title: "Documentar decisões da etapa", subject: "Construção de Software", description: "Registrar as decisões técnicas do projeto.", dueDate: getDateOffset(3), priority: "media", status: "pendente", createdAt: new Date().toISOString() },
  { id: "seed-3", title: "Lista de exercícios 4", subject: "Cálculo I", description: "Resolver os exercícios indicados pela professora.", dueDate: getDateOffset(5), priority: "media", status: "pendente", createdAt: new Date().toISOString() },
  { id: "seed-4", title: "Leitura do capítulo 6", subject: "Banco de Dados", description: "Revisar o conteúdo sobre modelagem de dados.", dueDate: getDateOffset(7), priority: "baixa", status: "pendente", createdAt: new Date().toISOString() },
  { id: "seed-5", title: "Revisar normalização", subject: "Banco de Dados", description: "Conferir anotações sobre formas normais.", dueDate: getDateOffset(-2), priority: "baixa", status: "concluida", createdAt: new Date().toISOString() },
  { id: "seed-6", title: "Resumo da aula 3", subject: "Cálculo I", description: "Sintetizar os principais conceitos apresentados.", dueDate: getDateOffset(-4), priority: "baixa", status: "concluida", createdAt: new Date().toISOString() }
];

const isTask = (task) => task
  && typeof task.id === "string"
  && typeof task.title === "string"
  && typeof task.subject === "string"
  && typeof task.dueDate === "string"
  && hasOwn(priorityLabels, task.priority)
  && hasOwn(statusLabels, task.status);

export const saveTasks = (tasks) => {
  memoryTasks = tasks;
  try {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch {
    return false;
  }
};

export const getTasks = () => {
  let savedTasks;
  try {
    savedTasks = localStorage.getItem(TASK_STORAGE_KEY);
  } catch {
    return memoryTasks || createSeedTasks();
  }

  if (!savedTasks) {
    const seedTasks = memoryTasks || createSeedTasks();
    saveTasks(seedTasks);
    return seedTasks;
  }

  try {
    const tasks = JSON.parse(savedTasks);
    if (Array.isArray(tasks)) {
      const validTasks = tasks.filter(isTask);
      if (validTasks.length !== tasks.length) saveTasks(validTasks);
      memoryTasks = validTasks;
      return validTasks;
    }
  } catch {
    // O armazenamento inválido é recuperado com dados de demonstração.
  }

  const seedTasks = createSeedTasks();
  saveTasks(seedTasks);
  return seedTasks;
};
