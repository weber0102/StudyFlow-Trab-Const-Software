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
  if (error.code === "ERR_SQLITE_ERROR" || error.code === "ERR_INVALID_STATE") {
    console.error("Falha de persistência:", error);
    const sqliteCode = Number(error.errcode) & 255;
    if ([5, 6, 8, 10, 11, 13, 14, 26].includes(sqliteCode) || error.code === "ERR_INVALID_STATE") {
      error = new HttpError(503, "PERSISTENCIA_INDISPONIVEL", "Não foi possível acessar o banco de dados. Tente novamente em instantes.");
    } else if ([1555, 2067].includes(error.errcode)) {
      error = new HttpError(409, "DADOS_DUPLICADOS", "Já existe um registro com estes dados.");
    } else if (error.errcode === 787 || error.errcode === 1811) {
      error = new HttpError(409, "RELACIONAMENTO_INVALIDO", "A operação viola o vínculo entre a matéria e seus registros.");
    } else if (sqliteCode === 19) {
      error = new HttpError(400, "DADOS_INVALIDOS", "Os dados não atendem às restrições do banco.");
    } else {
      error = new HttpError(500, "ERRO_PERSISTENCIA", "Não foi possível concluir a operação no banco de dados.");
    }
  }
  if (!(error instanceof HttpError)) {
    console.error("Falha inesperada na API:", error);
    error = new HttpError(500, "ERRO_INTERNO", "Erro interno do servidor.");
  }
  response.status(error.status).json({ erro: error.code, mensagem: error.message, ...(error.field ? { campo: error.field } : {}) });
};
