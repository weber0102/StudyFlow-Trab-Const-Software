import { Router } from "express";
import { createSubjectController } from "../controllers/subject.controller.js";

export const createSubjectRouter = (service) => {
  const router = Router();
  const controller = createSubjectController(service);
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);
  return router;
};
