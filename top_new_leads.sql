DROP TABLE IF EXISTS top_new_leads;

CREATE TABLE top_new_leads (
  lead_id INTEGER PRIMARY KEY,
  company TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  note TEXT NOT NULL,
  action_label TEXT NOT NULL DEFAULT 'Draft',
  updated_at TEXT NOT NULL
);

INSERT INTO top_new_leads (company, score, note, action_label, updated_at) VALUES
('HealthSync', 92, 'Recent Series A, expanding health tech', 'Draft', '2026-02-26 10:20:00'),
('FinTech Innovate', 82, 'Series A', 'Draft', '2026-02-26 10:20:00'),
('YCStartup.io', 92, 'Driving the right job needed', 'Draft', '2026-02-26 10:20:00'),
('CloudPulse', 88, 'Enterprise pilot momentum', 'Draft', '2026-02-26 10:21:00'),
('SecureAI Inc.', 90, 'Security automation demand up', 'Draft', '2026-02-26 10:21:00');
