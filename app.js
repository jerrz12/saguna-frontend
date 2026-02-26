const state = { displayName: "Jerry" };
const currentPage = document.body.dataset.page || "dashboard";

const recentStartups = [
  { company: "company 1", funding: 120000, founder: "Founder 1", stage: "Pre-Launch", founded: "02/15/2026", priority: "High" },
  { company: "company 2", funding: 80000, founder: "Founder 2", stage: "Launched", founded: "02/11/2026", priority: "High" },
  { company: "company 3", funding: 56000, founder: "Founder 3", stage: "Pre-Launch", founded: "02/10/2026", priority: "High" },
  { company: "company 4", funding: 6000, founder: "Founder 4", stage: "Pre-Launch", founded: "01/10/2026", priority: "Medium" },
  { company: "company 5", funding: null, founder: "Founder 5", stage: "Launched", founded: "01/01/2026", priority: "Low" }
];

const leads = [
  { company: "company 1", sector: "Sector_1", why: "Reason_1", sources: "Source_1", score: 91, status: "New Lead" },
  { company: "company 2", sector: "Sector_2", why: "Reason_2", sources: "Source_1", score: 84, status: "Contacted" },
  { company: "company 3", sector: "Sector_1", why: "Reason_3", sources: "Source_1", score: 78, status: "New Lead" },
  { company: "company 4", sector: "Sector_3", why: "Reason_1", sources: "Source_1", score: 76, status: "New Lead" },
  { company: "company 6", sector: "Sector_1", why: "Reason_1", sources: "Source_1", score: 73, status: "New Lead" },
  { company: "company 5", sector: "Sector_1", why: "Reason_1", sources: "Source_1", score: 70, status: "Not Fit" }
];

const els = {
  avatar: document.getElementById("avatar"),
  navItems: Array.from(document.querySelectorAll(".navItem")),
  collapseBtn: document.getElementById("collapseBtn"),
  startupSearch: document.getElementById("startupSearch"),
  recentTbody: document.querySelector("#recentTable tbody"),
  leadsTbody: document.querySelector("#leadsTable tbody"),
  sectorFilter: document.getElementById("sectorFilter"),
  sourceFilter: document.getElementById("sourceFilter"),
  scoreMin: document.getElementById("scoreMin"),
  scoreLabel: document.getElementById("scoreLabel"),
  leadSearch: document.getElementById("leadSearch"),
  displayName: document.getElementById("displayName"),
  logoutBtn: document.getElementById("logoutBtn"),
  metricNewLeadsToday: document.getElementById("metricNewLeadsToday"),
  metricFollowUpsDue: document.getElementById("metricFollowUpsDue"),
  metricLeadsThisWeek: document.getElementById("metricLeadsThisWeek"),
  metricRepliesReceived: document.getElementById("metricRepliesReceived"),
  metricOutreachToday: document.getElementById("metricOutreachToday"),
  metricOutreachWeek: document.getElementById("metricOutreachWeek"),
  metricPipelineErrors: document.getElementById("metricPipelineErrors"),
  metricPipelineRetries: document.getElementById("metricPipelineRetries"),
  metricLastUpdated: document.getElementById("metricLastUpdated"),
  followUpsDueList: document.getElementById("followUpsDueList"),
  topNewLeadsList: document.getElementById("topNewLeadsList"),
  recentActivityList: document.getElementById("recentActivityList"),
  needsReviewList: document.getElementById("needsReviewList"),
  retryQueueList: document.getElementById("retryQueueList"),
  onlyWithContactsToggle: document.getElementById("onlyWithContactsToggle"),
  hideContactedToggle: document.getElementById("hideContactedToggle")
};

function money(v) {
  return v === null || v === undefined ? "$Unknown" : "$" + Number(v).toLocaleString();
}

function priorityPill(p) {
  return `<span class="pill ${p.toLowerCase()}">${p}</span>`;
}

function markActiveNav() {
  els.navItems.forEach((item) => item.classList.toggle("active", item.dataset.route === currentPage));
}

function syncAvatar() {
  if (!els.avatar) return;
  const initial = state.displayName.trim()[0] || "J";
  els.avatar.textContent = initial.toUpperCase();
}

function renderRecent(q = "") {
  if (!els.recentTbody) return;
  const s = q.trim().toLowerCase();
  els.recentTbody.innerHTML = recentStartups
    .filter((x) => !s || x.company.toLowerCase().includes(s) || x.founder.toLowerCase().includes(s))
    .map(
      (x) => `
      <tr>
        <td>${x.company}</td><td>${money(x.funding)}</td><td>${x.founder}</td>
        <td>${x.stage}</td><td>${x.founded}</td><td>${priorityPill(x.priority)}</td>
        <td class="right"><a class="viewLink" href="#" onclick="return false;">View</a></td>
      </tr>
    `
    )
    .join("") || `<tr><td colspan="7" class="muted">No results.</td></tr>`;
}

function renderLeads() {
  if (!els.leadsTbody || !els.sectorFilter || !els.sourceFilter || !els.scoreMin || !els.leadSearch || !els.scoreLabel) return;

  const sector = els.sectorFilter.value;
  const source = els.sourceFilter.value;
  const minScore = Number(els.scoreMin.value);
  const q = els.leadSearch.value.trim().toLowerCase();
  els.scoreLabel.textContent = String(minScore);

  els.leadsTbody.innerHTML = leads
    .filter((l) => sector === "all" || l.sector === sector)
    .filter((l) => source === "all" || l.sources === source)
    .filter((l) => l.score >= minScore)
    .filter((l) => !q || l.company.toLowerCase().includes(q) || l.why.toLowerCase().includes(q))
    .map(
      (l) => `
      <tr><td>${l.company}</td><td>${l.sector}</td><td>${l.why}</td><td>${l.sources}</td><td>${l.score}</td><td>${l.status}</td></tr>
    `
    )
    .join("") || `<tr><td colspan="6" class="muted">No results.</td></tr>`;
}

function redirectTo(path) {
  window.location.href = path;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadDashboardMetrics() {
  try {
    const response = await fetch("/api/dashboard-metrics");
    if (!response.ok) return;
    const payload = await response.json();
    if (!payload || !payload.metrics) return;
    const m = payload.metrics;

    if (els.metricNewLeadsToday) els.metricNewLeadsToday.textContent = String(m.new_leads_today);
    if (els.metricFollowUpsDue) els.metricFollowUpsDue.textContent = String(m.follow_ups_due);
    if (els.metricLeadsThisWeek) els.metricLeadsThisWeek.textContent = String(m.leads_this_week);
    if (els.metricRepliesReceived) els.metricRepliesReceived.textContent = String(m.replies_received);
    if (els.metricOutreachToday) els.metricOutreachToday.textContent = String(m.outreach_sent_today);
    if (els.metricOutreachWeek) els.metricOutreachWeek.textContent = String(m.outreach_sent_week);
    if (els.metricPipelineErrors) els.metricPipelineErrors.textContent = String(m.pipeline_errors);
    if (els.metricPipelineRetries) els.metricPipelineRetries.textContent = String(m.pipeline_retries);
    if (els.metricLastUpdated && m.updated_at) els.metricLastUpdated.textContent = String(m.updated_at);
  } catch (_error) {
    // Keep HTML fallback values when the API is not available.
  }
}

async function loadFollowUpsDue() {
  if (!els.followUpsDueList) return;
  try {
    const response = await fetch("/api/followups-due?limit=6");
    if (!response.ok) return;
    const payload = await response.json();
    const items = payload && Array.isArray(payload.items) ? payload.items : [];
    if (items.length === 0) {
      els.followUpsDueList.innerHTML = "<li><span>No follow-ups due.</span></li>";
      return;
    }

    els.followUpsDueList.innerHTML = items
      .map(
        (item) =>
          `<li><b>${escapeHtml(item.company)}</b><span>Score: ${Number(item.score || 0)} | Last: ${escapeHtml(item.last_contacted || "")}</span><button>Open</button></li>`
      )
      .join("");
  } catch (_error) {
    els.followUpsDueList.innerHTML = "<li><span>Unable to load follow-ups.</span></li>";
  }
}

async function loadTopNewLeads() {
  if (!els.topNewLeadsList) return;
  try {
    const response = await fetch("/api/top-new-leads?limit=8");
    if (!response.ok) return;
    const payload = await response.json();
    const items = payload && Array.isArray(payload.items) ? payload.items : [];
    if (items.length === 0) {
      els.topNewLeadsList.innerHTML = "<li><span>No top leads available.</span></li>";
      return;
    }

    els.topNewLeadsList.innerHTML = items
      .map(
        (item) =>
          `<li><b>${escapeHtml(item.company)}</b><span>Score: ${Number(item.score || 0)} | "${escapeHtml(item.note || "")}"</span><button>${escapeHtml(item.action_label || "Draft")}</button></li>`
      )
      .join("");
  } catch (_error) {
    els.topNewLeadsList.innerHTML = "<li><span>Unable to load top leads.</span></li>";
  }
}

async function loadDashboardPanel(panel, targetEl) {
  if (!targetEl) return;
  try {
    const response = await fetch(`/api/dashboard-panels?panel=${encodeURIComponent(panel)}&limit=10`);
    if (!response.ok) return;
    const payload = await response.json();
    const items = payload && Array.isArray(payload.items) ? payload.items : [];
    if (items.length === 0) {
      targetEl.innerHTML = "<li><span>No items.</span></li>";
      return;
    }

    targetEl.innerHTML = items
      .map((item) => {
        const left = escapeHtml(item.label_left || "");
        const right = escapeHtml(item.label_right || "");
        if (left) return `<li><span>${left}</span><span>${right}</span></li>`;
        return `<li><span>${right}</span></li>`;
      })
      .join("");
  } catch (_error) {
    targetEl.innerHTML = "<li><span>Unable to load.</span></li>";
  }
}

function applySidebarCollapsed(isCollapsed) {
  document.body.classList.toggle("sidebarCollapsed", isCollapsed);
  if (!els.collapseBtn) return;
  const chevron = els.collapseBtn.querySelector(".chevron");
  if (chevron) chevron.style.transform = isCollapsed ? "rotate(180deg)" : "rotate(0deg)";
  els.collapseBtn.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  els.collapseBtn.setAttribute("aria-label", isCollapsed ? "Expand menu" : "Collapse menu");
  els.collapseBtn.setAttribute("title", isCollapsed ? "Expand menu" : "Collapse menu");
}

function bindSwitch(btn) {
  if (!btn) return;
  btn.addEventListener("click", () => {
    const on = btn.classList.toggle("on");
    btn.setAttribute("aria-checked", on ? "true" : "false");
  });
}

(function init() {
  state.displayName = localStorage.getItem("sagunaDisplayName") || "Jerry";

  markActiveNav();
  syncAvatar();

  if (els.startupSearch) {
    els.startupSearch.addEventListener("input", (e) => renderRecent(e.target.value));
  }

  [els.sectorFilter, els.sourceFilter, els.scoreMin].forEach((el) => {
    if (el) el.addEventListener("input", renderLeads);
  });

  if (els.leadSearch) {
    els.leadSearch.addEventListener("input", renderLeads);
  }

  if (els.displayName) {
    els.displayName.value = state.displayName;
    els.displayName.addEventListener("input", (e) => {
      state.displayName = e.target.value || "Jerry";
      localStorage.setItem("sagunaDisplayName", state.displayName);
      syncAvatar();
    });
  }

  if (els.logoutBtn) {
    els.logoutBtn.addEventListener("click", () => {
      state.displayName = "Jerry";
      localStorage.setItem("sagunaDisplayName", state.displayName);
      syncAvatar();
      redirectTo("index.html");
    });
  }

  if (els.collapseBtn) {
    const collapsed = localStorage.getItem("sagunaSidebarCollapsed") === "1";
    applySidebarCollapsed(collapsed);
    els.collapseBtn.addEventListener("click", () => {
      const nextState = !document.body.classList.contains("sidebarCollapsed");
      applySidebarCollapsed(nextState);
      localStorage.setItem("sagunaSidebarCollapsed", nextState ? "1" : "0");
    });
  }

  bindSwitch(els.onlyWithContactsToggle);
  bindSwitch(els.hideContactedToggle);

  renderRecent("");
  renderLeads();
  loadDashboardMetrics();
  loadFollowUpsDue();
  loadTopNewLeads();
  loadDashboardPanel("recent_activity", els.recentActivityList);
  loadDashboardPanel("needs_review", els.needsReviewList);
  loadDashboardPanel("retry_queue", els.retryQueueList);
})();
