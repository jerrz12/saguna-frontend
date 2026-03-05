DROP TABLE IF EXISTS ranking_detail;

CREATE TABLE ranking_detail (
  detail_id INTEGER PRIMARY KEY,
  lead_id INTEGER NOT NULL UNIQUE,
  icp_reason TEXT NOT NULL,
  growth_signal TEXT NOT NULL,
  decision_stage TEXT NOT NULL,
  outreach_angle TEXT NOT NULL,
  risk_notes TEXT NOT NULL,
  next_step TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (lead_id) REFERENCES leads(lead_id) ON DELETE CASCADE
);

INSERT INTO ranking_detail (
  lead_id,
  icp_reason,
  growth_signal,
  decision_stage,
  outreach_angle,
  risk_notes,
  next_step,
  updated_at
) VALUES
  (1, 'Strong fit in regulated healthcare workflows and multi-site operations.', 'Recently increased hiring across product and implementation teams.', 'Executive sponsorship identified and actively evaluating solutions.', 'Lead with ROI on workflow automation and compliance-ready reporting.', 'Long procurement cycle due to security and legal reviews.', 'Send tailored discovery agenda focused on deployment timeline.', '2026-03-05'),
  (2, 'Good fit for transaction-heavy SMB operations with recurring support needs.', 'Expansion into two new metro markets in the last quarter.', 'Ops team engaged, final budget owner not yet confirmed.', 'Position quick rollout and reduced manual reconciliation.', 'Potential sensitivity to implementation costs.', 'Share phased pilot plan with clear payback milestones.', '2026-03-05'),
  (3, 'High relevance for risk/compliance teams requiring auditable automation.', 'New partnerships with regional banks suggest expansion momentum.', 'Technical champion identified; procurement stage not started.', 'Anchor message on faster due diligence and fewer false positives.', 'May require deep security questionnaire before pilot.', 'Provide security packet and propose technical workshop.', '2026-03-05'),
  (4, 'Moderate fit tied to field-ops visibility and reporting efficiency.', 'Launched new sensor package and announced distribution channel growth.', 'Department-level interest, no executive sponsor yet.', 'Focus on operational visibility and incident-prevention savings.', 'Hardware dependencies may slow software-only adoption.', 'Run qualification call to validate integration constraints.', '2026-03-05'),
  (5, 'Use case aligns with claims workflow automation and SLA improvement.', 'Published hiring for claims operations and workflow engineering roles.', 'Initial contact only; no committed timeline from buyer.', 'Highlight reduced turnaround time and audit traceability.', 'Competitive pressure from incumbent claims tools.', 'Draft comparison matrix vs incumbent stack for next touchpoint.', '2026-03-05'),
  (6, 'Strong fit for platform teams needing centralized observability outcomes.', 'Recently signed enterprise pilot with multi-team deployment scope.', 'Technical evaluation underway with platform engineering stakeholders.', 'Lead with faster MTTR and lower instrumentation overhead.', 'Could prioritize in-house tooling if budget is frozen.', 'Offer pilot success criteria and 30-day implementation plan.', '2026-03-05');
