(() => {
  const storageKey = "studyflow-tasks";
  const subjectStorageKey = "studyflow-subjects";
  const defaultSubjects = ["Construção de Software", "Banco de Dados", "Cálculo I"];
  const priorityLabels = { alta: "Alta", media: "Média", baixa: "Baixa" };
  const priorityOrder = { alta: 0, media: 1, baixa: 2 };
  const statusLabels = { pendente: "Pendente", concluida: "Concluída" };
  let pendingDeletionId = null;
  let deleteModal;
  let lastDeleteTrigger = null;
  let memoryTasks = null;

  const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  const getToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  };

  const toIsoDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDateOffset = (days) => {
    const date = getToday();
    date.setDate(date.getDate() + days);
    return toIsoDate(date);
  };

  const createSeedTasks = () => [
    { id: "seed-1", title: "Protótipo estrutural em HTML", subject: "Construção de Software", description: "Organizar a estrutura semântica das telas.", dueDate: getDateOffset(2), priority: "alta", status: "pendente", createdAt: new Date().toISOString() },
    { id: "seed-2", title: "Documentar decisões da etapa", subject: "Construção de Software", description: "Registrar as decisões técnicas do projeto.", dueDate: getDateOffset(3), priority: "media", status: "pendente", createdAt: new Date().toISOString() },
    { id: "seed-3", title: "Lista de exercícios 4", subject: "Cálculo I", description: "Resolver os exercícios indicados pela professora.", dueDate: getDateOffset(5), priority: "media", status: "pendente", createdAt: new Date().toISOString() },
    { id: "seed-4", title: "Leitura do capítulo 6", subject: "Banco de Dados", description: "Revisar o conteúdo sobre modelagem de dados.", dueDate: getDateOffset(7), priority: "baixa", status: "pendente", createdAt: new Date().toISOString() },
    { id: "seed-5", title: "Revisar normalização", subject: "Banco de Dados", description: "Conferir anotações sobre formas normais.", dueDate: getDateOffset(-2), priority: "baixa", status: "concluida", createdAt: new Date().toISOString() },
    { id: "seed-6", title: "Resumo da aula 3", subject: "Cálculo I", description: "Sintetizar os principais conceitos apresentados.", dueDate: getDateOffset(-4), priority: "baixa", status: "concluida", createdAt: new Date().toISOString() }
  ];

  const isTask = (task) => task
    && typeof task.id === "string"
    && typeof task.title === "string"
    && typeof task.subject === "string"
    && typeof task.dueDate === "string"
    && hasOwn(priorityLabels, task.priority)
    && hasOwn(statusLabels, task.status);

  const saveTasks = (tasks) => {
    memoryTasks = tasks;
    try {
      localStorage.setItem(storageKey, JSON.stringify(tasks));
      return true;
    } catch {
      return false;
    }
  };

  const getTasks = () => {
    let savedTasks;
    try {
      savedTasks = localStorage.getItem(storageKey);
    } catch {
      return memoryTasks || createSeedTasks();
    }
    if (!savedTasks) {
      const seedTasks = memoryTasks || createSeedTasks();
      saveTasks(seedTasks);
      return seedTasks;
    }

    try {
      const tasks = JSON.parse(savedTasks);
      if (Array.isArray(tasks)) {
        const validTasks = tasks.filter(isTask);
        if (validTasks.length !== tasks.length) saveTasks(validTasks);
        memoryTasks = validTasks;
        return validTasks;
      }
    } catch {
      // Um armazenamento inválido não deve impedir o uso da aplicação.
    }

    const seedTasks = createSeedTasks();
    saveTasks(seedTasks);
    return seedTasks;
  };

  const getSubjects = () => {
    try {
      const savedSubjects = localStorage.getItem(subjectStorageKey);
      if (savedSubjects === null) return defaultSubjects;
      const storedSubjects = JSON.parse(savedSubjects);
      if (Array.isArray(storedSubjects)) {
        return storedSubjects.filter((subject) => typeof subject === "string" && subject.trim());
      }
    } catch {
      // Mantém as matérias iniciais caso a lista salva esteja corrompida.
    }
    return defaultSubjects;
  };

  const normalizeText = (value) => value.trim().replace(/\s+/g, " ");

  const parseDate = (isoDate) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return null;
    const date = new Date(`${isoDate}T12:00:00`);
    return Number.isNaN(date.getTime()) || toIsoDate(date) !== isoDate ? null : date;
  };

  const formatDate = (isoDate) => {
    const date = parseDate(isoDate);
    if (!date) return "Data inválida";
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
  };

  const createTaskId = () => window.crypto?.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const getFormData = (form) => ({
    title: normalizeText(form.elements.title.value),
    subject: form.elements.subject.value,
    description: normalizeText(form.elements.description.value),
    dueDate: form.elements.dueDate.value,
    priority: form.elements.priority.value,
    status: form.elements.status.value
  });

  const validateTask = (task) => {
    if (!task.title) return { field: "title", message: "Preencha o título da tarefa." };
    if (task.title.length < 3) return { field: "title", message: "O título deve ter pelo menos 3 caracteres." };
    if (!getSubjects().includes(task.subject)) return { field: "subject", message: "Selecione uma matéria cadastrada." };
    if (task.description.length > 500) return { field: "description", message: "A descrição pode ter no máximo 500 caracteres." };
    if (!parseDate(task.dueDate)) return { field: "dueDate", message: "Informe uma data de entrega válida." };
    if (parseDate(task.dueDate) < getToday()) return { field: "dueDate", message: "A data de entrega não pode estar no passado." };
    if (!hasOwn(priorityLabels, task.priority)) return { field: "priority", message: "Selecione uma prioridade válida." };
    if (!hasOwn(statusLabels, task.status)) return { field: "status", message: "Selecione um status válido." };

    const duplicatedTask = getTasks().some((savedTask) => (
      savedTask.title.toLocaleLowerCase() === task.title.toLocaleLowerCase()
      && savedTask.subject === task.subject
      && savedTask.dueDate === task.dueDate
    ));
    if (duplicatedTask) return { field: "title", message: "Já existe uma tarefa com este título, matéria e prazo." };

    return null;
  };

  const setFeedback = (selector, message, type = "") => {
    const feedback = document.querySelector(selector);
    if (!feedback) return;
    feedback.className = `form-feedback ${type}`;
    feedback.textContent = message;
  };

  const clearInvalidFields = (form) => {
    form.querySelectorAll("[aria-invalid='true']").forEach((field) => {
      field.removeAttribute("aria-invalid");
      field.classList.remove("is-invalid");
    });
  };

  const showFormError = (form, error) => {
    const field = form.elements[error.field];
    if (field) {
      field.setAttribute("aria-invalid", "true");
      field.classList.add("is-invalid");
      field.focus();
    }
    setFeedback("[data-task-feedback]", error.message, "is-error");
  };

  const setSuccessWithLink = (message) => {
    const feedback = document.querySelector("[data-task-feedback]");
    if (!feedback) return;
    const link = document.createElement("a");
    link.className = "inline-link";
    link.href = "tarefas.html?v=stage4-1";
    link.textContent = "Ver minhas tarefas";
    feedback.className = "form-feedback is-success";
    feedback.replaceChildren(document.createTextNode(`${message} `), link);
  };

  const getBadgeClass = (value) => ({ alta: "danger", media: "warning", baixa: "neutral", pendente: "warning", concluida: "success" }[value] || "neutral");

  const createBadge = (value, label) => {
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
    row.dataset.taskId = task.id;
    const actions = document.createElement("div");
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

  const getFilterState = () => ({
    search: normalizeText(document.querySelector("[data-task-search]")?.value || "").toLocaleLowerCase(),
    subject: document.querySelector("[data-task-filter='subject']")?.value || "",
    status: document.querySelector("[data-task-filter='status']")?.value || "",
    priority: document.querySelector("[data-task-filter='priority']")?.value || "",
    sort: document.querySelector("[data-task-sort]")?.value || "deadline-asc"
  });

  const filterAndSortTasks = (tasks, filters) => {
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

  const renderTaskTable = () => {
    const body = document.querySelector("[data-task-table-body]");
    const count = document.querySelector("[data-task-count]");
    const emptyState = document.querySelector("[data-task-empty]");
    if (!body || !count) return;

    const filteredTasks = filterAndSortTasks(getTasks(), getFilterState());
    body.replaceChildren();
    filteredTasks.forEach((task) => body.append(createTaskRow(task)));
    count.textContent = `${filteredTasks.length} ${filteredTasks.length === 1 ? "tarefa encontrada" : "tarefas encontradas"}`;
    if (emptyState) emptyState.hidden = filteredTasks.length !== 0;
  };

  const renderSubjectSummary = (tasks) => {
    const subjectList = document.querySelector("[data-dashboard-subjects]");
    if (!subjectList) return;

    const subjects = [...new Set([...getSubjects(), ...tasks.map((task) => task.subject)])];
    subjectList.replaceChildren();
    subjects.forEach((subject) => {
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
    const checkbox = document.createElement("input");
    const copy = document.createElement("div");
    const link = document.createElement("a");
    const detail = document.createElement("p");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.status === "concluida";
    checkbox.dataset.dashboardStatus = task.id;
    checkbox.setAttribute("aria-label", `${task.status === "concluida" ? "Reabrir" : "Concluir"} ${task.title}`);
    copy.className = "task-copy";
    link.href = "tarefas.html";
    link.textContent = task.title;
    detail.textContent = `${task.subject} · Entrega em ${formatDate(task.dueDate)}`;
    copy.append(link, detail);
    item.append(checkbox, copy, createBadge(task.status, statusLabels[task.status]));
    return item;
  };

  const renderDashboard = () => {
    const taskList = document.querySelector("[data-dashboard-tasks]");
    const tasks = getTasks();
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
    renderSubjectSummary(tasks);
  };

  const refreshTaskInterfaces = () => {
    renderTaskTable();
    renderDashboard();
  };

  const showListFeedback = (message, type = "") => {
    setFeedback("[data-task-list-feedback]", message, type);
    setFeedback("[data-dashboard-feedback]", message, type);
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
    confirmButton.addEventListener("click", confirmTaskDeletion);
    deleteModal = overlay;
    return overlay;
  };

  const openDeleteModal = (id, trigger) => {
    const task = getTasks().find((storedTask) => storedTask.id === id);
    if (!task) {
      showListFeedback("Essa tarefa já não existe na lista.", "is-error");
      return;
    }
    const modal = ensureDeleteModal();
    pendingDeletionId = id;
    lastDeleteTrigger = trigger || null;
    modal.querySelector("[data-task-modal-description]").textContent = `“${task.title}” será removida permanentemente deste navegador.`;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modal.querySelector("[data-task-modal-cancel]").focus();
  };

  const closeDeleteModal = (restoreFocus = true) => {
    if (!deleteModal) return;
    const trigger = lastDeleteTrigger;
    deleteModal.hidden = true;
    pendingDeletionId = null;
    lastDeleteTrigger = null;
    document.body.classList.remove("modal-open");
    if (restoreFocus && trigger?.isConnected) trigger.focus();
  };

  const confirmTaskDeletion = () => {
    const task = getTasks().find((storedTask) => storedTask.id === pendingDeletionId);
    if (!task) {
      closeDeleteModal();
      showListFeedback("A tarefa escolhida não pôde ser localizada.", "is-error");
      return;
    }
    if (!saveTasks(getTasks().filter((storedTask) => storedTask.id !== pendingDeletionId))) {
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
      setFeedback("[data-task-feedback]", "");
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      clearInvalidFields(form);
      const task = getFormData(form);
      const validationError = validateTask(task);
      if (validationError) {
        showFormError(form, validationError);
        return;
      }
      const newTask = { id: createTaskId(), ...task, createdAt: new Date().toISOString() };
      if (!saveTasks([...getTasks(), newTask])) {
        setFeedback("[data-task-feedback]", "Não foi possível salvar a tarefa neste navegador.", "is-error");
        return;
      }
      form.reset();
      setSuccessWithLink("Tarefa cadastrada com sucesso.");
    });
  };

  const initializeTaskList = () => {
    const filterForm = document.querySelector("[data-task-filters]");
    const tableBody = document.querySelector("[data-task-table-body]");
    if (!filterForm || !tableBody) return;

    filterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      renderTaskTable();
    });
    filterForm.addEventListener("input", renderTaskTable);
    filterForm.addEventListener("change", renderTaskTable);
    filterForm.addEventListener("reset", () => window.setTimeout(renderTaskTable, 0));
    tableBody.addEventListener("click", (event) => {
      const statusButton = event.target.closest("[data-task-status]");
      const deleteButton = event.target.closest("[data-task-delete]");
      if (statusButton) toggleTaskStatus(statusButton.dataset.taskStatus);
      if (deleteButton) openDeleteModal(deleteButton.dataset.taskDelete, deleteButton);
    });
  };

  const initializeDashboard = () => {
    const taskList = document.querySelector("[data-dashboard-tasks]");
    if (!taskList) return;
    taskList.addEventListener("change", (event) => {
      const checkbox = event.target.closest("[data-dashboard-status]");
      if (checkbox) toggleTaskStatus(checkbox.dataset.dashboardStatus);
    });
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && deleteModal && !deleteModal.hidden) closeDeleteModal();
  });

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) refreshTaskInterfaces();
  });

  document.addEventListener("DOMContentLoaded", () => {
    getTasks();
    initializeTaskForm();
    initializeTaskList();
    initializeDashboard();
    refreshTaskInterfaces();
  });
})();
