import express from "express";
import { fileURLToPath } from "node:url";
import { createStore } from "./data/store.js";
import { HttpError, errorHandler } from "./errors.js";
import { createTaskRouter } from "./routes/task.routes.js";
import { createStudyRouter } from "./routes/study.routes.js";

export const createApp = ({ store = createStore(), allowedOrigins = [] } = {}) => {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api", (request, response, next) => {
    response.set("Cache-Control", "no-store");
    const origin = request.get("Origin");
    if (origin && origin !== `${request.protocol}://${request.get("Host")}`) {
      if (!allowedOrigins.includes(origin)) return next(new HttpError(403, "ORIGEM_NAO_PERMITIDA", "Esta origem não tem permissão para acessar a API."));
      response.set("Access-Control-Allow-Origin", origin).vary("Origin");
    }
    if (request.method === "OPTIONS") {
      response.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      return response.status(204).end();
    }
    if (["POST", "PATCH"].includes(request.method) && !request.is("application/json")) {
      return next(new HttpError(415, "TIPO_NAO_SUPORTADO", "Envie o cabeçalho Content-Type: application/json."));
    }
    next();
  });
  app.use("/api", express.json({ limit: "16kb", strict: false }));
  app.use("/api/tarefas", createTaskRouter(store));
  app.use("/api", createStudyRouter(store));
  app.use("/api", (request, response, next) => next(new HttpError(404, "ROTA_NAO_ENCONTRADA", "Rota da API não encontrada.")));

  // O Pages usa o arquivo estático; o servidor ativa a API na mesma origem.
  app.get("/assets/js/services/config.js", (request, response) => {
    response.set("Cache-Control", "no-store").type("application/javascript").send('export const API_BASE_URL = "/api";\nexport const isApiMode = true;\n');
  });
  app.use(express.static(fileURLToPath(new URL("../../src", import.meta.url)), { maxAge: 0 }));
  app.use((request, response, next) => next(new HttpError(404, "ROTA_NAO_ENCONTRADA", "Página não encontrada.")));
  app.use(errorHandler);
  return app;
};
