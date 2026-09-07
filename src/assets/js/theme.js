(() => {
  const storageKey = "studyflow-theme";
  const root = document.documentElement;
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(storageKey);
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "light";
  };
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
      button.querySelector(".theme-toggle__icon").textContent = isDark ? "☀" : "☾";
      button.querySelector(".theme-toggle__label").textContent = isDark ? "Claro" : "Escuro";
    });
  };
  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getPreferredTheme());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
      });
    });
  });
})();
