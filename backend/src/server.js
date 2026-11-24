import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
const server = createApp({ allowedOrigins }).listen(port, host, () => {
  console.info(`StudyFlow disponível em http://${host}:${port}`);
  console.info("Dados em memória: reiniciar o servidor restaura a demonstração inicial.");
});
server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? "A porta já está em uso. Configure PORT com outra porta." : "Não foi possível iniciar o servidor.");
  process.exitCode = 1;
});
