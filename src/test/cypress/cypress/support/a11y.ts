/// <reference types="cypress" />
/// <reference types="cypress-axe" />

// DEV.md §12.2 automated accessibility slice.
//
// We gate only on the two highest-severity impact buckets. axe-core surfaces a
// long tail of "minor"/"moderate" advisories that are worth reviewing but should
// not block CI on day one; "critical"/"serious" are the access-blocking issues
// (missing labels, contrast failures, invalid ARIA) that must not ship.
//
// This is the *automated* portion only — manual keyboard-nav and screen-reader
// passes on the dashboard remain a human task (see PHASE_12_TODO.md).
const GATING_IMPACTS: ('critical' | 'serious')[] = ['critical', 'serious'];

function logViolations(violations: unknown[]): void {
  (violations as Array<{ impact?: string; id: string; help: string; nodes: unknown[] }>).forEach(
    (v) => {
      cy.log(`a11y [${v.impact}] ${v.id}: ${v.help} — ${v.nodes.length} node(s)`);
    },
  );
}

/**
 * Inject axe-core into the current page and assert there are no critical or
 * serious accessibility violations. Optionally scope to a context selector.
 */
export function auditA11y(context?: string): void {
  cy.injectAxe();
  cy.checkA11y(context, { includedImpacts: GATING_IMPACTS }, logViolations);
}
