export const normalizedKey = (text) => text.normalize("NFC").toLocaleLowerCase("pt-BR");
const columns = "id, name, created_at AS createdAt, updated_at AS updatedAt";

export const createSubjectRepository = (database) => ({
  list: () => database.prepare(`SELECT ${columns} FROM subjects ORDER BY created_at, id`).all(),
  get: (id) => database.prepare(`SELECT ${columns} FROM subjects WHERE id = ?`).get(id),
  findByName: (name) => database.prepare(`SELECT ${columns} FROM subjects WHERE name_key = ?`).get(normalizedKey(name)),
  create(subject) {
    database.prepare("INSERT INTO subjects(id, name, name_key, created_at) VALUES (?, ?, ?, ?)")
      .run(subject.id, subject.name, normalizedKey(subject.name), subject.createdAt);
    return this.get(subject.id);
  },
  update(subject) {
    database.prepare("UPDATE subjects SET name = ?, name_key = ?, updated_at = ? WHERE id = ?")
      .run(subject.name, normalizedKey(subject.name), subject.updatedAt, subject.id);
    return this.get(subject.id);
  },
  remove: (id) => database.prepare("DELETE FROM subjects WHERE id = ?").run(id),
  hasDependents: (id) => Boolean(database.prepare("SELECT 1 FROM tasks WHERE subject_id = ? UNION ALL SELECT 1 FROM checkins WHERE subject_id = ? LIMIT 1").get(id, id))
});
