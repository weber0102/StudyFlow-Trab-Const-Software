const select = `SELECT c.id, c.subject_id AS subjectId, s.name AS subject, c.minutes, c.note, c.created_at AS createdAt
  FROM checkins c JOIN subjects s ON s.id = c.subject_id`;

export const createCheckinRepository = (database) => ({
  list: () => database.prepare(`${select} ORDER BY c.created_at DESC, c.rowid DESC`).all(),
  create(checkin) {
    database.prepare("INSERT INTO checkins(id, subject_id, minutes, note, created_at) VALUES (?, ?, ?, ?, ?)")
      .run(checkin.id, checkin.subjectId, checkin.minutes, checkin.note, checkin.createdAt);
    return database.prepare(`${select} WHERE c.id = ?`).get(checkin.id);
  }
});
