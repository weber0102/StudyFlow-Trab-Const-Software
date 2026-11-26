import { Router } from "express";
import { createTaskController } from "../controllers/task.controller.js";

export const createTaskRouter = (service) => {
  const router = Router();
  const controller = createTaskController(service);
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);
  return router;
};
