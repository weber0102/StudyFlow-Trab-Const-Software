import { clearInvalidFields, setFeedback, setFormFieldInvalid } from "../core/feedback.js";
import { createId } from "../core/helpers.js";
import { getSubjects } from "../subjects.js";
import { closeDeleteModal, initTaskModals, openDeleteModal, openTaskDetails } from "./modals.js";
import { getTasks, saveTasks, TASK_STORAGE_KEY } from "./store.js";
import { getTaskFormData, validateTask } from "./validation.js";
import { renderDashboard, renderTaskTable, setTaskFormSuccess } from "./view.js";

const showListFeedback = (message, type = "") => {
  setFeedback("[data-task-list-feedback]", message, type);
  setFeedback("[data-dashboard-feedback]", message, type);
};

export const refreshTaskInterfaces = () => {
  const tasks = getTasks();
  renderTaskTable(tasks);
  renderDashboard(tasks, getSubjects());
};

const toggleTaskStatus = (id) => {
  const task = getTasks().find((storedTask) => storedTask.id === id);
  if (!task) {
    showListFeedback("Essa tarefa não foi encontrada. Atualize a página e tente novamente.", "is-error");
    return;
  }

  const nextStatus = task.status === "concluida" ? "pendente" : "concluida";
  const updatedTasks = getTasks().map((storedTask) => (
    storedTask.id === id ? { ...storedTask, status: nextStatus } : storedTask
  ));
  if (!saveTasks(updatedTasks)) {
    showListFeedback("Não foi possível salvar a alteração neste navegador.", "is-error");
    return;
  }

  refreshTaskInterfaces();
  showListFeedback(nextStatus === "concluida" ? "Tarefa marcada como concluída." : "Tarefa reaberta para acompanhamento.", "is-success");
};

const confirmTaskDeletion = (id) => {
  const task = getTasks().find((storedTask) => storedTask.id === id);
  if (!task) {
    closeDeleteModal();
    showListFeedback("A tarefa escolhida não pôde ser localizada.", "is-error");
    return;
  }
  if (!saveTasks(getTasks().filter((storedTask) => storedTask.id !== id))) {
    closeDeleteModal();
    showListFeedback("Não foi possível excluir a tarefa neste navegador.", "is-error");
    return;
  }

  closeDeleteModal(false);
  refreshTaskInterfaces();
  showListFeedback(`“${task.title}” foi excluída.`, "is-success");
};

const initializeTaskForm = () => {
  const form = document.querySelector("[data-task-form]");
  if (!form) return;

  form.addEventListener("input", () => {
    clearInvalidFields(form);
    setFeedback("[data-task-feedback]");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearInvalidFields(form);
    const task = getTaskFormData(form);
    const validationError = validateTask(task);
    if (validationError) {
      setFormFieldInvalid(form, validationError.field, validationError.message, "[data-task-feedback]");
      return;
    }

    const newTask = { id: createId("task"), ...task, createdAt: new Date().toISOString() };
    if (!saveTasks([...getTasks(), newTask])) {
      setFeedback("[data-task-feedback]", "Não foi possível salvar a tarefa neste navegador.", "is-error");
      return;
    }

    form.reset();
    refreshTaskInterfaces();
    setTaskFormSuccess("Tarefa cadastrada com sucesso.");
  });
};

const initializeTaskList = () => {
  const filterForm = document.querySelector("[data-task-filters]");
  const tableBody = document.querySelector("[data-task-table-body]");
  if (!filterForm || !tableBody) return;

  filterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    renderTaskTable(getTasks());
  });
  filterForm.addEventListener("input", () => renderTaskTable(getTasks()));
  filterForm.addEventListener("change", () => renderTaskTable(getTasks()));
  filterForm.addEventListener("reset", () => window.setTimeout(() => renderTaskTable(getTasks()), 0));
  tableBody.addEventListener("click", (event) => {
    const statusButton = event.target.closest("[data-task-status]");
    const deleteButton = event.target.closest("[data-task-delete]");
    if (statusButton) {
      toggleTaskStatus(statusButton.dataset.taskStatus);
      return;
    }
    if (!deleteButton) return;
    const task = getTasks().find((storedTask) => storedTask.id === deleteButton.dataset.taskDelete);
    if (!task) {
      showListFeedback("Essa tarefa já não existe na lista.", "is-error");
      return;
    }
    openDeleteModal(task, deleteButton, () => confirmTaskDeletion(task.id));
  });
};

const initializeDashboard = () => {
  const taskList = document.querySelector("[data-dashboard-tasks]");
  if (!taskList) return;
  taskList.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-dashboard-view]");
    if (!openButton) return;
    const task = getTasks().find((storedTask) => storedTask.id === openButton.dataset.dashboardView);
    if (!task) {
      showListFeedback("Essa tarefa não foi encontrada. Atualize a página e tente novamente.", "is-error");
      return;
    }
    openTaskDetails(task, openButton);
  });
};

export const initTasks = () => {
  if (!document.querySelector("[data-task-form], [data-task-table-body], [data-dashboard-tasks]")) return;
  getTasks();
  initTaskModals();
  initializeTaskForm();
  initializeTaskList();
  initializeDashboard();
  window.addEventListener("storage", (event) => {
    if (event.key === TASK_STORAGE_KEY) refreshTaskInterfaces();
  });
  window.addEventListener("studyflow:subjects-updated", refreshTaskInterfaces);
  refreshTaskInterfaces();
};
