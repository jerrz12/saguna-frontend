DROP TABLE IF EXISTS followups_due;

CREATE TABLE followups_due (
  followup_id INTEGER PRIMARY KEY,
  company TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  last_contacted TEXT NOT NULL,
  owner TEXT,
  priority TEXT DEFAULT 'Medium',
  updated_at TEXT NOT NULL
);

INSERT INTO followups_due (company, score, last_contacted, owner, priority, updated_at) VALUES
('MediTech Solutions', 85, '2026-02-23', 'A. Chen', 'High', '2026-02-26 10:10:00'),
('GreenFin Labs', 81, '2026-02-23', 'R. Patel', 'Medium', '2026-02-26 10:12:00'),
('SecureAI Inc.', 90, '2026-02-22', 'M. Torres', 'High', '2026-02-26 10:13:00'),
('Tracklytics', 83, '2026-02-22', 'J. Kim', 'Medium', '2026-02-26 10:14:00'),
('CloudPulse', 79, '2026-02-21', 'N. Singh', 'Low', '2026-02-26 10:15:00');
