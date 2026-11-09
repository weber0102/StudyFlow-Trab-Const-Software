import { getQueryParam, wait } from "../core/helpers.js";
import { ApiError, requestJson } from "./api-client.js";

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
  const url = getQueryParam("consulta") === "erro" ? invalidRecommendationsUrl : recommendationsUrl;
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
    throw new ApiError("O serviço simulado de check-in está indisponível. Tente novamente em instantes.");
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
