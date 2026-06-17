import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { IErrorReportingService } from '@core/telemetry/interfaces/error-reporter.interface';

/**
 * Thin wrapper over the Google Sheets API v4 used as a lightweight datastore for
 * pre-launch marketing data (feature requests, leads). NOT for clinical/child
 * data — that always lives in Postgres.
 *
 * Auth uses Application Default Credentials (the Cloud Run runtime service
 * account in prod; `gcloud auth application-default login` locally). The target
 * spreadsheet must be shared with that service-account email. No key file is
 * committed or mounted — this respects the repo's WIF-only rule.
 *
 * POPIA: callers must never pass clinical data here, and row contents (which may
 * include an email) must never be logged. We log tab names / row counts only.
 */
@Injectable()
export class GoogleSheetsService {
  private sheetsClient: sheets_v4.Sheets | null = null;

  /** spreadsheetId -> { values, expiresAt } per-tab read cache. */
  private readonly readCache = new Map<
    string,
    { values: string[][]; expiresAt: number }
  >();

  /** Short TTL keeps us well under the Sheets read quota (~60/min/project). */
  private readonly cacheTtlMs = 30_000;

  constructor(
    private readonly config: ConfigService,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('IErrorReportingService')
    private readonly errorReporter: IErrorReportingService,
  ) {}

  private get spreadsheetId(): string {
    const id = this.config.get<string>('GOOGLE_SHEETS_SPREADSHEET_ID');
    if (!id) {
      throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is not configured');
    }
    return id;
  }

  /** Lazily build the authenticated Sheets client (ADC). */
  private async getClient(): Promise<sheets_v4.Sheets> {
    if (this.sheetsClient) {
      return this.sheetsClient;
    }
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const authClient = await auth.getClient();
    this.sheetsClient = google.sheets({
      version: 'v4',
      auth: authClient as never,
    });
    return this.sheetsClient;
  }

  /**
   * Ensure row 1 of a tab holds the given header labels. Idempotent: if row 1
   * already has any content it is left untouched. The rest of this service
   * assumes row 1 is a header (getRows drops it; incrementCell offsets by it),
   * so a freshly-created tab MUST be seeded before use. Called only by the
   * one-off seed script — never on a request path.
   */
  async ensureHeaderRow(tab: string, headers: string[]): Promise<void> {
    try {
      const sheets = await this.getClient();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: `${tab}!1:1`,
      });
      const firstRow = (res.data.values?.[0] ?? []) as string[];
      const hasHeader = firstRow.some((cell) => (cell ?? '').trim() !== '');
      if (hasHeader) {
        return;
      }
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${tab}!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: [headers] },
      });
      this.readCache.delete(tab);
      this.logger.log(`Sheets: wrote header row to ${tab}`);
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, {
          tab,
          op: 'ensureHeaderRow',
        });
      }
      throw error;
    }
  }

  /** Append a single row to the given tab. */
  async appendRow(tab: string, values: unknown[]): Promise<void> {
    try {
      const sheets = await this.getClient();
      await sheets.spreadsheets.values.append({
        spreadsheetId: this.spreadsheetId,
        range: `${tab}!A:A`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values: [values] },
      });
      this.readCache.delete(tab);
      this.logger.log(`Sheets: appended 1 row to ${tab}`);
    } catch (error) {
      if (error instanceof Error) {
        // Context deliberately excludes row contents (may contain PII).
        this.errorReporter.reportException(error, { tab, op: 'appendRow' });
      }
      throw error;
    }
  }

  /**
   * Read all data rows from a tab (excluding the header row), cached for a short
   * TTL. Returns a 2-D array of cell strings.
   */
  async getRows(tab: string): Promise<string[][]> {
    const cached = this.readCache.get(tab);
    const now = Date.now();
    if (cached && cached.expiresAt > now) {
      return cached.values;
    }
    try {
      const sheets = await this.getClient();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: tab,
      });
      const rows = (res.data.values ?? []) as string[][];
      // Drop the header row (row 1).
      const dataRows = rows.length > 1 ? rows.slice(1) : [];
      this.readCache.set(tab, {
        values: dataRows,
        expiresAt: now + this.cacheTtlMs,
      });
      this.logger.log(`Sheets: read ${dataRows.length} rows from ${tab}`);
      return dataRows;
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, { tab, op: 'getRows' });
      }
      throw error;
    }
  }

  /**
   * Increment an integer counter cell on the row whose column-A id matches
   * `rowId`. `column` is the A1 column letter (e.g. 'H'). Read-modify-write;
   * safe at landing-page volume (documented trade-off — see plan).
   * Returns the new value, or null if the id was not found.
   */
  async incrementCell(
    tab: string,
    rowId: string,
    column: string,
  ): Promise<number | null> {
    try {
      const sheets = await this.getClient();
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: tab,
      });
      const rows = (res.data.values ?? []) as string[][];
      // rows[0] is the header; data starts at sheet row 2.
      const dataIndex = rows.slice(1).findIndex((r) => r[0] === rowId);
      if (dataIndex === -1) {
        return null;
      }
      const sheetRowNumber = dataIndex + 2; // +1 header, +1 1-based
      const colIndex = column.toUpperCase().charCodeAt(0) - 65;
      const current = Number.parseInt(
        rows[dataIndex + 1]?.[colIndex] ?? '0',
        10,
      );
      const next = (Number.isNaN(current) ? 0 : current) + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: `${tab}!${column}${sheetRowNumber}`,
        valueInputOption: 'RAW',
        requestBody: { values: [[next]] },
      });
      this.readCache.delete(tab);
      this.logger.log(`Sheets: ${tab} ${column}${sheetRowNumber} -> ${next}`);
      return next;
    } catch (error) {
      if (error instanceof Error) {
        this.errorReporter.reportException(error, { tab, op: 'incrementCell' });
      }
      throw error;
    }
  }
}
