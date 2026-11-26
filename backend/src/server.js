import { createApp } from "./app.js";

const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "127.0.0.1";
const allowedOrigins = (process.env.CORS_ORIGINS || "").split(",").map((origin) => origin.trim()).filter(Boolean);
let app;
try {
  app = createApp({ allowedOrigins });
} catch (error) {
  console.error("Não foi possível abrir ou preparar o banco. Verifique DATABASE_PATH e as permissões da pasta.");
  console.error(error);
  process.exit(1);
}
const server = app.listen(port, host, () => {
  console.info(`StudyFlow disponível em http://${host}:${server.address().port}`);
  console.info("Dados persistentes em SQLite. Reiniciar o servidor mantém os registros.");
});
let closing = false;
const shutdown = () => {
  if (closing) return;
  closing = true;
  server.close(() => app.locals.database.close());
  server.closeIdleConnections();
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
server.on("error", (error) => {
  console.error(error.code === "EADDRINUSE" ? "A porta já está em uso. Configure PORT com outra porta." : "Não foi possível iniciar o servidor.");
  app.locals.database.close();
  process.exitCode = 1;
});
