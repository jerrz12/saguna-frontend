DROP TABLE IF EXISTS dashboard_metrics;

CREATE TABLE dashboard_metrics (
  metric_id INTEGER PRIMARY KEY,
  new_leads_today INTEGER NOT NULL,
  follow_ups_due INTEGER NOT NULL,
  leads_this_week INTEGER NOT NULL,
  replies_received INTEGER NOT NULL,
  outreach_sent_today INTEGER NOT NULL,
  outreach_sent_week INTEGER NOT NULL,
  pipeline_errors INTEGER NOT NULL,
  pipeline_retries INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);

INSERT INTO dashboard_metrics (
  new_leads_today,
  follow_ups_due,
  leads_this_week,
  replies_received,
  outreach_sent_today,
  outreach_sent_week,
  pipeline_errors,
  pipeline_retries,
  updated_at
) VALUES
(11, 7, 31, 6, 9, 24, 1, 4, '2026-02-26 21:10:00');
