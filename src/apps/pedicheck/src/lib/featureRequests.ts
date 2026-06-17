'use client';

import { api } from './api';

export interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
}

export type VoteDirection = 'up' | 'down';

export interface CreateFeatureRequestInput {
  title: string;
  description: string;
  email?: string;
  consent?: boolean;
}

export function listFeatureRequests(): Promise<FeatureRequest[]> {
  return api.get<FeatureRequest[]>('/feature-requests');
}

export function submitFeatureRequest(
  input: CreateFeatureRequestInput,
): Promise<{ id: string }> {
  return api.post<{ id: string }>('/feature-requests', input);
}

export function voteFeatureRequest(
  id: string,
  direction: VoteDirection,
): Promise<{ value: number }> {
  return api.post<{ value: number }>(`/feature-requests/${id}/vote`, {
    direction,
  });
}

// --- per-browser vote dedup (localStorage) ----------------------------------
// Not a security control — it stops accidental/casual double-voting only.

const VOTES_KEY = 'pedicheck_feature_votes';

type VoteMap = Record<string, VoteDirection>;

export function readVotes(): VoteMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(VOTES_KEY);
    return raw ? (JSON.parse(raw) as VoteMap) : {};
  } catch {
    return {};
  }
}

export function recordVote(id: string, direction: VoteDirection): void {
  try {
    const votes = readVotes();
    votes[id] = direction;
    window.localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
  } catch {
    /* swallow storage errors (private mode, quota) */
  }
}
