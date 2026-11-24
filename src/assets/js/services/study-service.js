import { getQueryParam, wait } from "../core/helpers.js";
import { ApiError, requestJson } from "./api-client.js";
import { API_BASE_URL, isApiMode } from "./config.js";

const recommendationsUrl = new URL("../../data/recomendacoes-estudo.json", import.meta.url);
const invalidRecommendationsUrl = new URL("../../data/recomendacoes-indisponiveis.json", import.meta.url);
const mockCheckinUrl = "https://jsonplaceholder.typicode.com/posts";
const minimumLoadingTime = 700;

const isRecommendation = (recommendation) => recommendation
  && typeof recommendation.id === "string"
  && typeof recommendation.subject === "string"
  && typeof recommendation.title === "string"
  && typeof recommendation.description === "string"
  && typeof recommendation.duration === "string";

export const loadRecommendations = async () => {
  const url = isApiMode
    ? `${API_BASE_URL}/${getQueryParam("consulta") === "erro" ? "recomendacoes-indisponiveis" : "recomendacoes"}`
    : getQueryParam("consulta") === "erro" ? invalidRecommendationsUrl : recommendationsUrl;
  const [payload] = await Promise.all([
    requestJson(url, { cache: "no-store" }),
    wait(minimumLoadingTime)
  ]);

  if (!payload || !Array.isArray(payload.recommendations)) {
    throw new ApiError("A lista de recomendações recebida é inválida.");
  }

  const recommendations = payload.recommendations.filter(isRecommendation);
  if (!recommendations.length) {
    throw new ApiError("Nenhuma recomendação acadêmica está disponível no momento.");
  }
  return recommendations;
};

export const submitStudyCheckin = async ({ subject, minutes, note }) => {
  if (getQueryParam("envio") === "erro") {
    await wait(minimumLoadingTime);
    throw new ApiError("Falha de envio ativada para demonstração. Abra a página sem ?envio=erro para tentar novamente.");
  }

  if (isApiMode) {
    const checkin = await requestJson(`${API_BASE_URL}/checkins`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, minutes, note })
    });
    return { ...checkin, serverId: checkin.id };
  }

  const [response] = await Promise.all([
    requestJson(mockCheckinUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
        title: `Check-in StudyFlow: ${subject}`,
        body: note || "Check-in sem observações.",
        userId: 1,
        subject,
        minutes
      })
    }),
    wait(minimumLoadingTime)
  ]);

  if (!response || (typeof response.id !== "number" && typeof response.id !== "string")) {
    throw new ApiError("O serviço não confirmou o recebimento do check-in.");
  }

  return { serverId: response.id, subject, minutes, note };
};

export const loadStudyCheckins = () => requestJson(`${API_BASE_URL}/checkins`, { cache: "no-store" });
