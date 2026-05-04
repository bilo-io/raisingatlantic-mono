import { UserRole } from '@/lib/constants';

/**
 * Frontend RBAC matrix. Mirrors backend `@Roles()` decorations on each
 * NestJS controller route, plus the *expected* role for endpoints that
 * are currently unguarded (tracked in the audit gap report). When backend
 * fixes land, callers don't need to change.
 *
 * `'any-auth'` means any authenticated user (no role restriction).
 * `'public'` means unauthenticated callers are allowed.
 */
export type Action = 'list' | 'get' | 'create' | 'update' | 'delete';

export type Resource =
  | 'children'
  | 'child-allergies'
  | 'child-conditions'
  | 'users'
  | 'appointments'
  | 'reports'
  | 'practices'
  | 'tenants'
  | 'blog'
  | 'leads'
  | 'verifications'
  | 'system-logs'
  | 'master-data'
  | 'self';

type RoleScope = 'any-auth' | 'public' | UserRole[];

const A = UserRole.ADMIN;
const C = UserRole.CLINICIAN;
const P = UserRole.PARENT;
const SA = UserRole.SUPER_ADMIN;

export const permissions: Record<Resource, Partial<Record<Action, RoleScope>>> = {
  // children: class-level JwtAuthGuard, per-method @Roles
  children: {
    list: 'any-auth',
    get: 'any-auth',
    create: [A, C, P], // backend currently [A, C] — we extend to P per G-CHILD-01 decision
    update: [A, C, P], // parent updates own child (server-scoped)
    delete: [A],
  },
  'child-allergies': {
    create: [A, C],
  },
  'child-conditions': {
    create: [A, C],
  },

  // users: backend currently UNGUARDED (G-USERS-01). Expected matrix below.
  users: {
    list: [A, SA],
    get: 'any-auth', // self or admin — refine via scope.ownerId
    create: [A, SA],
    update: 'any-auth', // self or admin — refine via scope.ownerId
    delete: [A, SA],
  },

  appointments: {
    list: 'any-auth',
    get: 'any-auth',
    create: [A, C, P],
    update: [A, C],
    delete: [A],
  },

  reports: {
    list: 'any-auth',
    get: 'any-auth',
    create: [A, C],
    delete: [A],
  },

  practices: {
    list: 'any-auth',
    get: 'any-auth',
    create: [SA],
    update: [SA],
    delete: [SA],
  },

  tenants: {
    list: [SA],
    get: [SA],
    create: [SA],
    update: [SA],
    delete: [SA],
  },

  blog: {
    list: 'public', // public reads
    get: 'public',
    create: [SA],
    update: [SA],
    delete: [SA],
  },

  leads: {
    create: 'public', // contact form / lead capture
  },

  // verifications: backend currently UNGUARDED (G-VER-01). Expected matrix.
  verifications: {
    list: [A, SA],
    get: [A, SA],
    update: [A, SA], // approve/reject — endpoint G-VER-02 not yet implemented
  },

  'system-logs': {
    list: [A, SA],
    get: [A, SA],
  },

  // master-data: backend currently UNGUARDED (G-MD-01). Expected matrix.
  'master-data': {
    list: 'any-auth',
    get: 'any-auth',
  },

  // pseudo-resource representing "operations on the user's own record"
  self: {
    get: 'any-auth',
    update: 'any-auth',
  },
};
