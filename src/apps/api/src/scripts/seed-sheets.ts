/**
 * One-off Google Sheets seed + smoke test.
 *
 * Proves the Sheets wiring end to end WITHOUT booting Postgres: it builds a
 * minimal Nest context (ConfigModule + the @Global GoogleSheetsModule only,
 * NOT AppModule, so no DB connection is attempted), ensures both tabs have a
 * header row, appends one clearly-marked test row to each, then reads both
 * tabs back and prints counts.
 *
 * Run (from src/apps/api):  npm run seed:sheets   — or  moon run api:seed-sheets
 *
 * Requires (see docs/PEDICHECK_SHEETS_SETUP.md):
 *   • GOOGLE_SHEETS_SPREADSHEET_ID set in .env
 *   • ADC configured with the spreadsheets scope, and the sheet shared with
 *     the ADC principal (your Google account locally; the runtime SA in prod).
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { randomUUID } from 'crypto';
import { GoogleSheetsModule } from '../common/google-sheets/google-sheets.module';
import { GoogleSheetsService } from '../common/google-sheets/google-sheets.service';

// Must match the column layouts in leads.service.ts / feature-requests.service.ts.
const LEADS_HEADERS = [
  'id',
  'createdAt',
  'type',
  'name',
  'email',
  'phone',
  'subject',
  'message',
  'consent',
  'ip',
];
const FEATURE_HEADERS = [
  'id',
  'createdAt',
  'title',
  'description',
  'email',
  'consent',
  'status',
  'upvotes',
  'downvotes',
];

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), GoogleSheetsModule],
})
class SeedModule {}

async function main(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const config = app.get(ConfigService);
    const sheets = app.get(GoogleSheetsService);

    const spreadsheetId = config.get<string>('GOOGLE_SHEETS_SPREADSHEET_ID');
    if (!spreadsheetId) {
      throw new Error(
        'GOOGLE_SHEETS_SPREADSHEET_ID is not set — add it to src/apps/api/.env first.',
      );
    }
    const leadsTab = config.get<string>('GOOGLE_SHEETS_LEADS_TAB') ?? 'Leads';
    const featureTab =
      config.get<string>('GOOGLE_SHEETS_FEATURE_TAB') ?? 'FeatureRequests';

    console.log(`\nSeeding spreadsheet ${spreadsheetId}`);
    console.log(`  Leads tab:            "${leadsTab}"`);
    console.log(`  FeatureRequests tab:  "${featureTab}"\n`);

    // 1. Ensure header rows (idempotent — leaves an existing header untouched).
    await sheets.ensureHeaderRow(leadsTab, LEADS_HEADERS);
    await sheets.ensureHeaderRow(featureTab, FEATURE_HEADERS);
    console.log('✓ Header rows ensured on both tabs.');

    // 2. Append one clearly-marked test row to each tab.
    const now = new Date().toISOString();
    await sheets.appendRow(leadsTab, [
      randomUUID(),
      now,
      'waitlist',
      'SEED TEST (delete me)',
      'seed-test@example.com',
      '+27000000000',
      'Seed smoke test',
      'Seed smoke test row — safe to delete.',
      'true',
      '',
    ]);
    const featureId = randomUUID();
    await sheets.appendRow(featureTab, [
      featureId,
      now,
      'SEED TEST feature (delete me)',
      'Seed smoke test row — safe to delete.',
      '',
      '',
      'PENDING',
      0,
      0,
    ]);
    console.log('✓ Appended one test row to each tab.');

    // 3. Read both tabs back (excludes the header row).
    const leadRows = await sheets.getRows(leadsTab);
    const featureRows = await sheets.getRows(featureTab);
    console.log(
      `✓ Read back: ${leadRows.length} lead row(s), ${featureRows.length} feature row(s).\n`,
    );

    console.log('Next steps:');
    console.log(
      "  • In the sheet, set the test feature row's status (column G) to APPROVED:",
    );
    console.log(`      test feature id = ${featureId}`);
    console.log(
      '  • GET /v1/feature-requests should then return it (allow ≤30s read cache).',
    );
    console.log('  • Delete the two "SEED TEST" rows when you are done.\n');
  } finally {
    await app.close();
  }
}

main().catch((err: unknown) => {
  console.error('\nseed:sheets failed:');
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
