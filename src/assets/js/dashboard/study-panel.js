import { clearInvalidFields, setButtonLoading, setFeedback, setFormFieldInvalid } from "../core/feedback.js";
import { createId, normalizeText } from "../core/helpers.js";
import { getSubjects } from "../subjects.js";
import { loadRecommendations, submitStudyCheckin } from "../services/study-service.js";

const checkinStorageKey = "studyflow-study-checkins";

const getCheckinHistory = () => {
  try {
    const savedHistory = JSON.parse(localStorage.getItem(checkinStorageKey));
    return Array.isArray(savedHistory) ? savedHistory.filter((entry) => entry && typeof entry.subject === "string") : [];
  } catch {
    return [];
  }
};

const saveCheckinHistory = (history) => {
  try {
    localStorage.setItem(checkinStorageKey, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
};

const populateCheckinSubjects = () => {
  const select = document.querySelector("[data-checkin-subject]");
  if (!select) return;
  const selectedValue = select.value;
  const placeholder = select.querySelector("option[data-placeholder]");
  select.replaceChildren();
  if (placeholder) select.append(placeholder);
  getSubjects().forEach((subject) => select.append(new Option(subject, subject, false, subject === selectedValue)));
};

const renderRecommendations = (recommendations) => {
  const list = document.querySelector("[data-recommendations-list]");
  if (!list) return;
  list.replaceChildren();
  recommendations.forEach((recommendation) => {
    const item = document.createElement("li");
    const subject = document.createElement("p");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const duration = document.createElement("span");
    item.className = "recommendation-card";
    subject.className = "recommendation-card__subject";
    subject.textContent = recommendation.subject;
    title.textContent = recommendation.title;
    description.textContent = recommendation.description;
    duration.className = "recommendation-card__duration";
    duration.textContent = recommendation.duration;
    item.append(subject, title, description, duration);
    list.append(item);
  });
  list.hidden = false;
};

const renderCheckinHistory = () => {
  const list = document.querySelector("[data-checkin-history]");
  if (!list) return;
  const entries = getCheckinHistory().slice(0, 3);
  list.replaceChildren();
  if (!entries.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "checkin-empty";
    emptyItem.textContent = "Nenhum check-in enviado ainda.";
    list.append(emptyItem);
    return;
  }
  entries.forEach((entry) => {
    const item = document.createElement("li");
    const copy = document.createElement("div");
    const subject = document.createElement("strong");
    const note = document.createElement("span");
    const minutes = document.createElement("span");
    subject.textContent = entry.subject;
    note.textContent = entry.note || "Check-in sem observações.";
    minutes.className = "checkin-history__minutes";
    minutes.textContent = `${entry.minutes} min`;
    copy.append(subject, note);
    item.append(copy, minutes);
    list.append(item);
  });
};

const setRecommendationsState = (state, message = "") => {
  const panel = document.querySelector("[data-study-panel]");
  const stateElement = document.querySelector("[data-recommendations-state]");
  const list = document.querySelector("[data-recommendations-list]");
  if (!stateElement) return;
  stateElement.hidden = state === "success";
  stateElement.className = `async-state is-${state}`;
  stateElement.textContent = message;
  if (list && state !== "success") list.hidden = true;
  if (panel) panel.setAttribute("aria-busy", String(state === "loading"));
};

const loadRecommendationPanel = async () => {
  const retryButton = document.querySelector("[data-recommendations-retry]");
  setButtonLoading(retryButton, true, "Carregando…");
  setRecommendationsState("loading", "Carregando recomendações acadêmicas…");
  setFeedback("[data-recommendations-feedback]");
  try {
    const recommendations = await loadRecommendations();
    renderRecommendations(recommendations);
    setRecommendationsState("success");
    setFeedback("[data-recommendations-feedback]", `${recommendations.length} recomendações carregadas com sucesso.`, "is-success");
  } catch (error) {
    setRecommendationsState("error", `Não foi possível carregar as recomendações. ${error.message}`);
    setFeedback("[data-recommendations-feedback]", "Use o botão Atualizar para tentar novamente.", "is-error");
  } finally {
    setButtonLoading(retryButton, false);
  }
};

const validateCheckin = ({ subject, minutes, note }) => {
  if (!getSubjects().includes(subject)) return { field: "subject", message: "Selecione uma matéria cadastrada." };
  if (!Number.isInteger(minutes) || minutes < 1 || minutes > 600) return { field: "minutes", message: "Informe uma duração entre 1 e 600 minutos." };
  if (note.length > 180) return { field: "note", message: "A observação pode ter no máximo 180 caracteres." };
  return null;
};

const initializeCheckinForm = () => {
  const form = document.querySelector("[data-checkin-form]");
  const submitButton = document.querySelector("[data-checkin-submit]");
  if (!form || !submitButton) return;

  form.addEventListener("input", () => {
    clearInvalidFields(form);
    setFeedback("[data-checkin-feedback]");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearInvalidFields(form);
    const checkin = {
      subject: form.elements.subject.value,
      minutes: Number(form.elements.minutes.value),
      note: normalizeText(form.elements.note.value)
    };
    const validationError = validateCheckin(checkin);
    if (validationError) {
      setFormFieldInvalid(form, validationError.field, validationError.message, "[data-checkin-feedback]");
      return;
    }

    setButtonLoading(submitButton, true, "Enviando check-in…");
    setFeedback("[data-checkin-feedback]", "Enviando seus dados ao serviço simulado…");
    try {
      const savedCheckin = await submitStudyCheckin(checkin);
      const history = [{ id: createId(`checkin-${savedCheckin.serverId}`), ...savedCheckin, createdAt: new Date().toISOString() }, ...getCheckinHistory()];
      if (!saveCheckinHistory(history)) throw new Error("O check-in foi recebido, mas não pôde ser salvo neste navegador.");
      form.reset();
      populateCheckinSubjects();
      renderCheckinHistory();
      setFeedback("[data-checkin-feedback]", "Check-in enviado com sucesso e registrado no seu histórico.", "is-success");
    } catch (error) {
      setFeedback("[data-checkin-feedback]", `Não foi possível enviar o check-in. ${error.message}`, "is-error");
    } finally {
      setButtonLoading(submitButton, false);
    }
  });
};

export const initStudyPanel = () => {
  if (!document.querySelector("[data-study-panel]")) return;
  populateCheckinSubjects();
  renderCheckinHistory();
  initializeCheckinForm();
  document.querySelector("[data-recommendations-retry]")?.addEventListener("click", loadRecommendationPanel);
  window.addEventListener("studyflow:subjects-updated", populateCheckinSubjects);
  loadRecommendationPanel();
};
