# Sample Leads DB (SQLite)

- DB file: `frontend/sample_leads.db`
- Seed SQL: `frontend/sample_leads.sql`

Quick test:

```bash
sqlite3 frontend/sample_leads.db "SELECT lead_id, company, sector, score, status FROM leads ORDER BY lead_id;"
```

Filter example (score slider behavior):

```bash
sqlite3 frontend/sample_leads.db "SELECT company, score FROM leads WHERE score >= 70 ORDER BY score DESC;"
```
