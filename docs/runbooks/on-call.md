# On-Call Runbook

**Phase:** [Go-Live Phase 7 §7.4](../GO_LIVE/DEV.md#74-uptime--slos)
**SLO contract:** [ADR 0004](../adr/0004-slos.md) (DRAFT)

## Today's posture

This product currently has **one on-call engineer** (Bilo). Until `OPS` is hired
and a PagerDuty schedule is wired in, all alerts route to:

1. Slack `#alerts-prod` — primary signal channel.
2. `alerts@raisingatlantic.com` — low-severity digest, batched.

PagerDuty is fully scaffolded in Terraform — provider (`infra/envs/prod/main.tf`)
plus a `pagerduty_schedule`, `pagerduty_escalation_policy`, and `pagerduty_service`
in `infra/envs/prod/monitoring.tf`, all gated behind `enable_pagerduty` (default
off). It stays off until a **second** on-call exists: a 30-minute escalation that
loops back to the only engineer is theatre. When `OPS` is hired, set
`pagerduty_oncall_user_id`, add a second layer to the schedule, and flip the flag.
The single-on-call interim posture is documented here so we don't pretend we have
24/7 paging when we don't.

## Alert sources

| Source | What it watches | Where it fires |
|---|---|---|
| Cloud Monitoring `alert_error_rate` | API 5xx > 1% over 5m | `#alerts-prod` |
| Cloud Monitoring `alert_p95_latency` | API p95 > 500ms over 10m | `#alerts-prod` |
| Cloud Monitoring `alert_db_connections` | PG pool > 80% over 5m | email digest |
| Cloud Monitoring `alert_uptime_api` | Probe failure | `#alerts-prod` |
| BetterStack monitors | Independent uptime probe | BetterStack incident + Slack |
| Sentry | Exceptions in API / web / mobile | Sentry issue alert → Slack |

Every alert documentation block links back to a section of this runbook.

## Severity & response targets

| Severity | Examples | Target ack | Target resolve |
|---|---|---|---|
| P0 | Total outage, data loss, PII exposure | 15 min | 2 h |
| P1 | Degraded latency, error rate > SLO, payment-flow failures | 30 min | 4 h |
| P2 | Single feature broken, non-blocking, dashboards alerting on warnings | 4 business h | 5 business days |

Targets are aspirational at solo-on-call. Re-baseline once PagerDuty is wired.

## API error rate

**Alert:** `alert_error_rate` — 5xx response rate > 1% over 5 minutes on `ra-api-prod`.

1. Open the [Cloud Monitoring API errors dashboard](https://console.cloud.google.com/monitoring/dashboards) (or the `api_errors` dashboard provisioned by `infra/envs/prod/monitoring.tf`).
2. Check [Sentry](https://sentry.io) for a corresponding issue spike — group by `release` (= Git SHA) to spot a bad deploy.
3. If a bad deploy is suspected, rollback:
   ```sh
   gcloud run services update-traffic ra-api-prod \
     --region africa-south1 --project ra-prod \
     --to-revisions <previous-revision>=100
   ```
4. If the spike survives rollback, suspect downstream (DB, third-party). Check `alert_db_connections` and Stripe / SendGrid status pages.
5. Post a status update on `status.raisingatlantic.com` once severity is confirmed.

## API latency

**Alert:** `alert_p95_latency` — p95 > 500ms over 10 minutes.

1. Open the `api_latency` Cloud Monitoring dashboard. Look for an outlier endpoint.
2. Cross-check Cloud Trace for slow spans — auto-instrumentation tags every span with `http.target`.
3. Check `alert_db_connections` — slow DB is a common root cause.
4. If load-driven, increase Cloud Run `--max-instances` temporarily and file a follow-up to right-size.

## DB pool exhaustion

**Alert:** `alert_db_connections` — backends > 80% of pool.

1. Open Cloud SQL dashboard for `ra-postgres-prod`.
2. Identify long-running queries via `pg_stat_activity`.
3. Confirm TypeORM connection pool size matches expected concurrency (currently `retryAttempts: 10`, default pool 10).
4. If a single query is hot, file an index review (DEV.md §12.3 sets the > 100ms threshold).

## Uptime probe failure

**Alert:** `alert_uptime_api`.

1. Check the Cloud Monitoring uptime dashboard — multi-region probes mean a single failing region is not yet an incident.
2. Cross-check BetterStack — if both agree, escalate.
3. Verify Cloud Run revision is healthy: `gcloud run revisions list --service ra-api-prod`.
4. Verify Cloud Armor / WAF isn't returning 403 to the prober's source IPs (check `infra/envs/prod/main.tf` Cloud Armor block once enabled).

## Information Regulator notification (POPIA breach)

If at any point the incident involves **unauthorised access to or loss of
personal information**, escalate per `docs/runbooks/data-breach.md` (Phase
4.4 — to be created). POPIA Section 22 requires Information Regulator
notification "as soon as reasonably possible" after discovery.

## Status page

Public status page lives at `https://status.raisingatlantic.com` (BetterStack).
Authoring incidents:

1. Log in to BetterStack with the on-call account.
2. Create incident with severity, affected components, public message.
3. Set up a daily comms cadence for P0/P1 until resolved.

## After-action

Every P0 and every P1 with > 1h to resolve gets a written post-mortem in
`docs/incidents/YYYY-MM-DD-<slug>.md` within 5 business days. Format:
summary, timeline, contributing factors, lessons, action items (with owner +
due date). No blame.
