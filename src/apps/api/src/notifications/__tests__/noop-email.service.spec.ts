import { NoopEmailService } from '@core/notifications/noop/noop-email.service';
import { createMockLogger } from '../../common/test/test-utils';

describe('NoopEmailService', () => {
  it('logs a redacted recipient and returns delivered=false', async () => {
    const logger = createMockLogger();
    const service = new NoopEmailService(logger);

    const result = await service.send({
      to: 'parent@example.com',
      subject: 'Welcome',
      text: 'Hi there',
    });

    expect(result).toEqual({ delivered: false, providerId: 'noop' });
    expect(logger.log).toHaveBeenCalledTimes(1);
    const logLine = logger.log.mock.calls[0][0] as string;
    expect(logLine).toContain('pa***@example.com');
    expect(logLine).not.toContain('parent@example.com');
    expect(logLine).toContain('Welcome');
  });

  it('does not throw when recipient is malformed', async () => {
    const logger = createMockLogger();
    const service = new NoopEmailService(logger);

    await expect(service.send({ to: '', subject: 'x' })).resolves.toEqual({
      delivered: false,
      providerId: 'noop',
    });
  });
});
