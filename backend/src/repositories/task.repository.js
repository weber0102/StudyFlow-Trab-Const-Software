import { normalizedKey } from "./subject.repository.js";

const select = `SELECT t.id, t.title, s.name AS subject, t.subject_id AS subjectId,
  t.description, t.due_date AS dueDate, t.priority, t.status,
  t.created_at AS createdAt, t.updated_at AS updatedAt
  FROM tasks t JOIN subjects s ON s.id = t.subject_id`;

export const createTaskRepository = (database) => ({
  list: () => database.prepare(`${select} ORDER BY t.created_at, t.id`).all(),
  get: (id) => database.prepare(`${select} WHERE t.id = ?`).get(id),
  findDuplicate: (task, excludedId = "") => database.prepare("SELECT id FROM tasks WHERE title_key = ? AND subject_id = ? AND due_date = ? AND id <> ?")
    .get(normalizedKey(task.title), task.subjectId, task.dueDate, excludedId),
  create(task) {
    database.prepare("INSERT INTO tasks(id, title, title_key, subject_id, description, due_date, priority, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(task.id, task.title, normalizedKey(task.title), task.subjectId, task.description, task.dueDate, task.priority, task.status, task.createdAt);
    return this.get(task.id);
  },
  update(task) {
    database.prepare("UPDATE tasks SET title = ?, title_key = ?, subject_id = ?, description = ?, due_date = ?, priority = ?, status = ?, updated_at = ? WHERE id = ?")
      .run(task.title, normalizedKey(task.title), task.subjectId, task.description, task.dueDate, task.priority, task.status, task.updatedAt, task.id);
    return this.get(task.id);
  },
  remove: (id) => database.prepare("DELETE FROM tasks WHERE id = ?").run(id)
});
