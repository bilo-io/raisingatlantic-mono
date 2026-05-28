/**
 * k6 load test — staging API
 *
 * Usage:
 *   k6 run --env BASE_URL=https://ra-api-staging.raisingatlantic.com tests/k6/staging-load.js
 *
 * Profile: 1-min ramp-up → 5-min hold at 100 VUs → 1-min ramp-down
 * Thresholds: p95 < 500ms, error rate < 1%
 *
 * Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const healthLatency = new Trend('health_latency', true);

export const options = {
  stages: [
    { duration: '1m', target: 100 },  // ramp up
    { duration: '5m', target: 100 },  // hold
    { duration: '1m', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // §12.3: p95 under 500ms
    errors:            ['rate<0.01'],  // < 1% error rate
  },
};

const BASE = __ENV.BASE_URL || 'https://ra-api-staging.raisingatlantic.com';

export default function () {
  // Health check — always available, no auth required
  const health = http.get(`${BASE}/v1/health`);
  healthLatency.add(health.timings.duration);
  errorRate.add(
    !check(health, {
      'health 200': (r) => r.status === 200,
      'health <500ms': (r) => r.timings.duration < 500,
    }),
  );

  sleep(1);
}
