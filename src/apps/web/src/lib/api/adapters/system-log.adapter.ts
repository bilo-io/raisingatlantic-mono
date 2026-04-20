import { withDataSource } from '../data-source';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/v1';

export interface SystemLog {
  id: string;
  type: string;
  message: string;
  metadata?: any;
  ipAddress?: string;
  createdAt: string;
}

export async function getSystemLogs(): Promise<SystemLog[]> {
  return withDataSource(
    async () => {
      const response = await fetch(`${API_BASE_URL}/system-logs`, {
        headers: {
          // This would normally include auth tokens
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch system logs');
      }

      return response.json();
    },
    [] // Mock data empty for now
  );
}
