import { isApiMode } from "../services/config.js";

export const initDataMode = () => {
  const messages = isApiMode ? {
    summary: "Tarefas e check-ins conectados ao servidor. Os registros desta demonstração são reiniciados quando o servidor é reiniciado. Matérias e conta demonstrativa ficam neste navegador.",
    tasks: "As alterações são enviadas ao servidor e compartilhadas entre os navegadores que acessam esta API.",
    persistence: "As tarefas ficam na memória do servidor durante esta execução.",
    checkin: "Registre o que estudou e acompanhe as últimas sessões de estudo."
  } : {
    summary: "Demonstração local: tarefas, matérias e histórico ficam neste navegador. Para usar os dados compartilhados, execute a versão com servidor seguindo o README.",
    tasks: "As alterações desta demonstração são guardadas neste navegador.",
    persistence: "As tarefas desta demonstração são salvas localmente no navegador.",
    checkin: "Envie um resumo para o serviço demonstrativo e acompanhe seus últimos registros neste navegador."
  };
  Object.entries(messages).forEach(([key, message]) => {
    document.querySelectorAll(`[data-mode-copy='${key}']`).forEach((element) => { element.textContent = message; });
  });
};
