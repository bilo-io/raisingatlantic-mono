import { withDataSource } from '../data-source';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

export interface LeadData {
  email: string;
  name?: string;
  subject?: string;
  message: string;
}

export async function submitLead(data: LeadData): Promise<any> {
  return withDataSource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit contact form');
      }

      return response.json();
    },
    { message: 'Mock lead submitted successfully' }
  );
}
