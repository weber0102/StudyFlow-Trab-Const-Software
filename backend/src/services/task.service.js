import { randomUUID } from "node:crypto";
import { HttpError } from "../errors.js";
import { validateId, validateTask } from "../validation.js";

export const createTaskService = (store) => {
  const get = (id) => {
    const normalizedId = validateId(id);
    const task = store.tasks.find((entry) => entry.id === normalizedId);
    if (!task) throw new HttpError(404, "TAREFA_NAO_ENCONTRADA", "Tarefa não encontrada.");
    return task;
  };
  const rejectDuplicate = (task, excludedId) => {
    if (store.tasks.some((entry) => entry.id !== excludedId
      && entry.title.toLocaleLowerCase("pt-BR") === task.title.toLocaleLowerCase("pt-BR")
      && entry.subject.toLocaleLowerCase("pt-BR") === task.subject.toLocaleLowerCase("pt-BR")
      && entry.dueDate === task.dueDate)) {
      throw new HttpError(409, "TAREFA_DUPLICADA", "Já existe uma tarefa com este título, matéria e prazo.", "title");
    }
  };
  return {
    list: () => store.tasks,
    get,
    create(body) {
      const fields = validateTask(body);
      rejectDuplicate(fields);
      const task = { id: randomUUID(), ...fields, createdAt: new Date().toISOString() };
      store.tasks.push(task);
      return task;
    },
    update(id, body) {
      const current = get(id);
      const fields = validateTask(body, { partial: true });
      const task = { ...current, ...fields, updatedAt: new Date().toISOString() };
      rejectDuplicate(task, current.id);
      store.tasks[store.tasks.indexOf(current)] = task;
      return task;
    },
    remove(id) {
      const task = get(id);
      store.tasks.splice(store.tasks.indexOf(task), 1);
    }
  };
};
