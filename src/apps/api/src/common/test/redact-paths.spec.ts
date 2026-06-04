import { pino } from 'pino';
import { Writable } from 'stream';
import { PII_REDACT_PATHS, REDACTION_CENSOR } from '../logging/redact-paths';

function makeLogger() {
  const lines: string[] = [];
  const stream = new Writable({
    write(chunk, _enc, cb) {
      lines.push(chunk.toString());
      cb();
    },
  });
  const logger = pino(
    {
      level: 'debug',
      redact: {
        paths: [...PII_REDACT_PATHS],
        censor: REDACTION_CENSOR,
      },
    },
    stream,
  );
  return {
    logger,
    output: () => lines.map((l) => JSON.parse(l) as Record<string, unknown>),
  };
}

describe('PII redaction (Pino + redact-paths)', () => {
  it('redacts every POPIA-sensitive direct identifier', () => {
    const { logger, output } = makeLogger();
    logger.info(
      {
        user: {
          email: 'parent@example.com',
          firstName: 'Thandi',
          lastName: 'Mokoena',
          dateOfBirth: '1985-06-12',
          idNumber: '8506125012087',
          phoneNumber: '+27821234567',
        },
      },
      'user record',
    );

    const [entry] = output();
    const u = (entry as { user: Record<string, string> }).user;
    expect(u.email).toBe(REDACTION_CENSOR);
    expect(u.firstName).toBe(REDACTION_CENSOR);
    expect(u.lastName).toBe(REDACTION_CENSOR);
    expect(u.dateOfBirth).toBe(REDACTION_CENSOR);
    expect(u.idNumber).toBe(REDACTION_CENSOR);
    expect(u.phoneNumber).toBe(REDACTION_CENSOR);
  });

  it('redacts clinician verification numbers', () => {
    const { logger, output } = makeLogger();
    logger.info(
      { clinician: { hpcsaNumber: 'MP0712345', sancNumber: '12345' } },
      'verify',
    );
    const c = (output()[0] as { clinician: Record<string, string> }).clinician;
    expect(c.hpcsaNumber).toBe(REDACTION_CENSOR);
    expect(c.sancNumber).toBe(REDACTION_CENSOR);
  });

  it('redacts child medical conditions including array entries', () => {
    const { logger, output } = makeLogger();
    logger.info(
      {
        child: {
          medicalConditions: [
            { condition: 'asthma', notes: 'mild' },
            { condition: 'peanut allergy' },
          ],
          allergies: [{ name: 'penicillin' }],
        },
      },
      'child record',
    );
    const child = (
      output()[0] as {
        child: { medicalConditions: unknown; allergies: unknown };
      }
    ).child;
    expect(child.medicalConditions).toBe(REDACTION_CENSOR);
    expect(child.allergies).toBe(REDACTION_CENSOR);
  });

  it('redacts request body and auth headers', () => {
    const { logger, output } = makeLogger();
    logger.info(
      {
        req: {
          headers: {
            authorization: 'Bearer eyJ...',
            cookie: 'session=abc',
            'x-api-key': 'k_live_xyz',
          },
          body: {
            email: 'a@b.com',
            password: 'hunter2',
            idNumber: '8506125012087',
          },
        },
      },
      'incoming request',
    );
    const entry = output()[0] as {
      req: { headers: Record<string, string>; body: Record<string, string> };
    };
    expect(entry.req.headers.authorization).toBe(REDACTION_CENSOR);
    expect(entry.req.headers.cookie).toBe(REDACTION_CENSOR);
    expect(entry.req.headers['x-api-key']).toBe(REDACTION_CENSOR);
    expect(entry.req.body.email).toBe(REDACTION_CENSOR);
    expect(entry.req.body.password).toBe(REDACTION_CENSOR);
    expect(entry.req.body.idNumber).toBe(REDACTION_CENSOR);
  });

  it('does not redact non-sensitive fields', () => {
    const { logger, output } = makeLogger();
    logger.info({ user: { id: 'u-1', tenantId: 't-1' } }, 'safe');
    const entry = output()[0] as { user: Record<string, string> };
    expect(entry.user.id).toBe('u-1');
    expect(entry.user.tenantId).toBe('t-1');
  });
});
