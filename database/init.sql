CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL
);

INSERT INTO app_settings (key, value)
VALUES
  ('title', 'Two-Tier Application'),
  ('summary', 'A lightweight frontend communicating with a Node.js backend API backed by PostgreSQL.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO tasks (title, status)
VALUES
  ('Set up frontend tier', 'done'),
  ('Expose backend API', 'done'),
  ('Connect PostgreSQL data', 'done')
ON CONFLICT DO NOTHING;
