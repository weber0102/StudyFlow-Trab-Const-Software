import { Router } from "express";

export const createStudyRouter = (service) => {
  const router = Router();
  router.get("/recomendacoes", (request, response) => response.json(service.recommendations()));
  router.get("/checkins", (request, response) => response.json(service.listCheckins()));
  router.post("/checkins", (request, response) => response.status(201).json(service.createCheckin(request.body)));
  return router;
};
