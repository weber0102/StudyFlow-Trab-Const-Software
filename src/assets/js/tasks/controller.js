import { clearInvalidFields, setButtonLoading, setFeedback, setFormFieldInvalid } from "../core/feedback.js";
import { getSubjects } from "../subjects.js";
import { isApiMode } from "../services/config.js";
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from "../services/task-service.js";
import { closeDeleteModal, initTaskModals, openDeleteModal, openTaskDetails } from "./modals.js";
import { getTasks, TASK_STORAGE_KEY } from "./store.js";
import { getTaskFormData, validateTask } from "./validation.js";
import { renderDashboard, renderTaskTable, setTaskFormSuccess } from "./view.js";

let mutationPending = false;
let loadPending = false;

const showListFeedback = (message, type = "") => {
  setFeedback("[data-task-list-feedback]", message, type);
  setFeedback("[data-dashboard-feedback]", message, type);
};

export const refreshTaskInterfaces = () => {
  renderTaskTable(getTasks());
  renderDashboard(getTasks(), getSubjects());
};

const loadTasks = async () => {
  if (loadPending) return;
  loadPending = true;
  const retry = document.querySelector("[data-tasks-retry]");
  const submit = document.querySelector("[data-task-form] button[type='submit']");
  setButtonLoading(retry, true, "Carregando…");
  if (submit) submit.disabled = true;
  const state = document.querySelector("[data-tasks-state]");
  state.textContent = "Carregando suas tarefas…";
  state.className = "async-state is-loading";
  state.setAttribute("aria-busy", "true");
  document.querySelector("[data-task-empty]")?.setAttribute("hidden", "");
  try {
    await fetchTasks();
    refreshTaskInterfaces();
    state.textContent = isApiMode ? "Tarefas carregadas do servidor." : "Tarefas carregadas deste navegador.";
    state.className = "async-state is-success";
    if (submit) submit.disabled = false;
  } catch (error) {
    state.textContent = `Não foi possível carregar as tarefas. ${error.message} Use Atualizar tarefas para tentar novamente.`;
    state.className = "async-state is-error";
    document.querySelectorAll("[data-dashboard-pending], [data-dashboard-completed], [data-dashboard-next]").forEach((element) => { element.textContent = "—"; });
  } finally {
    loadPending = false;
    state.setAttribute("aria-busy", "false");
    setButtonLoading(retry, false);
  }
};

const runMutation = async (button, label, operation) => {
  if (mutationPending || loadPending) return;
  mutationPending = true;
  setButtonLoading(button, true, label);
  try {
    await operation();
  } catch (error) {
    showListFeedback(error.message, "is-error");
    setFeedback(".task-modal:not([hidden]) [data-task-modal-feedback]", error.message, "is-error");
  } finally {
    mutationPending = false;
    setButtonLoading(button, false);
  }
};

const confirmTaskDeletion = (task) => runMutation(document.querySelector("[data-task-modal-confirm]"), "Excluindo…", async () => {
  await deleteTask(task.id);
  closeDeleteModal(false);
  await loadTasks();
  showListFeedback(`“${task.title}” foi excluída.`, "is-success");
});

const initializeTaskForm = () => {
  const form = document.querySelector("[data-task-form]");
  if (!form) return;
  form.addEventListener("input", () => {
    clearInvalidFields(form);
    setFeedback("[data-task-feedback]");
  });
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (mutationPending || form.querySelector("button[type='submit']").disabled) return;
    clearInvalidFields(form);
    const fields = getTaskFormData(form);
    const error = validateTask(fields);
    if (error) {
      setFormFieldInvalid(form, error.field, error.message, "[data-task-feedback]");
      return;
    }
    mutationPending = true;
    const button = form.querySelector("button[type='submit']");
    setButtonLoading(button, true, "Salvando…");
    setFeedback("[data-task-feedback]", "Salvando sua tarefa…");
    try {
      await createTask(fields);
      form.reset();
      await loadTasks();
      setTaskFormSuccess("Tarefa cadastrada com sucesso.");
    } catch (error) {
      setFormFieldInvalid(form, error.field, error.message, "[data-task-feedback]");
    } finally {
      mutationPending = false;
      setButtonLoading(button, false);
    }
  });
};

const initializeTaskList = () => {
  const filterForm = document.querySelector("[data-task-filters]");
  const tableBody = document.querySelector("[data-task-table-body]");
  if (!filterForm || !tableBody) return;
  filterForm.addEventListener("submit", (event) => { event.preventDefault(); renderTaskTable(getTasks()); });
  filterForm.addEventListener("input", () => renderTaskTable(getTasks()));
  filterForm.addEventListener("change", (event) => {
    // O input de pesquisa já renderiza ao digitar; recriar a linha no blur perderia o primeiro clique.
    if (event.target.matches("select")) renderTaskTable(getTasks());
  });
  filterForm.addEventListener("reset", () => window.setTimeout(() => renderTaskTable(getTasks()), 0));
  tableBody.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-task-status]");
    const deleteButton = event.target.closest("[data-task-delete]");
    if (statusButton) {
      runMutation(statusButton, "Salvando…", async () => {
        const task = await fetchTask(statusButton.dataset.taskStatus);
        const status = task.status === "concluida" ? "pendente" : "concluida";
        await updateTask(task.id, { status });
        await loadTasks();
        showListFeedback(status === "concluida" ? "Tarefa marcada como concluída." : "Tarefa reaberta para acompanhamento.", "is-success");
      });
    } else if (deleteButton && !mutationPending) {
      runMutation(deleteButton, "Abrindo…", async () => {
        const task = await fetchTask(deleteButton.dataset.taskDelete);
        openDeleteModal(task, deleteButton, () => confirmTaskDeletion(task));
      });
    }
  });
};

const initializeDashboard = () => {
  document.querySelector("[data-dashboard-tasks]")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-dashboard-view]");
    if (!button) return;
    runMutation(button, "…", async () => openTaskDetails(await fetchTask(button.dataset.dashboardView), button));
  });
};

export const initTasks = () => {
  if (!document.querySelector("[data-task-form], [data-task-table-body], [data-dashboard-tasks]")) return;
  const toolbar = document.createElement("div");
  toolbar.className = "task-sync-bar";
  const state = document.createElement("p");
  state.dataset.tasksState = "";
  state.setAttribute("role", "status");
  const retry = document.createElement("button");
  retry.type = "button";
  retry.dataset.tasksRetry = "";
  retry.className = "button secondary";
  retry.textContent = "Atualizar tarefas";
  retry.addEventListener("click", loadTasks);
  toolbar.append(state, retry);
  document.querySelector(".page-intro").after(toolbar);
  initTaskModals();
  initializeTaskForm();
  initializeTaskList();
  initializeDashboard();
  window.addEventListener("storage", (event) => {
    if (!isApiMode && event.key === TASK_STORAGE_KEY) refreshTaskInterfaces();
  });
  window.addEventListener("studyflow:subjects-updated", () => {
    if (isApiMode) loadTasks();
    else refreshTaskInterfaces();
  });
  loadTasks();
};
