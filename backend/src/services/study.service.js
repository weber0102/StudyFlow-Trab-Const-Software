import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { validateCheckin } from "../validation.js";
import { resolveSubject } from "./subject.service.js";

export const createStudyService = (checkins, subjects) => ({
  recommendations: () => JSON.parse(readFileSync(new URL("../../../src/assets/data/recomendacoes-estudo.json", import.meta.url), "utf8")),
  listCheckins: checkins.list,
  createCheckin(body) {
    const fields = validateCheckin(body);
    return checkins.create({ id: randomUUID(), ...fields, ...resolveSubject(fields, subjects), createdAt: new Date().toISOString() });
  }
});
