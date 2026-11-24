import { readFileSync } from "node:fs";

const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

export const createStore = ({ seed = true } = {}) => {
  const examples = [
    ["Protótipo estrutural em HTML", "Construção de Software", 2, "alta", "pendente"],
    ["Documentar decisões da etapa", "Construção de Software", 3, "media", "pendente"],
    ["Lista de exercícios 4", "Cálculo I", 5, "media", "pendente"],
    ["Leitura do capítulo 6", "Banco de Dados", 7, "baixa", "pendente"],
    ["Revisar normalização", "Banco de Dados", -2, "baixa", "concluida"],
    ["Resumo da aula 3", "Cálculo I", -4, "baixa", "concluida"]
  ];
  return {
    tasks: seed ? examples.map(([title, subject, offset, priority, status], index) => ({
      id: `00000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
      title, subject, description: "Atividade acadêmica de demonstração.", dueDate: dateOffset(offset), priority, status,
      createdAt: new Date().toISOString()
    })) : [],
    checkins: [],
    recommendations: JSON.parse(readFileSync(new URL("../../../src/assets/data/recomendacoes-estudo.json", import.meta.url), "utf8"))
  };
};
