(() => {
  const storageKey = "studyflow-subjects";
  const initialSubjects = ["Construção de Software", "Banco de Dados", "Cálculo I"];

  const getSubjects = () => {
    const savedSubjects = localStorage.getItem(storageKey);
    if (!savedSubjects) return initialSubjects;

    try {
      const subjects = JSON.parse(savedSubjects);
      return Array.isArray(subjects) ? subjects : initialSubjects;
    } catch {
      return initialSubjects;
    }
  };

  const saveSubjects = (subjects) => localStorage.setItem(storageKey, JSON.stringify(subjects));

  const populateSubjectSelects = () => {
    const subjects = getSubjects();
    document.querySelectorAll("[data-subject-select]").forEach((select) => {
      const selectedValue = select.value;
      const firstOption = select.querySelector("option[data-placeholder]");
      select.replaceChildren();
      if (firstOption) select.append(firstOption);
      subjects.forEach((subject) => {
        const option = new Option(subject, subject);
        option.selected = subject === selectedValue;
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

  const announce = (message, type = "") => {
    const feedback = document.querySelector("[data-subject-feedback]");
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('a[href$=".html"]').forEach((link) => {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin === window.location.origin) {
        destination.searchParams.set("v", "subjects-2");
        link.href = destination.toString();
      }
    });

    populateSubjectSelects();
    renderSubjects();

    const subjectForm = document.querySelector("[data-subject-form]");
    subjectForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = subjectForm.querySelector("#subject-name");
      const subjectName = input.value.trim().replace(/\s+/g, " ");
      const subjects = getSubjects();

      if (!subjectName) return;
      if (subjects.some((subject) => subject.toLocaleLowerCase() === subjectName.toLocaleLowerCase())) {
        announce("Esta matéria já está cadastrada.", "is-error");
        input.focus();
        return;
      }

      saveSubjects([...subjects, subjectName]);
      input.value = "";
      populateSubjectSelects();
      renderSubjects();
      announce(`Matéria “${subjectName}” adicionada com sucesso.`, "is-success");
    });

    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-subject]");
      if (!button) return;
      const subjects = getSubjects().filter((subject) => subject !== button.dataset.removeSubject);
      saveSubjects(subjects);
      populateSubjectSelects();
      renderSubjects();
      announce("Matéria removida da sua lista.", "is-success");
    });
  });
})();
