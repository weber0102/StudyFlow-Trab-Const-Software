import { isApiMode } from "../services/config.js";

export const initDataMode = () => {
  const messages = isApiMode ? {
    summary: "Matérias, tarefas e check-ins ficam salvos no banco de dados e continuam disponíveis após reiniciar o servidor. Sua conta demonstrativa e preferências ficam neste navegador.",
    tasks: "As alterações são enviadas ao servidor e compartilhadas entre os navegadores que acessam esta API.",
    persistence: "Matérias e tarefas ficam salvas no banco de dados do servidor.",
    subjectsPersistence: "As matérias ficam salvas no banco de dados e são compartilhadas com as tarefas e check-ins.",
    subjectsDeletion: "Matérias com tarefas ou check-ins vinculados não podem ser removidas.",
    checkin: "Registre o que estudou e acompanhe as últimas sessões de estudo."
  } : {
    summary: "Demonstração local: tarefas, matérias e histórico ficam neste navegador. Para usar os dados compartilhados, execute a versão com servidor seguindo o README.",
    tasks: "As alterações desta demonstração são guardadas neste navegador.",
    persistence: "As tarefas desta demonstração são salvas localmente no navegador.",
    subjectsPersistence: "As informações desta demonstração ficam salvas neste navegador.",
    subjectsDeletion: "Remova matérias que não utiliza mais.",
    checkin: "Envie um resumo para o serviço demonstrativo e acompanhe seus últimos registros neste navegador."
  };
  Object.entries(messages).forEach(([key, message]) => {
    document.querySelectorAll(`[data-mode-copy='${key}']`).forEach((element) => { element.textContent = message; });
  });
};
