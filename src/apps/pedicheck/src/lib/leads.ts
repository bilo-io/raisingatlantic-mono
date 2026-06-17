'use client';

import { api } from './api';

export type LeadType = 'contact' | 'waitlist';

export interface SubmitLeadInput {
  email: string;
  message: string;
  name?: string;
  subject?: string;
  phone?: string;
  type?: LeadType;
  consent: boolean;
}

export function submitLead(
  input: SubmitLeadInput,
): Promise<{ message: string; timestamp: string }> {
  return api.post('/leads', input);
}
