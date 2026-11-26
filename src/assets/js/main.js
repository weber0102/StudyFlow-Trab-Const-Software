import { initAuth } from "./auth.js";
import { initDataMode } from "./core/data-mode.js";
import { initStudyPanel } from "./dashboard/study-panel.js";
import { initNavigation } from "./navigation.js";
import { initSubjects } from "./subjects.js";
import { initTasks } from "./tasks/controller.js";
import { initTheme } from "./theme.js";

const initializeApplication = async () => {
  initTheme();
  initNavigation();
  initAuth();
  initDataMode();
  await initSubjects();
  initTasks();
  initStudyPanel();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApplication, { once: true });
} else {
  initializeApplication();
}
