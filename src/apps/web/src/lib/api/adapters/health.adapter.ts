import { apiClient } from '../api-client';

export interface HealthStatus {
  status: string;
  timestamp: string;
  uptime: number;
}

export async function checkApiHealth(): Promise<HealthStatus> {
  const response = await apiClient.get<HealthStatus>('/health');
  return response.data;
}
