import { fixtureUsers } from "./fixtures";
import type { Role, User } from "./types";

export type AuthProvider = {
  signIn: (role: Role) => Promise<User>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

export const FixtureAuthProvider: AuthProvider = {
  async signIn(role) {
    return fixtureUsers[role];
  },
  async signOut() {
    return;
  },
  async getIdToken() {
    return null;
  },
};

export const FirebaseAuthProvider: AuthProvider = {
  async signIn() {
    throw new Error(
      "FirebaseAuthProvider is not implemented — see DEV.md §2.1 (auth provider decision) and MOBILE.md §M4.4.",
    );
  },
  async signOut() {
    throw new Error("FirebaseAuthProvider is not implemented");
  },
  async getIdToken() {
    return null;
  },
};

let active: AuthProvider = FixtureAuthProvider;

export function setActiveAuthProvider(next: AuthProvider): void {
  active = next;
}

export function getActiveAuthProvider(): AuthProvider {
  return active;
}
