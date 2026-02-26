# Run Frontend with Sample DB

From repo root:

```bash
python3 frontend/server.py
```

Open:

- `http://127.0.0.1:8000/index.html` (Leads page)
- `http://127.0.0.1:8000/lead-detail.html` (Lead detail page)

API used by `index.html`:

- `GET /api/leads?sector=All&yc=All&form_d=Any&min_score=0&search=`
