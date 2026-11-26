CREATE TABLE subjects (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 60),
  name_key TEXT NOT NULL UNIQUE CHECK(length(name_key) > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT
) STRICT;

CREATE TABLE tasks (
  id TEXT PRIMARY KEY NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 3 AND 100),
  title_key TEXT NOT NULL CHECK(length(title_key) > 0),
  description TEXT NOT NULL DEFAULT '' CHECK(length(description) <= 500),
  due_date TEXT NOT NULL CHECK(length(due_date) = 10 AND date(due_date, '+0 days') IS NOT NULL AND date(due_date, '+0 days') = due_date),
  priority TEXT NOT NULL CHECK(priority IN ('alta', 'media', 'baixa')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK(status IN ('pendente', 'concluida')),
  created_at TEXT NOT NULL,
  updated_at TEXT,
  UNIQUE(title_key, subject_id, due_date)
) STRICT;
CREATE INDEX tasks_subject_idx ON tasks(subject_id);

CREATE TABLE checkins (
  id TEXT PRIMARY KEY NOT NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
  minutes INTEGER NOT NULL CHECK(minutes BETWEEN 1 AND 600),
  note TEXT NOT NULL DEFAULT '' CHECK(length(note) <= 180),
  created_at TEXT NOT NULL
) STRICT;
CREATE INDEX checkins_subject_idx ON checkins(subject_id);

CREATE TABLE seed_runs (
  name TEXT PRIMARY KEY NOT NULL,
  applied_at TEXT NOT NULL
) STRICT;
