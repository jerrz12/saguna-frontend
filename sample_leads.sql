DROP TABLE IF EXISTS leads;

CREATE TABLE leads (
  lead_id INTEGER PRIMARY KEY,
  company TEXT NOT NULL,
  sector TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  why_now TEXT NOT NULL,
  sources TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
  contact TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL,
  yc_filter TEXT NOT NULL,
  form_d_filter TEXT NOT NULL,
  website TEXT,
  updated_at TEXT NOT NULL
);

INSERT INTO leads (company, sector, summary, why_now, sources, score, contact, status, yc_filter, form_d_filter, website, updated_at) VALUES
('MediSync Health', 'Healthcare', 'AI-powered EHR interoperability platform for mid-size hospital networks.', 'Raised $8M Series A to expand EHR platform.', 'TC|YC|SEC', 95, 'Priya Sharma, CEO', 'New Lead', 'YC Only', 'Has Form D', 'https://www.medisynchealth.com', '2026-02-23'),
('FreshBytes', 'FoodTech', 'Cloud POS and inventory suite for independent restaurants.', 'Closed $5M Seed round for restaurant software.', 'YC|SEC', 88, 'Marco Lin, Co-founder', 'Contacted', 'YC Only', 'No Form D', 'https://www.freshbytes.io', '2026-02-23'),
('FinSecure', 'Fintech', 'Real-time AML screening and risk-scoring API for banks.', 'Series A momentum in AML and risk compliance.', 'YC|SEC|DOC', 84, 'David Osei, CTO', 'Follow-up Due', 'YC Only', 'Possible Match / Needs Review', 'https://www.finsecure.ai', '2026-02-22'),
('AgriNext', 'AgTech', 'IoT sensor network for precision soil and crop monitoring.', 'Secured $2M to scale precision farming sensors.', 'TC|SEC', 81, 'Ana Torres, VP Sales', 'Reviewed', 'Non-YC Only', 'Unknown (not checked yet)', 'https://www.agrinext.tech', '2026-02-21'),
('CareSure', 'InsurTech', 'Automated claims processing engine for P&C insurers.', 'Filed Form D after insurance automation launch.', 'SEC|DOC', 78, 'James Park, BD Lead', 'Not Fit', 'Unknown (not matched yet)', 'Has Form D', 'https://www.caresure.co', '2026-02-20'),
('CloudPulse', 'DevTools / Infra', 'Full-stack observability platform with auto-instrumentation.', 'Landed enterprise pilots for observability stack.', 'TC|YC', 86, 'Nina Kovic, CEO', 'Draft Generated', 'YC Only', 'No Form D', 'https://www.cloudpulse.dev', '2026-02-24');
