import { randomUUID } from "node:crypto";
import { HttpError } from "../errors.js";
import { validateId, validateTask } from "../validation.js";
import { resolveSubject } from "./subject.service.js";

export const createTaskService = (repository, subjects) => {
  const get = (id) => {
    const task = repository.get(validateId(id));
    if (!task) throw new HttpError(404, "TAREFA_NAO_ENCONTRADA", "Tarefa não encontrada.");
    return task;
  };
  const rejectDuplicate = (task, excludedId) => {
    if (repository.findDuplicate(task, excludedId)) {
      throw new HttpError(409, "TAREFA_DUPLICADA", "Já existe uma tarefa com este título, matéria e prazo.", "title");
    }
  };
  return {
    list: repository.list,
    get,
    create(body) {
      const fields = validateTask(body);
      const task = { id: randomUUID(), ...fields, ...resolveSubject(fields, subjects), createdAt: new Date().toISOString() };
      rejectDuplicate(task);
      return repository.create(task);
    },
    update(id, body) {
      const current = get(id);
      const fields = validateTask(body, { partial: true });
      const relation = fields.subject || fields.subjectId ? resolveSubject(fields, subjects) : {};
      const task = { ...current, ...fields, ...relation, updatedAt: new Date().toISOString() };
      rejectDuplicate(task, current.id);
      return repository.update(task);
    },
    remove(id) {
      repository.remove(get(id).id);
    }
  };
};
