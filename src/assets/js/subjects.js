import { setButtonLoading, setFeedback } from "./core/feedback.js";
import { normalizeText } from "./core/helpers.js";
import { isApiMode } from "./services/config.js";
import { createSubject, deleteSubject, fetchSubjects, updateSubject } from "./services/subject-service.js";

export const SUBJECT_STORAGE_KEY = "studyflow-subjects";
export const DEFAULT_SUBJECTS = ["Construção de Software", "Banco de Dados", "Cálculo I"];
let serverSubjects = [];
let editingId = null;
let pending = false;

export const getSubjects = () => {
  if (isApiMode) return serverSubjects.map((subject) => subject.name);
  try {
    const saved = localStorage.getItem(SUBJECT_STORAGE_KEY);
    if (!saved) return DEFAULT_SUBJECTS;
    const subjects = JSON.parse(saved);
    return Array.isArray(subjects) ? subjects.filter((subject) => typeof subject === "string" && subject.trim()) : DEFAULT_SUBJECTS;
  } catch { return DEFAULT_SUBJECTS; }
};

const localSave = (subjects) => localStorage.setItem(SUBJECT_STORAGE_KEY, JSON.stringify(subjects));
const notifyChange = () => window.dispatchEvent(new CustomEvent("studyflow:subjects-updated"));

export const populateSubjectSelects = () => {
  document.querySelectorAll("[data-subject-select]").forEach((select) => {
    const selectedValue = select.value;
    const placeholder = select.querySelector("option[data-placeholder]");
    select.replaceChildren();
    if (placeholder) select.append(placeholder);
    getSubjects().forEach((subject) => select.append(new Option(subject, subject, false, subject === selectedValue)));
  });
};

const renderSubjects = () => {
  const list = document.querySelector("[data-subject-list]");
  const count = document.querySelector("[data-subject-count]");
  if (!list) return;
  const subjects = isApiMode ? serverSubjects : getSubjects().map((name) => ({ id: name, name }));
  list.replaceChildren();
  if (!subjects.length) {
    const empty = document.createElement("li");
    empty.className = "dynamic-empty-item";
    empty.textContent = "Nenhuma matéria cadastrada. Adicione a primeira disciplina acima.";
    list.append(empty);
  }
  subjects.forEach((subject) => {
    const item = document.createElement("li");
    item.className = "subject-item";
    const marker = document.createElement("span");
    marker.className = "subject-item__marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "◈";
    const name = document.createElement("strong");
    name.textContent = subject.name;
    const actions = document.createElement("div");
    actions.className = "task-actions";
    if (isApiMode) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "task-action";
      edit.dataset.editSubject = subject.id;
      edit.textContent = "Renomear";
      edit.setAttribute("aria-label", `Renomear ${subject.name}`);
      actions.append(edit);
    }
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "subject-remove";
    remove.dataset.removeSubject = subject.id;
    remove.setAttribute("aria-label", `Remover ${subject.name}`);
    remove.textContent = "Remover";
    actions.append(remove);
    item.append(marker, name, actions);
    list.append(item);
  });
  if (count) count.textContent = `${subjects.length} ${subjects.length === 1 ? "matéria cadastrada" : "matérias cadastradas"}`;
};

const refresh = () => { populateSubjectSelects(); renderSubjects(); notifyChange(); };

const loadSubjects = async () => {
  if (isApiMode) serverSubjects = await fetchSubjects();
  refresh();
};

const resetEditing = (form) => {
  editingId = null;
  form.reset();
  document.querySelector("#subject-form-title").textContent = "Adicionar matéria";
  form.querySelector("button[type='submit']").textContent = "Adicionar matéria";
  form.querySelector("[data-cancel-subject-edit]").hidden = true;
};

export const initSubjects = async () => {
  const form = document.querySelector("[data-subject-form]");
  const list = document.querySelector("[data-subject-list]");
  const submit = form?.querySelector("button[type='submit']");
  const retry = document.createElement("button");
  retry.type = "button";
  retry.className = "button secondary";
  retry.textContent = "Atualizar matérias";
  retry.dataset.subjectRetry = "";
  document.querySelector(".subject-panel .panel-heading")?.append(retry);
  const reload = async () => {
    if (pending) return;
    pending = true;
    setButtonLoading(retry, true, "Carregando…");
    if (submit) submit.disabled = true;
    if (form) setFeedback("[data-subject-feedback]", "Carregando matérias…");
    try {
      await loadSubjects();
      setFeedback("[data-subject-feedback]");
    } catch (error) {
      setFeedback("[data-subject-feedback]", `Não foi possível carregar as matérias. ${error.message} Use Atualizar matérias para tentar novamente.`, "is-error");
      const notice = document.querySelector("[data-mode-copy='summary']");
      if (notice) notice.textContent = `Não foi possível consultar as matérias. ${error.message}`;
    } finally {
      pending = false;
      setButtonLoading(retry, false);
      if (submit) submit.disabled = false;
    }
  };
  retry.addEventListener("click", reload);
  if (form && list) {
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "button secondary";
    cancel.dataset.cancelSubjectEdit = "";
    cancel.textContent = "Cancelar edição";
    cancel.hidden = true;
    cancel.addEventListener("click", () => { if (!pending) resetEditing(form); });
    form.querySelector(".form-actions").append(cancel);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending) return;
      const input = form.querySelector("#subject-name");
      const name = normalizeText(input.value);
      if (!name || name.length > 60) {
        setFeedback("[data-subject-feedback]", "Informe um nome de matéria com 1 a 60 caracteres.", "is-error");
        input.focus();
        return;
      }
      pending = true;
      setButtonLoading(submit, true, "Salvando…");
      try {
        if (isApiMode) {
          if (editingId) await updateSubject(editingId, name);
          else await createSubject(name);
        } else {
          if (getSubjects().some((subject) => subject.toLocaleLowerCase() === name.toLocaleLowerCase())) throw new Error("Esta matéria já está cadastrada.");
          localSave([...getSubjects(), name]);
        }
        await loadSubjects();
        setButtonLoading(submit, false);
        resetEditing(form);
        setFeedback("[data-subject-feedback]", "Matéria salva com sucesso.", "is-success");
      } catch (error) {
        setButtonLoading(submit, false);
        setFeedback("[data-subject-feedback]", error.message, "is-error");
      } finally { pending = false; }
    });
    list.addEventListener("click", async (event) => {
      if (pending) return;
      const edit = event.target.closest("[data-edit-subject]");
      const remove = event.target.closest("[data-remove-subject]");
      if (edit) {
        const subject = serverSubjects.find((entry) => entry.id === edit.dataset.editSubject);
        if (!subject) return;
        editingId = subject.id;
        form.elements.materia.value = subject.name;
        document.querySelector("#subject-form-title").textContent = "Renomear matéria";
        submit.textContent = "Salvar alterações";
        cancel.hidden = false;
        form.elements.materia.focus();
      } else if (remove) {
        pending = true;
        setButtonLoading(remove, true, "Removendo…");
        try {
          if (isApiMode) await deleteSubject(remove.dataset.removeSubject);
          else localSave(getSubjects().filter((name) => name !== remove.dataset.removeSubject));
          await loadSubjects();
          if (editingId === remove.dataset.removeSubject) resetEditing(form);
          setFeedback("[data-subject-feedback]", "Matéria removida da sua lista.", "is-success");
        } catch (error) {
          setFeedback("[data-subject-feedback]", error.message, "is-error");
          document.querySelector("[data-subject-feedback]")?.scrollIntoView({ block: "center" });
        } finally { pending = false; setButtonLoading(remove, false); }
      }
    });
  }
  await reload();
};
