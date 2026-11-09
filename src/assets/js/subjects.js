import { setFeedback } from "./core/feedback.js";
import { normalizeText } from "./core/helpers.js";

export const SUBJECT_STORAGE_KEY = "studyflow-subjects";
export const DEFAULT_SUBJECTS = ["Construção de Software", "Banco de Dados", "Cálculo I"];

export const getSubjects = () => {
  try {
    const savedSubjects = localStorage.getItem(SUBJECT_STORAGE_KEY);
    if (!savedSubjects) return DEFAULT_SUBJECTS;
    const subjects = JSON.parse(savedSubjects);
    return Array.isArray(subjects)
      ? subjects.filter((subject) => typeof subject === "string" && subject.trim())
      : DEFAULT_SUBJECTS;
  } catch {
    return DEFAULT_SUBJECTS;
  }
};

const saveSubjects = (subjects) => {
  try {
    localStorage.setItem(SUBJECT_STORAGE_KEY, JSON.stringify(subjects));
    window.dispatchEvent(new CustomEvent("studyflow:subjects-updated"));
    return true;
  } catch {
    return false;
  }
};

export const populateSubjectSelects = () => {
  const subjects = getSubjects();
  document.querySelectorAll("[data-subject-select]").forEach((select) => {
    const selectedValue = select.value;
    const placeholder = select.querySelector("option[data-placeholder]");
    select.replaceChildren();
    if (placeholder) select.append(placeholder);
    subjects.forEach((subject) => {
      const option = new Option(subject, subject, false, subject === selectedValue);
      select.append(option);
    });
  });
};

const renderSubjects = () => {
  const list = document.querySelector("[data-subject-list]");
  const count = document.querySelector("[data-subject-count]");
  if (!list) return;

  const subjects = getSubjects();
  list.replaceChildren();
  subjects.forEach((subject) => {
    const item = document.createElement("li");
    const marker = document.createElement("span");
    const name = document.createElement("strong");
    const removeButton = document.createElement("button");
    item.className = "subject-item";
    marker.className = "subject-item__marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = "◈";
    name.textContent = subject;
    removeButton.className = "subject-remove";
    removeButton.type = "button";
    removeButton.dataset.removeSubject = subject;
    removeButton.setAttribute("aria-label", `Remover ${subject}`);
    removeButton.textContent = "Remover";
    item.append(marker, name, removeButton);
    list.append(item);
  });

  if (count) count.textContent = `${subjects.length} ${subjects.length === 1 ? "matéria cadastrada" : "matérias cadastradas"}`;
};

const refreshSubjectInterface = () => {
  populateSubjectSelects();
  renderSubjects();
};

export const initSubjects = () => {
  refreshSubjectInterface();

  const subjectForm = document.querySelector("[data-subject-form]");
  const subjectList = document.querySelector("[data-subject-list]");
  if (!subjectForm || !subjectList) return;

  subjectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = subjectForm.querySelector("#subject-name");
    const subjectName = normalizeText(input?.value);
    const subjects = getSubjects();

    if (!subjectName) {
      setFeedback("[data-subject-feedback]", "Informe o nome da matéria.", "is-error");
      input?.focus();
      return;
    }
    if (subjects.some((subject) => subject.toLocaleLowerCase() === subjectName.toLocaleLowerCase())) {
      setFeedback("[data-subject-feedback]", "Esta matéria já está cadastrada.", "is-error");
      input?.focus();
      return;
    }
    if (!saveSubjects([...subjects, subjectName])) {
      setFeedback("[data-subject-feedback]", "Não foi possível salvar a matéria neste navegador.", "is-error");
      return;
    }

    input.value = "";
    refreshSubjectInterface();
    setFeedback("[data-subject-feedback]", `Matéria “${subjectName}” adicionada com sucesso.`, "is-success");
  });

  subjectList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-subject]");
    if (!button) return;
    const subjects = getSubjects().filter((subject) => subject !== button.dataset.removeSubject);
    if (!saveSubjects(subjects)) {
      setFeedback("[data-subject-feedback]", "Não foi possível remover a matéria neste navegador.", "is-error");
      return;
    }
    refreshSubjectInterface();
    setFeedback("[data-subject-feedback]", "Matéria removida da sua lista.", "is-success");
  });
};
