DROP TABLE IF EXISTS dashboard_panels;

CREATE TABLE dashboard_panels (
  item_id INTEGER PRIMARY KEY,
  panel_type TEXT NOT NULL CHECK (panel_type IN ('recent_activity', 'needs_review', 'retry_queue')),
  label_left TEXT,
  label_right TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);

INSERT INTO dashboard_panels (panel_type, label_left, label_right, sort_order, updated_at) VALUES
('recent_activity', '9:00 AM', 'Ingest Completed', 1, '2026-02-26 10:30:00'),
('recent_activity', '9:15 AM', 'Ranking Updated', 2, '2026-02-26 10:30:00'),
('recent_activity', '9:30 AM', 'Email Sent to HealthSync', 3, '2026-02-26 10:30:00'),
('needs_review', '', 'Pending Domain Match', 1, '2026-02-26 10:30:00'),
('needs_review', '', 'Low Confidence Lead', 2, '2026-02-26 10:30:00'),
('retry_queue', '', 'TechCrunch Article Failed', 1, '2026-02-26 10:30:00'),
('retry_queue', '', 'SEC Fetch Retries: 2', 2, '2026-02-26 10:30:00');
