import { formatDate } from "../core/helpers.js";
import { priorityLabels, statusLabels } from "./store.js";
import { createBadge } from "./view.js";

let detailsModal;
let deleteModal;
let lastDetailsTrigger = null;
let lastDeleteTrigger = null;
let onConfirmDeletion = null;

const createTaskDetailItem = (label, dataAttribute) => {
  const item = document.createElement("div");
  const term = document.createElement("dt");
  const description = document.createElement("dd");
  term.textContent = label;
  description.dataset[dataAttribute] = "";
  item.append(term, description);
  return item;
};

const ensureTaskDetailsModal = () => {
  if (detailsModal) return detailsModal;
  const overlay = document.createElement("div");
  const dialog = document.createElement("section");
  const title = document.createElement("h2");
  const taskName = document.createElement("h3");
  const taskDescription = document.createElement("p");
  const details = document.createElement("dl");
  const actions = document.createElement("div");
  const listLink = document.createElement("a");
  const closeButton = document.createElement("button");

  overlay.className = "task-modal task-details-modal";
  overlay.hidden = true;
  overlay.setAttribute("role", "presentation");
  dialog.className = "task-modal__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "task-details-modal-title");
  dialog.setAttribute("aria-describedby", "task-details-modal-description");
  title.id = "task-details-modal-title";
  title.textContent = "Detalhes da tarefa";
  taskName.className = "task-details__name";
  taskName.dataset.taskDetailsName = "";
  taskDescription.id = "task-details-modal-description";
  taskDescription.className = "task-details__description";
  taskDescription.dataset.taskDetailsDescription = "";
  details.className = "task-details";
  details.append(
    createTaskDetailItem("Matéria", "taskDetailsSubject"),
    createTaskDetailItem("Prazo", "taskDetailsDueDate"),
    createTaskDetailItem("Prioridade", "taskDetailsPriority"),
    createTaskDetailItem("Status", "taskDetailsStatus")
  );
  actions.className = "task-modal__actions";
  listLink.className = "button secondary";
  listLink.href = "tarefas.html";
  listLink.textContent = "Gerenciar tarefas";
  closeButton.type = "button";
  closeButton.className = "button";
  closeButton.dataset.taskDetailsClose = "";
  closeButton.textContent = "Fechar";
  actions.append(listLink, closeButton);
  dialog.append(title, taskName, taskDescription, details, actions);
  overlay.append(dialog);
  document.body.append(overlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest("[data-task-details-close]")) closeTaskDetailsModal();
  });
  detailsModal = overlay;
  return overlay;
};

const ensureDeleteModal = () => {
  if (deleteModal) return deleteModal;
  const overlay = document.createElement("div");
  const dialog = document.createElement("section");
  const title = document.createElement("h2");
  const description = document.createElement("p");
  const actions = document.createElement("div");
  const cancelButton = document.createElement("button");
  const confirmButton = document.createElement("button");

  overlay.className = "task-modal";
  overlay.hidden = true;
  overlay.setAttribute("role", "presentation");
  dialog.className = "task-modal__dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-labelledby", "task-modal-title");
  dialog.setAttribute("aria-describedby", "task-modal-description");
  title.id = "task-modal-title";
  title.textContent = "Excluir tarefa?";
  description.id = "task-modal-description";
  description.dataset.taskModalDescription = "";
  actions.className = "task-modal__actions";
  cancelButton.type = "button";
  cancelButton.className = "button secondary";
  cancelButton.dataset.taskModalCancel = "";
  cancelButton.textContent = "Cancelar";
  confirmButton.type = "button";
  confirmButton.className = "button task-action--danger";
  confirmButton.dataset.taskModalConfirm = "";
  confirmButton.textContent = "Excluir tarefa";
  actions.append(cancelButton, confirmButton);
  dialog.append(title, description, actions);
  overlay.append(dialog);
  document.body.append(overlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay || event.target.closest("[data-task-modal-cancel]")) closeDeleteModal();
  });
  confirmButton.addEventListener("click", () => onConfirmDeletion?.());
  deleteModal = overlay;
  return overlay;
};

export const openTaskDetails = (task, trigger) => {
  const modal = ensureTaskDetailsModal();
  lastDetailsTrigger = trigger || null;
  modal.querySelector("[data-task-details-name]").textContent = task.title;
  modal.querySelector("[data-task-details-description]").textContent = task.description || "Sem descrição adicionada para esta tarefa.";
  modal.querySelector("[data-task-details-subject]").textContent = task.subject;
  modal.querySelector("[data-task-details-due-date]").textContent = formatDate(task.dueDate);
  modal.querySelector("[data-task-details-priority]").replaceChildren(createBadge(task.priority, priorityLabels[task.priority]));
  modal.querySelector("[data-task-details-status]").replaceChildren(createBadge(task.status, statusLabels[task.status]));
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector("[data-task-details-close]").focus();
};

export const closeTaskDetailsModal = (restoreFocus = true) => {
  if (!detailsModal) return;
  const trigger = lastDetailsTrigger;
  detailsModal.hidden = true;
  lastDetailsTrigger = null;
  document.body.classList.remove("modal-open");
  if (restoreFocus && trigger?.isConnected) trigger.focus();
};

export const openDeleteModal = (task, trigger, confirmHandler) => {
  const modal = ensureDeleteModal();
  onConfirmDeletion = confirmHandler;
  lastDeleteTrigger = trigger || null;
  modal.querySelector("[data-task-modal-description]").textContent = `“${task.title}” será removida permanentemente deste navegador.`;
  modal.hidden = false;
  document.body.classList.add("modal-open");
  modal.querySelector("[data-task-modal-cancel]").focus();
};

export const closeDeleteModal = (restoreFocus = true) => {
  if (!deleteModal) return;
  const trigger = lastDeleteTrigger;
  deleteModal.hidden = true;
  lastDeleteTrigger = null;
  onConfirmDeletion = null;
  document.body.classList.remove("modal-open");
  if (restoreFocus && trigger?.isConnected) trigger.focus();
};

export const initTaskModals = () => {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (detailsModal && !detailsModal.hidden) closeTaskDetailsModal();
    else if (deleteModal && !deleteModal.hidden) closeDeleteModal();
  });
};
