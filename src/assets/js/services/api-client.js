export class ApiError extends Error {
  constructor(message, { status = null, cause = null, field = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.cause = cause;
    this.field = field;
  }
}

export const requestJson = async (url, options = {}) => {
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new ApiError("Não foi possível comunicar com o serviço. Verifique sua conexão e tente novamente.", { cause: error });
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new ApiError(errorBody?.mensagem || `O serviço respondeu com erro HTTP ${response.status}.`, {
      status: response.status, field: errorBody?.campo
    });
  }

  if (response.status === 204) return null;

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError("O serviço enviou uma resposta em formato inesperado.", { status: response.status, cause: error });
  }
};
