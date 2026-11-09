import { formatDate, normalizeText } from "../core/helpers.js";
import { priorityLabels, priorityOrder, statusLabels } from "./store.js";

const getBadgeClass = (value) => ({ alta: "danger", media: "warning", baixa: "neutral", pendente: "warning", concluida: "success" }[value] || "neutral");

export const createBadge = (value, label) => {
  const badge = document.createElement("span");
  badge.className = `badge ${getBadgeClass(value)}`;
  badge.textContent = label;
  return badge;
};

const createCell = (label, content, className = "") => {
  const cell = document.createElement("td");
  cell.dataset.label = label;
  if (className) cell.className = className;
  if (content instanceof Node) cell.append(content);
  else cell.textContent = content;
  return cell;
};

const createActionButton = (label, dataAttribute, id, className = "") => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `task-action ${className}`.trim();
  button.dataset[dataAttribute] = id;
  button.textContent = label;
  return button;
};

const createTaskRow = (task) => {
  const row = document.createElement("tr");
  const actions = document.createElement("div");
  row.dataset.taskId = task.id;
  actions.className = "task-actions";
  actions.append(
    createActionButton(task.status === "concluida" ? "Reabrir" : "Concluir", "taskStatus", task.id),
    createActionButton("Excluir", "taskDelete", task.id, "task-action--danger")
  );
  row.append(
    createCell("Tarefa", task.title, "task-name"),
    createCell("Matéria", task.subject),
    createCell("Prazo", formatDate(task.dueDate)),
    createCell("Prioridade", createBadge(task.priority, priorityLabels[task.priority])),
    createCell("Status", createBadge(task.status, statusLabels[task.status])),
    createCell("Ações", actions, "task-actions-cell")
  );
  return row;
};

export const getFilterState = () => ({
  search: normalizeText(document.querySelector("[data-task-search]")?.value || "").toLocaleLowerCase(),
  subject: document.querySelector("[data-task-filter='subject']")?.value || "",
  status: document.querySelector("[data-task-filter='status']")?.value || "",
  priority: document.querySelector("[data-task-filter='priority']")?.value || "",
  sort: document.querySelector("[data-task-sort]")?.value || "deadline-asc"
});

export const filterAndSortTasks = (tasks, filters) => {
  const filteredTasks = tasks.filter((task) => {
    const searchableText = `${task.title} ${task.subject} ${task.description || ""}`.toLocaleLowerCase();
    return (!filters.search || searchableText.includes(filters.search))
      && (!filters.subject || task.subject === filters.subject)
      && (!filters.status || task.status === filters.status)
      && (!filters.priority || task.priority === filters.priority);
  });

  return filteredTasks.sort((firstTask, secondTask) => {
    if (filters.sort === "title-asc") return firstTask.title.localeCompare(secondTask.title, "pt-BR");
    if (filters.sort === "priority") return priorityOrder[firstTask.priority] - priorityOrder[secondTask.priority];
    if (filters.sort === "deadline-desc") return secondTask.dueDate.localeCompare(firstTask.dueDate);
    return firstTask.dueDate.localeCompare(secondTask.dueDate);
  });
};

export const renderTaskTable = (tasks) => {
  const body = document.querySelector("[data-task-table-body]");
  const count = document.querySelector("[data-task-count]");
  const emptyState = document.querySelector("[data-task-empty]");
  if (!body || !count) return;

  const filteredTasks = filterAndSortTasks(tasks, getFilterState());
  body.replaceChildren();
  filteredTasks.forEach((task) => body.append(createTaskRow(task)));
  count.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}`;
  if (emptyState) emptyState.hidden = filteredTasks.length !== 0;
};

const renderSubjectSummary = (tasks, subjects) => {
  const subjectList = document.querySelector("[data-dashboard-subjects]");
  if (!subjectList) return;

  const allSubjects = [...new Set([...subjects, ...tasks.map((task) => task.subject)])];
  subjectList.replaceChildren();
  allSubjects.forEach((subject) => {
    const pendingCount = tasks.filter((task) => task.subject === subject && task.status === "pendente").length;
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const detail = document.createElement("span");
    name.textContent = subject;
    detail.textContent = `${pendingCount} ${pendingCount === 1 ? "tarefa pendente" : "tarefas pendentes"}`;
    item.append(name, detail);
    subjectList.append(item);
  });
};

const createDashboardTask = (task) => {
  const item = document.createElement("li");
  const openButton = document.createElement("button");
  const copy = document.createElement("div");
  const link = document.createElement("a");
  const detail = document.createElement("p");
  openButton.className = "task-open";
  openButton.type = "button";
  openButton.dataset.dashboardView = task.id;
  openButton.setAttribute("aria-label", `Abrir detalhes de ${task.title}`);
  openButton.title = "Abrir detalhes da tarefa";
  openButton.textContent = "↗";
  copy.className = "task-copy";
  link.href = "tarefas.html";
  link.textContent = task.title;
  detail.textContent = `${task.subject} · Entrega em ${formatDate(task.dueDate)}`;
  copy.append(link, detail);
  item.append(openButton, copy, createBadge(task.status, statusLabels[task.status]));
  return item;
};

export const renderDashboard = (tasks, subjects) => {
  const taskList = document.querySelector("[data-dashboard-tasks]");
  const taskSummary = tasks.reduce((summary, task) => {
    summary[task.status] += 1;
    return summary;
  }, { pendente: 0, concluida: 0 });
  const pendingTasks = tasks.filter((task) => task.status === "pendente");
  const nextTask = [...pendingTasks].sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate))[0];

  document.querySelectorAll("[data-dashboard-pending]").forEach((element) => { element.textContent = taskSummary.pendente; });
  document.querySelectorAll("[data-dashboard-pending-detail]").forEach((element) => { element.textContent = `${taskSummary.pendente} ${taskSummary.pendente === 1 ? "atividade para acompanhar" : "atividades para acompanhar"}`; });
  document.querySelectorAll("[data-dashboard-completed]").forEach((element) => { element.textContent = taskSummary.concluida; });
  document.querySelectorAll("[data-dashboard-completed-detail]").forEach((element) => { element.textContent = taskSummary.concluida ? "Tarefas concluídas" : "Conclua sua primeira tarefa"; });
  document.querySelectorAll("[data-dashboard-next]").forEach((element) => { element.textContent = nextTask ? formatDate(nextTask.dueDate) : "Sem prazo"; });
  document.querySelectorAll("[data-dashboard-next-detail]").forEach((element) => { element.textContent = nextTask ? nextTask.title : "Nenhuma tarefa pendente"; });

  if (taskList) {
    taskList.replaceChildren();
    const upcomingTasks = [...pendingTasks].sort((firstTask, secondTask) => firstTask.dueDate.localeCompare(secondTask.dueDate)).slice(0, 3);
    if (!upcomingTasks.length) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "dynamic-empty-item";
      emptyItem.textContent = "Nenhuma tarefa pendente. Aproveite para planejar a próxima atividade.";
      taskList.append(emptyItem);
    } else {
      upcomingTasks.forEach((task) => taskList.append(createDashboardTask(task)));
    }
  }

  renderSubjectSummary(tasks, subjects);
};

export const setTaskFormSuccess = (message) => {
  const feedback = document.querySelector("[data-task-feedback]");
  if (!feedback) return;
  const link = document.createElement("a");
  link.className = "inline-link";
  link.href = "tarefas.html?v=stage5-1";
  link.textContent = "Ver minhas tarefas";
  feedback.className = "form-feedback is-success";
  feedback.replaceChildren(document.createTextNode(`${message} `), link);
};
