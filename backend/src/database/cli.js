import { openDatabase, defaultDatabasePath } from "./connection.js";
import { seedDatabase } from "./seeds/demo.js";

const command = process.argv[2];
if (!["init", "seed", "check"].includes(command)) {
  console.error("Use init, seed ou check.");
  process.exit(1);
}
let database;
try {
  database = openDatabase();
  if (command === "seed") console.info(seedDatabase(database) ? "Dados demonstrativos inseridos." : "Seed já aplicado; nenhum registro foi recriado.");
  console.info(`Banco: ${process.env.DATABASE_PATH || defaultDatabasePath}`);
  console.info(JSON.stringify({
    integrity: database.prepare("PRAGMA integrity_check").get(),
    foreignKeyViolations: database.prepare("PRAGMA foreign_key_check").all(),
    subjects: database.prepare("SELECT COUNT(*) AS total FROM subjects").get().total,
    tasks: database.prepare("SELECT COUNT(*) AS total FROM tasks").get().total,
    checkins: database.prepare("SELECT COUNT(*) AS total FROM checkins").get().total
  }, null, 2));
} catch (error) {
  console.error("Falha ao preparar ou verificar o banco. Confira DATABASE_PATH e as permissões.");
  console.error(error);
  process.exitCode = 1;
} finally { database?.close(); }
