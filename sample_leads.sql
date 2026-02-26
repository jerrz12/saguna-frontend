DROP TABLE IF EXISTS leads;

CREATE TABLE leads (
  lead_id INTEGER PRIMARY KEY,
  company TEXT NOT NULL,
  sector TEXT NOT NULL,
  why_now TEXT NOT NULL,
  sources TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  status TEXT NOT NULL,
  yc_filter TEXT NOT NULL,
  form_d_filter TEXT NOT NULL,
  website TEXT,
  updated_at TEXT NOT NULL
);

INSERT INTO leads (company, sector, why_now, sources, score, status, yc_filter, form_d_filter, website, updated_at) VALUES
('MediSync Health', 'Healthcare', 'Raised $8M Series A to expand EHR platform.', 'TC|YC|SEC', 95, 'New Lead', 'YC Only', 'Has Form D', 'https://www.medisynchealth.com', '2026-02-23'),
('FreshBytes', 'FoodTech', 'Closed $5M Seed round for restaurant software.', 'YC|SEC', 88, 'Contacted', 'YC Only', 'No Form D', 'https://www.freshbytes.io', '2026-02-23'),
('FinSecure', 'Fintech', 'Series A momentum in AML and risk compliance.', 'YC|SEC|DOC', 84, 'Follow-up Due', 'YC Only', 'Possible Match / Needs Review', 'https://www.finsecure.ai', '2026-02-22'),
('AgriNext', 'AgTech', 'Secured $2M to scale precision farming sensors.', 'TC|SEC', 81, 'Reviewed', 'Non-YC Only', 'Unknown (not checked yet)', 'https://www.agrinext.tech', '2026-02-21'),
('CareSure', 'InsurTech', 'Filed Form D after insurance automation launch.', 'SEC|DOC', 78, 'Not Fit', 'Unknown (not matched yet)', 'Has Form D', 'https://www.caresure.co', '2026-02-20'),
('CloudPulse', 'DevTools / Infra', 'Landed enterprise pilots for observability stack.', 'TC|YC', 86, 'Draft Generated', 'YC Only', 'No Form D', 'https://www.cloudpulse.dev', '2026-02-24');
