export const setFeedback = (target, message = "", type = "") => {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;
  element.className = `form-feedback ${type}`.trim();
  element.textContent = message;
};

export const setButtonLoading = (button, isLoading, loadingLabel) => {
  if (!button) return;
  if (isLoading) {
    button.dataset.originalLabel = button.textContent;
    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    button.textContent = loadingLabel;
    return;
  }
  button.disabled = false;
  button.removeAttribute("aria-busy");
  button.textContent = button.dataset.originalLabel || button.textContent;
  delete button.dataset.originalLabel;
};

export const setFormFieldInvalid = (form, fieldName, message, feedbackTarget) => {
  const field = form?.elements?.[fieldName];
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.classList.add("is-invalid");
    field.focus();
  }
  setFeedback(feedbackTarget, message, "is-error");
};

export const clearInvalidFields = (form) => {
  form?.querySelectorAll("[aria-invalid='true']").forEach((field) => {
    field.removeAttribute("aria-invalid");
    field.classList.remove("is-invalid");
  });
};
