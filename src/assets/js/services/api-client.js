export class ApiError extends Error {
  constructor(message, { status = null, cause = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.cause = cause;
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
    throw new ApiError(`O serviço respondeu com erro HTTP ${response.status}.`, { status: response.status });
  }

  try {
    return await response.json();
  } catch (error) {
    throw new ApiError("O serviço enviou uma resposta em formato inesperado.", { status: response.status, cause: error });
  }
};
