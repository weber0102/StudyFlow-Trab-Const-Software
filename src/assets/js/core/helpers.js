export const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

export const normalizeText = (value = "") => String(value).trim().replace(/\s+/g, " ");

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getDateOffset = (days) => {
  const date = getToday();
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
};

export const parseDate = (isoDate) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || "")) return null;
  const date = new Date(`${isoDate}T12:00:00`);
  return Number.isNaN(date.getTime()) || toIsoDate(date) !== isoDate ? null : date;
};

export const formatDate = (isoDate) => {
  const date = parseDate(isoDate);
  if (!date) return "Data inválida";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date).replace(".", "");
};

export const createId = (prefix) => window.crypto?.randomUUID?.() || `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const wait = (milliseconds) => new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export const getQueryParam = (name) => new URLSearchParams(window.location.search).get(name);
