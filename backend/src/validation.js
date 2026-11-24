import { HttpError } from "./errors.js";

const invalid = (message, field) => { throw new HttpError(400, "DADOS_INVALIDOS", message, field); };
const own = (object, field) => Object.prototype.hasOwnProperty.call(object, field);

export const validateId = (id) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    throw new HttpError(400, "ID_INVALIDO", "O ID deve ser um UUID válido.");
  }
  return id.toLowerCase();
};

export const validateBody = (body, fields) => {
  if (!body || typeof body !== "object" || Array.isArray(body) || !Object.keys(body).length) invalid("Envie um objeto JSON com os campos esperados.");
  for (const field of Object.keys(body)) {
    if (!fields.includes(field)) invalid(`O campo ${field} não é permitido.`, field);
  }
};

export const textField = (value, field, minimum, maximum) => {
  if (typeof value !== "string") invalid(`O campo ${field} deve ser um texto.`, field);
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length < minimum || text.length > maximum) invalid(`O campo ${field} deve ter entre ${minimum} e ${maximum} caracteres.`, field);
  return text;
};

const validateDate = (value, enforceFuture) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) invalid("Informe a data no formato YYYY-MM-DD.", "dueDate");
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) invalid("Informe uma data de entrega real.", "dueDate");
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  if (enforceFuture && value < today) invalid("A data de entrega não pode estar no passado.", "dueDate");
  return value;
};

export const validateTask = (body, { partial = false } = {}) => {
  const fields = ["title", "subject", "description", "dueDate", "priority", "status"];
  validateBody(body, fields);
  const result = {};
  for (const field of partial ? fields.filter((key) => own(body, key)) : fields) {
    const value = body[field];
    if (field === "title") result.title = textField(value, field, 3, 100);
    if (field === "subject") result.subject = textField(value, field, 1, 60);
    if (field === "description") result.description = textField(value === undefined ? "" : value, field, 0, 500);
    if (field === "dueDate") result.dueDate = validateDate(value, true);
    if (field === "priority") {
      if (!["alta", "media", "baixa"].includes(value)) invalid("Selecione uma prioridade válida: alta, media ou baixa.", field);
      result.priority = value;
    }
    if (field === "status") {
      result.status = value === undefined && !partial ? "pendente" : value;
      if (!["pendente", "concluida"].includes(result.status)) invalid("Selecione um status válido: pendente ou concluida.", field);
    }
  }
  return result;
};

export const validateCheckin = (body) => {
  validateBody(body, ["subject", "minutes", "note"]);
  const subject = textField(body.subject, "subject", 1, 60);
  if (!Number.isInteger(body.minutes) || body.minutes < 1 || body.minutes > 600) invalid("Informe uma duração inteira entre 1 e 600 minutos.", "minutes");
  return { subject, minutes: body.minutes, note: textField(body.note === undefined ? "" : body.note, "note", 0, 180) };
};
