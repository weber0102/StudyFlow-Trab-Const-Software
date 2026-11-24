import { createId } from "../core/helpers.js";
import { getTasks, replaceApiTasks, saveTasks } from "../tasks/store.js";
import { ApiError, requestJson } from "./api-client.js";
import { API_BASE_URL, isApiMode } from "./config.js";

const endpoint = (id = "") => `${API_BASE_URL}/tarefas${id ? `/${encodeURIComponent(id)}` : ""}`;
const persistLocal = (tasks) => {
  if (!saveTasks(tasks)) throw new ApiError("Não foi possível salvar as tarefas neste navegador.");
};

export const fetchTasks = async () => {
  if (!isApiMode) return getTasks();
  const tasks = await requestJson(endpoint(), { cache: "no-store" });
  if (!Array.isArray(tasks)) throw new ApiError("A API não retornou uma lista de tarefas válida.");
  replaceApiTasks(tasks);
  return tasks;
};

export const fetchTask = async (id) => {
  if (isApiMode) return requestJson(endpoint(id), { cache: "no-store" });
  const task = getTasks().find((entry) => entry.id === id);
  if (!task) throw new ApiError("Tarefa não encontrada.", { status: 404 });
  return task;
};

export const createTask = async (fields) => {
  if (isApiMode) return requestJson(endpoint(), {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields)
  });
  const task = { id: createId("task"), ...fields, createdAt: new Date().toISOString() };
  persistLocal([...getTasks(), task]);
  return task;
};

export const updateTask = async (id, fields) => {
  if (isApiMode) return requestJson(endpoint(id), {
    method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(fields)
  });
  const task = { ...await fetchTask(id), ...fields };
  persistLocal(getTasks().map((entry) => entry.id === id ? task : entry));
  return task;
};

export const deleteTask = async (id) => {
  if (isApiMode) return requestJson(endpoint(id), { method: "DELETE" });
  await fetchTask(id);
  persistLocal(getTasks().filter((entry) => entry.id !== id));
};
