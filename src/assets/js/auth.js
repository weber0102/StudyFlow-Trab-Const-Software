import { setFeedback } from "./core/feedback.js";

const accountKey = "studyflow-demo-account";
const sessionKey = "studyflow-demo-session";

const readStoredObject = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value && typeof value === "object" ? value : null;
  } catch {
    return null;
  }
};

const getAccount = () => readStoredObject(accountKey);
const getSession = () => readStoredObject(sessionKey);
const saveSession = ({ name, email }) => localStorage.setItem(sessionKey, JSON.stringify({ name, email }));

const hashPassword = async (password) => {
  if (!window.crypto?.subtle) throw new Error("Criptografia indisponível neste navegador.");
  const bytes = new TextEncoder().encode(password);
  const hash = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const normalizeEmail = (email) => email.trim().toLocaleLowerCase();

const updateAccountUI = () => {
  const session = getSession();
  document.querySelectorAll("[data-account-label]").forEach((label) => {
    label.textContent = session ? "Conta" : "Entrar";
  });
  document.querySelectorAll("[data-student-name]").forEach((name) => {
    if (session?.name) name.textContent = session.name;
  });
};

const showTab = (name) => {
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    const selected = button.dataset.authTab === name;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  });
  document.querySelectorAll("[data-auth-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.authPanel !== name;
  });
  setFeedback("[data-auth-feedback]");
};

const updateLoginPage = () => {
  const session = getSession();
  const accountForms = document.querySelector("[data-auth-forms]");
  const sessionPanel = document.querySelector("[data-auth-session]");
  const sessionName = document.querySelector("[data-auth-session-name]");
  if (!accountForms || !sessionPanel) return;

  accountForms.hidden = Boolean(session);
  sessionPanel.hidden = !session;
  if (sessionName && session?.name) sessionName.textContent = session.name;
};

const initializeLoginForm = () => {
  document.querySelector("[data-login-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const email = normalizeEmail(form.elements.email.value);
    const password = form.elements.password.value;
    const account = getAccount();

    if (!account || account.email !== email) {
      setFeedback("[data-auth-feedback]", "Não encontramos uma conta com este e-mail neste navegador.", "is-error");
      return;
    }

    try {
      if (account.passwordHash !== await hashPassword(password)) {
        setFeedback("[data-auth-feedback]", "Senha incorreta. Tente novamente.", "is-error");
        return;
      }
      saveSession(account);
      updateAccountUI();
      setFeedback("[data-auth-feedback]", "Acesso realizado. Abrindo seu painel…", "is-success");
      window.setTimeout(() => { window.location.href = "index.html"; }, 550);
    } catch (error) {
      setFeedback("[data-auth-feedback]", error.message, "is-error");
    }
  });
};

const initializeRegistrationForm = () => {
  document.querySelector("[data-register-form]")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const name = form.elements.name.value.trim().replace(/\s+/g, " ");
    const email = normalizeEmail(form.elements.email.value);
    const password = form.elements.password.value;
    const confirmation = form.elements.passwordConfirmation.value;
    const existingAccount = getAccount();

    if (password.length < 6) {
      setFeedback("[data-auth-feedback]", "Use uma senha com pelo menos 6 caracteres.", "is-error");
      return;
    }
    if (password !== confirmation) {
      setFeedback("[data-auth-feedback]", "A confirmação de senha não confere.", "is-error");
      return;
    }
    if (existingAccount && existingAccount.email !== email) {
      setFeedback("[data-auth-feedback]", "Este navegador já possui uma conta demonstrativa. Entre nela ou saia para criar outra.", "is-error");
      return;
    }

    try {
      const account = { name, email, passwordHash: await hashPassword(password) };
      localStorage.setItem(accountKey, JSON.stringify(account));
      saveSession(account);
      updateAccountUI();
      updateLoginPage();
    } catch (error) {
      setFeedback("[data-auth-feedback]", error.message, "is-error");
    }
  });
};

export const initAuth = () => {
  updateAccountUI();
  updateLoginPage();
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.authTab));
  });
  initializeLoginForm();
  initializeRegistrationForm();
  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem(sessionKey);
    updateAccountUI();
    updateLoginPage();
    showTab("login");
  });
};
