/**
 * k6 load test — staging API  (DEV.md §12.3)
 *
 * Usage:
 *   k6 run --env BASE_URL=https://ra-api-staging.raisingatlantic.com tests/k6/staging-load.js
 *
 * Profile: 1-min ramp-up → 5-min hold at 100 VUs → 1-min ramp-down
 * Thresholds: p95 < 500ms, error rate < 1%
 *
 * Exercises only unauthenticated endpoints so the test needs no seeded
 * credentials: the liveness probe, the static EPI/milestone reference data,
 * and one DB-backed read (growth records). The public lead-capture POST is
 * deliberately NOT load-tested — it is throttled to 3 req/min/IP, so hammering
 * it would just measure the rate limiter.
 *
 * NOTE: the API applies a global throttler (UserAwareThrottlerGuard). Staging
 * must raise the throttle ceiling (or allowlist the load-generator IP) for the
 * 100-VU run, otherwise 429s will dominate the error rate.
 *
 * Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
 */

import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 100 }, // ramp up
    { duration: '5m', target: 100 }, // hold at 100 concurrent users
    { duration: '1m', target: 0 }, // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // §12.3: p95 under 500ms
    errors: ['rate<0.01'], // < 1% error rate
  },
};

const BASE = __ENV.BASE_URL || 'https://ra-api-staging.raisingatlantic.com';

// GET endpoints exercised each iteration. `endpoint` becomes a k6 tag so the
// per-route latency breakdown is visible in the summary.
const READS = [
  { name: 'health', path: '/v1/health' },
  { name: 'records_vaccinations', path: '/v1/records/vaccinations' },
  { name: 'records_milestones', path: '/v1/records/milestones' },
  { name: 'records_growth', path: '/v1/records/growth' },
];

function hit(name, path) {
  const res = http.get(`${BASE}${path}`, { tags: { endpoint: name } });
  errorRate.add(
    !check(
      res,
      {
        [`${name} 200`]: (r) => r.status === 200,
        [`${name} <500ms`]: (r) => r.timings.duration < 500,
      },
      { endpoint: name },
    ),
  );
}

export default function () {
  group('reads', () => {
    for (const { name, path } of READS) {
      hit(name, path);
    }
  });

  sleep(1);
}
