export class HttpError extends Error {
  constructor(status, code, message, field) {
    super(message);
    this.status = status;
    this.code = code;
    this.field = field;
  }
}

export const errorHandler = (error, request, response, next) => {
  if (response.headersSent) return next(error);
  if (error.type === "entity.parse.failed") {
    error = new HttpError(400, "JSON_INVALIDO", "O corpo da requisição deve conter JSON válido.");
  } else if (error.type === "entity.too.large") {
    error = new HttpError(413, "CORPO_MUITO_GRANDE", "O corpo da requisição excede o limite de 16 KB.");
  } else if (error instanceof URIError) {
    error = new HttpError(400, "URL_INVALIDA", "O endereço informado é inválido.");
  } else if (error.type === "charset.unsupported" || error.type === "encoding.unsupported") {
    error = new HttpError(415, "TIPO_NAO_SUPORTADO", "Use JSON com codificação UTF-8.");
  }
  if (!(error instanceof HttpError)) {
    console.error("Falha inesperada na API:", error);
    error = new HttpError(500, "ERRO_INTERNO", "Erro interno do servidor.");
  }
  response.status(error.status).json({ erro: error.code, mensagem: error.message, ...(error.field ? { campo: error.field } : {}) });
};
