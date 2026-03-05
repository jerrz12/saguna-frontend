#!/usr/bin/env python3
from __future__ import annotations

import json
import sqlite3
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "sample_leads.db"


def fetch_leads(query: dict[str, list[str]]) -> list[dict[str, object]]:
    search = (query.get("search", [""])[0] or "").strip()
    sector = (query.get("sector", ["All"])[0] or "All").strip()
    yc_filter = (query.get("yc", ["All"])[0] or "All").strip()
    form_d_filter = (query.get("form_d", ["Any"])[0] or "Any").strip()
    min_score = int((query.get("min_score", ["0"])[0] or "0").strip())

    clauses = ["score >= ?"]
    params: list[object] = [min_score]

    if search:
        clauses.append(
            "(LOWER(company) LIKE LOWER(?))"
        )
        like = f"%{search}%"
        params.append(like)
    if sector != "All":
        clauses.append("sector = ?")
        params.append(sector)
    if yc_filter != "All":
        clauses.append("yc_filter = ?")
        params.append(yc_filter)
    if form_d_filter != "Any":
        clauses.append("form_d_filter = ?")
        params.append(form_d_filter)

    sql = f"""
        SELECT
            lead_id, company, sector, summary, why_now, sources, score, contact, status, yc_filter, form_d_filter
        FROM leads
        WHERE {" AND ".join(clauses)}
        ORDER BY score DESC, lead_id ASC
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(sql, params).fetchall()
    return [dict(r) for r in rows]


def fetch_dashboard_metrics() -> dict[str, object] | None:
    sql = """
        SELECT
            new_leads_today,
            follow_ups_due,
            leads_this_week,
            replies_received,
            outreach_sent_today,
            outreach_sent_week,
            pipeline_errors,
            pipeline_retries,
            updated_at
        FROM dashboard_metrics
        ORDER BY metric_id DESC
        LIMIT 1
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(sql).fetchone()
    return dict(row) if row else None


def fetch_followups_due(limit: int = 6) -> list[dict[str, object]]:
    sql = """
        SELECT company, score, last_contacted, updated_at
        FROM followups_due
        ORDER BY score DESC, followup_id ASC
        LIMIT ?
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(sql, (limit,)).fetchall()
    return [dict(r) for r in rows]


def fetch_top_new_leads(limit: int = 6) -> list[dict[str, object]]:
    sql = """
        SELECT company, score, note, action_label, updated_at
        FROM top_new_leads
        ORDER BY score DESC, lead_id ASC
        LIMIT ?
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(sql, (limit,)).fetchall()
    return [dict(r) for r in rows]


def fetch_dashboard_panel_items(panel_type: str, limit: int = 6) -> list[dict[str, object]]:
    sql = """
        SELECT label_left, label_right
        FROM dashboard_panels
        WHERE panel_type = ?
        ORDER BY sort_order ASC, item_id ASC
        LIMIT ?
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(sql, (panel_type, limit)).fetchall()
    return [dict(r) for r in rows]


def fetch_lead_detail(query: dict[str, list[str]]) -> dict[str, object] | None:
    lead_id_raw = (query.get("lead_id", [""])[0] or "").strip()
    company = (query.get("company", [""])[0] or "").strip()

    if lead_id_raw:
        try:
            lead_id = int(lead_id_raw)
        except ValueError as exc:
            raise ValueError("Invalid lead_id") from exc

        sql = """
            SELECT
                l.lead_id,
                l.company,
                l.sector,
                l.summary,
                l.why_now,
                l.sources,
                l.score,
                l.contact,
                l.status,
                l.yc_filter,
                l.form_d_filter,
                l.website,
                l.updated_at,
                rd.icp_reason,
                rd.growth_signal,
                rd.decision_stage,
                rd.outreach_angle,
                rd.risk_notes,
                rd.next_step,
                rd.updated_at AS ranking_updated_at
            FROM leads l
            LEFT JOIN ranking_detail rd ON rd.lead_id = l.lead_id
            WHERE l.lead_id = ?
            LIMIT 1
        """
        params: tuple[object, ...] = (lead_id,)
    elif company:
        sql = """
            SELECT
                l.lead_id,
                l.company,
                l.sector,
                l.summary,
                l.why_now,
                l.sources,
                l.score,
                l.contact,
                l.status,
                l.yc_filter,
                l.form_d_filter,
                l.website,
                l.updated_at,
                rd.icp_reason,
                rd.growth_signal,
                rd.decision_stage,
                rd.outreach_angle,
                rd.risk_notes,
                rd.next_step,
                rd.updated_at AS ranking_updated_at
            FROM leads l
            LEFT JOIN ranking_detail rd ON rd.lead_id = l.lead_id
            WHERE LOWER(l.company) = LOWER(?)
            LIMIT 1
        """
        params = (company,)
    else:
        raise ValueError("Missing lead_id or company")

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute(sql, params).fetchone()
    return dict(row) if row else None


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(BASE_DIR), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == "/api/dashboard-metrics":
            try:
                data = fetch_dashboard_metrics()
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"metrics": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path == "/api/followups-due":
            try:
                query = parse_qs(parsed.query)
                limit = int((query.get("limit", ["6"])[0] or "6").strip())
                limit = max(1, min(limit, 25))
                data = fetch_followups_due(limit)
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"items": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path == "/api/top-new-leads":
            try:
                query = parse_qs(parsed.query)
                limit = int((query.get("limit", ["6"])[0] or "6").strip())
                limit = max(1, min(limit, 25))
                data = fetch_top_new_leads(limit)
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"items": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path == "/api/dashboard-panels":
            try:
                query = parse_qs(parsed.query)
                panel = (query.get("panel", [""])[0] or "").strip()
                if panel not in {"recent_activity", "needs_review", "retry_queue"}:
                    raise ValueError("Invalid panel type")
                limit = int((query.get("limit", ["10"])[0] or "10").strip())
                limit = max(1, min(limit, 30))
                data = fetch_dashboard_panel_items(panel, limit)
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"items": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path == "/api/leads":
            try:
                data = fetch_leads(parse_qs(parsed.query))
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"items": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        if parsed.path == "/api/lead-detail":
            try:
                data = fetch_lead_detail(parse_qs(parsed.query))
                if not data:
                    self.send_response(HTTPStatus.NOT_FOUND)
                    self.send_header("Content-Type", "application/json; charset=utf-8")
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Lead not found"}).encode("utf-8"))
                    return
            except Exception as exc:  # noqa: BLE001
                self.send_response(HTTPStatus.INTERNAL_SERVER_ERROR)
                self.send_header("Content-Type", "application/json; charset=utf-8")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(exc)}).encode("utf-8"))
                return

            payload = json.dumps({"item": data}).encode("utf-8")
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return

        return super().do_GET()


def main():
    host = "127.0.0.1"
    port = 8000
    server = ThreadingHTTPServer((host, port), Handler)
    print(f"Serving frontend on http://{host}:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
