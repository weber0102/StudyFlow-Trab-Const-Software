import { getToday, hasOwn, normalizeText, parseDate } from "../core/helpers.js";
import { getSubjects } from "../subjects.js";
import { getTasks, priorityLabels, statusLabels } from "./store.js";

export const getTaskFormData = (form) => ({
  title: normalizeText(form.elements.title.value),
  subject: form.elements.subject.value,
  description: normalizeText(form.elements.description.value),
  dueDate: form.elements.dueDate.value,
  priority: form.elements.priority.value,
  status: form.elements.status.value
});

export const validateTask = (task) => {
  if (!task.title) return { field: "title", message: "Preencha o título da tarefa." };
  if (task.title.length < 3) return { field: "title", message: "O título deve ter pelo menos 3 caracteres." };
  if (!getSubjects().includes(task.subject)) return { field: "subject", message: "Selecione uma matéria cadastrada." };
  if (task.description.length > 500) return { field: "description", message: "A descrição pode ter no máximo 500 caracteres." };
  if (!parseDate(task.dueDate)) return { field: "dueDate", message: "Informe uma data de entrega válida." };
  if (parseDate(task.dueDate) < getToday()) return { field: "dueDate", message: "A data de entrega não pode estar no passado." };
  if (!hasOwn(priorityLabels, task.priority)) return { field: "priority", message: "Selecione uma prioridade válida." };
  if (!hasOwn(statusLabels, task.status)) return { field: "status", message: "Selecione um status válido." };

  const duplicatedTask = getTasks().some((savedTask) => (
    savedTask.title.toLocaleLowerCase() === task.title.toLocaleLowerCase()
    && savedTask.subject === task.subject
    && savedTask.dueDate === task.dueDate
  ));
  if (duplicatedTask) return { field: "title", message: "Já existe uma tarefa com este título, matéria e prazo." };

  return null;
};
