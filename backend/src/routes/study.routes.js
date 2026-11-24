import { Router } from "express";
import { randomUUID } from "node:crypto";
import { validateCheckin } from "../validation.js";

export const createStudyRouter = (store) => {
  const router = Router();
  router.get("/recomendacoes", (request, response) => response.json(store.recommendations));
  router.get("/checkins", (request, response) => response.json(store.checkins));
  router.post("/checkins", (request, response) => {
    const checkin = { id: randomUUID(), ...validateCheckin(request.body), createdAt: new Date().toISOString() };
    store.checkins.unshift(checkin);
    response.status(201).json(checkin);
  });
  return router;
};
