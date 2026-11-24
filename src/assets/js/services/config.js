// Configuração da versão estática. O Express fornece este módulo com /api ativo.
// Para um front-end em outra origem, informe aqui a URL HTTPS da API e configure CORS no servidor.
export const API_BASE_URL = null;
export const isApiMode = Boolean(API_BASE_URL);
