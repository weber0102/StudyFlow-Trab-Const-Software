import { requestJson } from "./api-client.js";
import { API_BASE_URL } from "./config.js";

export const fetchSubjects = () => requestJson(`${API_BASE_URL}/materias`, { cache: "no-store" });
export const createSubject = (name) => requestJson(`${API_BASE_URL}/materias`, {
  method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name })
});
export const updateSubject = (id, name) => requestJson(`${API_BASE_URL}/materias/${encodeURIComponent(id)}`, {
  method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name })
});
export const deleteSubject = (id) => requestJson(`${API_BASE_URL}/materias/${encodeURIComponent(id)}`, { method: "DELETE" });
