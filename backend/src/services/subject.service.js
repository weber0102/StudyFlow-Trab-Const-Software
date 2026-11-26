import { randomUUID } from "node:crypto";
import { HttpError } from "../errors.js";
import { textField, validateBody, validateId } from "../validation.js";

export const createSubjectService = (repository) => {
  const get = (id) => {
    const subject = repository.get(validateId(id));
    if (!subject) throw new HttpError(404, "MATERIA_NAO_ENCONTRADA", "Matéria não encontrada.");
    return subject;
  };
  const nameFromBody = (body) => {
    validateBody(body, ["name"]);
    return textField(body.name, "name", 1, 60);
  };
  const rejectDuplicate = (name, id) => {
    const duplicate = repository.findByName(name);
    if (duplicate && duplicate.id !== id) throw new HttpError(409, "MATERIA_DUPLICADA", "Esta matéria já está cadastrada.", "name");
  };
  return {
    list: repository.list,
    get,
    create(body) {
      const name = nameFromBody(body);
      rejectDuplicate(name);
      return repository.create({ id: randomUUID(), name, createdAt: new Date().toISOString() });
    },
    update(id, body) {
      const current = get(id);
      const name = nameFromBody(body);
      rejectDuplicate(name, current.id);
      return repository.update({ ...current, name, updatedAt: new Date().toISOString() });
    },
    remove(id) {
      const subject = get(id);
      if (repository.hasDependents(subject.id)) throw new HttpError(409, "MATERIA_EM_USO", "Esta matéria possui tarefas ou check-ins vinculados e não pode ser removida.");
      repository.remove(subject.id);
    }
  };
};

export const resolveSubject = (fields, repository) => {
  const byId = fields.subjectId ? repository.get(fields.subjectId) : null;
  const byName = fields.subject ? repository.findByName(fields.subject) : null;
  const subject = fields.subjectId ? byId : byName;
  if (!subject) throw new HttpError(400, "REFERENCIA_INVALIDA", "Cadastre ou selecione uma matéria existente.", "subject");
  if (fields.subjectId && fields.subject && byName?.id !== subject.id) {
    throw new HttpError(400, "REFERENCIA_INVALIDA", "O nome e o ID informados não correspondem à mesma matéria.", "subject");
  }
  return { subject: subject.name, subjectId: subject.id };
};
