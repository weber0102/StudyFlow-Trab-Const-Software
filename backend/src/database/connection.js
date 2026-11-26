import { DatabaseSync } from "node:sqlite";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const defaultDatabasePath = fileURLToPath(new URL("../../data/studyflow.sqlite", import.meta.url));

export const transaction = (database, operation) => {
  database.exec("BEGIN IMMEDIATE");
  try {
    const result = operation();
    database.exec("COMMIT");
    return result;
  } catch (error) {
    database.exec("ROLLBACK");
    throw error;
  }
};

export const openDatabase = ({ filename = process.env.DATABASE_PATH || defaultDatabasePath, busyTimeout = 3000 } = {}) => {
  const path = filename === ":memory:" ? filename : resolve(filename);
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const database = new DatabaseSync(path);
  try {
    database.exec(`PRAGMA foreign_keys = ON; PRAGMA busy_timeout = ${Math.max(0, Math.floor(busyTimeout))};`);
    transaction(database, () => {
      database.exec("CREATE TABLE IF NOT EXISTS schema_migrations (version INTEGER PRIMARY KEY, applied_at TEXT NOT NULL) STRICT");
      const applied = database.prepare("SELECT version FROM schema_migrations WHERE version = 1").get();
      if (!applied) {
        database.exec(readFileSync(new URL("./migrations/001-initial.sql", import.meta.url), "utf8"));
        database.prepare("INSERT INTO schema_migrations(version, applied_at) VALUES (?, ?)").run(1, new Date().toISOString());
      }
    });
    return database;
  } catch (error) {
    database.close();
    throw error;
  }
};
