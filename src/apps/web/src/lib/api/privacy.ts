import { apiClient } from './api-client';

export interface ErasureResult {
  deletionRequestedAt: string;
  scheduledHardDeleteAt: string;
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** POPIA DSAR: download the caller's full personal data as JSON. */
export async function downloadMyDataJson(): Promise<void> {
  const { data } = await apiClient.get('/privacy/export');
  triggerDownload(
    new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }),
    'raising-atlantic-data-export.json',
  );
}

/** POPIA DSAR: download the caller's data as a human-readable PDF. */
export async function downloadMyDataPdf(): Promise<void> {
  const res = await apiClient.get('/privacy/export/pdf', { responseType: 'blob' });
  triggerDownload(res.data as Blob, 'raising-atlantic-data-export.pdf');
}

/** POPIA right-to-erasure: soft-delete the account (30-day grace). */
export async function requestErasure(): Promise<ErasureResult> {
  const { data } = await apiClient.post('/privacy/erasure');
  return data as ErasureResult;
}
