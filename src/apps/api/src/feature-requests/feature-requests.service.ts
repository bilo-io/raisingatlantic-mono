import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { GoogleSheetsService } from '../common/google-sheets/google-sheets.service';
import { ILoggerService } from '@core/telemetry/interfaces/logger.interface';
import { IMetricService } from '@core/telemetry/interfaces/metric.interface';
import { CreateFeatureRequestDto } from './dto/create-feature-request.dto';
import { VoteDirection } from './dto/vote-feature-request.dto';

/**
 * FeatureRequests tab column layout (row 1 is a header):
 *   A id | B createdAt | C title | D description | E email | F consent
 *   | G status | H upvotes | I downvotes
 */
const COL = {
  id: 0,
  createdAt: 1,
  title: 2,
  description: 3,
  email: 4,
  consent: 5,
  status: 6,
  upvotes: 7,
  downvotes: 8,
} as const;

const UPVOTE_COLUMN = 'H';
const DOWNVOTE_COLUMN = 'I';

/** Public-facing shape — deliberately excludes email/consent/status. */
export interface PublicFeatureRequest {
  id: string;
  title: string;
  description: string;
  upvotes: number;
  downvotes: number;
}

@Injectable()
export class FeatureRequestsService {
  private readonly tab: string;

  constructor(
    private readonly sheets: GoogleSheetsService,
    private readonly config: ConfigService,
    @Inject('ILoggerService') private readonly logger: ILoggerService,
    @Inject('IMetricService') private readonly metric: IMetricService,
  ) {
    this.tab =
      this.config.get<string>('GOOGLE_SHEETS_FEATURE_TAB') ?? 'FeatureRequests';
  }

  async create(dto: CreateFeatureRequestDto): Promise<{ id: string }> {
    const id = randomUUID();
    const row = [
      id,
      new Date().toISOString(),
      dto.title,
      dto.description,
      dto.email ?? '',
      dto.email ? String(dto.consent === true) : '',
      'PENDING',
      0,
      0,
    ];
    await this.sheets.appendRow(this.tab, row);
    this.metric.incrementCounter('feature_request.created', 1, {
      status: 'success',
    });
    // No PII in the log line — id only.
    this.logger.log(`Feature request created: ${id}`);
    return { id };
  }

  /** APPROVED rows only, newest first. */
  async list(): Promise<PublicFeatureRequest[]> {
    const rows = await this.sheets.getRows(this.tab);
    return (
      rows
        // .trim() so a manually-typed status with stray whitespace (e.g.
        // "approved ") still matches — approval is a human action in the sheet.
        .filter(
          (r) => (r[COL.status] ?? '').trim().toUpperCase() === 'APPROVED',
        )
        .map((r) => ({
          id: r[COL.id],
          title: r[COL.title] ?? '',
          description: r[COL.description] ?? '',
          upvotes: Number.parseInt(r[COL.upvotes] ?? '0', 10) || 0,
          downvotes: Number.parseInt(r[COL.downvotes] ?? '0', 10) || 0,
        }))
        .reverse()
    );
  }

  async vote(id: string, direction: VoteDirection): Promise<{ value: number }> {
    const column = direction === 'up' ? UPVOTE_COLUMN : DOWNVOTE_COLUMN;
    const value = await this.sheets.incrementCell(this.tab, id, column);
    if (value === null) {
      throw new NotFoundException(`Feature request not found: ${id}`);
    }
    this.metric.incrementCounter('feature_request.voted', 1, { direction });
    return { value };
  }
}
