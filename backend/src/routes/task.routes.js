import { Router } from "express";
import { createTaskController } from "../controllers/task.controller.js";
import { createTaskService } from "../services/task.service.js";

export const createTaskRouter = (store) => {
  const router = Router();
  const controller = createTaskController(createTaskService(store));
  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.remove);
  return router;
};
